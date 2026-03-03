// ============================================================
// Bain VCCP Dashboard - Main Application
// ============================================================

// Chart.js global config
Chart.defaults.font.family = "'Inter', sans-serif";
Chart.defaults.font.size = 11;
Chart.defaults.color = '#6B7280';
Chart.defaults.plugins.tooltip.backgroundColor = '#1A1A2E';
Chart.defaults.plugins.tooltip.cornerRadius = 6;
Chart.defaults.plugins.tooltip.padding = 10;
Chart.defaults.plugins.tooltip.titleFont = { size: 12, weight: '600' };
Chart.defaults.plugins.tooltip.bodyFont = { size: 11 };
Chart.defaults.plugins.legend.labels.usePointStyle = true;
Chart.defaults.plugins.legend.labels.pointStyle = 'circle';
Chart.defaults.plugins.legend.labels.padding = 16;
Chart.defaults.elements.line.tension = 0.3;
Chart.defaults.elements.bar.borderRadius = 4;
Chart.defaults.scale.grid = { color: 'rgba(0,0,0,0.04)' };

const COLORS = {
  economist: '#CC0000',
  ft: '#E8A94E',
  wsj: '#4A99CC',
  nativo: '#2D8B57',
  mobkoi: '#7C5BBF',
  red: '#CC0000',
  blue: '#4A99CC',
  gold: '#E8A94E',
  green: '#2D8B57',
  purple: '#7C5BBF',
  orange: '#E07B53',
  teal: '#3BBFA0',
  chart: ['#CC0000', '#4A99CC', '#E8A94E', '#2D8B57', '#7C5BBF', '#E07B53', '#3BBFA0', '#9333EA']
};

const SITE_COLOR_MAP = {
  'The Economist': COLORS.economist,
  'FT': COLORS.ft,
  'WSJ': COLORS.wsj,
  'Nativo Inc.': COLORS.nativo,
  'Mobkoi': COLORS.mobkoi
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
  return '£' + n.toLocaleString();
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

  // Count unique placements
  const numPlacements = TOP_PLACEMENTS.length;

  // Calculate months active
  const monthsActive = MONTHS.length;

  document.getElementById('placement-kpis').innerHTML = `
    <div class="kpi-card highlight">
      <div class="kpi-label">Total Impressions</div>
      <div class="kpi-value red">${fmt(totalImps)}</div>
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
  const ctx = document.getElementById('chartImpByPublisher').getContext('2d');
  const sites = ['The Economist', 'FT', 'WSJ', 'Nativo Inc.', 'Mobkoi'];
  const datasets = sites.map(site => ({
    label: site === 'The Economist' ? 'Economist' : site === 'Nativo Inc.' ? 'Nativo' : site,
    data: metric === 'impressions' ? SITE_MONTHLY[site] : SITE_MONTHLY_CLICKS[site],
    backgroundColor: SITE_COLOR_MAP[site] + '20',
    borderColor: SITE_COLOR_MAP[site],
    borderWidth: 2,
    fill: true,
    pointRadius: 3,
    pointHoverRadius: 5
  }));

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
      datasets: [{ data, backgroundColor: colors, borderWidth: 2, borderColor: '#fff', hoverOffset: 8 }]
    },
    options: {
      responsive: true,
      cutout: '65%',
      plugins: {
        legend: { position: 'bottom', labels: { padding: 12, font: { size: 11 } } },
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
          backgroundColor: COLORS.red + '80',
          borderColor: COLORS.red,
          borderWidth: 1,
          yAxisID: 'y'
        },
        {
          label: 'CTR (%)',
          data: data.map(d => d.ctr),
          type: 'line',
          borderColor: COLORS.blue,
          backgroundColor: COLORS.blue,
          borderWidth: 2,
          pointRadius: 4,
          pointBackgroundColor: COLORS.blue,
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
        y: { beginAtZero: true, ticks: { callback: v => fmt(v) }, title: { display: true, text: 'Impressions' } },
        y1: { position: 'right', beginAtZero: true, ticks: { callback: v => v.toFixed(2) + '%' }, title: { display: true, text: 'CTR' }, grid: { display: false } }
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
          backgroundColor: COLORS.chart.slice(0, TARGETING_DATA.length).map(c => c + '80'),
          borderColor: COLORS.chart.slice(0, TARGETING_DATA.length),
          borderWidth: 1
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
      <td title="${p.placement}" style="max-width:320px;overflow:hidden;text-overflow:ellipsis;">${p.placement}</td>
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
  // Re-render will sort
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
      <div class="kpi-value red">${fmt(totalImps)}</div>
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
  const themeColors = { 'AI': COLORS.red, 'Macro': COLORS.blue, 'Energy': COLORS.gold };

  charts['chartThemePerf'] = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: CREATIVE_THEMES.map(t => t.theme),
      datasets: [
        {
          label: 'Impressions',
          data: CREATIVE_THEMES.map(t => t.impressions),
          backgroundColor: CREATIVE_THEMES.map(t => (themeColors[t.theme] || COLORS.red) + '80'),
          borderColor: CREATIVE_THEMES.map(t => themeColors[t.theme] || COLORS.red),
          borderWidth: 1,
          yAxisID: 'y'
        },
        {
          label: 'CTR (%)',
          type: 'line',
          data: CREATIVE_THEMES.map(t => t.ctr),
          borderColor: '#1A1A2E',
          backgroundColor: '#1A1A2E',
          borderWidth: 2,
          pointRadius: 6,
          pointBackgroundColor: '#1A1A2E',
          yAxisID: 'y1'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom' } },
      scales: {
        y: { beginAtZero: true, ticks: { callback: v => fmt(v) }, title: { display: true, text: 'Impressions' } },
        y1: { position: 'right', beginAtZero: true, ticks: { callback: v => v + '%' }, title: { display: true, text: 'CTR %' }, grid: { display: false } }
      }
    }
  });
}

function renderThemeCTRChart() {
  destroyChart('chartThemeCTR');
  const ctx = document.getElementById('chartThemeCTR').getContext('2d');
  const months = MONTHLY_THEME_CTR.map(d => d.month);
  const themeColors = { 'AI': COLORS.red, 'Macro': COLORS.blue, 'Energy': COLORS.gold };

  const datasets = ['AI', 'Macro', 'Energy'].map(theme => ({
    label: theme,
    data: MONTHLY_THEME_CTR.map(d => d[theme] || null),
    borderColor: themeColors[theme],
    backgroundColor: themeColors[theme] + '20',
    borderWidth: 2,
    pointRadius: 4,
    pointBackgroundColor: themeColors[theme],
    spanGaps: true,
    fill: false
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
        y: { beginAtZero: true, ticks: { callback: v => v.toFixed(2) + '%' }, title: { display: true, text: 'CTR %' } }
      }
    }
  });
}

function renderMessagingChart(metric) {
  destroyChart('chartMessaging');
  const ctx = document.getElementById('chartMessaging').getContext('2d');
  const top20 = CREATIVE_MESSAGES.slice(0, 20);
  const sortedData = metric === 'ctr' ? [...top20].sort((a, b) => b.ctr - a.ctr) : top20;

  charts['chartMessaging'] = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: sortedData.map(m => m.message),
      datasets: [{
        label: metric === 'impressions' ? 'Impressions' : 'CTR (%)',
        data: sortedData.map(m => metric === 'impressions' ? m.impressions : m.ctr),
        backgroundColor: sortedData.map((m, i) => COLORS.chart[i % COLORS.chart.length] + '70'),
        borderColor: sortedData.map((m, i) => COLORS.chart[i % COLORS.chart.length]),
        borderWidth: 1
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
        x: { ticks: { callback: v => metric === 'impressions' ? fmt(v) : v + '%' } }
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
      <div style="display:flex;align-items:center;gap:12px;padding:10px 0;${i < items.length - 1 ? 'border-bottom:1px solid #E5E7EB;' : ''}">
        <div style="width:28px;height:28px;border-radius:50%;background:${isTop ? '#ECFDF5' : '#FEF2F2'};display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:${isTop ? '#059669' : '#DC2626'}">${i + 1}</div>
        <div style="flex:1;min-width:0;">
          <div style="font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${m.message}</div>
          <div style="font-size:11px;color:#9CA3AF;">${fmtFull(m.impressions)} impressions</div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:15px;font-weight:700;color:${isTop ? '#059669' : '#DC2626'}">${fmtPct(m.ctr)}</div>
          <div style="font-size:10px;color:#9CA3AF;">CTR</div>
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
      <td style="font-weight:500;">${m.message}</td>
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

  // Find highest frequency month across all publishers
  let maxFreq = 0, maxFreqPub = '', maxFreqMonth = '';
  for (const pub of publishers) {
    for (const [month, freq] of Object.entries(SOV_FREQUENCY[pub].monthly)) {
      if (freq > maxFreq) { maxFreq = freq; maxFreqPub = pub; maxFreqMonth = month; }
    }
  }

  document.getElementById('sov-kpis').innerHTML = `
    <div class="kpi-card highlight">
      <div class="kpi-label">Avg Frequency</div>
      <div class="kpi-value red">${overallAvgFreq.toFixed(1)}x</div>
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
  const pubColors = { 'WSJ': COLORS.wsj, 'Economist': COLORS.economist, 'FT': COLORS.ft };

  container.innerHTML = Object.entries(SOV_FREQUENCY).map(([pub, data]) => {
    const months = Object.entries(data.monthly);
    const maxFreq = Math.max(...months.map(([, f]) => f));
    const minFreq = Math.min(...months.map(([, f]) => f));

    // Get audience segments for this publisher
    const auds = AUDIENCE_DEFINITIONS.filter(a => a.publisher === pub || a.publisher === pub + ' ');

    return `
      <div class="sov-vendor-card" style="border-top: 3px solid ${pubColors[pub]}">
        <div class="sov-vendor-name" style="color:${pubColors[pub]}">${pub === 'FT' ? 'Financial Times' : pub === 'WSJ' ? 'Wall Street Journal' : 'The Economist'}</div>
        <div style="font-size:36px;font-weight:800;color:#1A1A2E;margin:8px 0;">${data.avg.toFixed(1)}x</div>
        <div style="font-size:11px;color:#9CA3AF;margin-bottom:16px;">Average Frequency</div>
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
          <div style="text-align:left;padding:6px 0;border-bottom:1px solid #E5E7EB;font-size:11px;">
            <div style="font-weight:600;">${a.audience}</div>
            <div style="color:#9CA3AF;">${fmt(a.size)} pool size</div>
          </div>
        `).join('')}
      </div>
    `;
  }).join('');
}

function renderFrequencyTrendChart() {
  destroyChart('chartFreqTrend');
  const ctx = document.getElementById('chartFreqTrend').getContext('2d');
  const allMonths = ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const pubColors = { 'WSJ': COLORS.wsj, 'Economist': COLORS.economist, 'FT': COLORS.ft };

  const datasets = Object.entries(SOV_FREQUENCY).map(([pub, data]) => ({
    label: pub === 'FT' ? 'Financial Times' : pub === 'WSJ' ? 'Wall Street Journal' : 'The Economist',
    data: allMonths.map(m => data.monthly[m] || null),
    borderColor: pubColors[pub],
    backgroundColor: pubColors[pub] + '15',
    borderWidth: 3,
    pointRadius: 5,
    pointBackgroundColor: pubColors[pub],
    pointBorderColor: '#fff',
    pointBorderWidth: 2,
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
          title: { display: true, text: 'Frequency' }
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
            <td style="font-weight:500;">${a.audience}</td>
            <td class="number">${fmtFull(a.size)}</td>
            <td style="font-size:11px;color:#6B7280;white-space:normal;max-width:300px;">${a.definition}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

function renderFreqDistChart() {
  destroyChart('chartFreqDist');
  const ctx = document.getElementById('chartFreqDist').getContext('2d');
  const pubColors = { 'WSJ': COLORS.wsj, 'Economist': COLORS.economist, 'FT': COLORS.ft };
  const pubs = Object.keys(SOV_FREQUENCY);

  charts['chartFreqDist'] = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: pubs.map(pub => ({
        label: pub,
        data: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => SOV_FREQUENCY[pub].monthly[m] || 0),
        borderColor: pubColors[pub],
        backgroundColor: pubColors[pub] + '20',
        borderWidth: 2,
        pointBackgroundColor: pubColors[pub],
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
          ticks: { callback: v => v + 'x', stepSize: 1 }
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
    if (!val) return '#F9FAFB';
    const intensity = Math.min(val / max, 1);
    const r = 204;
    const g = Math.round(255 - intensity * 255);
    const b = Math.round(255 - intensity * 255);
    return `rgba(${r}, ${Math.max(g, 0)}, ${Math.max(b, 0)}, ${0.15 + intensity * 0.65})`;
  }

  const maxPen = Math.max(...PENETRATION_DATA.flatMap(d => Object.values(d.months)));

  container.innerHTML = `
    <div style="margin-bottom:16px;font-size:12px;font-weight:600;">Penetration Rate (%) - Economist</div>
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
              return `<td style="background:${getHeatColor(val, maxPen)};color:${val && val > maxPen * 0.5 ? '#fff' : '#1A1A2E'};font-weight:${val ? '600' : '400'}">${val ? val.toFixed(1) + '%' : '-'}</td>`;
            }).join('')}
          </tr>
        `).join('')}
      </tbody>
    </table>
    <div style="margin-top:24px;font-size:12px;font-weight:600;">Frequency Detail - Economist</div>
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
              return `<td style="background:${getHeatColor(val, maxF)};color:${val && val > maxF * 0.5 ? '#fff' : '#1A1A2E'};font-weight:${val ? '600' : '400'}">${val ? val.toFixed(1) + 'x' : '-'}</td>`;
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
  // Hide loading overlay
  setTimeout(() => {
    document.getElementById('loadingOverlay').classList.add('hidden');
    renderPlacementsView();
  }, 500);
});
