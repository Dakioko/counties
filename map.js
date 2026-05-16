/**
 * map.js
 * Handles all D3 SVG map rendering, zoom, county path interactions,
 * and the GeoJSON fetch (with retry and sessionStorage caching).
 *
 * Exports: initMap, g, zoom, findMatch, updatePinnedPaths, toTitle
 *
 * Circular dependency resolved: map.js no longer imports ui.js.
 * Instead, callers pass an onCountyClick callback to initMap().
 * main.js wires map.js and ui.js together.
 */

import { countiesData, REGION_COLORS } from './counties.js';

// ── CONSTANTS ──────────────────────────────────────────────────────────────
const GEOJSON_URL       = 'https://cdn.jsdelivr.net/gh/mikelmaron/kenya-election-data@master/data/counties.geojson';

// Cache key versioned by a hash of the source URL — changing the URL
// automatically busts the cache without manual version bumps.
const _urlHash = GEOJSON_URL.split('').reduce((h, c) => (Math.imul(31, h) + c.charCodeAt(0)) | 0, 0);
const GEOJSON_CACHE_KEY = `kenya_counties_geojson_${(_urlHash >>> 0).toString(36)}`;

// ── ELEMENTS ───────────────────────────────────────────────────────────────
const mapWrap = document.getElementById('map-wrap');
const svgEl   = d3.select('#svg-map');
const tip     = document.getElementById('hover-tip');

/** Transform group that zoom acts on. Exported for use in ui.js (find-path loops). */
export const g = svgEl.append('g');

const isTouchDevice = window.matchMedia('(hover: none)').matches;

// ── PROJECTION & PATH ──────────────────────────────────────────────────────
const projection = d3.geoMercator().center([37.9, 0.1]);
const path       = d3.geoPath().projection(projection);

function updateMapSize() {
  const w = mapWrap.offsetWidth;
  const h = mapWrap.offsetHeight;
  projection.translate([w / 2, h / 2]);
  /*projection.scale(h * (w < 480 ? 2.8 : w < 768 ? 3.2 : w < 1024 ? 3.8 : 4.5));*/
  projection.scale(h * (w < 480 ? 3.2 : w < 768 ? 3.8 : w < 1024 ? 5.0 : 6.0));
}
updateMapSize();

// ── ZOOM ───────────────────────────────────────────────────────────────────
export const zoom = d3.zoom()
  .scaleExtent([0.8, 8])
  .on('zoom', e => g.attr('transform', e.transform));

svgEl.call(zoom).on('dblclick.zoom', null);

document.getElementById('btn-reset-zoom').addEventListener('click', () => {
  svgEl.transition().duration(500).call(zoom.transform, d3.zoomIdentity);
});

// ── HELPERS ────────────────────────────────────────────────────────────────
export function toTitle(s) {
  return s.toLowerCase().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function getRawName(d) {
  return d.properties.COUNTY_NAM || d.properties.COUNTY || d.properties.name || '';
}

function normalise(s) {
  return s.toLowerCase().replace(/[^a-z0-9]/g, '');
}

// ── PRE-COMPUTED MATCH CACHE ───────────────────────────────────────────────
// Built once after GeoJSON loads. Avoids O(n) loop on every mousemove/click.
let _matchCache = null; // Map<GeoJSON feature, county object | null>

function buildMatchCache(features) {
  _matchCache = new Map();
  // Pre-normalise all county keys once
  const normalisedKeys = Object.keys(countiesData).map(k => ({
    key: k,
    norm: normalise(k),
  }));

  features.forEach(feature => {
    let raw = normalise(getRawName(feature));

    // Aliases for GeoJSON name variants
    if (raw.includes('keiyo') || raw.includes('elgeyo') || raw.includes('marakwet')) {
      raw = 'elgeyomarakwet';
    }

    const match = normalisedKeys.find(({ norm }) => norm === raw);
    _matchCache.set(
      feature,
      match ? { name: match.key, ...countiesData[match.key] } : null
    );
  });
}

/**
 * findMatch(d)
 * Maps a GeoJSON feature → countiesData entry using the pre-computed cache.
 * Falls back to a live loop before the cache is ready (e.g. during load).
 */
export function findMatch(d) {
  if (_matchCache) return _matchCache.get(d) ?? null;

  // Fallback (pre-cache): live O(n) loop
  let raw = normalise(getRawName(d));
  if (raw.includes('keiyo') || raw.includes('elgeyo') || raw.includes('marakwet')) {
    raw = 'elgeyomarakwet';
  }
  for (const key in countiesData) {
    if (normalise(key) === raw) return { name: key, ...countiesData[key] };
  }
  return null;
}

// ── PINNED PATH HIGHLIGHTS ─────────────────────────────────────────────────
export function updatePinnedPaths(pinnedCounties, selectedName) {
  g.selectAll('path').each(function(d) {
    const m = findMatch(d);
    d3.select(this).classed(
      'pinned-path',
      !!(m && pinnedCounties.includes(m.name) && m.name !== selectedName)
    );
  });
}

// ── GEOJSON FETCH — sessionStorage cache + timeout ────────────────────────
const FETCH_TIMEOUT_MS = 10_000;

async function fetchGeoJSON() {
  // Try sessionStorage first for instant repeat-visit loads
  try {
    const cached = sessionStorage.getItem(GEOJSON_CACHE_KEY);
    if (cached) return JSON.parse(cached);
  } catch { /* quota exceeded or parse error — fall through to network */ }

  // Race the fetch against a 10-second timeout
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  let res;
  try {
    res = await fetch(GEOJSON_URL, { signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }

  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();

  try { sessionStorage.setItem(GEOJSON_CACHE_KEY, JSON.stringify(data)); } catch { /* quota — skip cache */ }
  return data;
}

// ── SPINNER HELPERS ────────────────────────────────────────────────────────────
function showSpinner() {
  const el = document.createElement('div');
  el.className = 'map-spinner';
  el.setAttribute('role', 'status');
  el.setAttribute('aria-label', 'Loading map');
  el.innerHTML = '<div class="map-spinner-ring" aria-hidden="true"></div>'
               + '<div class="map-spinner-label" aria-hidden="true">Loading map…</div>';
  mapWrap.appendChild(el);
  return el;
}

function removeSpinner(el) {
  el?.remove();
}

// ── INITMAP — entry point called by main.js ───────────────────────────────
/**
 * initMap(onCountyClick)
 * Fetches GeoJSON, renders county paths, and calls onCountyClick(countyData, pathEl)
 * when a county is activated. Also handles deep-link on load.
 *
 * @param {(data: object, el: SVGPathElement|null) => void} onCountyClick
 */
export function initMap(onCountyClick) {
  mapWrap.classList.add('loading');
  const spinner = showSpinner();

  return fetchGeoJSON()
    .then(geoData => {
      mapWrap.classList.remove('loading');
      removeSpinner(spinner);
      buildMatchCache(geoData.features);
      renderPaths(geoData.features, onCountyClick);
      handleDeepLink(onCountyClick);
    })
    .catch(err => {
      console.error('[map] GeoJSON fetch failed:', err);
      mapWrap.classList.remove('loading');
      removeSpinner(spinner);
      showMapError(() => initMap(onCountyClick));
    });
}

// ── RENDER PATHS ───────────────────────────────────────────────────────────
function renderPaths(features, onCountyClick) {
  g.selectAll('path')
    .data(features)
    .enter().append('path')
      .attr('d', path)
      .attr('class', 'county-path')
      .attr('fill', d => {
        const m = findMatch(d);
        return m ? (REGION_COLORS[m.region] || '#cbd5e1') : '#cbd5e1';
      })
      .attr('tabindex', '0')
      .attr('role', 'button')
      .attr('aria-label', d => {
        const m = findMatch(d);
        return m
          ? `${m.name} County, ${m.region} region. Population ${m.pop}. Press Enter to explore.`
          : toTitle(getRawName(d));
      })
      .on('mouseover', (e, d) => {
        if (isTouchDevice) return;
        const m = findMatch(d);
        tip.textContent = m ? m.name : toTitle(getRawName(d));
        tip.style.display = 'block';
      })
      .on('mousemove', e => {
        if (isTouchDevice) return;
        tip.style.left = (e.offsetX + 14) + 'px';
        tip.style.top  = (e.offsetY - 10) + 'px';
      })
      .on('mouseout', () => { tip.style.display = 'none'; })
      .on('click', function(e, d) {
        const m = findMatch(d);
        if (m) onCountyClick(m, this);
      })
      .on('keydown', function(e, d) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const m = findMatch(d);
          if (m) onCountyClick(m, this);
        }
      });
}

// ── DEEP LINK ──────────────────────────────────────────────────────────────
function handleDeepLink(onCountyClick) {
  const param = new URLSearchParams(window.location.search).get('county');
  if (!param || !countiesData[param]) return;

  const data = { name: param, ...countiesData[param] };
  let pathEl = null;
  g.selectAll('path').each(function(d) {
    if (findMatch(d)?.name === param) pathEl = this;
  });
  onCountyClick(data, pathEl);
}

// ── ERROR STATE ────────────────────────────────────────────────────────────
function showMapError(onRetry) {
  const errEl = document.createElement('div');
  errEl.className = 'map-error';
  errEl.setAttribute('role', 'alert');

  const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  icon.setAttribute('width', '24'); icon.setAttribute('height', '24');
  icon.setAttribute('viewBox', '0 0 24 24');
  icon.setAttribute('fill', 'none');
  icon.setAttribute('stroke', 'currentColor');
  icon.setAttribute('stroke-width', '1.5');
  icon.setAttribute('aria-hidden', 'true');
  icon.innerHTML = '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>';

  const msg  = document.createElement('span');
  msg.textContent = 'Could not load the map. Check your connection and ';

  const btn  = document.createElement('button');
  btn.className = 'map-error-retry';
  btn.textContent = 'try again';
  btn.addEventListener('click', () => { errEl.remove(); onRetry(); });

  msg.appendChild(btn);
  errEl.append(icon, msg);
  mapWrap.appendChild(errEl);
}

// ── DEBOUNCED RESIZE ───────────────────────────────────────────────────────
let _resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(_resizeTimer);
  _resizeTimer = setTimeout(() => {
    updateMapSize();
    if (g.selectAll('path').size() > 0) {
      g.selectAll('path').attr('d', path);
    }
  }, 150);
});