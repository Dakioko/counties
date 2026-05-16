/**
 * ui.js
 * All UI interactions: county panel rendering, tabs, command palette,
 * compare bar/modal, CSV export, share (URL deep-link),
 * mobile sheet, focus trapping, toast notifications, and keyboard navigation.
 *
 * Changes from original:
 * - Removed: about drawer, about overlay, btn-about, btn-tour, onboarding system
 * - Added: cycling did-you-know with fade transition (setDailyHighlight)
 * - Timer pauses when placeholder is hidden, resumes on reset
 */

import { countiesData, REGION_COLORS, KENYA_POP_MILLIONS, parseGcpValue } from './counties.js';

// ── MAP BRIDGE ──────────────────────────────────────────────────────────────
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

// ── Backdrop element (tap to collapse sheet) ──────────────────────────────────
const sheetBackdrop = document.createElement('div');
sheetBackdrop.id = 'sheet-backdrop';
sheetBackdrop.setAttribute('aria-hidden', 'true');
document.getElementById('main')?.appendChild(sheetBackdrop);

sheetBackdrop.addEventListener('click', () => {
  if (sheetState === 'open') setSheet('mid');
  else if (sheetState === 'mid') setSheet('peek');
});

function updateBackdrop(state) {
  // Show backdrop only when sheet is mid or open so map is partially/fully covered
  sheetBackdrop.classList.toggle('visible', state === 'open' || state === 'mid');
  // Stronger opacity when fully open
  sheetBackdrop.classList.toggle('full', state === 'open');
}

function setSheet(state, animate = true) {
  // Clear any in-progress inline transform so CSS transition takes over cleanly
  els.sidebar.style.transition = '';
  els.sidebar.style.transform  = '';

  sheetState = state;
  els.sidebar.classList.remove('sheet-peek', 'sheet-mid', 'sheet-open');
  if (state !== 'hidden') els.sidebar.classList.add(`sheet-${state}`);
  updateBackdrop(state);
}

// On first mobile load: start at peek, then after a short delay bounce to hint
// that the sheet is draggable
if (isMobile()) {
  setSheet('peek');
  setTimeout(() => {
    if (sheetState === 'peek') {
      els.sidebar.classList.add('sheet-bounce-hint');
      els.sidebar.addEventListener('animationend', () => {
        els.sidebar.classList.remove('sheet-bounce-hint');
      }, { once: true });
    }
  }, 1200);
}

function setMobBtnVisible(_visible) {}

els.sheetExpandBtn?.addEventListener('click', () => {
  if (sheetState === 'open') {
    setSheet('mid');
    setMobBtnVisible(!!selectedCounty);
  } else {
    setSheet('open');
    setMobBtnVisible(false);
  }
});

// ── Peek teaser: show county name (or placeholder title) in the handle strip ──
function updatePeekTeaser(countyName) {
  let teaser = document.getElementById('sheet-peek-teaser');
  if (!teaser) {
    teaser = document.createElement('div');
    teaser.id = 'sheet-peek-teaser';
    teaser.setAttribute('aria-hidden', 'true');
    // Insert after the handle bar inside sheetHandle
    const bar = els.sheetHandle?.querySelector('.sheet-handle-bar');
    bar?.insertAdjacentElement('afterend', teaser);
  }
  teaser.textContent = countyName || "Kenya's 47 Counties";
}

// Initialise teaser on load
updatePeekTeaser(null);

// ── Drag handling ─────────────────────────────────────────────────────────────
let dragStartY      = 0;
let dragStartState  = 'peek';
let isDragging      = false;
let lastTouchY      = 0;
let lastTouchTime   = 0;
let dragVelocity    = 0; // px/ms — positive = downward

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
  lastTouchY     = dragStartY;
  lastTouchTime  = Date.now();
  dragVelocity   = 0;
  dragStartState = sheetState;
  isDragging     = true;
  // Suspend CSS transition during finger drag for 1:1 tracking
  els.sidebar.style.transition = 'none';
}, { passive: true });

els.sheetHandle?.addEventListener('touchmove', e => {
  if (!isDragging) return;
  const now    = Date.now();
  const touchY = e.touches[0].clientY;

  // Rolling velocity (px/ms), positive = moving down
  const dt = now - lastTouchTime;
  if (dt > 0) dragVelocity = (touchY - lastTouchY) / dt;
  lastTouchY    = touchY;
  lastTouchTime = now;

  const deltaY = touchY - dragStartY;
  const baseY  = sheetStateY(dragStartState);
  const sheetH = els.sidebar.offsetHeight;
  const peekH  = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sheet-peek'), 10) || 200;
  const newY   = Math.min(sheetH - peekH, Math.max(0, baseY + deltaY));
  els.sidebar.style.transform = `translateY(${newY}px)`;
}, { passive: true });

els.sheetHandle?.addEventListener('touchend', e => {
  if (!isDragging) return;
  isDragging = false;

  // Re-enable CSS transition before snapping
  els.sidebar.style.transition = '';
  els.sidebar.style.transform  = '';

  const deltaY = e.changedTouches[0].clientY - dragStartY;
  const DIST_THRESHOLD     = 60;   // px — raised from 40 to avoid accidental state changes
  const VELOCITY_THRESHOLD = 0.4;  // px/ms — fast flick always changes state

  const isFastFlickUp   = dragVelocity < -VELOCITY_THRESHOLD;
  const isFastFlickDown = dragVelocity >  VELOCITY_THRESHOLD;
  const isSwipeUp       = deltaY < -DIST_THRESHOLD;
  const isSwipeDown     = deltaY >  DIST_THRESHOLD;

  if (isFastFlickUp || isSwipeUp) {
    // Swipe / flick upward → expand
    setSheet(dragStartState === 'peek' ? 'mid' : 'open');
    setMobBtnVisible(false);
  } else if (isFastFlickDown || isSwipeDown) {
    // Swipe / flick downward → collapse
    if (dragStartState === 'open') {
      setSheet('mid');
      setMobBtnVisible(!!selectedCounty);
    } else {
      setSheet('peek');
      setMobBtnVisible(!!selectedCounty);
    }
  } else {
    // Short drag — snap back to current state cleanly
    setSheet(dragStartState);
  }
}, { passive: true });

// ── DAILY HIGHLIGHT — cycling with fade ──────────────────────────────────────
const HIGHLIGHTS = [
  "Nairobi is the only capital city in the world with a national park within its boundaries.",
  "Lake Turkana is the world's largest permanent desert lake, stretching 290km from north to south.",
  "Lamu Old Town has been continuously inhabited for over 700 years and is a UNESCO World Heritage Site.",
  "Meru County produces over 90% of Kenya's miraa (khat), air-freighted daily to Somalia and beyond.",
  "The Great Wildebeest Migration through Narok's Maasai Mara is considered the greatest wildlife show on earth.",
  "Kisii soapstone, found only in Kisii County, is hand-carved into sculptures sold on five continents.",
  "Iten in Elgeyo Marakwet has produced more Olympic marathon medals than most countries combined.",
  "Fort Jesus in Mombasa, built by the Portuguese in 1593, changed hands nine times across colonial powers.",
  "Laikipia has more black rhinos than any place outside a national park in Africa.",
  "Kakamega Forest is East Africa's last remaining fragment of the ancient Congo Basin rainforest.",
  "Nyandarua supplies roughly 40% of Kenya's total potato production.",
  "Barack Obama's father was born in Kogelo village, Siaya County.",
  "Cars are almost entirely banned on Lamu Island — donkeys and boats are the primary modes of transport.",
  "The Busia border crossing handles over 700 trucks daily, making it East Africa's busiest land border.",
  "Kirinyaga's Mwea Irrigation Scheme produces over 80% of Kenya's locally grown rice.",
  "Marsabit's Lake Turkana Wind Power project (310MW) is Africa's largest wind farm.",
  "The Nandi resisted British colonial advance for over a decade — longer than any other community in sub-Saharan Africa.",
  "Makueni was the first county in Kenya to implement a universal health care scheme at county level.",
  "Samburu National Reserve is the only place in Kenya to see all five of the 'Samburu Special' animals.",
  "Turkana County contains the world's largest known field of fossil hominid remains at Sibiloi National Park.",
];

let _highlightTimer  = null;
let _highlightIndex  = 0;

function cycleHighlight() {
  const el = document.getElementById('ph-highlight-text');
  if (!el || els.placeholder.hidden) return;

  el.style.opacity = '0';
  setTimeout(() => {
    el.textContent = HIGHLIGHTS[_highlightIndex];
    el.style.opacity = '1';
    _highlightIndex = (_highlightIndex + 1) % HIGHLIGHTS.length;
  }, 600);
}

export function setDailyHighlight() {
  const el = document.getElementById('ph-highlight-text');
  if (!el) return;

  // Start from today's index for consistency on first load
  const now      = new Date();
  const start    = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now - start) / 86_400_000);
  _highlightIndex = dayOfYear % HIGHLIGHTS.length;

  // Show first fact immediately, no fade
  el.textContent  = HIGHLIGHTS[_highlightIndex];
  el.style.opacity = '1';
  _highlightIndex = (_highlightIndex + 1) % HIGHLIGHTS.length;

  // Clear any existing timer before starting
  if (_highlightTimer) clearInterval(_highlightTimer);
  _highlightTimer = setInterval(cycleHighlight, 8000);
}

function stopHighlightCycle() {
  if (_highlightTimer) {
    clearInterval(_highlightTimer);
    _highlightTimer = null;
  }
}

// ── SHOW COUNTY ──────────────────────────────────────────────────────────────
export function showCounty(data, mapPathEl) {
  selectedCounty = data;

  // Stop cycling when county panel is visible
  stopHighlightCycle();

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

  const gcpNum      = parseGcpValue(data.gcp);
  const GCP_MAX_LOG = Math.log(2100 + 1);
  const gcpPct      = gcpNum > 0
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
    high: { cls: 'tier-high', txt: 'High GCP'   },
    mid:  { cls: 'tier-mid',  txt: 'Mid GCP'    },
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
    { label: 'Terrain',   val: geo.terrain    },
    { label: 'Climate',   val: geo.climate    },
    { label: 'Elevation', val: geo.elevation  },
    { label: 'Borders',   val: geo.neighbours },
  ].filter(f => f.val);

  const geoCells = geoFields.map(f => {
    const cell = document.createElement('div');
    cell.className = 'geo-cell';
    const dt = document.createElement('dt');
    dt.className   = 'geo-label';
    dt.textContent = f.label;
    const dd = document.createElement('dd');
    dd.className   = 'geo-val';
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
    updatePeekTeaser(data.name);
    if (sheetState === 'mid') {
      // Already mid — briefly dip to peek then snap back so the user
      // feels that the content has changed (tactile snap feedback)
      els.sidebar.classList.remove('sheet-mid');
      els.sidebar.classList.add('sheet-peek');
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          els.sidebar.classList.remove('sheet-peek');
          els.sidebar.classList.add('sheet-mid');
          sheetState = 'mid';
          updateBackdrop('mid');
        });
      });
    } else {
      setSheet('mid');
    }
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
  if (els.compareModal.classList.contains('open')) { closeCompareModal(); return; }
});

// ── CSV EXPORT ───────────────────────────────────────────────────────────────
els.btnCsv.addEventListener('click', () => {
  if (!selectedCounty) return;
  const d = selectedCounty;
  const rows = [
    ['Field', 'Value'],
    ['County',                    d.name],
    ['Code',                      d.code],
    ['County HQ',                 d.cap],
    ['Population',                d.pop],
    ['Area (km²)',                d.area],
    ['Population Density (/km²)', calcDensity(d)],
    ['Governor',                  d.governor],
    ['GCP',                       d.gcp],
    ['GCP Tier',                  d.gcpTier],
    ['Industries',                (d.industries  || []).join('; ')],
    ['Notable Places',            (d.landmarks   || []).join('; ')],
    ['Sub-Counties',              (d.subcounties || []).join('; ')],
    ['About',                     d.known],
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
let cmdCursor = -1; // index of the currently highlighted result item (-1 = none)

// Returns all navigable .cmd-item elements currently rendered in the results list
function getCmdItems() {
  return Array.from(els.cmdResults.querySelectorAll('.cmd-item'));
}

// Apply or remove the keyboard-highlight class on a specific item index,
// scroll it into view, and update aria-activedescendant on the input
function setCmdCursor(index) {
  const items = getCmdItems();
  // Clamp with wrap-around
  if (items.length === 0) { cmdCursor = -1; return; }
  cmdCursor = (index + items.length) % items.length;

  items.forEach((item, i) => {
    const active = i === cmdCursor;
    item.classList.toggle('cmd-item--active', active);
    item.setAttribute('aria-selected', String(active));
    if (active) {
      // Keep the highlighted item visible without jarring full-page scroll
      item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      // Let screen readers announce which item is active
      els.cmdInput.setAttribute('aria-activedescendant', item.id || '');
    }
  });
}

function openCmd() {
  cmdCursor = -1;
  els.cmdOverlay.classList.add('open');
  els.cmdOverlay.setAttribute('aria-hidden', 'false');
  els.cmdInput.focus();
  renderCmd('');
  createFocusTrap(els.cmdOverlay);
}

function closeCmd() {
  cmdCursor = -1;
  els.cmdOverlay.classList.remove('open');
  els.cmdOverlay.setAttribute('aria-hidden', 'true');
  els.cmdInput.value = '';
  els.cmdInput.removeAttribute('aria-activedescendant');
  els.navSearchTrigger.focus();
}

// Arrow-key / Enter handling on the search input
els.cmdInput.addEventListener('keydown', e => {
  const items = getCmdItems();
  if (!items.length) return;

  if (e.key === 'ArrowDown') {
    e.preventDefault(); // stop the cursor jumping inside the input
    setCmdCursor(cmdCursor + 1);
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    setCmdCursor(cmdCursor - 1);
  } else if (e.key === 'Enter') {
    e.preventDefault();
    if (cmdCursor >= 0 && items[cmdCursor]) {
      items[cmdCursor].click(); // re-use the existing activate() handler
    }
  }
});

els.navSearchTrigger.addEventListener('click', openCmd);
els.navSearchTrigger.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') openCmd(); });
els.mobSearchBtn?.addEventListener('click', openCmd);
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
    c.known    || '',
    (c.industries || []).join(' '),
    (c.landmarks  || []).join(' '),
  ].join(' ').toLowerCase().replace(/[^a-z0-9 ]/g, '');

  return q.split(/\s+/).filter(Boolean).every(word => haystack.includes(word));
}

function renderCmd(term) {
  const q = term.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
  const allCounties = Object.entries(countiesData).map(([name, d]) => ({ name, ...d }));
  const filtered    = allCounties.filter(c => countyMatchesQuery(c, q));

  // Reset cursor whenever the list changes so arrow keys start fresh from top
  cmdCursor = -1;
  els.cmdInput.removeAttribute('aria-activedescendant');

  if (!filtered.length) {
    const empty = document.createElement('div');
    empty.className   = 'cmd-empty';
    empty.textContent = 'No counties match your search.';
    els.cmdResults.replaceChildren(empty);
    return;
  }

  const labelEl = document.createElement('div');
  labelEl.className   = 'cmd-section-label';
  labelEl.textContent = q
    ? `${filtered.length} result${filtered.length !== 1 ? 's' : ''}`
    : 'All 47 Counties';

  const items = filtered.map((c, i) => {
    const item = document.createElement('div');
    item.className        = 'cmd-item';
    item.dataset.county   = c.name;
    item.id               = `cmd-item-${i}`; // stable ID for aria-activedescendant
    item.setAttribute('role',          'option');
    item.setAttribute('tabindex',      '0');
    item.setAttribute('aria-selected', 'false');

    const dot = document.createElement('div');
    dot.className        = 'cmd-dot';
    dot.style.background = REGION_COLORS[c.region] || '#cbd5e1';
    dot.setAttribute('aria-hidden', 'true');

    const main = document.createElement('div');
    main.className   = 'cmd-main';
    main.textContent = c.name;

    let subText = c.region;
    if (q) {
      const words = q.split(/\s+/).filter(Boolean);
      const hint  = [...(c.industries || []), ...(c.landmarks || [])].find(s =>
        words.some(w => s.toLowerCase().includes(w))
      );
      if (hint) subText = hint;
    }

    const sub = document.createElement('div');
    sub.className   = 'cmd-sub';
    sub.textContent = subText;

    item.append(dot, main, sub);

    const activate = () => {
      if (!countiesData[c.name]) return;
      const data   = { name: c.name, ...countiesData[c.name] };
      let pathEl   = null;
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

// ── COMPARE SYSTEM ───────────────────────────────────────────────────────────
function updatePinBtn(name) {
  const isPinned = pinnedCounties.includes(name);
  const atMax    = pinnedCounties.length >= 3 && !isPinned;

  els.btnPinCounty.classList.toggle('pinned', isPinned);
  els.btnPinCounty.setAttribute('aria-pressed', String(isPinned));
  els.btnPinCounty.title = atMax ? 'Remove a county to pin another (max 3)' : '';

  const svgNS    = 'http://www.w3.org/2000/svg';
  const starPath = 'M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2z';

  const svgIcon = document.createElementNS(svgNS, 'svg');
  svgIcon.setAttribute('width',        '11');
  svgIcon.setAttribute('height',       '11');
  svgIcon.setAttribute('viewBox',      '0 0 24 24');
  svgIcon.setAttribute('aria-hidden',  'true');
  svgIcon.setAttribute('fill',         isPinned ? 'currentColor' : 'none');
  svgIcon.setAttribute('stroke',       'currentColor');
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
    nameSpan.className   = 'compare-slot-name';
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
    const slot = document.createElement('div');
    slot.className = 'compare-slot';
    const hint = document.createElement('span');
    hint.className   = 'compare-slot-empty';
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

  const TIER_LABELS = { high: 'High GCP',  mid: 'Mid GCP',  low: 'Developing' };
  const TIER_COLORS = { high: '#166534',    mid: '#854d0e',  low: '#475569'    };
  const TIER_BG     = { high: '#dcfce7',    mid: '#fef9c3',  low: '#f1f5f9'    };

  const cards = counties.map(c => {
    const color = REGION_COLORS[c.region] || '#2563eb';
    const pct   = ((c.popM / KENYA_POP_MILLIONS) * 100).toFixed(2);

    const card = document.createElement('div');
    card.className = 'cmp-card';

    const band = document.createElement('div');
    band.className        = 'cmp-card-band';
    band.style.background = color;
    band.setAttribute('aria-hidden', 'true');

    const titleRow = document.createElement('div');
    titleRow.className = 'cmp-card-title-row';
    const nameEl = document.createElement('div');
    nameEl.className   = 'cmp-card-name';
    nameEl.textContent = c.name;
    const hqEl = document.createElement('div');
    hqEl.className   = 'cmp-card-hq';
    hqEl.textContent = `HQ: ${c.cap} · No. ${c.code}`;
    titleRow.append(nameEl, hqEl);

    const header = document.createElement('div');
    header.className = 'cmp-card-header';
    header.append(band, titleRow);

    const bigStats = [
      { label: 'Population',   val: c.pop,        accent: true },
      { label: 'GCP (est.)',   val: c.gcp                      },
      { label: 'Area km²',     val: c.area                     },
      { label: 'Density /km²', val: calcDensity(c)             },
    ].map(({ label, val, accent }) => {
      const cell = document.createElement('div');
      cell.className = 'cmp-big-cell' + (accent ? ' accent' : '');
      const lbl = document.createElement('div');
      lbl.className   = 'cmp-big-label';
      lbl.textContent = label;
      const v = document.createElement('div');
      v.className   = 'cmp-big-val' + (accent ? ' accent' : '');
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
    tierLbl.className   = 'cmp-fact-label';
    tierLbl.textContent = 'GCP tier';
    const tierBadge = document.createElement('span');
    Object.assign(tierBadge.style, {
      background: TIER_BG[c.gcpTier],   color: TIER_COLORS[c.gcpTier],
      padding: '2px 8px',               borderRadius: '4px',
      fontSize: '11px',                 fontWeight: '700',
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
      { label: '% of Kenya pop.', val: pct + '%'                          },
      { label: 'Sub-counties',    val: String(c.subcounties?.length ?? '—') },
      { label: 'Climate',         val: c.geo?.climate   || '—'            },
      { label: 'Elevation',       val: c.geo?.elevation || '—'            },
    ].forEach(({ label, val }) => {
      const row = document.createElement('div');
      row.className = 'cmp-fact-row';
      const l = document.createElement('span');
      l.className   = 'cmp-fact-label';
      l.textContent = label;
      const v = document.createElement('span');
      v.className   = 'cmp-fact-val';
      v.textContent = val;
      row.append(l, v);
      facts.appendChild(row);
    });

    const chipSection = document.createElement('div');
    chipSection.className = 'cmp-chip-section';
    const chipLabel = document.createElement('div');
    chipLabel.className   = 'cmp-chip-label';
    chipLabel.textContent = 'Key Industries';
    const chips = document.createElement('div');
    chips.className = 'cmp-chips';
    (c.industries || []).forEach(ind => {
      const chip = document.createElement('span');
      chip.className   = 'cmp-chip';
      chip.textContent = ind;
      chips.appendChild(chip);
    });
    chipSection.append(chipLabel, chips);

    const gov = document.createElement('div');
    gov.className = 'cmp-governor';
    const govSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    govSvg.setAttribute('width',        '12');
    govSvg.setAttribute('height',       '12');
    govSvg.setAttribute('viewBox',      '0 0 24 24');
    govSvg.setAttribute('fill',         'none');
    govSvg.setAttribute('stroke',       'currentColor');
    govSvg.setAttribute('stroke-width', '2');
    govSvg.setAttribute('aria-hidden',  'true');
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
  els.placeholder.classList.add('no-anim');

  const url = new URL(window.location.href);
  url.searchParams.delete('county');
  history.replaceState(null, '', url.toString());

  if (isMobile()) {
    updatePeekTeaser(null);
    setSheet('mid');
  }

  setDailyHighlight();
}

els.brand.addEventListener('click', resetHome);
els.brand.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') resetHome(); });

// ── INIT — triggered by main.js after map is ready ───────────────────────────
function populateCountyHighlights() {
  const statsGrid = document.getElementById('ph-stats-grid');
  if (!statsGrid) return;

  const counties = Object.entries(countiesData).map(([name, data]) => ({ name, ...data }));
  const parseNum = s => parseFloat((s || '0').replace(/,/g, '')) || 0;

  const largestPop  = [...counties].sort((a, b) => b.popM - a.popM)[0];
  const largestArea = [...counties].sort((a, b) => parseNum(b.area) - parseNum(a.area))[0];
  const highestGcp  = [...counties].sort((a, b) => parseGcpValue(b.gcp) - parseGcpValue(a.gcp))[0];
  const densest     = [...counties].sort((a, b) => {
    const densA = a.popM * 1_000_000 / parseNum(a.area);
    const densB = b.popM * 1_000_000 / parseNum(b.area);
    return densB - densA;
  })[0];

  statsGrid.innerHTML = `
    <div class="ph-stat-item">
      <span class="ph-stat-item-label">Largest Population</span>
      <span class="ph-stat-item-value highlight">${largestPop.name} (${largestPop.pop})</span>
    </div>
    <div class="ph-stat-item">
      <span class="ph-stat-item-label">Largest Area</span>
      <span class="ph-stat-item-value highlight">${largestArea.name} (${largestArea.area} km²)</span>
    </div>
    <div class="ph-stat-item">
      <span class="ph-stat-item-label">Highest GCP</span>
      <span class="ph-stat-item-value highlight">${highestGcp.name} (${highestGcp.gcp})</span>
    </div>
    <div class="ph-stat-item">
      <span class="ph-stat-item-label">Most Dense</span>
      <span class="ph-stat-item-value highlight">${densest.name}</span>
    </div>
  `;
}

// Single mapready handler — was duplicated before, causing setDailyHighlight() to run twice
window.addEventListener('mapready', () => {
  setDailyHighlight();
  populateCountyHighlights();
}, { once: true });

// Fallback: if mapready never fires (e.g. GeoJSON blocked), still initialise the highlight
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    if (!document.getElementById('ph-highlight-text')?.textContent) {
      setDailyHighlight();
    }
  }, 1500);
}, { once: true });