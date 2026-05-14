/**
 * ui.js
 * All UI interactions: county panel rendering, tabs, command palette,
 * about drawer, compare bar/modal, CSV export, share (URL deep-link),
 * mobile sheet, focus trapping, toast notifications, and keyboard navigation.
 *
 * Imports from: counties.js
 * Wired to map.js via main.js (no direct import of map.js here).
 * Receives g, zoom, findMatch, updatePinnedPaths via connectMap().
 */

import { countiesData, REGION_COLORS, KENYA_POP_MILLIONS, parseGcpValue } from './counties.js';

// ── MAP BRIDGE ──────────────────────────────────────────────────────────────
// Populated by connectMap() called from main.js — avoids circular imports.
let _g, _findMatch, _updatePinnedPaths;

export function connectMap({ g, findMatch, updatePinnedPaths }) {
  _g = g;
  _findMatch = findMatch;
  _updatePinnedPaths = updatePinnedPaths;
}

// ── STATE ───────────────────────────────────────────────────────────────────
export let selectedCounty = null;
let pinnedCounties = [];
let activeTab = 'overview';

// ── ELEMENT CACHE ──────────────────────────────────────────────────────────
const els = {
  placeholder:       document.getElementById('placeholder'),
  countyPanel:       document.getElementById('county-panel'),
  cBand:             document.getElementById('c-band'),
  cName:             document.getElementById('c-name'),
  cCodeBadge:        document.getElementById('c-code-badge'),
  cHq:               document.getElementById('c-hq'),
  cPop:              document.getElementById('c-pop'),
  cArea:             document.getElementById('c-area'),
  cDensity:          document.getElementById('c-density'),
  cGovernor:         document.getElementById('c-governor'),
  cPctPill:          document.getElementById('c-pct-pill'),
  cAbout:            document.getElementById('c-about'),
  cFact:             document.getElementById('c-fact'),
  cLandmarks:        document.getElementById('c-landmarks'),
  cGcp:              document.getElementById('c-gcp'),
  cGcpBar:           document.getElementById('c-gcp-bar'),
  cTier:             document.getElementById('c-tier'),
  cHighlights:       document.getElementById('c-highlights'),
  cIndustries:       document.getElementById('c-industries'),
  cGeo:              document.getElementById('c-geo'),
  cConnect:          document.getElementById('c-connect'),
  cScTitle:          document.getElementById('c-sc-title'),
  cSc:               document.getElementById('c-sc'),
  btnPinCounty:      document.getElementById('btn-pin-county'),
  btnShare:          document.getElementById('btn-share'),
  btnCsv:            document.getElementById('btn-csv'),
  sidebar:           document.getElementById('sidebar'),
  mobPanelBtn:       document.getElementById('mob-panel-btn'),
  mobPanelBtnLabel:  document.getElementById('mob-panel-btn-label'),
  sheetHandle:       document.getElementById('sheet-handle'),
  sheetExpandBtn:    document.getElementById('sheet-expand-btn'),
  compareBar:        document.getElementById('compare-bar'),
  compareSlots:      document.getElementById('compare-slots'),
  compareGoBtn:      document.getElementById('compare-go-btn'),
  compareClearBtn:   document.getElementById('compare-clear-btn'),
  compareSrStatus:   document.getElementById('compare-sr-status'),
  compareModal:      document.getElementById('compare-modal'),
  compareModalBody:  document.getElementById('compare-modal-body'),
  compareModalClose: document.getElementById('compare-modal-close'),
  compareSubtitle:   document.getElementById('compare-modal-subtitle'),
  cmdOverlay:        document.getElementById('cmd-overlay'),
  cmdInput:          document.getElementById('cmd-input'),
  cmdResults:        document.getElementById('cmd-results'),
  cmdEsc:            document.getElementById('cmd-esc'),
  aboutOverlay:      document.getElementById('about-overlay'),
  aboutDrawer:       document.getElementById('about-drawer'),
  drawerClose:       document.getElementById('drawer-close'),
  navSearchTrigger:  document.getElementById('nav-search-trigger'),
  mobSearchBtn:      document.getElementById('mob-search-btn'),
  brand:             document.querySelector('.brand'),
};

// ── HELPERS ─────────────────────────────────────────────────────────────────
function isMobile() { return window.innerWidth <= 768; }

function calcDensity(data) {
  const areaNum = parseInt((data.area || '0').replace(/,/g, ''), 10);
  if (!areaNum) return '—';
  return Math.round(data.popM * 1_000_000 / areaNum).toLocaleString();
}

function safeText(text) {
  return document.createTextNode(String(text ?? '—'));
}

function buildListItems(items, tag = 'li', cls = 'item-row') {
  return (items || []).map(text => {
    const el = document.createElement(tag);
    el.className = cls;
    el.textContent = text;
    return el;
  });
}

function replaceChildren(container, nodes) {
  container.replaceChildren(...nodes);
}

// ── TOAST NOTIFICATION ───────────────────────────────────────────────────────
export function showToast(msg) {
  const existing = document.getElementById('_toast');
  if (existing) existing.remove();
  const t = document.createElement('div');
  t.id = '_toast';
  t.setAttribute('role', 'status');
  t.setAttribute('aria-live', 'polite');
  t.textContent = msg;
  document.body.appendChild(t);
  requestAnimationFrame(() => t.classList.add('visible'));
  setTimeout(() => {
    t.classList.remove('visible');
    setTimeout(() => t.remove(), 300);
  }, 2500);
}

// ── FOCUS TRAP ──────────────────────────────────────────────────────────────
// Used by openCmd() and openAbout() — simple two-argument version.
function createFocusTrap(el) {
  function handler(e) {
    if (e.key !== 'Tab') return;
    const focusable = Array.from(el.querySelectorAll(
      'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])'
    )).filter(n => !n.closest('[aria-hidden="true"]'));
    if (!focusable.length) { e.preventDefault(); return; }
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  }
  el.addEventListener('keydown', handler);
  return handler;
}

// ── MOBILE SHEET ─────────────────────────────────────────────────────────────
let sheetState = 'hidden';

function setSheet(state) {
  sheetState = state;
  els.sidebar.classList.remove('sheet-peek', 'sheet-mid', 'sheet-open');
  if (state !== 'hidden') els.sidebar.classList.add(`sheet-${state}`);
}

if (isMobile()) setSheet('peek');

function setMobBtnVisible(_visible) {
  // mob-panel-btn removed — drag handle is the sole sheet interaction affordance
}

els.sheetExpandBtn?.addEventListener('click', () => {
  if (sheetState === 'open') {
    setSheet('mid');
    setMobBtnVisible(!!selectedCounty);
  } else {
    setSheet('open');
    setMobBtnVisible(false);
  }
});

let dragStartY = 0;
let dragStartState = 'peek';
let isDragging = false;

function sheetStateY(state) {
  const sheetH = els.sidebar.offsetHeight;
  const peekH  = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sheet-peek'), 10) || 200;
  const midH   = window.innerHeight * 0.52;
  if (state === 'open')  return 0;
  if (state === 'mid')   return sheetH - midH;
  if (state === 'peek')  return sheetH - peekH;
  return sheetH;
}

els.sheetHandle?.addEventListener('touchstart', e => {
  dragStartY     = e.touches[0].clientY;
  dragStartState = sheetState;
  isDragging     = true;
  els.sidebar.style.transition = 'none';
}, { passive: true });

els.sheetHandle?.addEventListener('touchmove', e => {
  if (!isDragging) return;
  const deltaY   = e.touches[0].clientY - dragStartY;
  const baseY    = sheetStateY(dragStartState);
  const sheetH   = els.sidebar.offsetHeight;
  const minY     = 0;
  const maxY     = sheetH - (parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sheet-peek'), 10) || 200);
  const newY     = Math.min(maxY, Math.max(minY, baseY + deltaY));
  els.sidebar.style.transform = `translateY(${newY}px)`;
}, { passive: true });

els.sheetHandle?.addEventListener('touchend', e => {
  if (!isDragging) return;
  isDragging = false;
  els.sidebar.style.transition = '';
  els.sidebar.style.transform  = '';

  const deltaY = e.changedTouches[0].clientY - dragStartY;
  if (deltaY < -40) {
    setSheet(dragStartState === 'peek' ? 'mid' : 'open');
    setMobBtnVisible(false);
  } else if (deltaY > 40) {
    if (dragStartState === 'open') {
      setSheet('mid');
      setMobBtnVisible(!!selectedCounty);
    } else if (dragStartState === 'mid') {
      setSheet('peek');
      setMobBtnVisible(!!selectedCounty);
    } else {
      setSheet('peek');
    }
  } else {
    setSheet(dragStartState);
  }
}, { passive: true });

// ── SHOW COUNTY ──────────────────────────────────────────────────────────────
export function showCounty(data, mapPathEl) {
  selectedCounty = data;

  d3.selectAll('.county-path').classed('selected', false);
  if (mapPathEl) d3.select(mapPathEl).classed('selected', true);

  els.placeholder.hidden = true;
  els.countyPanel.classList.remove('active');
  void els.countyPanel.offsetWidth;
  els.countyPanel.classList.add('active');

  const color = REGION_COLORS[data.region] || '#2563eb';

  // Hero
  els.cBand.style.background = color;
  els.cName.textContent      = data.name;
  els.cCodeBadge.textContent = 'No. ' + data.code;
  els.cHq.textContent        = data.cap || '—';
  els.cPop.textContent       = data.pop || '—';
  els.cArea.textContent      = data.area || '—';
  els.cDensity.textContent   = calcDensity(data);
  els.cGovernor.textContent  = data.governor || '—';

  const pct = ((data.popM / KENYA_POP_MILLIONS) * 100).toFixed(2);
  els.cPctPill.textContent = pct + '% of Kenya';

  updatePinBtn(data.name);

  // Overview tab
  els.cAbout.textContent = data.known || '—';
  els.cFact.textContent  = data.funfact || '—';
  replaceChildren(els.cLandmarks, buildListItems(data.landmarks));

  // Economy tab
  els.cGcp.textContent = data.gcp || '—';

  const gcpNum = parseGcpValue(data.gcp);
  const GCP_MAX_LOG = Math.log(2100 + 1);
  const gcpPct = gcpNum > 0
    ? Math.min(100, Math.round((Math.log(gcpNum + 1) / GCP_MAX_LOG) * 100))
    : 0;
  els.cGcpBar.style.width      = gcpPct + '%';
  els.cGcpBar.style.background =
    data.gcpTier === 'high' ? '#16a34a' :
    data.gcpTier === 'mid'  ? '#ca8a04' : '#94a3b8';

  els.cGcpBar.closest('[role="img"]')?.setAttribute(
    'aria-label', `GCP bar: ${data.gcp}, ${gcpPct}% relative to Nairobi on a log scale`
  );

  const TIER_MAP = {
    high: { cls: 'tier-high', txt: 'High GCP' },
    mid:  { cls: 'tier-mid',  txt: 'Mid GCP'  },
    low:  { cls: 'tier-low',  txt: 'Developing' },
  };
  const tier = TIER_MAP[data.gcpTier] || TIER_MAP.low;
  els.cTier.className   = 'gcp-tier-tag ' + tier.cls;
  els.cTier.textContent = tier.txt;

  replaceChildren(els.cHighlights, buildListItems(data.gcpHighlights, 'li', 'econ-hl'));

  const industryNodes = (data.industries || []).map(ind => {
    const chip = document.createElement('div');
    chip.className = 'chip';
    chip.setAttribute('role', 'listitem');
    chip.textContent = ind;
    return chip;
  });
  replaceChildren(els.cIndustries, industryNodes);

  // Geography tab
  const geo = data.geo || {};
  const geoFields = [
    { label: 'Terrain',   val: geo.terrain },
    { label: 'Climate',   val: geo.climate },
    { label: 'Elevation', val: geo.elevation },
    { label: 'Borders',   val: geo.neighbours },
  ].filter(f => f.val);

  const geoCells = geoFields.map(f => {
    const cell = document.createElement('div');
    cell.className = 'geo-cell';
    const dt = document.createElement('dt');
    dt.className = 'geo-label';
    dt.textContent = f.label;
    const dd = document.createElement('dd');
    dd.className = 'geo-val';
    dd.textContent = f.val;
    cell.append(dt, dd);
    return cell;
  });
  replaceChildren(els.cGeo, geoCells);
  replaceChildren(els.cConnect, buildListItems(data.connectivity));

  // Sub-counties tab
  const subs = data.subcounties || [];
  els.cScTitle.textContent = `Sub-Counties (${subs.length})`;
  const scNodes = subs.map(s => {
    const chip = document.createElement('div');
    chip.className = 'sc-chip';
    chip.setAttribute('role', 'listitem');
    chip.style.borderLeftColor = color;
    chip.textContent = s;
    return chip;
  });
  replaceChildren(els.cSc, scNodes);

  activeTab = 'overview';
  restoreActiveTab();
  document.querySelector('.tab-contents')?.scrollTo({ top: 0, behavior: 'instant' });

  _updatePinnedPaths?.(pinnedCounties, data.name);

  const url = new URL(window.location.href);
  url.searchParams.set('county', data.name);
  history.replaceState(null, '', url.toString());

  if (isMobile()) {
    setSheet('mid');
    setMobBtnVisible(false);
  }
}

// ── TABS ─────────────────────────────────────────────────────────────────────
function restoreActiveTab() {
  document.querySelectorAll('.tab-btn').forEach(b => {
    const isActive = b.dataset.tab === activeTab;
    b.classList.toggle('active', isActive);
    b.setAttribute('aria-selected', String(isActive));
  });
  document.querySelectorAll('.tab-pane').forEach(p => {
    p.classList.toggle('active', p.id === 'tab-' + activeTab);
  });
}

document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    activeTab = btn.dataset.tab;
    restoreActiveTab();
    if (isMobile() && sheetState !== 'open') setSheet('open');
  });
});

document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  if (els.cmdOverlay.classList.contains('open'))   { closeCmd();          return; }
  if (els.aboutDrawer.classList.contains('open'))  { closeAbout();        return; }
  if (els.compareModal.classList.contains('open')) { closeCompareModal(); return; }
});

// ── CSV EXPORT ───────────────────────────────────────────────────────────────
els.btnCsv.addEventListener('click', () => {
  if (!selectedCounty) return;
  const d = selectedCounty;
  const rows = [
    ['Field', 'Value'],
    ['County', d.name], ['Code', d.code], ['County HQ', d.cap],
    ['Population', d.pop], ['Area (km²)', d.area],
    ['Population Density (/km²)', calcDensity(d)],
    ['Governor', d.governor], ['GCP', d.gcp], ['GCP Tier', d.gcpTier],
    ['Industries', (d.industries || []).join('; ')],
    ['Notable Places', (d.landmarks || []).join('; ')],
    ['Sub-Counties', (d.subcounties || []).join('; ')],
    ['About', d.known],
  ];
  const csv = rows
    .map(r => r.map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(','))
    .join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `${d.name}_County.csv`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 100);
});

// ── SHARE ────────────────────────────────────────────────────────────────────
els.btnShare.addEventListener('click', () => {
  if (!selectedCounty) return;
  const shareUrl = window.location.href;

  if (!navigator.clipboard) {
    prompt('Copy this link to share:', shareUrl);
    return;
  }

  navigator.clipboard.writeText(shareUrl).then(() => {
    const orig = els.btnShare.innerHTML;
    els.btnShare.textContent = 'Link copied!';
    setTimeout(() => { els.btnShare.innerHTML = orig; }, 2000);
  }).catch(() => {
    prompt('Copy this link to share:', shareUrl);
  });
});

// ── COMMAND PALETTE ───────────────────────────────────────────────────────────
function openCmd() {
  els.cmdOverlay.classList.add('open');
  els.cmdOverlay.setAttribute('aria-hidden', 'false');
  els.cmdInput.focus();
  renderCmd('');
  createFocusTrap(els.cmdOverlay);
}

function closeCmd() {
  els.cmdOverlay.classList.remove('open');
  els.cmdOverlay.setAttribute('aria-hidden', 'true');
  els.cmdInput.value = '';
  els.navSearchTrigger.focus();
}

els.navSearchTrigger.addEventListener('click', openCmd);
els.navSearchTrigger.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') openCmd(); });
els.mobSearchBtn.addEventListener('click', openCmd);
els.cmdEsc.addEventListener('click', closeCmd);
els.cmdEsc.addEventListener('keydown', e => { if (e.key === 'Enter') closeCmd(); });
els.cmdOverlay.addEventListener('click', e => { if (e.target === els.cmdOverlay) closeCmd(); });
document.addEventListener('keydown', e => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); openCmd(); }
});

function countyMatchesQuery(c, q) {
  if (!q) return true;
  const haystack = [
    c.name,
    c.region,
    c.cap,
    c.governor || '',
    c.known || '',
    (c.industries || []).join(' '),
    (c.landmarks  || []).join(' '),
  ].join(' ').toLowerCase().replace(/[^a-z0-9 ]/g, '');

  return q.split(/\s+/).filter(Boolean).every(word => haystack.includes(word));
}

function renderCmd(term) {
  const q = term.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
  const allCounties = Object.entries(countiesData).map(([name, d]) => ({ name, ...d }));
  const filtered = allCounties.filter(c => countyMatchesQuery(c, q));

  if (!filtered.length) {
    const empty = document.createElement('div');
    empty.className = 'cmd-empty';
    empty.textContent = 'No counties match your search.';
    els.cmdResults.replaceChildren(empty);
    return;
  }

  const labelEl = document.createElement('div');
  labelEl.className = 'cmd-section-label';
  labelEl.textContent = q
    ? `${filtered.length} result${filtered.length !== 1 ? 's' : ''}`
    : 'All 47 Counties';

  const items = filtered.map(c => {
    const item = document.createElement('div');
    item.className = 'cmd-item';
    item.dataset.county = c.name;
    item.setAttribute('role', 'option');
    item.setAttribute('tabindex', '0');

    const dot = document.createElement('div');
    dot.className = 'cmd-dot';
    dot.style.background = REGION_COLORS[c.region] || '#cbd5e1';
    dot.setAttribute('aria-hidden', 'true');

    const main = document.createElement('div');
    main.className = 'cmd-main';
    main.textContent = c.name;

    let subText = c.region;
    if (q) {
      const words = q.split(/\s+/).filter(Boolean);
      const hint = [...(c.industries || []), ...(c.landmarks || [])].find(s =>
        words.some(w => s.toLowerCase().includes(w))
      );
      if (hint) subText = hint;
    }

    const sub = document.createElement('div');
    sub.className = 'cmd-sub';
    sub.textContent = subText;

    item.append(dot, main, sub);

    const activate = () => {
      if (!countiesData[c.name]) return;
      const data = { name: c.name, ...countiesData[c.name] };
      let pathEl = null;
      _g?.selectAll('path').each(function(d) {
        if (_findMatch?.(d)?.name === c.name) pathEl = this;
      });
      showCounty(data, pathEl);
      closeCmd();
    };

    item.addEventListener('click', activate);
    item.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') activate(); });
    return item;
  });

  els.cmdResults.replaceChildren(labelEl, ...items);
}

els.cmdInput.addEventListener('input', e => renderCmd(e.target.value));

// ── ABOUT DRAWER ─────────────────────────────────────────────────────────────
function openAbout() {
  els.aboutOverlay.classList.add('open');
  els.aboutOverlay.setAttribute('aria-hidden', 'false');
  els.aboutDrawer.classList.add('open');
  els.aboutDrawer.setAttribute('aria-hidden', 'false');
  els.drawerClose.focus();
  createFocusTrap(els.aboutDrawer);
}

function closeAbout() {
  els.aboutOverlay.classList.remove('open');
  els.aboutOverlay.setAttribute('aria-hidden', 'true');
  els.aboutDrawer.classList.remove('open');
  els.aboutDrawer.setAttribute('aria-hidden', 'true');
  document.getElementById('btn-about').focus();
}

document.getElementById('btn-about').addEventListener('click', openAbout);
els.drawerClose.addEventListener('click', closeAbout);
els.aboutOverlay.addEventListener('click', closeAbout);

// ── COMPARE SYSTEM ───────────────────────────────────────────────────────────
function updatePinBtn(name) {
  const isPinned = pinnedCounties.includes(name);
  const atMax    = pinnedCounties.length >= 3 && !isPinned;

  els.btnPinCounty.classList.toggle('pinned', isPinned);
  els.btnPinCounty.setAttribute('aria-pressed', String(isPinned));
  els.btnPinCounty.title = atMax ? 'Remove a county to pin another (max 3)' : '';

  const svgNS   = 'http://www.w3.org/2000/svg';
  const starPath = 'M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2z';

  const svgIcon = document.createElementNS(svgNS, 'svg');
  svgIcon.setAttribute('width', '11');
  svgIcon.setAttribute('height', '11');
  svgIcon.setAttribute('viewBox', '0 0 24 24');
  svgIcon.setAttribute('aria-hidden', 'true');
  svgIcon.setAttribute('fill', isPinned ? 'currentColor' : 'none');
  svgIcon.setAttribute('stroke', 'currentColor');
  svgIcon.setAttribute('stroke-width', isPinned ? '0' : '2.5');
  const p = document.createElementNS(svgNS, 'path');
  p.setAttribute('d', starPath);
  svgIcon.appendChild(p);

  const label = isPinned ? ' Pinned' : atMax ? ' Max 3' : ' Compare';
  els.btnPinCounty.replaceChildren(svgIcon, safeText(label));
}

els.btnPinCounty.addEventListener('click', () => {
  if (!selectedCounty) return;
  const name = selectedCounty.name;

  if (pinnedCounties.includes(name)) {
    pinnedCounties = pinnedCounties.filter(n => n !== name);
  } else {
    if (pinnedCounties.length >= 3) {
      showToast('Max 3 counties — remove one first');
      return;
    }
    pinnedCounties.push(name);
  }

  updatePinBtn(name);
  renderCompareBar();
  _updatePinnedPaths?.(pinnedCounties, selectedCounty?.name);
});

function renderCompareBar() {
  if (!pinnedCounties.length) {
    els.compareBar.classList.remove('visible');
    return;
  }
  els.compareBar.classList.add('visible');

  const isReady = pinnedCounties.length >= 2;
  els.compareGoBtn.disabled = !isReady;
  els.compareGoBtn.setAttribute('aria-disabled', String(!isReady));
  els.compareGoBtn.title = isReady ? '' : 'Pin at least 2 counties to compare';

  els.compareSrStatus.textContent =
    `${pinnedCounties.length} of 3 counties pinned. ${isReady ? 'Ready to compare.' : 'Pin one more to compare.'}`;

  const slotNodes = pinnedCounties.map(name => {
    const d    = countiesData[name];
    const slot = document.createElement('div');
    slot.className = 'compare-slot filled';

    const nameSpan = document.createElement('span');
    nameSpan.className = 'compare-slot-name';
    nameSpan.style.color = REGION_COLORS[d.region] || '#2563eb';
    nameSpan.textContent = name;

    const removeBtn = document.createElement('button');
    removeBtn.className = 'compare-slot-remove';
    removeBtn.setAttribute('aria-label', `Remove ${name} from comparison`);
    removeBtn.textContent = '×';
    removeBtn.addEventListener('click', () => {
      pinnedCounties = pinnedCounties.filter(n => n !== name);
      if (selectedCounty) updatePinBtn(selectedCounty.name);
      renderCompareBar();
      _updatePinnedPaths?.(pinnedCounties, selectedCounty?.name);
    });

    slot.append(nameSpan, removeBtn);
    return slot;
  });

  for (let i = pinnedCounties.length; i < 3; i++) {
    const slot  = document.createElement('div');
    slot.className = 'compare-slot';
    const hint  = document.createElement('span');
    hint.className = 'compare-slot-empty';
    hint.textContent = `+ Pin a county (${i + 1}/3)`;
    slot.appendChild(hint);
    slotNodes.push(slot);
  }

  els.compareSlots.replaceChildren(...slotNodes);
}

els.compareClearBtn.addEventListener('click', () => {
  pinnedCounties = [];
  if (selectedCounty) updatePinBtn(selectedCounty.name);
  renderCompareBar();
  _updatePinnedPaths?.([], selectedCounty?.name);
});

els.compareGoBtn.addEventListener('click', () => {
  if (pinnedCounties.length >= 2) openCompareModal();
});

// ── COMPARE MODAL ────────────────────────────────────────────────────────────
function openCompareModal() {
  const counties = pinnedCounties
    .map(name => (countiesData[name] ? { name, ...countiesData[name] } : null))
    .filter(Boolean);

  els.compareSubtitle.textContent = counties.map(c => c.name).join(' · ');

  const TIER_LABELS = { high: 'High GCP', mid: 'Mid GCP', low: 'Developing' };
  const TIER_COLORS = { high: '#166534', mid: '#854d0e', low: '#475569' };
  const TIER_BG     = { high: '#dcfce7', mid: '#fef9c3', low: '#f1f5f9' };

  const cards = counties.map(c => {
    const color = REGION_COLORS[c.region] || '#2563eb';
    const pct   = ((c.popM / KENYA_POP_MILLIONS) * 100).toFixed(2);

    const card = document.createElement('div');
    card.className = 'cmp-card';

    const band = document.createElement('div');
    band.className = 'cmp-card-band';
    band.style.background = color;
    band.setAttribute('aria-hidden', 'true');

    const titleRow = document.createElement('div');
    titleRow.className = 'cmp-card-title-row';
    const nameEl = document.createElement('div');
    nameEl.className = 'cmp-card-name';
    nameEl.textContent = c.name;
    const hqEl = document.createElement('div');
    hqEl.className = 'cmp-card-hq';
    hqEl.textContent = `HQ: ${c.cap} · No. ${c.code}`;
    titleRow.append(nameEl, hqEl);

    const header = document.createElement('div');
    header.className = 'cmp-card-header';
    header.append(band, titleRow);

    const bigStats = [
      { label: 'Population',   val: c.pop,         accent: true },
      { label: 'GCP (est.)',   val: c.gcp },
      { label: 'Area km²',     val: c.area },
      { label: 'Density /km²', val: calcDensity(c) },
    ].map(({ label, val, accent }) => {
      const cell = document.createElement('div');
      cell.className = 'cmp-big-cell' + (accent ? ' accent' : '');
      const lbl = document.createElement('div');
      lbl.className = 'cmp-big-label';
      lbl.textContent = label;
      const v = document.createElement('div');
      v.className = 'cmp-big-val' + (accent ? ' accent' : '');
      v.textContent = val || '—';
      cell.append(lbl, v);
      return cell;
    });
    const bigGrid = document.createElement('div');
    bigGrid.className = 'cmp-big-stats';
    bigGrid.append(...bigStats);

    const tierRow = document.createElement('div');
    tierRow.className = 'cmp-fact-row';
    const tierLbl = document.createElement('span');
    tierLbl.className = 'cmp-fact-label';
    tierLbl.textContent = 'GCP tier';
    const tierBadge = document.createElement('span');
    Object.assign(tierBadge.style, {
      background: TIER_BG[c.gcpTier], color: TIER_COLORS[c.gcpTier],
      padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '700',
    });
    tierBadge.textContent = TIER_LABELS[c.gcpTier] || '—';
    const tierVal = document.createElement('span');
    tierVal.className = 'cmp-fact-val';
    tierVal.appendChild(tierBadge);
    tierRow.append(tierLbl, tierVal);

    const facts = document.createElement('div');
    facts.className = 'cmp-facts';
    facts.appendChild(tierRow);

    [
      { label: '% of Kenya pop.', val: pct + '%' },
      { label: 'Sub-counties',    val: String(c.subcounties?.length ?? '—') },
      { label: 'Climate',         val: c.geo?.climate   || '—' },
      { label: 'Elevation',       val: c.geo?.elevation || '—' },
    ].forEach(({ label, val }) => {
      const row = document.createElement('div');
      row.className = 'cmp-fact-row';
      const l = document.createElement('span');
      l.className = 'cmp-fact-label';
      l.textContent = label;
      const v = document.createElement('span');
      v.className = 'cmp-fact-val';
      v.textContent = val;
      row.append(l, v);
      facts.appendChild(row);
    });

    const chipSection = document.createElement('div');
    chipSection.className = 'cmp-chip-section';
    const chipLabel = document.createElement('div');
    chipLabel.className = 'cmp-chip-label';
    chipLabel.textContent = 'Key Industries';
    const chips = document.createElement('div');
    chips.className = 'cmp-chips';
    (c.industries || []).forEach(ind => {
      const chip = document.createElement('span');
      chip.className = 'cmp-chip';
      chip.textContent = ind;
      chips.appendChild(chip);
    });
    chipSection.append(chipLabel, chips);

    const gov = document.createElement('div');
    gov.className = 'cmp-governor';
    const govSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    govSvg.setAttribute('width', '12'); govSvg.setAttribute('height', '12');
    govSvg.setAttribute('viewBox', '0 0 24 24'); govSvg.setAttribute('fill', 'none');
    govSvg.setAttribute('stroke', 'currentColor'); govSvg.setAttribute('stroke-width', '2');
    govSvg.setAttribute('aria-hidden', 'true');
    govSvg.innerHTML = '<circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>';
    const govStrong = document.createElement('strong');
    govStrong.textContent = c.governor || '—';
    gov.append(govSvg, govStrong);

    card.append(header, bigGrid, facts, chipSection, gov);
    return card;
  });

  const cardWrap = document.createElement('div');
  cardWrap.className = 'cmp-cards';
  cardWrap.append(...cards);
  els.compareModalBody.replaceChildren(cardWrap);

  els.compareModal.classList.add('open');
  els.compareModal.setAttribute('aria-hidden', 'false');
  els.compareModalClose.focus();
  createFocusTrap(els.compareModal);
}

function closeCompareModal() {
  els.compareModal.classList.remove('open');
  els.compareModal.setAttribute('aria-hidden', 'true');
  els.compareGoBtn.focus();
}

els.compareModalClose.addEventListener('click', closeCompareModal);
els.compareModal.addEventListener('click', e => {
  if (e.target === els.compareModal) closeCompareModal();
});

// ── BRAND — reset to home ────────────────────────────────────────────────────
function resetHome() {
  selectedCounty = null;
  d3.selectAll('.county-path').classed('selected', false);
  els.countyPanel.classList.remove('active');
  els.placeholder.hidden = false;

  const url = new URL(window.location.href);
  url.searchParams.delete('county');
  history.replaceState(null, '', url.toString());

  if (isMobile()) setSheet('peek');
}

els.brand.addEventListener('click', resetHome);
els.brand.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') resetHome(); });

// ══════════════════════════════════════════════════════════════════════════════
// ONBOARDING SYSTEM
// ══════════════════════════════════════════════════════════════════════════════
// FIX: The original code redefined createFocusTrap() a second time inside the
// onboarding section. ES modules run in strict mode, where duplicate function
// declarations in the same scope are a SyntaxError — crashing the entire
// module before any code executes. The onboarding version is now named
// createModalFocusTrap() and its one call site inside openOnboarding() is
// updated to match.
// ══════════════════════════════════════════════════════════════════════════════

const ONBOARDING_STORAGE_KEY = 'kenya_county_onboarding_seen';

let currentStep = 0;
let totalSteps  = 0;
let onboardingFocusTrapHandler = null;

/**
 * createModalFocusTrap(container, selector?)
 * Generic focus trap used exclusively by the onboarding modal.
 * Renamed from createFocusTrap to avoid the duplicate-declaration SyntaxError.
 */
function createModalFocusTrap(container, selector) {
  const SEL = selector || [
    'button:not([disabled])',
    '[href]',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(', ');

  return function handleTrapKey(e) {
    if (e.key !== 'Tab') return;
    const focusable = Array.from(container.querySelectorAll(SEL));
    if (!focusable.length) return;
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };
}

// Step accent colours
const STEP_ACCENTS = ['#1e4a8a', '#0d7a55', '#b45309'];

function updateProgressBar(step, total) {
  const fill = document.getElementById('onboarding-progress-fill');
  if (!fill) return;
  const pct = Math.round(((step + 1) / total) * 100);
  fill.style.width      = pct + '%';
  fill.style.background = STEP_ACCENTS[step] || 'var(--accent)';

  const bar = fill.closest('[role="progressbar"]');
  if (bar) bar.setAttribute('aria-valuenow', pct);
}

function updateButtonAccent(modal, step) {
  modal.querySelectorAll('.onboarding-btn-primary').forEach(btn => {
    btn.style.background = STEP_ACCENTS[step] || '';
    btn.style.boxShadow  = '';
  });
}

function openOnboarding() {
  const modal = document.getElementById('onboarding-modal');
  if (!modal) return;

  totalSteps  = modal.querySelectorAll('.onboarding-step').length;
  currentStep = 0;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');

  showStep(0);
  createOnboardingDots(modal);

  // ── FIX: use createModalFocusTrap (not the now-removed duplicate) ──
  if (onboardingFocusTrapHandler) {
    modal.removeEventListener('keydown', onboardingFocusTrapHandler);
  }
  onboardingFocusTrapHandler = createModalFocusTrap(modal);
  modal.addEventListener('keydown', onboardingFocusTrapHandler);

  document.body.style.overflow = 'hidden';

  const firstFocusable = modal.querySelector(
    'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
  );
  if (firstFocusable) firstFocusable.focus();
}

function closeOnboarding() {
  const modal = document.getElementById('onboarding-modal');
  if (!modal) return;

  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  localStorage.setItem(ONBOARDING_STORAGE_KEY, 'true');

  if (onboardingFocusTrapHandler) {
    modal.removeEventListener('keydown', onboardingFocusTrapHandler);
    onboardingFocusTrapHandler = null;
  }

  document.body.style.overflow = '';
  document.getElementById('btn-tour')?.focus();
}

function showStep(step) {
  const modal = document.getElementById('onboarding-modal');
  if (!modal) return;

  const steps = modal.querySelectorAll('.onboarding-step');
  const dots  = modal.querySelectorAll('.onboarding-dot');

  steps.forEach((s, i) => s.classList.toggle('active', i === step));

  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === step);
    dot.setAttribute('aria-selected', i === step ? 'true' : 'false');
    dot.setAttribute('aria-label', `Go to step ${i + 1} of ${totalSteps}`);
  });

  currentStep = step;
  updateProgressBar(step, totalSteps);
  updateButtonAccent(modal, step);

  if (step === 1) {
    const demo = modal.querySelector('.ob-search-demo');
    if (demo) {
      demo.style.animation = 'none';
      void demo.offsetWidth;
      demo.style.animation = '';
      modal.querySelectorAll('.ob-result').forEach(el => {
        el.style.animation = 'none';
        void el.offsetWidth;
        el.style.animation = '';
      });
    }
  }

  modal.setAttribute(
    'aria-label',
    `Tour step ${step + 1} of ${totalSteps}: ${
      modal.querySelector(`.onboarding-step[data-step="${step}"] h2`)?.textContent || ''
    }`
  );
}

function nextStep() {
  if (currentStep < totalSteps - 1) {
    showStep(currentStep + 1);
  } else {
    closeOnboarding();
  }
}

function prevStep() {
  if (currentStep > 0) {
    showStep(currentStep - 1);
  }
}

function createOnboardingDots(modal) {
  modal.querySelectorAll('.onboarding-dots').forEach(container => {
    container.innerHTML = '';
    container.setAttribute('role', 'tablist');
    container.setAttribute('aria-label', 'Tour steps');

    for (let i = 0; i < totalSteps; i++) {
      const dot = document.createElement('div');
      dot.className          = 'onboarding-dot' + (i === currentStep ? ' active' : '');
      dot.setAttribute('role',          'tab');
      dot.setAttribute('tabindex',      i === currentStep ? '0' : '-1');
      dot.setAttribute('aria-selected', i === currentStep ? 'true' : 'false');
      dot.setAttribute('aria-label',    `Step ${i + 1} of ${totalSteps}`);

      dot.addEventListener('click', () => showStep(i));

      dot.addEventListener('keydown', e => {
        if (e.key === 'ArrowRight') { e.preventDefault(); showStep(Math.min(i + 1, totalSteps - 1)); }
        if (e.key === 'ArrowLeft')  { e.preventDefault(); showStep(Math.max(i - 1, 0)); }
      });

      container.appendChild(dot);
    }
  });
}

function bindOnboardingEvents() {
  const modal = document.getElementById('onboarding-modal');
  if (!modal) return;

  document.getElementById('onboarding-close')?.addEventListener('click', closeOnboarding);
  document.getElementById('onboarding-done')?.addEventListener('click', closeOnboarding);

  modal.querySelectorAll('[data-next]').forEach(btn =>
    btn.addEventListener('click', nextStep)
  );
  modal.querySelectorAll('[data-prev]').forEach(btn =>
    btn.addEventListener('click', prevStep)
  );

  modal.addEventListener('click', e => {
    if (e.target === modal) closeOnboarding();
  });

  modal.addEventListener('keydown', e => {
    if (e.key === 'Escape') { e.stopPropagation(); closeOnboarding(); }
  });

  document.getElementById('btn-tour')?.addEventListener('click', () => {
    localStorage.removeItem(ONBOARDING_STORAGE_KEY);
    openOnboarding();
  });
}

function initOnboarding() {
  if (!localStorage.getItem(ONBOARDING_STORAGE_KEY)) {
    openOnboarding();
  }
}

let onboardingInitialized = false;

function tryInitOnboarding() {
  if (onboardingInitialized) return;
  if (!document.getElementById('onboarding-modal')) return;

  onboardingInitialized = true;
  bindOnboardingEvents();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', tryInitOnboarding);
} else {
  tryInitOnboarding();
}

// Triggered by main.js after the GeoJSON map finishes loading.
window.addEventListener('mapready', initOnboarding, { once: true });

// Fallback: if mapready never fires, open onboarding after 1.5s.
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    if (!onboardingInitialized) return;
    if (!localStorage.getItem(ONBOARDING_STORAGE_KEY)) {
      openOnboarding();
    }
  }, 1500);
}, { once: true });