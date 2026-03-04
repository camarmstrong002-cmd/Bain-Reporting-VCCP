// ============================================================
// Bain VCCP Dashboard - Premium Dark Theme
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

let charts = {};
let currentView = 'placements';
let currentPage = 1;
const PAGE_SIZE = 25;

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

// Safe fill colour for line charts (avoids canvas gradient stack overflow)
function fillColor(hexColor, alpha) {
  // Convert hex to rgba
  const r = parseInt(hexColor.slice(1,3), 16);
  const g = parseInt(hexColor.slice(3,5), 16);
  const b = parseInt(hexColor.slice(5,7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha || 0.08})`;
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
// FILTERS
// ============================================================
function applyFilters() {
  if (currentView === 'placements') renderPlacementsView();
}

function getFilteredPlacements() {
  const month = document.getElementById('filterMonth').value;
  const site = document.getElementById('filterSite').value;
  const region = document.getElementById('filterRegion').value;

  let data = TOP_PLACEMENTS;
  if (site !== 'all') data = data.filter(p => p.site === site);
  if (region !== 'all') data = data.filter(p => p.region === region);
  return data;
}

// ============================================================
// VIEW 1: PLACEMENTS & SITES
// ============================================================
function renderPlacementsView() {
  renderPlacementKPIs();
  renderImpByPublisherChart('impressions');
  renderPublisherShareChart();
  renderRegionPerfChart();
  renderAudiencePerfChart();
  renderPlacementTable();
}

function renderPlacementKPIs() {
  const sites = Object.keys(SITE_TOTALS);
  const totalImps = sites.reduce((s, k) => s + SITE_TOTALS[k].impressions, 0);
  const totalClicks = sites.reduce((s, k) => s + SITE_TOTALS[k].clicks, 0);
  const avgCTR = totalClicks / totalImps * 100;
  const numPlacements = TOP_PLACEMENTS.length;
  const monthsActive = MONTHS.length;

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
      <div class="kpi-subtitle">Across all publishers</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">Active Publishers</div>
      <div class="kpi-value">${sites.length}</div>
      <div class="kpi-subtitle">FT, WSJ, Economist + 2</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">Campaign Period</div>
      <div class="kpi-value">${monthsActive}</div>
      <div class="kpi-subtitle">Months (Jan '25 - Feb '26)</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">Top Placements</div>
      <div class="kpi-value">${numPlacements}+</div>
      <div class="kpi-subtitle">Active placement lines</div>
    </div>
  `;
}

function renderImpByPublisherChart(metric) {
  destroyChart('chartImpByPublisher');
  const canvas = document.getElementById('chartImpByPublisher');
  const ctx = canvas.getContext('2d');
  const sites = ['The Economist', 'FT', 'WSJ', 'Nativo Inc.', 'Mobkoi'];

  const dashPatterns = [[], [8, 4], [3, 3], [12, 4, 3, 4], [6, 2]];
  const datasets = sites.map((site, idx) => {
    const color = SITE_COLOR_MAP[site];
    return {
      label: site === 'The Economist' ? 'Economist' : site === 'Nativo Inc.' ? 'Nativo' : site,
      data: metric === 'impressions' ? SITE_MONTHLY[site] : SITE_MONTHLY_CLICKS[site],
      backgroundColor: fillColor(color, 0.08),
      borderColor: color,
      borderWidth: 2.5,
      borderDash: dashPatterns[idx] || [],
      fill: true,
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
            label: (ctx) => `${ctx.dataset.label}: ${fmtFull(ctx.raw)} ${metric}`
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { callback: v => fmt(v) }
        },
        x: {
          ticks: { maxRotation: 45, font: { size: 10 } }
        }
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
  const sites = ['The Economist', 'FT', 'WSJ', 'Nativo Inc.', 'Mobkoi'];
  const labels = ['Economist', 'FT', 'WSJ', 'Nativo', 'Mobkoi'];
  const data = sites.map(s => SITE_TOTALS[s].impressions);
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
            label: (ctx) => {
              const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
              const pct = (ctx.raw / total * 100).toFixed(1);
              return `${ctx.label}: ${fmt(ctx.raw)} (${pct}%)`;
            }
          }
        }
      }
    }
  });
}

function renderRegionPerfChart() {
  destroyChart('chartRegionPerf');
  const ctx = document.getElementById('chartRegionPerf').getContext('2d');
  const data = REGION_DATA.slice(0, 8);

  charts['chartRegionPerf'] = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.map(d => d.region),
      datasets: [
        {
          label: 'Impressions',
          data: data.map(d => d.impressions),
          backgroundColor: COLORS.primary + '60',
          borderColor: COLORS.primary,
          borderWidth: 1,
          yAxisID: 'y',
          borderRadius: 6
        },
        {
          label: 'CTR (%)',
          data: data.map(d => d.ctr),
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
      plugins: { legend: { position: 'bottom' } },
      scales: {
        y: { beginAtZero: true, ticks: { callback: v => fmt(v) }, title: { display: true, text: 'Impressions', color: '#6B6B80' } },
        y1: { position: 'right', beginAtZero: true, ticks: { callback: v => v.toFixed(2) + '%' }, title: { display: true, text: 'CTR', color: '#6B6B80' }, grid: { display: false } }
      }
    }
  });
}

function renderAudiencePerfChart() {
  destroyChart('chartAudiencePerf');
  const ctx = document.getElementById('chartAudiencePerf').getContext('2d');

  charts['chartAudiencePerf'] = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: TARGETING_DATA.map(d => d.targeting),
      datasets: [
        {
          label: 'Impressions',
          data: TARGETING_DATA.map(d => d.impressions),
          backgroundColor: COLORS.chart.slice(0, TARGETING_DATA.length).map(c => c + '50'),
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
            label: (ctx) => {
              const d = TARGETING_DATA[ctx.dataIndex];
              return [`Impressions: ${fmtFull(d.impressions)}`, `Clicks: ${fmtFull(d.clicks)}`, `CTR: ${fmtPct(d.ctr)}`];
            }
          }
        }
      },
      scales: {
        x: { ticks: { callback: v => fmt(v) } }
      }
    }
  });
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
      <td><span class="vendor-tag ${getVendorClass(p.site)}">${p.site === 'The Economist' ? 'Economist' : p.site === 'Nativo Inc.' ? 'Nativo' : p.site}</span></td>
      <td>${p.region}</td>
      <td>${p.targeting}</td>
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

  document.getElementById('placementTableInfo').textContent = `Showing ${start + 1}-${end} of ${data.length}`;

  const totalPages = Math.ceil(data.length / PAGE_SIZE);
  const pagination = document.getElementById('placementPagination');
  let paginationHTML = `<button ${currentPage <= 1 ? 'disabled' : ''} onclick="changePage(${currentPage - 1})">&lt;</button>`;
  for (let i = 1; i <= totalPages; i++) {
    paginationHTML += `<button class="${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">${i}</button>`;
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

let sortColumn = null;
let sortDir = 1;
function sortTable(col) {
  if (sortColumn === col) sortDir *= -1;
  else { sortColumn = col; sortDir = 1; }
  renderPlacementTable();
}

// ============================================================
// VIEW 2: CREATIVE INSIGHTS
// ============================================================
function renderCreativeView() {
  renderCreativeKPIs();
  renderThemePerfChart();
  renderThemeCTRChart();
  renderMessagingChart('impressions');
  renderTopBottomCreatives();
  renderCreativeTable();
}

function renderCreativeKPIs() {
  const totalImps = CREATIVE_THEMES.reduce((s, t) => s + t.impressions, 0);
  const totalClicks = CREATIVE_THEMES.reduce((s, t) => s + t.clicks, 0);
  const avgCTR = totalClicks / totalImps * 100;
  const topMsg = CREATIVE_MESSAGES.reduce((best, m) => m.ctr > best.ctr ? m : best, CREATIVE_MESSAGES[0]);
  const numMessages = CREATIVE_MESSAGES.length;

  document.getElementById('creative-kpis').innerHTML = `
    <div class="kpi-card highlight">
      <div class="kpi-label">Creative Impressions</div>
      <div class="kpi-value gold">${fmt(totalImps)}</div>
      <div class="kpi-subtitle">Across ${CREATIVE_THEMES.length} themes</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">Creative Clicks</div>
      <div class="kpi-value">${fmt(totalClicks)}</div>
      <div class="kpi-subtitle">${fmtPct(avgCTR)} overall CTR</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">Top Performing</div>
      <div class="kpi-value" style="font-size:18px">${topMsg.message}</div>
      <div class="kpi-subtitle">${fmtPct(topMsg.ctr)} CTR</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">Active Creatives</div>
      <div class="kpi-value">${numMessages}</div>
      <div class="kpi-subtitle">Message variants running</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">Best Theme CTR</div>
      <div class="kpi-value">${CREATIVE_THEMES.reduce((best, t) => t.ctr > best.ctr ? t : best, CREATIVE_THEMES[0]).theme}</div>
      <div class="kpi-subtitle">${fmtPct(CREATIVE_THEMES.reduce((best, t) => t.ctr > best.ctr ? t : best, CREATIVE_THEMES[0]).ctr)} CTR</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">Highest Volume</div>
      <div class="kpi-value">${CREATIVE_THEMES.reduce((best, t) => t.impressions > best.impressions ? t : best, CREATIVE_THEMES[0]).theme}</div>
      <div class="kpi-subtitle">${fmt(CREATIVE_THEMES.reduce((best, t) => t.impressions > best.impressions ? t : best, CREATIVE_THEMES[0]).impressions)} imps</div>
    </div>
  `;
}

function renderThemePerfChart() {
  destroyChart('chartThemePerf');
  const ctx = document.getElementById('chartThemePerf').getContext('2d');
  const themeColors = { 'AI': '#F5C563', 'Macro': '#D4943A', 'Energy': '#FFE8A3' };

  charts['chartThemePerf'] = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: CREATIVE_THEMES.map(t => t.theme),
      datasets: [
        {
          label: 'Impressions',
          data: CREATIVE_THEMES.map(t => t.impressions),
          backgroundColor: CREATIVE_THEMES.map(t => (themeColors[t.theme] || COLORS.primary) + '50'),
          borderColor: CREATIVE_THEMES.map(t => themeColors[t.theme] || COLORS.primary),
          borderWidth: 1,
          yAxisID: 'y',
          borderRadius: 6
        },
        {
          label: 'CTR (%)',
          type: 'line',
          data: CREATIVE_THEMES.map(t => t.ctr),
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
      plugins: { legend: { position: 'bottom' } },
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
      plugins: { legend: { position: 'bottom' } },
      scales: {
        y: { beginAtZero: true, ticks: { callback: v => v.toFixed(2) + '%' }, title: { display: true, text: 'CTR %', color: '#6B6B80' } }
      }
    }
  });
}

function renderMessagingChart(metric) {
  destroyChart('chartMessaging');
  const ctx = document.getElementById('chartMessaging').getContext('2d');
  const top20 = CREATIVE_MESSAGES.slice(0, 20);
  const sortedData = metric === 'ctr' ? [...top20].sort((a, b) => b.ctr - a.ctr) : top20;

  function lerpColor(a, b, t) {
    const ar = parseInt(a.slice(1,3),16), ag = parseInt(a.slice(3,5),16), ab = parseInt(a.slice(5,7),16);
    const br = parseInt(b.slice(1,3),16), bg = parseInt(b.slice(3,5),16), bb = parseInt(b.slice(5,7),16);
    const r = Math.round(ar + (br-ar)*t), g = Math.round(ag + (bg-ag)*t), bl = Math.round(ab + (bb-ab)*t);
    return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${bl.toString(16).padStart(2,'0')}`;
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
            label: (ctx) => {
              const d = sortedData[ctx.dataIndex];
              return [`Impressions: ${fmtFull(d.impressions)}`, `Clicks: ${fmtFull(d.clicks)}`, `CTR: ${fmtPct(d.ctr)}`];
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
  const sorted = [...CREATIVE_MESSAGES].filter(m => m.impressions > 50000).sort((a, b) => b.ctr - a.ctr);
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
  const maxCTR = Math.max(...CREATIVE_MESSAGES.map(m => m.ctr));
  document.getElementById('creativeTableBody').innerHTML = CREATIVE_MESSAGES.map(m => `
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
}

// ============================================================
// VIEW 3: SHARE OF VOICE
// ============================================================
function renderSOVView() {
  renderSOVKPIs();
  renderSOVVendorCards();
  renderFrequencyTrendChart();
  renderAudienceBreakdown();
  renderFreqDistChart();
  renderPenetrationHeatmap();
}

function renderSOVKPIs() {
  const publishers = Object.keys(SOV_FREQUENCY);
  const avgFreqs = publishers.map(p => SOV_FREQUENCY[p].avg);
  const overallAvgFreq = avgFreqs.reduce((a, b) => a + b, 0) / avgFreqs.length;
  const totalAudSize = AUDIENCE_DEFINITIONS.reduce((s, a) => s + a.size, 0);

  let maxFreq = 0, maxFreqPub = '', maxFreqMonth = '';
  for (const pub of publishers) {
    for (const [month, freq] of Object.entries(SOV_FREQUENCY[pub].monthly)) {
      if (freq > maxFreq) { maxFreq = freq; maxFreqPub = pub; maxFreqMonth = month; }
    }
  }

  document.getElementById('sov-kpis').innerHTML = `
    <div class="kpi-card highlight">
      <div class="kpi-label">Avg Frequency</div>
      <div class="kpi-value gold">${overallAvgFreq.toFixed(1)}x</div>
      <div class="kpi-subtitle">Across all publishers</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">Total Audience Pool</div>
      <div class="kpi-value">${fmt(totalAudSize)}</div>
      <div class="kpi-subtitle">${AUDIENCE_DEFINITIONS.length} audience segments</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">Publishers Tracked</div>
      <div class="kpi-value">${publishers.length}</div>
      <div class="kpi-subtitle">WSJ, Economist, FT</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">Peak Frequency</div>
      <div class="kpi-value">${maxFreq.toFixed(1)}x</div>
      <div class="kpi-subtitle">${maxFreqPub} - ${maxFreqMonth}</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">Highest Avg Freq</div>
      <div class="kpi-value">${publishers.reduce((best, p) => SOV_FREQUENCY[p].avg > SOV_FREQUENCY[best].avg ? p : best, publishers[0])}</div>
      <div class="kpi-subtitle">${Math.max(...avgFreqs).toFixed(2)}x average</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">Reporting Period</div>
      <div class="kpi-value">11</div>
      <div class="kpi-subtitle">Months of SOV data</div>
    </div>
  `;
}

function renderSOVVendorCards() {
  const container = document.getElementById('sovVendorCards');
  const pubColors = { 'WSJ': '#F5C563', 'Economist': '#D4943A', 'FT': '#FFE8A3' };

  container.innerHTML = Object.entries(SOV_FREQUENCY).map(([pub, data]) => {
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

  const pubDashes = { 'WSJ': [], 'Economist': [8, 4], 'FT': [3, 3] };
  const datasets = Object.entries(SOV_FREQUENCY).map(([pub, data]) => ({
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
            label: (ctx) => `${ctx.dataset.label}: ${ctx.raw ? ctx.raw.toFixed(2) + 'x frequency' : 'N/A'}`
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
        ${AUDIENCE_DEFINITIONS.map(a => `
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
  const pubs = Object.keys(SOV_FREQUENCY);

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
    // Gold/yellow-based gradient
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
  }, 600);
});
