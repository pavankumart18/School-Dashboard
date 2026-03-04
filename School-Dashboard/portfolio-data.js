/**
 * EU Portfolio Synthetic Data Layer
 * Single source of truth — shared by Leaders-dahsboard.html,
 * Leaders-datastory.html, Leaders-email-alert.html, and index.html.
 *
 * All metric values are synthetic for illustrative purposes.
 * Version: FY2026 · Salesforce Wk 24 · OneStream Wk 23
 */

window.PORTFOLIO = (function () {

  // ─────────────────────────────────────────────────────────────────────────
  // META
  // ─────────────────────────────────────────────────────────────────────────
  const META = {
    region:         'EU',
    date:           '18 Feb 2026',
    dayOfWeek:      'Wednesday',
    fiscalYear:     'FY2026',
    enrolmentYear:  'EY2027',
    dataWeek:       24,
    source:         'Salesforce Wk 24 · OneStream Wk 23',
    schoolCount:    5,
  };

  // ─────────────────────────────────────────────────────────────────────────
  // THRESHOLDS  (used for auto RAG + alert generation)
  // ─────────────────────────────────────────────────────────────────────────
  const TH = {
    fteVsBudget:    { warn: -0.01,  crit: -0.025 },   // fraction; lower = worse
    enrolmentsYoY:  { warn: -0.08,  crit: -0.15  },
    enquiriesYoY:   { warn: -0.08,  crit: -0.18  },
    cvr:            { warn: 6.0,    crit: 4.5    },   // %; lower = worse
    velocity:       { warn: 100,    crit: 120    },   // days; higher = worse
    nps:            { target: 35,   warn: 30,   crit: 25   },
    capacity:       { warn: 75,     crit: 60    },    // %; lower = worse
    bgcStaff:       { warn: 92,     crit: 88    },
    bgcContractor:  { warn: 90,     crit: 80    },
    aLevelDrop:     { warn: -5,     crit: -10   },    // pp; more negative = worse
  };

  // ─────────────────────────────────────────────────────────────────────────
  // SCHOOL DATA
  // ─────────────────────────────────────────────────────────────────────────
  const SCHOOLS = [
    {
      id:       'aubonne',
      name:     'Aubonne',
      location: 'Geneva, Switzerland',
      country:  'Switzerland',
      segments: 'EY / Primary / Secondary',
      color:    '#c0392b',
      colorDim: '#fdf0ee',
      initial:  'A',
      // Link to principal dashboard if applicable
      principalDashboard: null,

      metrics: {
        fteVsBudget:    -0.071,   // fraction
        fteBudget:      860,
        fteForecast:    799,
        enrolmentsYoY:  -0.667,
        enrolments:     40,
        enrolmentsPY:   120,
        enquiriesYoY:   -0.373,
        enquiries:      188,
        enquiriesPY:    300,
        cvrDelta:       -0.033,   // % points
        cvr:            4.2,      // %
        velocity:       114,      // days
        nps:            32,
        npsPrev:        38,
        capacity:       49,       // %
        capacityTarget: 85,
        bgcStaff:       76,
        bgcContractor:  76,
        safeguarding:   88,
        fte:            800,
        staffAttrition: 22.1,
        macAttrition:   24.3,
        teacherAttrition: 21.8,
      },

      // 12-week weekly enquiry trend (Wk 13 – Wk 24)
      weeklyEnquiries: {
        weeks:    ['W13','W14','W15','W16','W17','W18','W19','W20','W21','W22','W23','W24'],
        thisYear: [28, 24, 22, 19, 17, 15, 18, 14, 12, 16, 13, 11],
        lastYear: [45, 48, 44, 42, 46, 41, 43, 40, 38, 44, 42, 39],
      },

      funnel: {
        enquiries:           188,
        applicationStarted:  94,
        applicationSubmitted:52,
        offerMade:           46,
        enrolled:            40,
      },

      npsDrivers: {
        'Teaching Quality': { curr: 3.8, prev: 3.9 },
        'Value for Money':  { curr: 3.1, prev: 3.5 },
        'Communication':    { curr: 3.4, prev: 3.6 },
        'Facilities':       { curr: 3.9, prev: 4.0 },
        'Curriculum':       { curr: 3.6, prev: 3.8 },
      },

      academic: {
        aLevel: { current: 52.7, prev: 66.0, target: 68.0 },
        igcse:  { current: 46.4, prev: 48.4, target: 50.0 },
        ib:     null,
      },

      compliance: {
        safeguarding:  88,
        staffBgc:      76,
        contractorBgc: 76,
      },

      competitors: [
        { name: 'Aspire IS', fee: 21000, segment: 'Primary', status: 'new' },
        { name: 'ISG Nyon',  fee: 24500, segment: 'Secondary', status: 'established' },
      ],
    },

    {
      id:       'beau-soleil',
      name:     'Beau Soleil',
      location: 'Villars, Switzerland',
      country:  'Switzerland',
      segments: 'Secondary',
      color:    '#1a6b50',
      colorDim: '#edf7f3',
      initial:  'B',
      principalDashboard: null,

      metrics: {
        fteVsBudget:    0.003,
        fteBudget:      497,
        fteForecast:    499,
        enrolmentsYoY:  0.143,
        enrolments:     114,
        enrolmentsPY:   100,
        enquiriesYoY:   0.215,
        enquiries:      412,
        enquiriesPY:    339,
        cvrDelta:       -0.007,
        cvr:            6.8,
        velocity:       168,
        nps:            null,      // No NPS survey this cycle
        npsPrev:        30,
        capacity:       101,
        capacityTarget: 100,
        bgcStaff:       91,
        bgcContractor:  91,
        safeguarding:   96,
        fte:            500,
        staffAttrition: 16.2,
        macAttrition:   19.1,
        teacherAttrition: 14.8,
      },

      weeklyEnquiries: {
        weeks:    ['W13','W14','W15','W16','W17','W18','W19','W20','W21','W22','W23','W24'],
        thisYear: [32, 36, 38, 34, 42, 38, 44, 40, 36, 41, 38, 34],
        lastYear: [26, 28, 30, 27, 34, 31, 36, 33, 29, 34, 31, 27],
      },

      funnel: {
        enquiries:           412,
        applicationStarted:  186,
        applicationSubmitted:132,
        offerMade:           118,
        enrolled:            114,
      },

      npsDrivers: null,   // survey not yet completed this cycle

      academic: {
        aLevel: null,
        igcse:  null,
        ib:     { current: 33.2, prev: 32.7, target: 34.0 },
      },

      compliance: {
        safeguarding:  96,
        staffBgc:      91,
        contractorBgc: 91,
      },

      competitors: [
        { name: 'Institut Le Rosey', fee: 120000, segment: 'Secondary', status: 'established' },
      ],
    },

    {
      id:       'bratislava',
      name:     'Bratislava',
      location: 'Bratislava, Slovakia',
      country:  'Slovakia',
      segments: 'EY / Primary',
      color:    '#b8680a',
      colorDim: '#fdf5e6',
      initial:  'B',
      principalDashboard: null,

      metrics: {
        fteVsBudget:    -0.036,
        fteBudget:      622,
        fteForecast:    599,
        enrolmentsYoY:  -0.545,
        enrolments:     50,
        enrolmentsPY:   110,
        enquiriesYoY:   -0.215,
        enquiries:      156,
        enquiriesPY:    199,
        cvrDelta:       -0.024,
        cvr:            5.1,
        velocity:       34,
        nps:            35,
        npsPrev:        32,
        capacity:       74,
        capacityTarget: 85,
        bgcStaff:       89,
        bgcContractor:  84,
        safeguarding:   92,
        fte:            600,
        staffAttrition: 18.4,
        macAttrition:   20.2,
        teacherAttrition: 16.9,
      },

      weeklyEnquiries: {
        weeks:    ['W13','W14','W15','W16','W17','W18','W19','W20','W21','W22','W23','W24'],
        thisYear: [18, 16, 14, 12, 15, 13, 14, 11, 13, 12, 10, 11],
        lastYear: [22, 24, 20, 23, 25, 21, 24, 22, 20, 24, 22, 19],
      },

      funnel: {
        enquiries:           156,
        applicationStarted:  86,
        applicationSubmitted:60,
        offerMade:           54,
        enrolled:            50,
      },

      npsDrivers: {
        'Teaching Quality': { curr: 4.1, prev: 3.9 },
        'Value for Money':  { curr: 3.6, prev: 3.4 },
        'Communication':    { curr: 3.8, prev: 3.7 },
        'Facilities':       { curr: 3.5, prev: 3.6 },
        'Curriculum':       { curr: 3.9, prev: 3.8 },
      },

      academic: {
        aLevel: null,
        igcse:  { current: 51.2, prev: 49.8, target: 52.0 },
        ib:     null,
      },

      compliance: {
        safeguarding:  92,
        staffBgc:      89,
        contractorBgc: 84,
      },

      competitors: [
        { name: 'QSI Bratislava', fee: 14000, segment: 'Primary', status: 'established' },
      ],
    },

    {
      id:       'brighton',
      name:     'Brighton',
      location: 'Brighton, United Kingdom',
      country:  'UK',
      segments: 'EY / Primary / Secondary',
      color:    '#1a3a7a',
      colorDim: '#eef2fb',
      initial:  'B',
      principalDashboard: 'index.html',   // <-- links to Westbridge/Brighton principal dash

      metrics: {
        fteVsBudget:    0.012,
        fteBudget:      1186,
        fteForecast:    1200,
        enrolmentsYoY:  -0.041,
        enrolments:     140,
        enrolmentsPY:   146,
        enquiriesYoY:   0.062,
        enquiries:      1442,
        enquiriesPY:    1358,
        cvrDelta:       0.011,
        cvr:            9.7,
        velocity:       98,
        nps:            38,
        npsPrev:        33,
        capacity:       88,
        capacityTarget: 90,
        bgcStaff:       94,
        bgcContractor:  94,
        safeguarding:   96,
        fte:            1200,
        staffAttrition: 14.8,
        macAttrition:   17.3,
        teacherAttrition: 12.4,
      },

      weeklyEnquiries: {
        weeks:    ['W13','W14','W15','W16','W17','W18','W19','W20','W21','W22','W23','W24'],
        thisYear: [112, 118, 124, 119, 130, 122, 128, 118, 124, 126, 132, 124],
        lastYear: [104, 110, 116, 112, 122, 114, 120, 110, 116, 118, 124, 116],
      },

      funnel: {
        enquiries:           1442,
        applicationStarted:  684,
        applicationSubmitted:210,
        offerMade:           154,
        enrolled:            140,
      },

      npsDrivers: {
        'Teaching Quality': { curr: 4.3, prev: 4.1 },
        'Value for Money':  { curr: 3.7, prev: 3.6 },
        'Communication':    { curr: 4.0, prev: 3.8 },
        'Facilities':       { curr: 4.2, prev: 4.0 },
        'Curriculum':       { curr: 4.1, prev: 3.9 },
      },

      academic: {
        aLevel: { current: 52.7, prev: 66.0, target: 68.0 },
        igcse:  { current: 46.4, prev: 48.4, target: 50.0 },
        ib:     null,
      },

      compliance: {
        safeguarding:  96,
        staffBgc:      94,
        contractorBgc: 94,
      },

      competitors: [
        { name: 'Hove Academy', fee: 18500, segment: 'Secondary', status: 'established' },
        { name: 'Preston IS',   fee: 16000, segment: 'Primary',   status: 'growing' },
      ],
    },

    {
      id:       'budapest',
      name:     'Budapest',
      location: 'Budapest, Hungary',
      country:  'Hungary',
      segments: 'EY / Primary / Secondary',
      color:    '#7a7060',
      colorDim: '#f5f4f0',
      initial:  'B',
      principalDashboard: null,

      metrics: {
        fteVsBudget:    -0.018,
        fteBudget:      917,
        fteForecast:    901,
        enrolmentsYoY:  -0.083,
        enrolments:     66,
        enrolmentsPY:   72,
        enquiriesYoY:   -0.051,
        enquiries:      318,
        enquiriesPY:    335,
        cvrDelta:       -0.012,
        cvr:            6.2,
        velocity:       118,
        nps:            31,
        npsPrev:        34,
        capacity:       79,
        capacityTarget: 85,
        bgcStaff:       88,
        bgcContractor:  85,
        safeguarding:   91,
        fte:            900,
        staffAttrition: 19.8,
        macAttrition:   22.1,
        teacherAttrition: 18.3,
      },

      weeklyEnquiries: {
        weeks:    ['W13','W14','W15','W16','W17','W18','W19','W20','W21','W22','W23','W24'],
        thisYear: [24, 26, 28, 22, 30, 26, 28, 24, 26, 28, 24, 22],
        lastYear: [26, 28, 30, 24, 32, 28, 30, 26, 28, 30, 26, 24],
      },

      funnel: {
        enquiries:           318,
        applicationStarted:  148,
        applicationSubmitted:86,
        offerMade:           72,
        enrolled:            66,
      },

      npsDrivers: {
        'Teaching Quality': { curr: 3.9, prev: 4.0 },
        'Value for Money':  { curr: 3.3, prev: 3.6 },
        'Communication':    { curr: 3.7, prev: 3.8 },
        'Facilities':       { curr: 3.8, prev: 3.9 },
        'Curriculum':       { curr: 3.7, prev: 3.8 },
      },

      academic: {
        aLevel: null,
        igcse:  { current: 43.8, prev: 45.2, target: 47.0 },
        ib:     { current: 31.4, prev: 32.1, target: 33.0 },
      },

      compliance: {
        safeguarding:  91,
        staffBgc:      88,
        contractorBgc: 85,
      },

      competitors: [
        { name: 'AIS Budapest', fee: 15000, segment: 'Secondary', status: 'established' },
      ],
    },
  ];

  // ─────────────────────────────────────────────────────────────────────────
  // REGIONAL AGGREGATES
  // ─────────────────────────────────────────────────────────────────────────
  const REGIONAL = {
    fteVsBudget:        -0.032,
    fteBudget:          12864,
    fteForecast:        12459,
    fteDelta:           -405,
    enrolmentsYoY:      -0.139,
    enrolments:         410,
    enrolmentsPY:       477,
    enrolmentDelta:     -67,
    enquiriesYoY:       -0.133,
    avgVelocity:        124,
    avgVelocityPY:      118,
    nps:                29,
    npsTarget:          35,
    npsPY:              33,
    capacity:           80.5,
    feeIncome:          64.3,
    feeBudget:          64.0,
    ebitda:             36.4,
    ebitdaBudget:       36.0,
    flowthroughPct:     23.7,
    flowthroughPctPY:   32.1,
    marketShareGrowth:  0.0017,
    contractorBgc:      76.2,
    staffBgc:           92.6,
    safeguarding:       94.9,
    macAttrition:       21.5,
    teacherAttrition:   19.6,
  };

  // ─────────────────────────────────────────────────────────────────────────
  // FINANCIAL TREND (FY23 – FY26)
  // ─────────────────────────────────────────────────────────────────────────
  const FINANCIAL_TREND = [
    { year: 'FY23', feeIncome: 54.2, ebitda: 29.4, flowthroughPct: 29.8 },
    { year: 'FY24', feeIncome: 58.7, ebitda: 32.1, flowthroughPct: 31.4 },
    { year: 'FY25', feeIncome: 61.9, ebitda: 34.8, flowthroughPct: 32.1 },
    { year: 'FY26', feeIncome: 64.3, ebitda: 36.4, flowthroughPct: 23.7 },
  ];

  // ─────────────────────────────────────────────────────────────────────────
  // REGIONAL ACADEMIC (portfolio-level summary)
  // ─────────────────────────────────────────────────────────────────────────
  const ACADEMIC = {
    aLevel: { current: 52.7, prev: 66.0, target: 68.0 },
    igcse:  { current: 46.4, prev: 48.4, target: 50.0 },
    ib:     { current: 33.2, prev: 32.7, target: 34.0 },
  };

  // ─────────────────────────────────────────────────────────────────────────
  // PRIORITY ACTIONS  (auto-sorted by priority for recommendations)
  // ─────────────────────────────────────────────────────────────────────────
  const ACTIONS = [
    {
      id:         'aubonne-recovery',
      priority:   'critical',
      priorityOrder: 1,
      school:     'Aubonne',
      title:      'Activate Aubonne recovery plan — call Principal today',
      desc:       'Enrolment down 66.7%. Capacity at 49%. New competitor in Primary. Referral programme not yet launched. Key questions: MAC process alignment with Brighton, next open-day follow-up cadence.',
      owner:      'Regional Director',
      deadline:   '18 Feb 2026',
      impact:     'Up to 40 additional enrolments if CVR raised from 4.2% to 7%',
      dataPoints: ['enrolmentsYoY: −66.7%', 'capacity: 49%', 'CVR: 4.2%'],
    },
    {
      id:         'bgc-escalation',
      priority:   'critical',
      priorityOrder: 2,
      school:     '3 Schools',
      title:      'Escalate contractor BGC compliance to Regional HR',
      desc:       '76.2% contractor BGC across 3 schools — 18pp below the 90% threshold. Systemic onboarding process failure, not school-level negligence. Target: 90%+ by end of FY26 Q3.',
      owner:      'Regional HR Director',
      deadline:   '20 Feb 2026',
      impact:     'Safeguarding risk remediation — reputational exposure mitigated',
      dataPoints: ['contractorBgc: 76.2%', 'staffBgc: 92.6%', 'gap: 18pp'],
    },
    {
      id:         'mac-transfer',
      priority:   'strategic',
      priorityOrder: 3,
      school:     'Portfolio',
      title:      'Commission Brighton → Aubonne MAC process transfer',
      desc:       'Brighton converts at 9.7% (2.3× Aubonne\'s 4.2%). Document Brighton\'s visit-to-application follow-up cadence and replicate at Aubonne immediately. Requires a 2-day facilitated session.',
      owner:      'MAC Regional Lead',
      deadline:   '25 Feb 2026',
      impact:     '+3–5pp CVR improvement = 20–35 additional enrolments',
      dataPoints: ['Brighton CVR: 9.7%', 'Aubonne CVR: 4.2%', 'multiple: 2.3×'],
    },
    {
      id:         'beau-soleil-pricing',
      priority:   'opportunity',
      priorityOrder: 4,
      school:     'Beau Soleil',
      title:      'Commission fee benchmarking — Beau Soleil at 101% capacity',
      desc:       'At 101% utilisation with +21.5% enquiry growth, Beau Soleil has unambiguous pricing headroom. Model impact of 8–12% fee increase on CVR and EBITDA before next enrolment cycle.',
      owner:      'Finance Director',
      deadline:   '31 Mar 2026',
      impact:     '+£500k–800k annual EBITDA uplift at 10% fee increase',
      dataPoints: ['capacity: 101%', 'enquiriesYoY: +21.5%', 'velocity: 168d'],
    },
    {
      id:         'mac-retention',
      priority:   'warning',
      priorityOrder: 5,
      school:     'Region-wide',
      title:      'Launch MAC retention programme before September enquiry season',
      desc:       'MAC attrition at 21.5% — the highest-leaving group portfolio-wide, and the people directly responsible for converting enquiries to enrolments. A structured retention programme must be in place before EY2028 season opens.',
      owner:      'Regional People Director',
      deadline:   '30 Apr 2026',
      impact:     'Prevents loss of conversion expertise at critical recruitment period',
      dataPoints: ['macAttrition: 21.5%', 'teacherAttrition: 19.6%', 'trend: +0.2pp'],
    },
  ];

  // ─────────────────────────────────────────────────────────────────────────
  // HELPER FUNCTIONS
  // ─────────────────────────────────────────────────────────────────────────

  /** Format a value for display */
  function fmt(v, type) {
    if (v === null || v === undefined) return '—';
    switch (type) {
      case 'pct':    return (v > 0 ? '+' : '') + (v * 100).toFixed(1) + '%';
      case 'pctAbs': return Math.abs(v * 100).toFixed(1) + '%';
      case 'pp':     return (v > 0 ? '+' : '') + v.toFixed(1) + 'pp';
      case 'ppAbs':  return Math.abs(v).toFixed(1) + 'pp';
      case 'days':   return Math.round(v) + 'd';
      case '$M':     return '$' + v.toFixed(1) + 'M';
      case 'n':      return Math.round(v).toLocaleString();
      case 'pctVal': return v.toFixed(1) + '%';
      case 'mult':   return v.toFixed(1) + '×';
      default:       return String(v);
    }
  }

  /** Compute RAG status string ('r', 'a', 'g') for a given metric value */
  function computeRag(value, metricKey) {
    if (value === null || value === undefined) return 'a';
    const t = TH[metricKey];
    if (!t) return 'a';

    const higherIsWorse = ['velocity'].includes(metricKey);
    if (higherIsWorse) {
      if (value >= t.crit) return 'r';
      if (value >= t.warn) return 'a';
      return 'g';
    } else {
      if (value <= (t.crit !== undefined ? t.crit : t.warn)) return 'r';
      if (value <= t.warn) return 'a';
      return 'g';
    }
  }

  /** Get RAG for a specific school + metric combination */
  function getSchoolRag(schoolId, metricKey) {
    const school = SCHOOLS.find(s => s.id === schoolId);
    if (!school) return 'a';
    const val = school.metrics[metricKey];
    if (val === null || val === undefined) return 'a';
    return computeRag(val, metricKey);
  }

  /** Heatmap data: returns a 2D array of { rag, display } for schools × metrics */
  function getHeatmapData() {
    const metricDefs = [
      { key: 'fteVsBudget',   label: 'FTE vs Bgt', ragKey: 'fteVsBudget',   format: v => (v > 0 ? '+' : '') + (v * 100).toFixed(1) + '%' },
      { key: 'enrolmentsYoY', label: 'Enrolments', ragKey: 'enrolmentsYoY', format: v => (v > 0 ? '+' : '') + (v * 100).toFixed(1) + '%' },
      { key: 'enquiriesYoY',  label: 'Enquiries',  ragKey: 'enquiriesYoY',  format: v => (v > 0 ? '+' : '') + (v * 100).toFixed(1) + '%' },
      { key: 'cvr',           label: 'CVR',        ragKey: 'cvr',           format: v => (v > 0 ? '+' : '') + v.toFixed(1) + '%' },
      { key: 'velocity',      label: 'Velocity',   ragKey: 'velocity',      format: v => Math.round(v) + 'd' },
      { key: 'nps',           label: 'NPS',        ragKey: 'nps',           format: v => v === null ? '—' : String(Math.round(v)) },
      { key: 'capacity',      label: 'Capacity',   ragKey: 'capacity',      format: v => Math.round(v) + '%' },
      { key: 'bgcContractor', label: 'BGC',        ragKey: 'bgcContractor', format: v => Math.round(v) + '%' },
    ];

    return {
      metrics: metricDefs,
      rows: SCHOOLS.map(s => ({
        school: s,
        cells: metricDefs.map(m => {
          const val = m.key === 'nps' ? s.metrics.nps : s.metrics[m.key];
          const rag = (val === null || val === undefined) ? 'a' : computeRag(val, m.ragKey);
          return { rag, display: (val === null || val === undefined) ? '—' : m.format(val) };
        }),
      })),
    };
  }

  /** Compute all threshold breaches → alert list */
  function getAlerts() {
    const alerts = [];

    // Per-school
    SCHOOLS.forEach(s => {
      const m = s.metrics;

      if (m.enrolmentsYoY <= TH.enrolmentsYoY.crit) {
        alerts.push({
          severity: 'critical', school: s.name,
          metric: 'Enrolments YoY',
          value: fmt(m.enrolmentsYoY, 'pct'),
          threshold: fmt(TH.enrolmentsYoY.crit, 'pct'),
          desc: `${Math.abs(m.enrolments - m.enrolmentsPY)} fewer students than last year`,
        });
      }
      if (m.fteVsBudget <= TH.fteVsBudget.crit) {
        alerts.push({
          severity: 'warning', school: s.name,
          metric: 'FTE vs Budget',
          value: fmt(m.fteVsBudget, 'pct'),
          threshold: fmt(TH.fteVsBudget.crit, 'pct'),
          desc: `${Math.abs(m.fteForecast - m.fteBudget)} students below budget`,
        });
      }
      if (m.velocity >= TH.velocity.crit) {
        alerts.push({
          severity: m.velocity >= TH.velocity.crit + 30 ? 'critical' : 'warning',
          school: s.name,
          metric: 'Conversion Velocity',
          value: fmt(m.velocity, 'days'),
          threshold: fmt(TH.velocity.crit, 'days'),
          desc: `${Math.round(m.velocity / TH.velocity.crit * 100 - 100)}% above the ${TH.velocity.crit}-day threshold`,
        });
      }
      if (m.bgcContractor !== null && m.bgcContractor <= TH.bgcContractor.warn) {
        alerts.push({
          severity: m.bgcContractor <= TH.bgcContractor.crit ? 'critical' : 'warning',
          school: s.name,
          metric: 'Contractor BGC Compliance',
          value: m.bgcContractor + '%',
          threshold: TH.bgcContractor.warn + '%',
          desc: `${Math.round(TH.bgcContractor.warn - m.bgcContractor)}pp below safeguarding threshold`,
        });
      }
    });

    // Regional / Academic
    const aLevelDrop = ACADEMIC.aLevel.current - ACADEMIC.aLevel.prev;
    if (aLevelDrop <= TH.aLevelDrop.crit) {
      alerts.push({
        severity: 'critical', school: 'Region',
        metric: 'A-Level A*–A Grades',
        value: (aLevelDrop > 0 ? '+' : '') + aLevelDrop.toFixed(1) + 'pp',
        threshold: TH.aLevelDrop.crit + 'pp',
        desc: 'Decline concentrated in high-attrition departments',
      });
    }

    if (REGIONAL.fteVsBudget <= TH.fteVsBudget.crit) {
      alerts.push({
        severity: 'critical', school: 'EU Region',
        metric: 'Portfolio FTE vs Budget',
        value: fmt(REGIONAL.fteVsBudget, 'pct'),
        threshold: fmt(TH.fteVsBudget.crit, 'pct'),
        desc: `${Math.abs(REGIONAL.fteDelta).toLocaleString()} students short (${REGIONAL.fteForecast.toLocaleString()} vs ${REGIONAL.fteBudget.toLocaleString()})`,
      });
    }

    // Sort: critical first
    alerts.sort((a, b) => (a.severity === 'critical' ? -1 : 1) - (b.severity === 'critical' ? -1 : 1));
    return alerts;
  }

  /** Find school with best/worst value for a given metric */
  function getBest(metricKey) {
    const higherIsWorse = ['velocity', 'staffAttrition', 'macAttrition'].includes(metricKey);
    let best = null;
    SCHOOLS.forEach(s => {
      const v = s.metrics[metricKey];
      if (v === null || v === undefined) return;
      if (!best) { best = s; return; }
      if (higherIsWorse ? v < best.metrics[metricKey] : v > best.metrics[metricKey]) best = s;
    });
    return best;
  }

  function getWorst(metricKey) {
    const higherIsWorse = ['velocity', 'staffAttrition', 'macAttrition'].includes(metricKey);
    let worst = null;
    SCHOOLS.forEach(s => {
      const v = s.metrics[metricKey];
      if (v === null || v === undefined) return;
      if (!worst) { worst = s; return; }
      if (higherIsWorse ? v > worst.metrics[metricKey] : v < worst.metrics[metricKey]) worst = s;
    });
    return worst;
  }

  /** Generate data-driven insight strings for use in dashboards and stories */
  function generateInsights() {
    const bestCVR   = getBest('cvr');
    const worstCVR  = getWorst('cvr');
    const worstVel  = getWorst('velocity');
    const worstEnr  = getWorst('enrolmentsYoY');
    const bestEnr   = getBest('enrolmentsYoY');
    const bestNPS   = getBest('nps');
    const worstNPS  = getWorst('nps');
    const bestCap   = getBest('capacity');
    const worstCap  = getWorst('capacity');
    const aLevelDrop = ACADEMIC.aLevel.current - ACADEMIC.aLevel.prev;

    const cvrMultiple = (bestCVR.metrics.cvr / worstCVR.metrics.cvr).toFixed(1);

    return {
      // Portfolio summary
      portfolioSummary: `EU Region is ${Math.abs(REGIONAL.fteDelta).toLocaleString()} students below FTE budget (${fmt(REGIONAL.fteVsBudget, 'pct')}), driven primarily by ${worstEnr.name} (${fmt(worstEnr.metrics.enrolmentsYoY, 'pct')}) and Bratislava (${fmt(SCHOOLS[2].metrics.enrolmentsYoY, 'pct')}).`,

      // CVR gap
      cvrGap: `${bestCVR.name} converts at ${bestCVR.metrics.cvr}% — ${cvrMultiple}× better than ${worstCVR.name} at ${worstCVR.metrics.cvr}%. Same pipeline effort, profoundly different outcomes.`,
      cvrAction: `Replicating ${bestCVR.name}'s MAC visit process at ${worstCVR.name} could yield approximately ${Math.round((7.0 - worstCVR.metrics.cvr) / 100 * worstCVR.metrics.enquiries)} additional enrolments per cycle.`,

      // Velocity
      velocityAlert: `${worstVel.name}'s secondary velocity reached ${worstVel.metrics.velocity} days — ${Math.round(worstVel.metrics.velocity / TH.velocity.crit * 100 - 100)}% above the ${TH.velocity.crit}-day threshold and the highest in the portfolio.`,

      // Two-school problem
      twoProblemSchools: `${worstEnr.name} (${fmt(worstEnr.metrics.enrolmentsYoY, 'pct')}) and Bratislava (${fmt(SCHOOLS[2].metrics.enrolmentsYoY, 'pct')}) account for approximately 80% of total portfolio enrolment loss.`,

      // Beau Soleil opportunity
      beauSoleilOpportunity: `${bestCap.name} is the only school above 100% capacity with growing enquiry volume (+${(SCHOOLS[1].metrics.enquiriesYoY * 100).toFixed(1)}%) — unambiguous pricing headroom.`,

      // NPS
      npsLeader: bestNPS ? `${bestNPS.name} leads NPS at ${bestNPS.metrics.nps} — the only school above the ${TH.nps.target} target. ${worstNPS.name} has dropped to ${worstNPS.metrics.nps} from ${worstNPS.metrics.npsPrev} last year.` : '',

      // Academic
      aLevelContext: `A-Level A*–A grades fell ${Math.abs(aLevelDrop).toFixed(1)}pp to ${ACADEMIC.aLevel.current}% — the largest single-year decline in the portfolio. IB scores improved to ${ACADEMIC.ib.current}, suggesting the issue is programme- not school-level.`,

      // Capacity
      capacityRisk: `${worstCap.name} at ${worstCap.metrics.capacity}% — ${Math.round(worstCap.metrics.capacityTarget - worstCap.metrics.capacity)}pp below target. Without intervention this cycle, the school will face a third consecutive enrolment decline.`,

      // Compliance
      bgcGap: `Contractor BGC compliance at ${REGIONAL.contractorBgc}% — ${(REGIONAL.staffBgc - REGIONAL.contractorBgc).toFixed(1)}pp below the staff rate of ${REGIONAL.staffBgc}%. This gap indicates a systemic onboarding process failure, not isolated negligence.`,

      // Financial
      financialHealth: `Fee income at ${fmt(REGIONAL.feeIncome, '$M')} and EBITDA at ${fmt(REGIONAL.ebitda, '$M')} are both on budget, but flowthrough has declined to ${REGIONAL.flowthroughPct}% (from ${REGIONAL.flowthroughPctPY}% last year) — flagging rising fixed cost pressure.`,

      // Forward
      forwardRisk: `If no structural intervention is made at ${worstEnr.name} and Bratislava, the portfolio will enter EY2028 with a third consecutive enrolment decline in both schools, compounding fixed-cost pressure and NPS deterioration.`,
    };
  }

  // Public API
  return {
    META,
    THRESHOLDS: TH,
    SCHOOLS,
    REGIONAL,
    FINANCIAL_TREND,
    ACADEMIC,
    ACTIONS,
    fmt,
    computeRag,
    getSchoolRag,
    getHeatmapData,
    getAlerts,
    getBest,
    getWorst,
    generateInsights,
  };

})();
