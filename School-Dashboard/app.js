document.addEventListener('DOMContentLoaded', () => {

    // --- STATE & INIT ---
    let currentSchoolId = "SCH-001";
    let currentSegment = "All";

    // --- UTILS ---
    // Average Calculation for Region (Mocking it for "Wow" factor if not pre-calculated)
    const calculateRegionalAvg = () => {
        const aggs = {};
        Object.values(schoolsDataStructure).forEach(s => {
            const m = s.segments['All'];
            ['Enquiries', 'Visits', 'Applications', 'Enrolled', 'Student FTE', 'Capacity Utilization', 'NPS Score', 'Teacher Attrition'].forEach(k => {
                // Find metric in categories
                let found = null;
                Object.values(m).forEach(cat => {
                    const match = cat.find(x => x['Metric Name'] === k);
                    if (match) found = match.Value;
                });
                if (found !== null) {
                    if (!aggs[k]) aggs[k] = { sum: 0, count: 0 };
                    aggs[k].sum += found;
                    aggs[k].count++;
                }
            });
        });
        const avgs = {};
        for (let k in aggs) avgs[k] = aggs[k].sum / aggs[k].count;
        return avgs;
    };
    const regionalAverages = calculateRegionalAvg();


    // --- MAIN RENDER ---
    const updateDashboard = () => {
        const schoolData = schoolsDataStructure[currentSchoolId];
        const metrics = schoolData.segments[currentSegment];
        const allMetrics = schoolData.segments['All']; // Fallback for school-wide KPIs

        // 1. KPI TEXT UPDATES
        updateKPIs(metrics, allMetrics);

        // 2. VISUALIZATIONS
        drawBulletGraph(metrics, allMetrics);
        drawStaffPulse(metrics, allMetrics);
        drawInteractiveFunnel(metrics);
        drawSpeedometerVelocity(schoolData); // Compare segments logic
        drawGlowingRadar(allMetrics, regionalAverages);
        drawSentimentRings(allMetrics);
    };

    // --- EVENTS ---
    const schoolSelect = document.getElementById('school-select');
    Object.keys(schoolsDataStructure).forEach(id => {
        const opt = document.createElement('option');
        opt.value = id; opt.textContent = schoolsDataStructure[id].name;
        schoolSelect.appendChild(opt);
    });
    schoolSelect.addEventListener('change', (e) => { currentSchoolId = e.target.value; updateDashboard(); });

    document.querySelectorAll('.segment-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.segment-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentSegment = btn.getAttribute('data-segment');
            updateDashboard();
        });
    });

    // Tooltip
    const tooltip = d3.select("body").append("div").attr("class", "d3-tooltip").style("opacity", 0);

    // --- CHART IMPLEMENTATIONS ---

    // 1. BULLET GRAPH (FTE)
    function drawBulletGraph(metrics, allMetrics) {
        const container = d3.select("#fte-bullet");
        container.html("");
        const w = container.node().getBoundingClientRect().width, h = 60;
        const svg = container.append("svg").attr("width", w).attr("height", h);

        const fte = getMetric(metrics, 'Performance', 'Student FTE') || { Value: 0 };
        // Simulated Budget (Target) & Ranges
        const current = fte.Value;
        const target = current * (1 + (Math.random() * 0.1 - 0.05)); // +/- 5%
        const max = Math.max(current, target) * 1.2;

        const scale = d3.scaleLinear().domain([0, max]).range([0, w]);

        // Ranges (Poor, Avg, Good)
        svg.append("rect").attr("width", scale(max * 0.6)).attr("height", h).attr("class", "bullet-range-poor bullet-bg");
        svg.append("rect").attr("x", scale(max * 0.6)).attr("width", scale(max * 0.25)).attr("height", h).attr("class", "bullet-range-avg bullet-bg");
        svg.append("rect").attr("x", scale(max * 0.85)).attr("width", scale(max * 0.15)).attr("height", h).attr("class", "bullet-range-good bullet-bg");

        // Measure (Bar)
        svg.append("rect")
            .attr("y", h / 2 - 6)
            .attr("height", 12)
            .attr("width", 0)
            .attr("class", "bullet-measure")
            .transition().duration(1000)
            .attr("width", scale(current));

        // Target (Line)
        svg.append("line")
            .attr("x1", scale(target)).attr("x2", scale(target))
            .attr("y1", h / 2 - 12).attr("y2", h / 2 + 12)
            .attr("class", "bullet-target");

        // Tooltip
        svg.on("mousemove", (e) => {
            tooltip.style("opacity", 1)
                .html(`FTE: <strong>${Math.round(current)}</strong><br>Target: ${Math.round(target)}`)
                .style("left", (e.pageX + 10) + "px").style("top", (e.pageY - 20) + "px");
        }).on("mouseout", () => tooltip.style("opacity", 0));
    }

    // 2. STAFF PULSE (Gauge + Spark)
    function drawStaffPulse(metrics, allMetrics) {
        const container = d3.select("#staff-pulse");
        container.html("");
        const w = container.node().getBoundingClientRect().width, h = 60;
        const svg = container.append("svg").attr("width", w).attr("height", h);

        // Attrition Gauge (Semi Circle)
        const attr = getMetric(allMetrics, 'People', 'Teacher Attrition') || { Value: 15 };
        const r = 28, cx = 40, cy = h - 5;

        const arcBg = d3.arc().innerRadius(r - 6).outerRadius(r).startAngle(-Math.PI / 2).endAngle(Math.PI / 2);

        const scale = d3.scaleLinear().domain([0, 30]).range([-Math.PI / 2, Math.PI / 2]).clamp(true);
        const arcVal = d3.arc().innerRadius(r - 6).outerRadius(r).startAngle(-Math.PI / 2).endAngle(scale(attr.Value));

        svg.append("path").attr("d", arcBg).attr("transform", `translate(${cx},${cy})`).attr("class", "gauge-bg-arc");
        svg.append("path").attr("d", arcVal).attr("transform", `translate(${cx},${cy})`)
            .attr("fill", attr.Value > 20 ? "#f87171" : (attr.Value > 10 ? "#fbbf24" : "#4ade80"))
            .attr("class", "gauge-val-arc");

        svg.append("text").attr("x", cx).attr("y", cy - 10).attr("text-anchor", "middle").attr("fill", "#fff").attr("font-size", "12px").attr("font-weight", "bold").text(attr.Value + "%");

        // Pulse Sparkline (Engagement)
        // Simulated history
        const engage = getMetric(allMetrics, 'People', 'Employee Engagement') || { Value: 60 };
        const hist = Array.from({ length: 10 }, (_, i) => engage.Value + (Math.random() * 10 - 5));

        const x = d3.scaleLinear().domain([0, 9]).range([cx + r + 10, w]);
        const y = d3.scaleLinear().domain([40, 90]).range([h - 10, 10]);

        const line = d3.line().x((d, i) => x(i)).y(d => y(d)).curve(d3.curveBasis);

        svg.append("path").datum(hist).attr("d", line).attr("class", "engagement-spark");
        svg.append("text").attr("x", w).attr("y", 10).attr("text-anchor", "end").attr("fill", "#c084fc").attr("font-size", "9px").text("Engagement Trend");
    }

    // 3. INTERACTIVE FUNNEL (Tapered)
    function drawInteractiveFunnel(metrics) {
        const container = d3.select("#funnel-viz");
        container.html("");
        const w = container.node().getBoundingClientRect().width || 400;
        const h = 300;
        const svg = container.append("svg").attr("width", w).attr("height", h);

        const stages = ['Enquiries', 'Visits', 'Applications', 'Enrolled'];
        const values = stages.map(s => {
            const m = getMetric(metrics, 'Marketing', s);
            return { stage: s, val: m ? m.Value : 0 };
        });

        // CVR for text
        const cvr = getMetric(metrics, 'Marketing', 'Inquiry to Enrolled CVR');
        d3.select("#cvr-val").text(cvr ? `${cvr.Value}%` : '--');

        // Trapezoid Calc
        const maxW = w * 0.7;
        const stepH = (h - 20) / values.length;
        const centerX = w / 2;

        const maxVal = values[0].val || 100;

        const color = d3.scaleSequential(d3.interpolateCool).domain([0, 4]);

        values.forEach((d, i) => {
            const nextVal = (i < values.length - 1) ? values[i + 1].val : d.val * 0.8; // tapering bottom

            const topW = (d.val / maxVal) * maxW;
            const bottomW = (nextVal / maxVal) * maxW;

            const y1 = 10 + i * stepH;
            const y2 = y1 + stepH - 10; // Gap

            // Polygon points
            const points = [
                [centerX - topW / 2, y1], [centerX + topW / 2, y1],
                [centerX + bottomW / 2, y2], [centerX - bottomW / 2, y2]
            ];

            svg.append("path")
                .attr("d", d3.line()(points) + "Z")
                .attr("fill", color(i))
                .attr("class", "funnel-step-path")
                .on("mouseover", (e) => {
                    tooltip.style("opacity", 1)
                        .html(`<strong>${d.stage}</strong><br>Count: ${Math.round(d.val)}`)
                        .style("left", (e.pageX + 10) + "px").style("top", (e.pageY - 20) + "px");
                })
                .on("mouseout", () => tooltip.style("opacity", 0));

            // Labels (Left side)
            svg.append("text").attr("x", centerX - topW / 2 - 10).attr("y", y1 + stepH / 2)
                .attr("text-anchor", "end").attr("fill", "#fff").attr("font-size", "12px").text(d.stage);

            // Values (Inside)
            svg.append("text").attr("x", centerX).attr("y", y1 + stepH / 2 + 4)
                .attr("text-anchor", "middle").attr("fill", "#0f172a").attr("font-weight", "bold").attr("font-size", "11px").text(Math.round(d.val));

            // Leakage (Right side gap)
            if (i < values.length - 1) {
                const drop = Math.round((1 - (values[i + 1].val / d.val)) * 100);
                svg.append("text").attr("x", centerX + maxW / 2 + 20).attr("y", y2 + 10)
                    .attr("class", "leakage-label").text(`-${drop}% drop`);
            }
        });
    }


    // 4. VELOCITY (Speedometer / Dot on Line)
    function drawSpeedometerVelocity(schoolData) {
        const container = d3.select("#velocity-viz");
        container.html("");
        const w = container.node().getBoundingClientRect().width || 400;
        const h = container.node().getBoundingClientRect().height;
        const svg = container.append("svg").attr("width", w).attr("height", h);

        // Segments to compare
        const data = ['Early Years', 'Primary', 'Secondary'].map(s => {
            const m = getMetric(schoolData.segments[s], 'Marketing', 'Velocity');
            return { seg: s, val: m ? m.Value : 0 };
        });

        const yScale = d3.scaleBand().domain(data.map(d => d.seg)).range([20, h - 20]).padding(0.5);
        const xScale = d3.scaleLinear().domain([0, 200]).range([100, w - 30]); // 0 to 200 days

        // Gradient Def
        const defs = svg.append("defs");
        const grad = defs.append("linearGradient").attr("id", "velocity-grad");
        grad.append("stop").attr("offset", "0%").attr("stop-color", "#4ade80"); // Green (Fast)
        grad.append("stop").attr("offset", "100%").attr("stop-color", "#f87171"); // Red (Slow)

        data.forEach(d => {
            // Label
            svg.append("text").attr("x", 10).attr("y", yScale(d.seg) + yScale.bandwidth() / 2 + 4)
                .attr("fill", "#94a3b8").attr("font-size", "11px").text(d.seg);

            // Track
            svg.append("rect")
                .attr("x", xScale(0)).attr("y", yScale(d.seg))
                .attr("width", xScale(200) - xScale(0)).attr("height", yScale.bandwidth())
                .attr("class", "velocity-track");

            // Dot
            svg.append("circle")
                .attr("cx", xScale(d.val)).attr("cy", yScale(d.seg) + yScale.bandwidth() / 2)
                .attr("r", 6).attr("class", "velocity-dot")
                .on("mouseover", (e) => {
                    tooltip.style("opacity", 1).html(`${d.val} Days`).style("left", (e.pageX) + "px").style("top", (e.pageY - 20) + "px");
                })
                .on("mouseout", () => tooltip.style("opacity", 0));
        });
    }

    // 5. GLOWING RADAR (Normalized)
    function drawGlowingRadar(allMetrics, regionalAvgs) {
        const container = d3.select("#radar-viz");
        container.html("");
        const w = 300, h = 300;
        const svg = container.append("svg").attr("width", w).attr("height", h).append("g").attr("transform", `translate(${w / 2},${h / 2})`);

        const keys = ['Enquiries', 'Capacity Utilization', 'NPS Score', 'Teacher Attrition'];
        // Mapping raw to 0-1
        const limits = {
            'Enquiries': { max: 1000 },
            'Capacity Utilization': { max: 100 },
            'NPS Score': { max: 100, offset: 50 }, // Range -50 to 100 -> 0 to 150
            'Teacher Attrition': { max: 30, invert: true }
        };

        const normalize = (k, val) => {
            const conf = limits[k] || { max: 100 };
            let v = val;
            if (conf.offset) v += conf.offset;
            let norm = v / (conf.offset ? conf.max + conf.offset : conf.max);
            if (conf.invert) norm = 1 - norm;
            return Math.max(0, Math.min(1, norm));
        };

        const schoolVals = keys.map(k => {
            const m = getMetric(allMetrics, k === 'Enquiries' ? 'Marketing' : (k === 'Capacity Utilization' ? 'Performance' : (k.includes('NPS') ? 'Sentiment' : 'People')), k);
            return { axis: k, value: normalize(k, m ? m.Value : 0) };
        });

        const regionVals = keys.map(k => {
            return { axis: k, value: normalize(k, regionalAvgs[k] || 0) };
        });

        // Radar Logic
        const r = 100;
        const angleSlice = Math.PI * 2 / keys.length;
        const rScale = d3.scaleLinear().range([0, r]).domain([0, 1]);

        const line = d3.lineRadial()
            .angle((d, i) => i * angleSlice)
            .radius(d => rScale(d.value))
            .curve(d3.curveLinearClosed);

        // Axes & Grid
        keys.forEach((k, i) => {
            const ang = i * angleSlice - Math.PI / 2;
            const x = rScale(1.1) * Math.cos(ang);
            const y = rScale(1.1) * Math.sin(ang);
            svg.append("line").attr("x1", 0).attr("y1", 0).attr("x2", rScale(1) * Math.cos(ang)).attr("y2", rScale(1) * Math.sin(ang)).attr("class", "radar-axis");
            svg.append("text").attr("x", x).attr("y", y).attr("text-anchor", "middle").attr("class", "radar-label").text(k.split(' ')[0]); // Short label

            // Grid rings
            [0.5, 1].forEach(tick => {
                svg.append("circle").attr("r", rScale(tick)).attr("class", "radar-grid");
            });
        });

        // Region Shape (Dotted)
        svg.append("path").datum(regionVals).attr("d", line).attr("class", "radar-area-region");

        // School Shape (Glow)
        svg.append("path").datum(schoolVals).attr("d", line).attr("class", "radar-area-school");
    }


    // 6. SENTIMENT RINGS
    function drawSentimentRings(allMetrics) {
        const container = d3.select("#sentiment-viz");
        container.html("");

        const items = [
            { key: 'Value for Money', cat: 'Sentiment', icon: 'payments', max: 5 },
            { key: 'Quality of Teaching', cat: 'Sentiment', icon: 'school', max: 5 },
            { key: 'IB Avg Score', cat: 'Academic', icon: 'workspace_premium', max: 45 }
        ];

        items.forEach(item => {
            const m = getMetric(allMetrics, item.cat, item.key);
            const val = m ? m.Value : 0;
            const pct = val / item.max;

            const div = container.append("div").attr("class", "sent-item");
            const w = 80, h = 80;
            const svg = div.append("svg").attr("width", w).attr("height", h);

            const arc = d3.arc().innerRadius(32).outerRadius(36).startAngle(0);

            const g = svg.append("g").attr("transform", `translate(${w / 2},${h / 2})`);

            // BG Ring
            g.append("path").datum({ endAngle: Math.PI * 2 }).attr("d", arc).attr("class", "gauge-bg-arc");

            // Value Ring
            g.append("path").datum({ endAngle: pct * Math.PI * 2 }).attr("d", arc).attr("fill", pct > 0.8 ? "#4ade80" : (pct > 0.6 ? "#fbbf24" : "#f87171"));

            // Icon
            div.append("div").style("position", "absolute").style("top", "28px").style("color", "#fff")
                .html(`<span class="material-symbols-outlined">${item.icon}</span>`);

            div.append("span").html(`<strong>${val}</strong>`).style("margin-top", "5px");
            div.append("span").text(item.key.split(' ')[0]).style("font-size", "10px");
        });
    }

    // Helper: KPI Text
    function updateKPIs(metrics, allMetrics) {
        const enrol = getMetric(metrics, 'Marketing', 'Enrolled');
        d3.select("#enrol-value").text(enrol ? Math.round(enrol.Value).toLocaleString() : '--');
        setTrend("#enrol-trend", enrol);

        // Cap Text
        const cap = getMetric(metrics, 'Performance', 'Capacity Utilization') || getMetric(allMetrics, 'Performance', 'Capacity Utilization');
        d3.select("#cap-value").text(cap ? Math.round(cap.Value) + '%' : '--');
    }

    function setTrend(sel, metric, invert) {
        if (!metric) return;
        d3.select(sel).text(metric['YoY Var']).attr("class", "trend " + (parseFloat(metric['YoY Var']) > 0 ? (invert ? 'bad' : 'good') : (invert ? 'good' : 'bad')));
    }

    function getMetric(segmentData, category, name) {
        if (!segmentData || !segmentData[category]) return null;
        return segmentData[category].find(m => m['Metric Name'] === name);
    }

    // Initial Load
    updateDashboard();
});
