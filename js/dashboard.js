// ============================================================
// Bain VCCP Dashboard - Interactive Drill-Down
// ============================================================

// Chart.js global config - Dark theme optimised
Chart.defaults.font.family = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";
Chart.defaults.font.size = 11;
Chart.defaults.color = '#6B6B80';
Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(22, 22, 31, 0.95)';
Chart.defaults.plugins.tooltip.borderColor = 'rgba(255,255,255,0.08)';
Chart.defaults.plugins.tooltip.borderWidth = 1;
Chart.defaults.plugins.tooltip.cornerRadius = 8;
Chart.defaults.plugins.tooltip.padding = 12;
Chart.defaults.plugins.tooltip.titleFont = { size: 12, weight: '600' };
Chart.defaults.plugins.tooltip.bodyFont = { size: 11 };
Chart.defaults.plugins.tooltip.titleColor = '#F1F1F4';
Chart.defaults.plugins.tooltip.bodyColor = '#A0A0B8';
Chart.defaults.plugins.tooltip.displayColors = true;
Chart.defaults.plugins.tooltip.boxPadding = 4;
Chart.defaults.plugins.legend.labels.usePointStyle = true;
Chart.defaults.plugins.legend.labels.pointStyle = 'circle';
Chart.defaults.plugins.legend.labels.padding = 20;
Chart.defaults.plugins.legend.labels.color = '#A0A0B8';
Chart.defaults.elements.line.tension = 0.35;
Chart.defaults.elements.bar.borderRadius = 6;
Chart.defaults.scale.grid.color = 'rgba(255, 255, 255, 0.04)';
Chart.defaults.scale.grid.drawBorder = false;
Chart.defaults.scale.border.display = false;
Chart.defaults.scale.ticks.color = '#6B6B80';

const COLORS = {
  economist: '#D4943A',
  ft: '#FFE8A3',
  wsj: '#F5C563',
  nativo: '#A67C2E',
  mobkoi: '#FFD04F',
  primary: '#F5C563',
  bright: '#FFE8A3',
  gold: '#F5C563',
  amber: '#D4943A',
  warmAmber: '#A67C2E',
  darkGold: '#8B6914',
  goldenrod: '#DAA520',
  paleGold: '#FFE8A3',
  chart: ['#F5C563', '#FFE8A3', '#D4943A', '#FFD04F', '#A67C2E', '#DAA520', '#8B6914', '#FFEFC1']
};

const SITE_COLOR_MAP = {
  'The Economist': '#D4943A',
  'FT': '#FFE8A3',
  'WSJ': '#F5C563',
  'Nativo Inc.': '#A67C2E',
  'Mobkoi': '#FFD04F'
};

const DISPLAY_NAMES = {
  'The Economist': 'Economist',
  'FT': 'FT',
  'WSJ': 'WSJ',
  'Nativo Inc.': 'Nativo',
  'Mobkoi': 'Mobkoi'
};

// Core publishers shown in overview; Nativo & Mobkoi only accessible via filters
const CORE_SITES = ['The Economist', 'FT', 'WSJ'];
const ALL_SITES = ['The Economist', 'FT', 'WSJ', 'Nativo Inc.', 'Mobkoi'];

let charts = {};
let currentView = 'placements';
let currentPage = 1;
let creativePage = 1;
const PAGE_SIZE = 25;
const CREATIVE_PAGE_SIZE = 15;

// ============================================================
// DRILL-DOWN STATE
// ============================================================
let drillState = { publisher: null, region: null, targeting: null };

function drillToPublisher(site) {
  drillState.publisher = drillState.publisher === site ? null : site;
  drillState.region = null;
  drillState.targeting = null;
  currentPage = 1;
  renderPlacementsView();
}

function drillToRegion(region) {
  drillState.region = drillState.region === region ? null : region;
  currentPage = 1;
  renderPlacementsView();
}

function drillToTargeting(targeting) {
  drillState.targeting = drillState.targeting === targeting ? null : targeting;
  currentPage = 1;
  renderPlacementsView();
}

function clearDrill() {
  drillState = { publisher: null, region: null, targeting: null };
  currentPage = 1;
  renderPlacementsView();
}

function clearAllFilters() {
  drillState = { publisher: null, region: null, targeting: null };
  document.getElementById('filterMonth').value = 'all';
  document.getElementById('filterSite').value = 'all';
  document.getElementById('filterRegion').value = 'all';
  currentPage = 1;
  renderPlacementsView();
}

function drillBack() {
  if (drillState.targeting) drillState.targeting = null;
  else if (drillState.region) drillState.region = null;
  else if (drillState.publisher) drillState.publisher = null;
  currentPage = 1;
  renderPlacementsView();
}

// Track which filter chip to clear by index
let _filterChipActions = [];
function clearFilterChip(idx) {
  if (_filterChipActions[idx]) {
    _filterChipActions[idx]();
  }
}

// ============================================================
// UTILITY FUNCTIONS
// ============================================================
function fmt(n) {
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
  return n.toLocaleString();
}

function fmtFull(n) {
  return n.toLocaleString();
}

function fmtPct(n) {
  return n.toFixed(2) + '%';
}

function fmtCurrency(n) {
  return '\u00A3' + n.toLocaleString();
}

function getVendorClass(site) {
  if (site.includes('Economist')) return 'econ';
  if (site.includes('FT') || site.includes('Financial')) return 'ft';
  if (site.includes('WSJ') || site.includes('Wall')) return 'wsj';
  return '';
}

function destroyChart(id) {
  if (charts[id]) {
    charts[id].destroy();
    delete charts[id];
  }
}

function fillColor(hexColor, alpha) {
  const r = parseInt(hexColor.slice(1,3), 16);
  const g = parseInt(hexColor.slice(3,5), 16);
  const b = parseInt(hexColor.slice(5,7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha || 0.08})`;
}

function lerpColor(a, b, t) {
  const ar = parseInt(a.slice(1,3),16), ag = parseInt(a.slice(3,5),16), ab = parseInt(a.slice(5,7),16);
  const br = parseInt(b.slice(1,3),16), bg = parseInt(b.slice(3,5),16), bb = parseInt(b.slice(5,7),16);
  const r = Math.round(ar + (br-ar)*t), g = Math.round(ag + (bg-ag)*t), bl = Math.round(ab + (bb-ab)*t);
  return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${bl.toString(16).padStart(2,'0')}`;
}

// ============================================================
// VIEW SWITCHING
// ============================================================
function switchView(view) {
  currentView = view;
  document.querySelectorAll('.dashboard-view').forEach(v => v.classList.remove('active'));
  document.getElementById('view-' + view).classList.add('active');
  document.querySelectorAll('.nav-item[data-view]').forEach(n => n.classList.remove('active'));
  document.querySelector(`.nav-item[data-view="${view}"]`).classList.add('active');

  const titles = { placements: 'Placements & Sites', creative: 'Creative Insights', sov: 'Share of Voice' };
  document.getElementById('pageTitle').textContent = titles[view];

  if (view === 'placements') renderPlacementsView();
  else if (view === 'creative') renderCreativeView();
  else if (view === 'sov') renderSOVView();
}

// ============================================================
// CAMPAIGN YEAR FILTER
// ============================================================
function applyYearFilter() {
  const year = document.getElementById('filterYear').value;
  const monthSelect = document.getElementById('filterMonth');
  const options = monthSelect.querySelectorAll('option');

  options.forEach(opt => {
    if (opt.value === 'all') {
      opt.style.display = '';
      return;
    }
    if (year === 'all') {
      opt.style.display = '';
    } else {
      opt.style.display = opt.value.startsWith(year) ? '' : 'none';
    }
  });

  // If current month selection is hidden by year filter, reset to 'all'
  const currentMonth = monthSelect.value;
  if (currentMonth !== 'all' && !currentMonth.startsWith(year) && year !== 'all') {
    monthSelect.value = 'all';
  }

  applyFilters();
}

// ============================================================
// EMEA TIER REFERENCE
// ============================================================
function toggleEMEARef() {
  const panel = document.getElementById('emeaRefPanel');
  if (!panel) return;
  panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
}

// ============================================================
// FILTERS
// ============================================================
function applyFilters() {
  if (currentView === 'placements') renderPlacementsView();
  else if (currentView === 'creative') renderCreativeView();
  else if (currentView === 'sov') renderSOVView();
}

// Returns the active month filter value (or 'all')
function getActiveMonth() {
  return document.getElementById('filterMonth').value;
}

// Returns the active publisher filter (drillState takes priority over dropdown)
function getActivePublisher() {
  if (drillState.publisher) return drillState.publisher;
  const v = document.getElementById('filterSite').value;
  return v !== 'all' ? v : null;
}

// Returns the active region filter (drillState takes priority over dropdown)
function getActiveRegion() {
  if (drillState.region) return drillState.region;
  const v = document.getElementById('filterRegion').value;
  return v !== 'all' ? v : null;
}

// Compute per-site totals filtered by the selected month
// When month='all', returns original SITE_TOTALS; otherwise computes from monthly arrays
function getFilteredSiteTotals() {
  const month = getActiveMonth();
  if (month === 'all') return SITE_TOTALS;

  const monthIdx = MONTHS.indexOf(month);
  if (monthIdx === -1) return SITE_TOTALS;

  const result = {};
  Object.keys(SITE_TOTALS).forEach(site => {
    const imps = (SITE_MONTHLY[site] && SITE_MONTHLY[site][monthIdx]) || 0;
    const clicks = (SITE_MONTHLY_CLICKS[site] && SITE_MONTHLY_CLICKS[site][monthIdx]) || 0;
    result[site] = {
      impressions: imps,
      clicks: clicks,
      ctr: imps > 0 ? (clicks / imps * 100) : 0
    };
  });
  return result;
}

// Get the month label for display (e.g. "Mar '25")
function getMonthLabel(monthKey) {
  const idx = MONTHS.indexOf(monthKey);
  return idx >= 0 ? MONTH_LABELS[idx] : monthKey;
}

function getFilteredPlacements() {
  const site = document.getElementById('filterSite').value;
  const region = document.getElementById('filterRegion').value;
  const month = getActiveMonth();

  let data = [...TOP_PLACEMENTS];

  // When a specific month is selected, scale placement data proportionally
  // so totals match the monthly KPI figures
  if (month !== 'all') {
    const monthIdx = MONTHS.indexOf(month);
    if (monthIdx >= 0) {
      // Build ratio per site: monthly impressions / total impressions
      const siteRatios = {};
      const siteClickRatios = {};
      Object.keys(SITE_TOTALS).forEach(s => {
        const totalImps = SITE_TOTALS[s].impressions;
        const monthImps = (SITE_MONTHLY[s] && SITE_MONTHLY[s][monthIdx]) || 0;
        siteRatios[s] = totalImps > 0 ? monthImps / totalImps : 0;

        const totalClicks = SITE_TOTALS[s].clicks;
        const monthClicks = (SITE_MONTHLY_CLICKS[s] && SITE_MONTHLY_CLICKS[s][monthIdx]) || 0;
        siteClickRatios[s] = totalClicks > 0 ? monthClicks / totalClicks : 0;
      });

      data = data.map(p => {
        const impRatio = siteRatios[p.site] || 0;
        const clickRatio = siteClickRatios[p.site] || 0;
        const scaledImps = Math.round(p.impressions * impRatio);
        const scaledClicks = Math.round(p.clicks * clickRatio);
        return {
          ...p,
          impressions: scaledImps,
          clicks: scaledClicks,
          ctr: scaledImps > 0 ? (scaledClicks / scaledImps * 100) : 0
        };
      });

      // Remove placements with zero impressions in this month
      data = data.filter(p => p.impressions > 0);
    }
  }

  // Drill-down filters take priority
  if (drillState.publisher) data = data.filter(p => p.site === drillState.publisher);
  else if (site !== 'all') data = data.filter(p => p.site === site);
  else {
    // In overview (no publisher selected), only show core publishers
    data = data.filter(p => CORE_SITES.includes(p.site));
  }

  if (drillState.region) data = data.filter(p => p.region === drillState.region);
  else if (region !== 'all') data = data.filter(p => p.region === region);

  if (drillState.targeting) data = data.filter(p => p.targeting === drillState.targeting);

  // Apply sorting
  if (sortColumn) {
    data.sort((a, b) => {
      let va = a[sortColumn], vb = b[sortColumn];
      if (typeof va === 'string') return sortDir * va.localeCompare(vb);
      return sortDir * (va - vb);
    });
  }

  return data;
}

// ============================================================
// DRILL-DOWN UI
// ============================================================
function renderDrillNav() {
  const backBtn = document.getElementById('drillBackBtn');
  const backLabel = document.getElementById('drillBackLabel');
  const hasFilters = drillState.publisher || drillState.region || drillState.targeting;

  if (hasFilters) {
    backBtn.style.display = 'inline-flex';
    if (drillState.targeting) backLabel.textContent = drillState.region || (drillState.publisher ? DISPLAY_NAMES[drillState.publisher] || drillState.publisher : 'All Publishers');
    else if (drillState.region) backLabel.textContent = drillState.publisher ? DISPLAY_NAMES[drillState.publisher] || drillState.publisher : 'All Publishers';
    else backLabel.textContent = 'All Publishers';
  } else {
    backBtn.style.display = 'none';
  }

  // Filter chips
  const container = document.getElementById('activeFilters');
  _filterChipActions = [];
  const chips = [];

  // Month filter chip
  const month = getActiveMonth();
  if (month !== 'all') {
    const idx = chips.length;
    chips.push(`<span class="filter-chip">Month: ${getMonthLabel(month)}<button onclick="clearFilterChip(${idx})">×</button></span>`);
    _filterChipActions.push(() => { document.getElementById('filterMonth').value = 'all'; currentPage = 1; renderPlacementsView(); });
  }

  if (drillState.publisher) {
    const name = DISPLAY_NAMES[drillState.publisher] || drillState.publisher;
    const idx = chips.length;
    chips.push(`<span class="filter-chip">Publisher: ${name}<button onclick="clearFilterChip(${idx})">×</button></span>`);
    _filterChipActions.push(() => { drillState.publisher = null; drillState.region = null; drillState.targeting = null; currentPage = 1; renderPlacementsView(); });
  } else {
    const pubDropdown = document.getElementById('filterSite').value;
    if (pubDropdown !== 'all') {
      const name = DISPLAY_NAMES[pubDropdown] || pubDropdown;
      const idx = chips.length;
      chips.push(`<span class="filter-chip">Publisher: ${name}<button onclick="clearFilterChip(${idx})">×</button></span>`);
      _filterChipActions.push(() => { document.getElementById('filterSite').value = 'all'; currentPage = 1; renderPlacementsView(); });
    }
  }

  if (drillState.region) {
    const idx = chips.length;
    chips.push(`<span class="filter-chip">Region: ${drillState.region}<button onclick="clearFilterChip(${idx})">×</button></span>`);
    _filterChipActions.push(() => { drillState.region = null; drillState.targeting = null; currentPage = 1; renderPlacementsView(); });
  } else {
    const regDropdown = document.getElementById('filterRegion').value;
    if (regDropdown !== 'all') {
      const idx = chips.length;
      chips.push(`<span class="filter-chip">Region: ${regDropdown}<button onclick="clearFilterChip(${idx})">×</button></span>`);
      _filterChipActions.push(() => { document.getElementById('filterRegion').value = 'all'; currentPage = 1; renderPlacementsView(); });
    }
  }

  if (drillState.targeting) {
    const idx = chips.length;
    chips.push(`<span class="filter-chip">Targeting: ${drillState.targeting}<button onclick="clearFilterChip(${idx})">×</button></span>`);
    _filterChipActions.push(() => { drillState.targeting = null; currentPage = 1; renderPlacementsView(); });
  }

  if (chips.length > 0) {
    container.innerHTML = chips.join('') + '<button class="filter-clear-all" onclick="clearAllFilters()">Clear all</button>';
  } else {
    container.innerHTML = '';
  }
}

// ============================================================
// VIEW 1: PLACEMENTS & SITES
// ============================================================
function renderPlacementsView() {
  renderDrillNav();
  renderPlacementKPIs();
  renderPublisherSummaryCards();
  renderImpByPublisherChart('impressions');
  renderPublisherShareChart();
  renderRegionPerfChart();
  renderAudiencePerfChart();
  renderPlacementTable();
}

function renderPlacementKPIs() {
  const filteredSites = getFilteredSiteTotals();
  const month = getActiveMonth();
  const activePub = getActivePublisher();
  const monthLabel = month !== 'all' ? getMonthLabel(month) : null;
  const placements = getFilteredPlacements();

  if (activePub) {
    // Single publisher view (drill or dropdown)
    const siteData = filteredSites[activePub] || { impressions: 0, clicks: 0, ctr: 0 };
    const totalImps = siteData.impressions;
    const totalClicks = siteData.clicks;
    const avgCTR = totalImps > 0 ? totalClicks / totalImps * 100 : 0;
    const name = DISPLAY_NAMES[activePub] || activePub;
    const regions = [...new Set(placements.map(p => p.region))];
    const formats = [...new Set(placements.map(p => p.format))];
    const periodLabel = monthLabel || 'all months';

    document.getElementById('placement-kpis').innerHTML = `
      <div class="kpi-card highlight">
        <div class="kpi-label">${name} Impressions</div>
        <div class="kpi-value gold">${fmt(totalImps)}</div>
        <div class="kpi-subtitle">${fmtFull(totalImps)} in ${periodLabel}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">${name} Clicks</div>
        <div class="kpi-value">${fmt(totalClicks)}</div>
        <div class="kpi-subtitle">${fmtFull(totalClicks)} total</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">CTR</div>
        <div class="kpi-value">${fmtPct(avgCTR)}</div>
        <div class="kpi-subtitle">${name} average</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">Placements</div>
        <div class="kpi-value">${placements.length}</div>
        <div class="kpi-subtitle">Active lines${drillState.region ? ' in ' + drillState.region : ''}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">Regions</div>
        <div class="kpi-value">${regions.length}</div>
        <div class="kpi-subtitle">${regions.slice(0,3).join(', ')}${regions.length > 3 ? '...' : ''}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">Formats</div>
        <div class="kpi-value">${formats.length}</div>
        <div class="kpi-subtitle">${formats.slice(0,3).join(', ')}${formats.length > 3 ? '...' : ''}</div>
      </div>
    `;
  } else {
    // All publishers view, filtered by month — only core sites in overview
    const sites = CORE_SITES;
    const totalImps = sites.reduce((s, k) => s + (filteredSites[k] ? filteredSites[k].impressions : 0), 0);
    const totalClicks = sites.reduce((s, k) => s + (filteredSites[k] ? filteredSites[k].clicks : 0), 0);
    const avgCTR = totalImps > 0 ? totalClicks / totalImps * 100 : 0;
    const numPlacements = placements.length;

    // Count active publishers (those with impressions in the period)
    const activeSites = sites.filter(k => filteredSites[k] && filteredSites[k].impressions > 0);
    const activeSiteNames = activeSites.map(s => DISPLAY_NAMES[s] || s);
    const pubSubtitle = activeSiteNames.length <= 3
      ? activeSiteNames.join(', ')
      : activeSiteNames.slice(0, 2).join(', ') + ' + ' + (activeSiteNames.length - 2);

    // Period info
    let periodLabel, monthsActive;
    if (month !== 'all') {
      periodLabel = monthLabel;
      monthsActive = 1;
    } else {
      periodLabel = "Jan '25 - Feb '26";
      monthsActive = MONTHS.length;
    }

    document.getElementById('placement-kpis').innerHTML = `
      <div class="kpi-card highlight">
        <div class="kpi-label">Total Impressions</div>
        <div class="kpi-value gold">${fmt(totalImps)}</div>
        <div class="kpi-subtitle">${fmtFull(totalImps)} delivered</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">Total Clicks</div>
        <div class="kpi-value">${fmt(totalClicks)}</div>
        <div class="kpi-subtitle">${fmtFull(totalClicks)} total</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">Overall CTR</div>
        <div class="kpi-value">${fmtPct(avgCTR)}</div>
        <div class="kpi-subtitle">${monthLabel ? monthLabel + ' average' : 'Across all publishers'}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">Active Publishers</div>
        <div class="kpi-value">${activeSites.length}</div>
        <div class="kpi-subtitle">${pubSubtitle}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">Campaign Period</div>
        <div class="kpi-value">${monthsActive}</div>
        <div class="kpi-subtitle">${monthsActive === 1 ? periodLabel : 'Months (' + periodLabel + ')'}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">Top Placements</div>
        <div class="kpi-value">${numPlacements}+</div>
        <div class="kpi-subtitle">Active placement lines</div>
      </div>
    `;
  }
}

// ============================================================
// PUBLISHER SUMMARY CARDS (clickable)
// ============================================================
function renderPublisherSummaryCards() {
  const container = document.getElementById('publisherSummaryCards');
  const filteredSites = getFilteredSiteTotals();
  const activePub = getActivePublisher();
  // Show core sites in overview; if a non-core publisher is drilled, include it
  const sites = activePub && !CORE_SITES.includes(activePub)
    ? [...CORE_SITES, activePub]
    : CORE_SITES;
  const totalImps = sites.reduce((s, k) => s + filteredSites[k].impressions, 0);

  container.innerHTML = sites.map(site => {
    const d = filteredSites[site];
    const color = SITE_COLOR_MAP[site];
    const pct = totalImps > 0 ? (d.impressions / totalImps * 100).toFixed(1) : '0.0';
    const placementCount = TOP_PLACEMENTS.filter(p => p.site === site).length;
    const isActive = activePub === site;
    const name = DISPLAY_NAMES[site];
    const ctr = d.impressions > 0 ? (d.clicks / d.impressions * 100) : 0;

    return `
      <div class="publisher-card ${isActive ? 'active' : ''}" onclick="drillToPublisher('${site}')" style="--pub-color: ${color}; border-top-color: ${color}">
        <div class="publisher-card-header">
          <span class="vendor-tag ${getVendorClass(site)}">${name}</span>
          <span class="publisher-card-pct">${pct}%</span>
        </div>
        <div class="publisher-card-value">${fmt(d.impressions)}</div>
        <div class="publisher-card-row">
          <span>${fmtFull(d.clicks)} clicks</span>
          <span>${fmtPct(ctr)} CTR</span>
        </div>
        <div class="publisher-card-placements">${placementCount} placements</div>
      </div>
    `;
  }).join('');
}

// ============================================================
// CHARTS - with interactive click handlers & enhanced tooltips
// ============================================================
function renderImpByPublisherChart(metric) {
  destroyChart('chartImpByPublisher');
  const canvas = document.getElementById('chartImpByPublisher');
  const ctx = canvas.getContext('2d');
  const activePub = getActivePublisher();
  const sites = activePub && !CORE_SITES.includes(activePub)
    ? [...CORE_SITES, activePub]
    : CORE_SITES;

  const dashPatterns = [[], [8, 4], [3, 3], [12, 4, 3, 4], [6, 2]];
  const datasets = sites.map((site, idx) => {
    const color = SITE_COLOR_MAP[site];
    const isHighlighted = !drillState.publisher || drillState.publisher === site;
    return {
      label: DISPLAY_NAMES[site],
      data: metric === 'impressions' ? SITE_MONTHLY[site] : SITE_MONTHLY_CLICKS[site],
      backgroundColor: fillColor(color, isHighlighted ? 0.08 : 0.02),
      borderColor: isHighlighted ? color : color + '30',
      borderWidth: isHighlighted ? 2.5 : 1,
      borderDash: dashPatterns[idx] || [],
      fill: isHighlighted,
      pointRadius: 0,
      pointHoverRadius: 6,
      pointHoverBackgroundColor: color,
      pointHoverBorderColor: '#0A0A0F',
      pointHoverBorderWidth: 3
    };
  });

  charts['chartImpByPublisher'] = new Chart(ctx, {
    type: 'line',
    data: { labels: MONTH_LABELS, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { position: 'bottom' },
        tooltip: {
          callbacks: {
            label: (tipCtx) => {
              const val = tipCtx.raw;
              const monthTotal = tipCtx.chart.data.datasets.reduce((s, ds) => s + (ds.data[tipCtx.dataIndex] || 0), 0);
              const pct = monthTotal ? (val / monthTotal * 100).toFixed(1) : '0';
              return `${tipCtx.dataset.label}: ${fmtFull(val)} ${metric} (${pct}%)`;
            }
          }
        }
      },
      scales: {
        y: { beginAtZero: true, ticks: { callback: v => fmt(v) } },
        x: { ticks: { maxRotation: 45, font: { size: 10 } } }
      }
    }
  });
}

function toggleImpChart(metric, btn) {
  btn.parentElement.querySelectorAll('.chart-toggle-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderImpByPublisherChart(metric);
}

function renderPublisherShareChart() {
  destroyChart('chartPublisherShare');
  const ctx = document.getElementById('chartPublisherShare').getContext('2d');
  const filteredSites = getFilteredSiteTotals();
  const activePub = getActivePublisher();
  const sites = activePub && !CORE_SITES.includes(activePub)
    ? [...CORE_SITES, activePub]
    : CORE_SITES;
  const labels = sites.map(s => DISPLAY_NAMES[s]);
  const data = sites.map(s => filteredSites[s].impressions);
  const colors = sites.map(s => SITE_COLOR_MAP[s]);

  charts['chartPublisherShare'] = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: colors,
        borderColor: '#0A0A0F',
        borderWidth: 3,
        hoverOffset: 8,
        hoverBorderWidth: 3
      }]
    },
    options: {
      responsive: true,
      cutout: '72%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: { padding: 16, font: { size: 11 } }
        },
        tooltip: {
          callbacks: {
            label: (tipCtx) => {
              const total = tipCtx.dataset.data.reduce((a, b) => a + b, 0);
              const pct = (tipCtx.raw / total * 100).toFixed(1);
              return `${tipCtx.label}: ${fmtFull(tipCtx.raw)} impressions (${pct}%)`;
            }
          }
        }
      },
      // Click to drill into publisher
      onClick: (evt, elements) => {
        if (elements.length > 0) {
          drillToPublisher(sites[elements[0].index]);
        }
      }
    }
  });
}

function renderRegionPerfChart() {
  destroyChart('chartRegionPerf');
  const ctx = document.getElementById('chartRegionPerf').getContext('2d');
  const chartData = REGION_DATA.slice(0, 8);
  const totalImps = chartData.reduce((s, d) => s + d.impressions, 0);

  // Mark the currently-drilled region
  const bgColors = chartData.map(d => {
    if (drillState.region === d.region) return COLORS.primary + 'A0';
    return COLORS.primary + '60';
  });
  const borderColors = chartData.map(d => {
    if (drillState.region === d.region) return COLORS.primary;
    return COLORS.primary;
  });

  // Add clickable hint
  document.getElementById('chartRegionPerf').parentElement.setAttribute('data-clickable', 'true');

  charts['chartRegionPerf'] = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: chartData.map(d => d.region),
      datasets: [
        {
          label: 'Impressions',
          data: chartData.map(d => d.impressions),
          backgroundColor: bgColors,
          borderColor: borderColors,
          borderWidth: 1,
          yAxisID: 'y',
          borderRadius: 6
        },
        {
          label: 'CTR (%)',
          data: chartData.map(d => d.ctr),
          type: 'line',
          borderColor: COLORS.bright,
          backgroundColor: 'transparent',
          borderWidth: 2.5,
          pointRadius: 5,
          pointBackgroundColor: COLORS.bright,
          pointBorderColor: '#0A0A0F',
          pointBorderWidth: 2,
          yAxisID: 'y1'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { position: 'bottom' },
        tooltip: {
          callbacks: {
            label: (tipCtx) => {
              if (tipCtx.datasetIndex === 0) {
                const pct = (tipCtx.raw / totalImps * 100).toFixed(1);
                return `Impressions: ${fmtFull(tipCtx.raw)} (${pct}% of total)`;
              }
              return `CTR: ${tipCtx.raw.toFixed(2)}%`;
            }
          }
        }
      },
      scales: {
        y: { beginAtZero: true, ticks: { callback: v => fmt(v) }, title: { display: true, text: 'Impressions', color: '#6B6B80' } },
        y1: { position: 'right', beginAtZero: true, ticks: { callback: v => v.toFixed(2) + '%' }, title: { display: true, text: 'CTR', color: '#6B6B80' }, grid: { display: false } }
      },
      // Click to filter by region
      onClick: (evt, elements) => {
        if (elements.length > 0) {
          drillToRegion(chartData[elements[0].index].region);
        }
      }
    }
  });
}

function renderAudiencePerfChart() {
  destroyChart('chartAudiencePerf');
  const ctx = document.getElementById('chartAudiencePerf').getContext('2d');
  const totalImps = TARGETING_DATA.reduce((s, d) => s + d.impressions, 0);

  // Highlight active targeting
  const bgColors = TARGETING_DATA.map((d, i) => {
    const base = COLORS.chart[i % COLORS.chart.length];
    return drillState.targeting === d.targeting ? base + '90' : base + '50';
  });

  // Add clickable hint
  document.getElementById('chartAudiencePerf').parentElement.setAttribute('data-clickable', 'true');

  charts['chartAudiencePerf'] = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: TARGETING_DATA.map(d => d.targeting),
      datasets: [
        {
          label: 'Impressions',
          data: TARGETING_DATA.map(d => d.impressions),
          backgroundColor: bgColors,
          borderColor: COLORS.chart.slice(0, TARGETING_DATA.length),
          borderWidth: 1,
          borderRadius: 6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'y',
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (tipCtx) => {
              const d = TARGETING_DATA[tipCtx.dataIndex];
              const pct = (d.impressions / totalImps * 100).toFixed(1);
              return [`Impressions: ${fmtFull(d.impressions)} (${pct}%)`, `Clicks: ${fmtFull(d.clicks)}`, `CTR: ${fmtPct(d.ctr)}`];
            }
          }
        }
      },
      scales: {
        x: { ticks: { callback: v => fmt(v) } }
      },
      // Click to filter by targeting
      onClick: (evt, elements) => {
        if (elements.length > 0) {
          drillToTargeting(TARGETING_DATA[elements[0].index].targeting);
        }
      }
    }
  });
}

// ============================================================
// PLACEMENT TABLE - with proper sorting
// ============================================================
let sortColumn = null;
let sortDir = 1;

function sortTable(col) {
  if (sortColumn === col) sortDir *= -1;
  else { sortColumn = col; sortDir = 1; }

  // Update header styling
  document.querySelectorAll('#placementTable th').forEach(th => th.classList.remove('sorted'));
  const headerIdx = ['placement','site','region','targeting','format','impressions','clicks','ctr'].indexOf(col);
  if (headerIdx >= 0) {
    const th = document.querySelectorAll('#placementTable th')[headerIdx];
    if (th) th.classList.add('sorted');
  }

  renderPlacementTable();
}

function renderPlacementTable() {
  const data = getFilteredPlacements();
  const start = (currentPage - 1) * PAGE_SIZE;
  const end = Math.min(start + PAGE_SIZE, data.length);
  const pageData = data.slice(start, end);

  const tbody = document.getElementById('placementTableBody');
  tbody.innerHTML = pageData.map(p => `
    <tr>
      <td title="${p.placement}" style="max-width:320px;overflow:hidden;text-overflow:ellipsis;color:var(--text-primary);font-weight:500;">${p.placement}</td>
      <td><span class="vendor-tag ${getVendorClass(p.site)}" style="cursor:pointer" onclick="drillToPublisher('${p.site}')">${DISPLAY_NAMES[p.site] || p.site}</span></td>
      <td><span style="cursor:pointer;text-decoration:underline;text-decoration-style:dotted;text-underline-offset:3px;" onclick="drillToRegion('${p.region}')">${p.region}</span></td>
      <td><span style="cursor:pointer;text-decoration:underline;text-decoration-style:dotted;text-underline-offset:3px;" onclick="drillToTargeting('${p.targeting}')">${p.targeting}</span></td>
      <td>${p.format}</td>
      <td class="number">${fmtFull(p.impressions)}</td>
      <td class="number">${fmtFull(p.clicks)}</td>
      <td class="number">
        <div class="perf-bar-container">
          <div class="perf-bar"><div class="perf-bar-fill ${p.ctr > 0.3 ? 'good' : p.ctr > 0.15 ? 'moderate' : 'low'}" style="width:${Math.min(p.ctr / 1 * 100, 100)}%"></div></div>
          <span class="perf-bar-value">${fmtPct(p.ctr)}</span>
        </div>
      </td>
    </tr>
  `).join('');

  document.getElementById('placementTableInfo').textContent = data.length > 0
    ? `Showing ${start + 1}\u2013${end} of ${data.length} placements`
    : 'No placements match current filters';

  const totalPages = Math.ceil(data.length / PAGE_SIZE);
  const pagination = document.getElementById('placementPagination');
  if (totalPages <= 1) {
    pagination.innerHTML = '';
    return;
  }
  let paginationHTML = `<button ${currentPage <= 1 ? 'disabled' : ''} onclick="changePage(${currentPage - 1})">&lt;</button>`;
  // Smart pagination: show first, last, and nearby pages
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      paginationHTML += `<button class="${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">${i}</button>`;
    } else if (i === currentPage - 2 || i === currentPage + 2) {
      paginationHTML += `<span style="color:var(--text-muted);padding:0 4px;">...</span>`;
    }
  }
  paginationHTML += `<button ${currentPage >= totalPages ? 'disabled' : ''} onclick="changePage(${currentPage + 1})">&gt;</button>`;
  pagination.innerHTML = paginationHTML;
}

function changePage(page) {
  currentPage = page;
  renderPlacementTable();
}

function filterPlacementTable() {
  const search = document.getElementById('placementSearch').value.toLowerCase();
  const rows = document.querySelectorAll('#placementTableBody tr');
  rows.forEach(row => {
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(search) ? '' : 'none';
  });
}

// ============================================================
// VIEW 2: CREATIVE INSIGHTS
// ============================================================

// Extract theme from placement name
function extractTheme(name) {
  if (name.includes('_AI_') || name.includes('_AI ') || name.includes('AI &')) return 'AI';
  if (name.includes('_Macro_') || name.includes('_Macro ')) return 'Macro';
  if (name.includes('_Energy_') || name.includes('_Energy ')) return 'Energy';
  return null;
}

// Extract creative message from placement name by matching known messages
const KNOWN_MESSAGES = CREATIVE_MESSAGES.map(m => m.message);
function extractMessage(name) {
  for (const msg of KNOWN_MESSAGES) {
    if (name.includes(msg) || name.toLowerCase().includes(msg.toLowerCase())) return msg;
  }
  // Try partial matches for common patterns
  if (name.includes('STtariff')) return 'TariffUncertainty';
  if (name.includes('TarrifsNextChapter')) return 'SeizeV2';
  if (name.includes('TarrifsPhase1')) return 'TariffActions';
  if (name.includes('BoardsPhase1')) return 'AiResults';
  if (name.includes('AgendaPhase1')) return 'Resources';
  if (name.includes('UnstickingYourAITransformation')) return 'UnstickTransformation';
  return null;
}

// Get filtered creative data derived from placements
function getFilteredCreativeData() {
  const month = getActiveMonth();
  const pubFilter = document.getElementById('filterSite').value;
  const regionFilter = document.getElementById('filterRegion').value;
  const hasFilter = month !== 'all' || pubFilter !== 'all' || regionFilter !== 'all';

  if (!hasFilter) {
    return { themes: CREATIVE_THEMES, messages: CREATIVE_MESSAGES, filtered: false };
  }

  // Get filtered placements (uses existing filter logic)
  let placements = [...TOP_PLACEMENTS];

  // Apply month scaling
  if (month !== 'all') {
    const monthIdx = MONTHS.indexOf(month);
    if (monthIdx >= 0) {
      const siteRatios = {};
      const siteClickRatios = {};
      Object.keys(SITE_TOTALS).forEach(s => {
        const totalImps = SITE_TOTALS[s].impressions;
        const monthImps = (SITE_MONTHLY[s] && SITE_MONTHLY[s][monthIdx]) || 0;
        siteRatios[s] = totalImps > 0 ? monthImps / totalImps : 0;
        const totalClicks = SITE_TOTALS[s].clicks;
        const monthClicks = (SITE_MONTHLY_CLICKS[s] && SITE_MONTHLY_CLICKS[s][monthIdx]) || 0;
        siteClickRatios[s] = totalClicks > 0 ? monthClicks / totalClicks : 0;
      });
      placements = placements.map(p => {
        const impRatio = siteRatios[p.site] || 0;
        const clickRatio = siteClickRatios[p.site] || 0;
        const scaledImps = Math.round(p.impressions * impRatio);
        const scaledClicks = Math.round(p.clicks * clickRatio);
        return { ...p, impressions: scaledImps, clicks: scaledClicks, ctr: scaledImps > 0 ? (scaledClicks / scaledImps * 100) : 0 };
      }).filter(p => p.impressions > 0);
    }
  }

  // Apply publisher filter
  if (pubFilter !== 'all') {
    placements = placements.filter(p => p.site === pubFilter);
  }

  // Apply region filter
  if (regionFilter !== 'all') {
    placements = placements.filter(p => p.region === regionFilter);
  }

  // Extract themes and messages from filtered placements
  const themeMap = {};
  const messageMap = {};

  placements.forEach(p => {
    const theme = extractTheme(p.placement);
    const msg = extractMessage(p.placement);

    if (theme) {
      if (!themeMap[theme]) themeMap[theme] = { theme, impressions: 0, clicks: 0 };
      themeMap[theme].impressions += p.impressions;
      themeMap[theme].clicks += p.clicks;
    }

    if (msg) {
      if (!messageMap[msg]) messageMap[msg] = { message: msg, impressions: 0, clicks: 0 };
      messageMap[msg].impressions += p.impressions;
      messageMap[msg].clicks += p.clicks;
    }
  });

  const themes = Object.values(themeMap).map(t => ({
    ...t,
    ctr: t.impressions > 0 ? (t.clicks / t.impressions * 100) : 0
  })).sort((a, b) => b.impressions - a.impressions);

  const messages = Object.values(messageMap).map(m => ({
    ...m,
    ctr: m.impressions > 0 ? (m.clicks / m.impressions * 100) : 0
  })).sort((a, b) => b.impressions - a.impressions);

  return { themes, messages, filtered: true };
}

function renderCreativeView() {
  renderCreativeKPIs();
  renderThemePerfChart();
  renderThemeCTRChart();
  renderMessagingChart('impressions');
  renderTopBottomCreatives();
  renderCreativeTable();
  renderCreativeGallery();
}

function renderCreativeKPIs() {
  const { themes, messages, filtered } = getFilteredCreativeData();

  if (themes.length === 0 && filtered) {
    document.getElementById('creative-kpis').innerHTML = `
      <div class="kpi-card" style="grid-column: 1 / -1; text-align:center;">
        <div class="kpi-label">No creative data available for the selected filters</div>
        <div class="kpi-subtitle">Try adjusting or clearing the filters</div>
      </div>`;
    return;
  }

  const totalImps = themes.reduce((s, t) => s + t.impressions, 0);
  const totalClicks = themes.reduce((s, t) => s + t.clicks, 0);
  const avgCTR = totalImps > 0 ? totalClicks / totalImps * 100 : 0;
  const topMsg = messages.length > 0 ? messages.reduce((best, m) => m.ctr > best.ctr ? m : best, messages[0]) : null;
  const numMessages = messages.length;
  const bestTheme = themes.reduce((best, t) => t.ctr > best.ctr ? t : best, themes[0]);
  const highestVol = themes.reduce((best, t) => t.impressions > best.impressions ? t : best, themes[0]);
  const filterNote = filtered ? '<div style="font-size:10px;color:var(--text-muted);margin-top:4px;">Filtered view</div>' : '';

  document.getElementById('creative-kpis').innerHTML = `
    <div class="kpi-card highlight">
      <div class="kpi-label">Creative Impressions</div>
      <div class="kpi-value gold">${fmt(totalImps)}</div>
      <div class="kpi-subtitle">Across ${themes.length} themes${filterNote}</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">Creative Clicks</div>
      <div class="kpi-value">${fmt(totalClicks)}</div>
      <div class="kpi-subtitle">${fmtPct(avgCTR)} overall CTR</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">Top Performing</div>
      <div class="kpi-value" style="font-size:18px">${topMsg ? topMsg.message : 'N/A'}</div>
      <div class="kpi-subtitle">${topMsg ? fmtPct(topMsg.ctr) + ' CTR' : ''}</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">Active Creatives</div>
      <div class="kpi-value">${numMessages}</div>
      <div class="kpi-subtitle">Message variants${filtered ? ' (filtered)' : ' running'}</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">Best Theme CTR</div>
      <div class="kpi-value">${bestTheme.theme}</div>
      <div class="kpi-subtitle">${fmtPct(bestTheme.ctr)} CTR</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">Highest Volume</div>
      <div class="kpi-value">${highestVol.theme}</div>
      <div class="kpi-subtitle">${fmt(highestVol.impressions)} imps</div>
    </div>
  `;
}

function renderThemePerfChart() {
  destroyChart('chartThemePerf');
  const ctx = document.getElementById('chartThemePerf').getContext('2d');
  const themeColors = { 'AI': '#F5C563', 'Macro': '#D4943A', 'Energy': '#FFE8A3' };
  const { themes } = getFilteredCreativeData();
  const totalImps = themes.reduce((s, t) => s + t.impressions, 0);

  if (themes.length === 0) {
    ctx.canvas.parentElement.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--text-muted);font-size:13px;">No theme data for selected filters</div>';
    return;
  }

  charts['chartThemePerf'] = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: themes.map(t => t.theme),
      datasets: [
        {
          label: 'Impressions',
          data: themes.map(t => t.impressions),
          backgroundColor: themes.map(t => (themeColors[t.theme] || COLORS.primary) + '50'),
          borderColor: themes.map(t => themeColors[t.theme] || COLORS.primary),
          borderWidth: 1,
          yAxisID: 'y',
          borderRadius: 6
        },
        {
          label: 'CTR (%)',
          type: 'line',
          data: themes.map(t => t.ctr),
          borderColor: '#F1F1F4',
          backgroundColor: 'transparent',
          borderWidth: 2.5,
          pointRadius: 6,
          pointBackgroundColor: '#F1F1F4',
          pointBorderColor: '#0A0A0F',
          pointBorderWidth: 2,
          yAxisID: 'y1'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom' },
        tooltip: {
          callbacks: {
            label: (tipCtx) => {
              if (tipCtx.datasetIndex === 0) {
                const pct = totalImps > 0 ? (tipCtx.raw / totalImps * 100).toFixed(1) : '0';
                return `Impressions: ${fmtFull(tipCtx.raw)} (${pct}% of total)`;
              }
              return `CTR: ${tipCtx.raw.toFixed(2)}%`;
            }
          }
        }
      },
      scales: {
        y: { beginAtZero: true, ticks: { callback: v => fmt(v) }, title: { display: true, text: 'Impressions', color: '#6B6B80' } },
        y1: { position: 'right', beginAtZero: true, ticks: { callback: v => v + '%' }, title: { display: true, text: 'CTR %', color: '#6B6B80' }, grid: { display: false } }
      }
    }
  });
}

function renderThemeCTRChart() {
  destroyChart('chartThemeCTR');
  const canvas = document.getElementById('chartThemeCTR');
  const ctx = canvas.getContext('2d');
  const months = MONTHLY_THEME_CTR.map(d => d.month);
  const themeColors = { 'AI': '#F5C563', 'Macro': '#D4943A', 'Energy': '#FFE8A3' };

  const themeDashes = { 'AI': [], 'Macro': [8, 4], 'Energy': [3, 3] };
  const datasets = ['AI', 'Macro', 'Energy'].map(theme => ({
    label: theme,
    data: MONTHLY_THEME_CTR.map(d => d[theme] || null),
    borderColor: themeColors[theme],
    backgroundColor: fillColor(themeColors[theme], 0.08),
    borderWidth: 2.5,
    borderDash: themeDashes[theme] || [],
    pointRadius: 0,
    pointHoverRadius: 6,
    pointHoverBackgroundColor: themeColors[theme],
    pointHoverBorderColor: '#0A0A0F',
    pointHoverBorderWidth: 3,
    spanGaps: true,
    fill: true
  }));

  charts['chartThemeCTR'] = new Chart(ctx, {
    type: 'line',
    data: { labels: months, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { position: 'bottom' },
        tooltip: {
          callbacks: {
            label: (tipCtx) => `${tipCtx.dataset.label}: ${tipCtx.raw !== null ? tipCtx.raw.toFixed(2) + '% CTR' : 'N/A'}`
          }
        }
      },
      scales: {
        y: { beginAtZero: true, ticks: { callback: v => v.toFixed(2) + '%' }, title: { display: true, text: 'CTR %', color: '#6B6B80' } }
      }
    }
  });
}

function renderMessagingChart(metric) {
  destroyChart('chartMessaging');
  const ctx = document.getElementById('chartMessaging').getContext('2d');
  const { messages } = getFilteredCreativeData();
  const top20 = messages.slice(0, 20);
  const sortedData = metric === 'ctr' ? [...top20].sort((a, b) => b.ctr - a.ctr) : top20;
  const totalImps = messages.reduce((s, m) => s + m.impressions, 0);

  if (top20.length === 0) {
    ctx.canvas.parentElement.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--text-muted);font-size:13px;">No messaging data for selected filters</div>';
    return;
  }

  charts['chartMessaging'] = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: sortedData.map(m => m.message),
      datasets: [{
        label: metric === 'impressions' ? 'Impressions' : 'CTR (%)',
        data: sortedData.map(m => metric === 'impressions' ? m.impressions : m.ctr),
        backgroundColor: sortedData.map((m, i) => lerpColor('#FFE8A3', '#8B6914', i / Math.max(sortedData.length - 1, 1)) + '70'),
        borderColor: sortedData.map((m, i) => lerpColor('#FFE8A3', '#8B6914', i / Math.max(sortedData.length - 1, 1))),
        borderWidth: 1,
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'y',
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (tipCtx) => {
              const d = sortedData[tipCtx.dataIndex];
              const pct = (d.impressions / totalImps * 100).toFixed(1);
              return [`Impressions: ${fmtFull(d.impressions)} (${pct}% of total)`, `Clicks: ${fmtFull(d.clicks)}`, `CTR: ${fmtPct(d.ctr)}`];
            }
          }
        }
      },
      scales: {
        x: { ticks: { callback: v => metric === 'impressions' ? fmt(v) : v + '%' } },
        y: { ticks: { font: { size: 10 } } }
      }
    }
  });
}

function toggleMsgChart(metric, btn) {
  btn.parentElement.querySelectorAll('.chart-toggle-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderMessagingChart(metric);
}

function renderTopBottomCreatives() {
  const { messages } = getFilteredCreativeData();
  const minImps = messages.some(m => m.impressions > 50000) ? 50000 : 0;
  const sorted = [...messages].filter(m => m.impressions > minImps).sort((a, b) => b.ctr - a.ctr);
  const top5 = sorted.slice(0, 6);
  const bottom5 = sorted.slice(-6).reverse();

  function renderList(container, items, isTop) {
    document.getElementById(container).innerHTML = items.map((m, i) => `
      <div style="display:flex;align-items:center;gap:12px;padding:12px 0;${i < items.length - 1 ? 'border-bottom:1px solid rgba(255,255,255,0.06);' : ''}">
        <div style="width:30px;height:30px;border-radius:50%;background:${isTop ? 'rgba(245,197,99,0.12)' : 'rgba(139,105,20,0.12)'};display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:${isTop ? '#FFE8A3' : '#8B6914'};flex-shrink:0;">${i + 1}</div>
        <div style="flex:1;min-width:0;">
          <div style="font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--text-primary);">${m.message}</div>
          <div style="font-size:11px;color:var(--text-muted);">${fmtFull(m.impressions)} impressions</div>
        </div>
        <div style="text-align:right;flex-shrink:0;">
          <div style="font-size:16px;font-weight:800;color:${isTop ? '#FFE8A3' : '#8B6914'}">${fmtPct(m.ctr)}</div>
          <div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px;">CTR</div>
        </div>
      </div>
    `).join('');
  }

  renderList('topCreatives', top5, true);
  renderList('bottomCreatives', bottom5, false);
}

function renderCreativeTable() {
  const { messages } = getFilteredCreativeData();
  const data = messages;
  const maxCTR = Math.max(...data.map(m => m.ctr));
  const start = (creativePage - 1) * CREATIVE_PAGE_SIZE;
  const end = Math.min(start + CREATIVE_PAGE_SIZE, data.length);
  const pageData = data.slice(start, end);

  document.getElementById('creativeTableBody').innerHTML = pageData.map(m => `
    <tr>
      <td style="font-weight:500;color:var(--text-primary);">${m.message}</td>
      <td class="number">${fmtFull(m.impressions)}</td>
      <td class="number">${fmtFull(m.clicks)}</td>
      <td class="number">${fmtPct(m.ctr)}</td>
      <td>
        <div class="perf-bar-container">
          <div class="perf-bar" style="width:120px;"><div class="perf-bar-fill ${m.ctr > 0.2 ? 'good' : m.ctr > 0.1 ? 'moderate' : 'low'}" style="width:${(m.ctr / maxCTR * 100)}%"></div></div>
        </div>
      </td>
    </tr>
  `).join('');

  document.getElementById('creativeTableInfo').textContent = `Showing ${start + 1}\u2013${end} of ${data.length} creatives`;

  const totalPages = Math.ceil(data.length / CREATIVE_PAGE_SIZE);
  const pagination = document.getElementById('creativePagination');
  if (totalPages <= 1) { pagination.innerHTML = ''; return; }
  let html = `<button ${creativePage <= 1 ? 'disabled' : ''} onclick="changeCreativePage(${creativePage - 1})">&lt;</button>`;
  for (let i = 1; i <= totalPages; i++) {
    html += `<button class="${i === creativePage ? 'active' : ''}" onclick="changeCreativePage(${i})">${i}</button>`;
  }
  html += `<button ${creativePage >= totalPages ? 'disabled' : ''} onclick="changeCreativePage(${creativePage + 1})">&gt;</button>`;
  pagination.innerHTML = html;
}

function changeCreativePage(page) {
  creativePage = page;
  renderCreativeTable();
}

// ============================================================
// CREATIVE GALLERY (placeholder - awaiting assets from client)
// ============================================================
function renderCreativeGallery() {
  const container = document.getElementById('creativeGallery');
  if (!container) return;
  if (typeof CREATIVE_GALLERY !== 'undefined' && CREATIVE_GALLERY.length > 0) {
    container.innerHTML = CREATIVE_GALLERY.map(c => `
      <div class="creative-gallery-card">
        <div class="creative-gallery-img" style="background-image:url('${c.imagePath}')"></div>
        <div class="creative-gallery-info">
          <div class="creative-gallery-name">${c.message}</div>
          <div class="creative-gallery-meta">${c.theme} &middot; ${c.format}</div>
        </div>
      </div>
    `).join('');
  } else {
    container.innerHTML = `
      <div style="text-align:center;padding:32px;color:var(--text-muted);font-size:13px;border:1px dashed var(--border-subtle);border-radius:12px;">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="width:32px;height:32px;margin:0 auto 12px;display:block;opacity:0.4;"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
        Creative visual reference coming soon.<br>
        <span style="font-size:11px;color:var(--text-muted);opacity:0.7;">Assets to be provided by Bain team</span>
      </div>
    `;
  }
}

// ============================================================
// VIEW 3: SHARE OF VOICE
// ============================================================

// SOV month key mapping: '2025-03' -> 'Mar', etc
const SOV_MONTH_MAP = {
  '2025-02': 'Feb', '2025-03': 'Mar', '2025-04': 'Apr', '2025-05': 'May',
  '2025-06': 'Jun', '2025-07': 'Jul', '2025-08': 'Aug', '2025-09': 'Sep',
  '2025-10': 'Oct', '2025-11': 'Nov', '2025-12': 'Dec'
};

// Map publisher filter values to SOV publisher keys
const SOV_PUB_MAP = {
  'The Economist': 'Economist',
  'FT': 'FT',
  'WSJ': 'WSJ'
};

function getSOVFilteredPublishers() {
  const pubFilter = document.getElementById('filterSite').value;
  if (pubFilter !== 'all') {
    const sovKey = SOV_PUB_MAP[pubFilter];
    if (sovKey && SOV_FREQUENCY[sovKey]) return [sovKey];
    return []; // Non-SOV publisher selected (e.g. Nativo, Mobkoi)
  }
  return Object.keys(SOV_FREQUENCY);
}

function getSOVFilteredMonth() {
  const month = getActiveMonth();
  if (month === 'all') return null;
  return SOV_MONTH_MAP[month] || null;
}

function renderSOVView() {
  renderSOVFilterNote();
  renderSOVKPIs();
  renderSOVVendorCards();
  renderFrequencyTrendChart();
  renderAudienceBreakdown();
  renderFreqDistChart();
  renderPenetrationHeatmap();
}

function renderSOVFilterNote() {
  let noteEl = document.getElementById('sovFilterNote');
  if (!noteEl) {
    const sovView = document.getElementById('view-sov');
    noteEl = document.createElement('div');
    noteEl.id = 'sovFilterNote';
    sovView.insertBefore(noteEl, sovView.firstChild);
  }

  const regionFilter = document.getElementById('filterRegion').value;
  const pubFilter = document.getElementById('filterSite').value;
  const notes = [];

  if (regionFilter !== 'all') {
    notes.push('Region filter does not apply to Share of Voice data');
  }
  if (pubFilter === 'Nativo Inc.' || pubFilter === 'Mobkoi') {
    notes.push(`${pubFilter} does not have Share of Voice data`);
  }

  if (notes.length > 0) {
    noteEl.innerHTML = `<div style="padding:10px 16px;margin-bottom:16px;border-radius:10px;background:rgba(245,197,99,0.08);border:1px solid rgba(245,197,99,0.15);font-size:12px;color:#F5C563;display:flex;align-items:center;gap:8px;">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;flex-shrink:0;"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      ${notes.join(' &middot; ')}
    </div>`;
  } else {
    noteEl.innerHTML = '';
  }
}

function renderSOVKPIs() {
  const publishers = getSOVFilteredPublishers();
  const selectedMonth = getSOVFilteredMonth();

  if (publishers.length === 0) {
    document.getElementById('sov-kpis').innerHTML = `
      <div class="kpi-card" style="grid-column: 1 / -1; text-align:center;">
        <div class="kpi-label">No SOV data available for this publisher</div>
        <div class="kpi-subtitle">SOV data is tracked for WSJ, Economist, and FT only</div>
      </div>`;
    return;
  }

  const avgFreqs = publishers.map(p => SOV_FREQUENCY[p].avg);
  const overallAvgFreq = avgFreqs.reduce((a, b) => a + b, 0) / avgFreqs.length;

  // Filter audience definitions by selected publishers
  const filteredAuds = publishers.length < Object.keys(SOV_FREQUENCY).length
    ? AUDIENCE_DEFINITIONS.filter(a => publishers.some(p => a.publisher === p || a.publisher.trim() === p))
    : AUDIENCE_DEFINITIONS;
  const totalAudSize = filteredAuds.reduce((s, a) => s + a.size, 0);

  let maxFreq = 0, maxFreqPub = '', maxFreqMonth = '';
  for (const pub of publishers) {
    const months = selectedMonth
      ? [[selectedMonth, SOV_FREQUENCY[pub].monthly[selectedMonth]]]
      : Object.entries(SOV_FREQUENCY[pub].monthly);
    for (const [month, freq] of months) {
      if (freq && freq > maxFreq) { maxFreq = freq; maxFreqPub = pub; maxFreqMonth = month; }
    }
  }

  const pubLabel = publishers.length === 1 ? publishers[0] : 'all publishers';
  const monthLabel = selectedMonth ? selectedMonth + " '25" : '';

  document.getElementById('sov-kpis').innerHTML = `
    <div class="kpi-card highlight">
      <div class="kpi-label">Avg Frequency</div>
      <div class="kpi-value gold">${overallAvgFreq.toFixed(1)}x</div>
      <div class="kpi-subtitle">${publishers.length === 1 ? publishers[0] : 'Across ' + pubLabel}</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">Total Audience Pool</div>
      <div class="kpi-value">${fmt(totalAudSize)}</div>
      <div class="kpi-subtitle">${filteredAuds.length} audience segments</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">Publishers Tracked</div>
      <div class="kpi-value">${publishers.length}</div>
      <div class="kpi-subtitle">${publishers.join(', ')}</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">Peak Frequency</div>
      <div class="kpi-value">${maxFreq > 0 ? maxFreq.toFixed(1) + 'x' : 'N/A'}</div>
      <div class="kpi-subtitle">${maxFreqPub ? maxFreqPub + ' - ' + maxFreqMonth : ''}</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">Highest Avg Freq</div>
      <div class="kpi-value">${publishers.reduce((best, p) => SOV_FREQUENCY[p].avg > SOV_FREQUENCY[best].avg ? p : best, publishers[0])}</div>
      <div class="kpi-subtitle">${Math.max(...avgFreqs).toFixed(2)}x average</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">Reporting Period</div>
      <div class="kpi-value">${selectedMonth ? 1 : 11}</div>
      <div class="kpi-subtitle">${selectedMonth ? selectedMonth + " '25" : 'Months of SOV data'}</div>
    </div>
  `;
}

function renderSOVVendorCards() {
  const container = document.getElementById('sovVendorCards');
  const pubColors = { 'WSJ': '#F5C563', 'Economist': '#D4943A', 'FT': '#FFE8A3' };
  const filteredPubs = getSOVFilteredPublishers();

  if (filteredPubs.length === 0) {
    container.innerHTML = '<div style="text-align:center;padding:32px;color:var(--text-muted);font-size:13px;">No SOV vendor data for selected publisher</div>';
    return;
  }

  const sovEntries = Object.entries(SOV_FREQUENCY).filter(([pub]) => filteredPubs.includes(pub));
  container.innerHTML = sovEntries.map(([pub, data]) => {
    const months = Object.entries(data.monthly);
    const maxFreq = Math.max(...months.map(([, f]) => f));
    const minFreq = Math.min(...months.map(([, f]) => f));
    const auds = AUDIENCE_DEFINITIONS.filter(a => a.publisher === pub || a.publisher === pub + ' ');
    const color = pubColors[pub];

    return `
      <div class="sov-vendor-card" style="border-top: 2px solid ${color};">
        <div class="sov-vendor-name" style="color:${color}">${pub === 'FT' ? 'Financial Times' : pub === 'WSJ' ? 'Wall Street Journal' : 'The Economist'}</div>
        <div style="font-size:42px;font-weight:900;color:var(--text-primary);margin:12px 0;letter-spacing:-2px;line-height:1;">${data.avg.toFixed(1)}x</div>
        <div style="font-size:11px;color:var(--text-muted);margin-bottom:20px;text-transform:uppercase;letter-spacing:1px;">Average Frequency</div>
        <div class="sov-metric-row">
          <span class="sov-metric-label">Peak Frequency</span>
          <span class="sov-metric-value">${maxFreq.toFixed(1)}x</span>
        </div>
        <div class="sov-metric-row">
          <span class="sov-metric-label">Low Frequency</span>
          <span class="sov-metric-value">${minFreq.toFixed(1)}x</span>
        </div>
        <div class="sov-metric-row">
          <span class="sov-metric-label">Months Tracked</span>
          <span class="sov-metric-value">${months.length}</span>
        </div>
        <div class="sov-metric-row">
          <span class="sov-metric-label">Audiences</span>
          <span class="sov-metric-value">${auds.length}</span>
        </div>
        ${auds.map(a => `
          <div style="text-align:left;padding:8px 0;border-bottom:1px solid var(--border-subtle);font-size:11px;">
            <div style="font-weight:600;color:var(--text-primary);">${a.audience}</div>
            <div style="color:var(--text-muted);">${fmt(a.size)} pool size</div>
          </div>
        `).join('')}
      </div>
    `;
  }).join('');
}

function renderFrequencyTrendChart() {
  destroyChart('chartFreqTrend');
  const canvas = document.getElementById('chartFreqTrend');
  const ctx = canvas.getContext('2d');
  const allMonths = ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const pubColors = { 'WSJ': '#F5C563', 'Economist': '#D4943A', 'FT': '#FFE8A3' };
  const filteredPubs = getSOVFilteredPublishers();
  const selectedMonth = getSOVFilteredMonth();

  if (filteredPubs.length === 0) return;

  const pubDashes = { 'WSJ': [], 'Economist': [8, 4], 'FT': [3, 3] };
  const sovEntries = Object.entries(SOV_FREQUENCY).filter(([pub]) => filteredPubs.includes(pub));
  const datasets = sovEntries.map(([pub, data]) => ({
    label: pub === 'FT' ? 'Financial Times' : pub === 'WSJ' ? 'Wall Street Journal' : 'The Economist',
    data: allMonths.map(m => data.monthly[m] || null),
    borderColor: pubColors[pub],
    backgroundColor: fillColor(pubColors[pub], 0.08),
    borderWidth: 3,
    borderDash: pubDashes[pub] || [],
    pointRadius: 0,
    pointHoverRadius: 7,
    pointHoverBackgroundColor: pubColors[pub],
    pointHoverBorderColor: '#0A0A0F',
    pointHoverBorderWidth: 3,
    spanGaps: true,
    fill: true
  }));

  charts['chartFreqTrend'] = new Chart(ctx, {
    type: 'line',
    data: { labels: allMonths.map(m => m + " '25"), datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { position: 'bottom' },
        tooltip: {
          callbacks: {
            label: (tipCtx) => `${tipCtx.dataset.label}: ${tipCtx.raw ? tipCtx.raw.toFixed(2) + 'x frequency' : 'N/A'}`
          }
        }
      },
      scales: {
        y: {
          beginAtZero: false,
          min: 2,
          max: 6,
          ticks: { callback: v => v.toFixed(1) + 'x' },
          title: { display: true, text: 'Frequency', color: '#6B6B80' }
        }
      }
    }
  });
}

function renderAudienceBreakdown() {
  const container = document.getElementById('audienceBreakdown');
  const filteredPubs = getSOVFilteredPublishers();
  const filteredAuds = filteredPubs.length < Object.keys(SOV_FREQUENCY).length
    ? AUDIENCE_DEFINITIONS.filter(a => filteredPubs.some(p => a.publisher === p || a.publisher.trim() === p))
    : AUDIENCE_DEFINITIONS;

  container.innerHTML = `
    <table class="data-table" style="font-size:12px;">
      <thead>
        <tr>
          <th>Publisher</th>
          <th>Audience</th>
          <th class="number">Pool Size</th>
          <th>Definition</th>
        </tr>
      </thead>
      <tbody>
        ${filteredAuds.map(a => `
          <tr>
            <td><span class="vendor-tag ${getVendorClass(a.publisher)}">${a.publisher}</span></td>
            <td style="font-weight:500;color:var(--text-primary);">${a.audience}</td>
            <td class="number">${fmtFull(a.size)}</td>
            <td style="font-size:11px;color:var(--text-tertiary);white-space:normal;max-width:300px;">${a.definition}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

function renderFreqDistChart() {
  destroyChart('chartFreqDist');
  const ctx = document.getElementById('chartFreqDist').getContext('2d');
  const pubColors = { 'WSJ': '#F5C563', 'Economist': '#D4943A', 'FT': '#FFE8A3' };
  const pubs = getSOVFilteredPublishers();

  if (pubs.length === 0) return;

  charts['chartFreqDist'] = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: pubs.map(pub => ({
        label: pub,
        data: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => SOV_FREQUENCY[pub].monthly[m] || 0),
        borderColor: pubColors[pub],
        backgroundColor: pubColors[pub] + '15',
        borderWidth: 2,
        pointBackgroundColor: pubColors[pub],
        pointBorderColor: '#0A0A0F',
        pointBorderWidth: 1,
        pointRadius: 3
      }))
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom' } },
      scales: {
        r: {
          beginAtZero: false,
          min: 2,
          max: 6,
          ticks: {
            callback: v => v + 'x',
            stepSize: 1,
            color: '#6B6B80',
            backdropColor: 'transparent'
          },
          grid: { color: 'rgba(255,255,255,0.04)' },
          angleLines: { color: 'rgba(255,255,255,0.04)' },
          pointLabels: { color: '#A0A0B8', font: { size: 10 } }
        }
      }
    }
  });
}

function renderPenetrationHeatmap() {
  const container = document.getElementById('penetrationHeatmap');
  const months = ['February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const shortMonths = ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  function getHeatColor(val, max) {
    if (!val) return 'rgba(255,255,255,0.02)';
    const intensity = Math.min(val / max, 1);
    return `rgba(245, 197, 99, ${0.08 + intensity * 0.55})`;
  }

  const maxPen = Math.max(...PENETRATION_DATA.flatMap(d => Object.values(d.months)));

  container.innerHTML = `
    <div style="margin-bottom:16px;font-size:12px;font-weight:600;color:var(--text-primary);">Penetration Rate (%) - Economist</div>
    <table class="heatmap">
      <thead>
        <tr>
          <th>Audience</th>
          ${shortMonths.map(m => `<th>${m}</th>`).join('')}
        </tr>
      </thead>
      <tbody>
        ${PENETRATION_DATA.map(d => `
          <tr>
            <td>${d.audience}</td>
            ${months.map(m => {
              const val = d.months[m];
              return `<td style="background:${getHeatColor(val, maxPen)};color:${val ? '#F1F1F4' : 'var(--text-muted)'};font-weight:${val ? '600' : '400'}">${val ? val.toFixed(1) + '%' : '-'}</td>`;
            }).join('')}
          </tr>
        `).join('')}
      </tbody>
    </table>
    <div style="margin-top:28px;font-size:12px;font-weight:600;color:var(--text-primary);">Frequency Detail - Economist</div>
    <table class="heatmap" style="margin-top:8px;">
      <thead>
        <tr>
          <th>Audience</th>
          ${shortMonths.map(m => `<th>${m}</th>`).join('')}
        </tr>
      </thead>
      <tbody>
        ${FREQ_DETAIL.map(d => `
          <tr>
            <td>${d.audience}</td>
            ${months.map(m => {
              const val = d.months[m];
              const maxF = 6;
              return `<td style="background:${getHeatColor(val, maxF)};color:${val ? '#F1F1F4' : 'var(--text-muted)'};font-weight:${val ? '600' : '400'}">${val ? val.toFixed(1) + 'x' : '-'}</td>`;
            }).join('')}
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

// ============================================================
// EXPORT
// ============================================================
function exportView() {
  window.print();
}

// ============================================================
// INITIALIZE
// ============================================================
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    document.getElementById('loadingOverlay').classList.add('hidden');
    renderPlacementsView();

    // Populate EMEA tier reference
    if (typeof EMEA_TIER_COUNTRIES !== 'undefined') {
      const t1 = document.getElementById('emeaTier1Countries');
      const t2 = document.getElementById('emeaTier2Countries');
      if (t1) t1.textContent = EMEA_TIER_COUNTRIES['EMEA Tier 1'].join(', ');
      if (t2) t2.textContent = EMEA_TIER_COUNTRIES['EMEA Tier 2'].join(', ');
    }
  }, 600);
});
