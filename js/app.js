document.addEventListener('DOMContentLoaded', () => {
    initDashboard();
    initFilterBar();
});

const STATUS_LABELS = {
    green: '<i class="mi">check_circle</i> On Track',
    amber: '<i class="mi">warning</i> Watch',
    red: '<i class="mi">error</i> Action Needed'
};

const TREND_ICONS = {
    up: '<i class="mi">trending_up</i>',
    down: '<i class="mi">trending_down</i>',
    flat: '<i class="mi">trending_flat</i>'
};

const FREQUENCY_CLASSES = {
    W: "w",
    M: "m",
    A: "a"
};

function initDashboard() {
    renderCards('all');
}

function initFilterBar() {
    const buttons = document.querySelectorAll('.filter-chip');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;
            renderCards(filter);
        });
    });
}

function renderCards(filter) {
    const sections = {
        'Marketing Efficiency': {
            container: document.getElementById('list-marketing'),
            counter: document.querySelector('[data-section-count="Marketing Efficiency"]'),
            alert: document.querySelector('[data-section-alert="Marketing Efficiency"]'),
            wrapper: document.querySelector('[data-section="Marketing Efficiency"]')
        },
        'School Proposition': {
            container: document.getElementById('list-proposition'),
            counter: document.querySelector('[data-section-count="School Proposition"]'),
            alert: document.querySelector('[data-section-alert="School Proposition"]'),
            wrapper: document.querySelector('[data-section="School Proposition"]')
        },
        'School Performance': {
            container: document.getElementById('list-performance'),
            counter: document.querySelector('[data-section-count="School Performance"]'),
            alert: document.querySelector('[data-section-alert="School Performance"]'),
            wrapper: document.querySelector('[data-section="School Performance"]')
        },
        'Talent / Capability': {
            container: document.getElementById('list-talent'),
            counter: document.querySelector('[data-section-count="Talent / Capability"]'),
            alert: document.querySelector('[data-section-alert="Talent / Capability"]'),
            wrapper: document.querySelector('[data-section="Talent / Capability"]')
        }
    };

    Object.values(sections).forEach(section => {
        if (section.container) {
            section.container.innerHTML = '';
        }
    });

    const filtered = SCAN_DATA.filter(kpi => {
        if (filter === 'all') return true;
        return kpi.frequency === filter;
    });

    filtered.forEach(kpi => {
        const section = sections[kpi.section];
        if (!section || !section.container) return;
        const card = createCard(kpi);
        section.container.appendChild(card);
    });

    updateSectionCounts(sections, filtered);
}

function createCard(kpi) {
    const statusClass = kpi.status === 'amber' ? 'a' : (kpi.status === 'red' ? 'r' : 'g');
    const trendIcon = TREND_ICONS[kpi.trend] || TREND_ICONS.flat;
    const trendClass = kpi.trend === 'down' ? 'dn' : (kpi.trend === 'up' ? 'up' : 'flat');
    const freqClass = FREQUENCY_CLASSES[kpi.frequency] || '';

    const link = document.createElement('a');
    link.className = 'kc-link';
    link.href = kpi.detail_link;
    link.setAttribute('aria-label', `${kpi.kpi_name} drill-down`);

    const card = document.createElement('div');
    card.className = `kc ${statusClass}`;
    card.dataset.frequency = kpi.frequency;

    if (kpi.is_compliance) {
        card.classList.add('kc-compliance');
        const complianceClass = kpi.compliance_status === 'red' ? 'compliance-red' : 'compliance-green';
        card.classList.add(complianceClass);
    }

    card.innerHTML = `
        <div class="kc-meta">
            <span class="kc-status">${STATUS_LABELS[kpi.status] || STATUS_LABELS.green}</span>
            <span class="kc-freq ${freqClass}">${kpi.frequency}</span>
        </div>
        <div class="kc-trend ${trendClass}">${trendIcon} ${kpi.trend_text}</div>
        <div class="kc-value">${kpi.current_value}</div>
        <div class="kc-name">${kpi.kpi_name}</div>
        <div class="kc-hover-panel" aria-hidden="true">
            <div class="kc-hover-title">Why</div>
            <div class="kc-hover-text"></div>
            <div class="kc-hover-title secondary">Action</div>
            <div class="kc-hover-text action"></div>
        </div>
    `;

    const hoverPanel = card.querySelector('.kc-hover-panel');
    const hoverText = card.querySelector('.kc-hover-text');
    const actionText = card.querySelector('.kc-hover-text.action');
    let typingInterval;
    let actionInterval;

    card.addEventListener('mouseenter', () => {
        hoverPanel.classList.add('show');
        hoverText.textContent = '';
        actionText.textContent = '';
        hoverText.classList.add('typing');
        actionText.classList.add('typing');
        let i = 0;
        let j = 0;
        const text = kpi.explanation || '';
        const action = kpi.action_text || '';
        if (!text) {
            hoverText.classList.remove('typing');
            return;
        }
        clearInterval(typingInterval);
        clearInterval(actionInterval);
        typingInterval = setInterval(() => {
            hoverText.textContent += text.charAt(i);
            i += 1;
            if (i >= text.length) {
                clearInterval(typingInterval);
                hoverText.classList.remove('typing');
                if (!action) {
                    actionText.classList.remove('typing');
                    return;
                }
                actionInterval = setInterval(() => {
                    actionText.textContent += action.charAt(j);
                    j += 1;
                    if (j >= action.length) {
                        clearInterval(actionInterval);
                        actionText.classList.remove('typing');
                    }
                }, 12);
            }
        }, 12);
    });

    card.addEventListener('mouseleave', () => {
        hoverPanel.classList.remove('show');
        clearInterval(typingInterval);
        clearInterval(actionInterval);
        hoverText.classList.remove('typing');
        actionText.classList.remove('typing');
        hoverText.textContent = '';
        actionText.textContent = '';
    });

    link.appendChild(card);
    return link;
}

function updateSectionCounts(sections, filtered) {
    const grouped = filtered.reduce((acc, kpi) => {
        if (!acc[kpi.section]) {
            acc[kpi.section] = { total: 0, red: 0, amber: 0, green: 0 };
        }
        acc[kpi.section].total += 1;
        acc[kpi.section][kpi.status] += 1;
        return acc;
    }, {});

    Object.keys(sections).forEach(sectionName => {
        const data = grouped[sectionName] || { total: 0, red: 0, amber: 0, green: 0 };
        const counter = sections[sectionName].counter;
        const alert = sections[sectionName].alert;
        const wrapper = sections[sectionName].wrapper;

        if (counter) {
            counter.textContent = `${data.total} KPI${data.total === 1 ? '' : 's'}`;
        }
        if (alert) {
            alert.classList.remove('red', 'amber', 'green');
            if (data.red > 0) {
                alert.classList.add('red');
                alert.textContent = `${data.red} need attention`;
            } else if (data.amber > 0) {
                alert.classList.add('amber');
                alert.textContent = `${data.amber} to watch`;
            } else {
                alert.classList.add('green');
                alert.textContent = 'On track';
            }
        }

        if (wrapper) {
            wrapper.style.display = data.total > 0 ? 'block' : 'none';
        }
    });
}
