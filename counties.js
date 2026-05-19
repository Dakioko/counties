/**
 * counties.js
 * Thin async loader for county data.
 *
 * All static data now lives in counties.json — edit that file to update
 * county records, GCP figures, governor names, etc. without touching code.
 *
 * Exports (all populated after loadCounties() resolves):
 *   countiesData       — { [countyName]: CountyObject }
 *   REGION_COLORS      — { [regionName]: hexColor }
 *   KENYA_POP_MILLIONS — number
 *   parseGcpValue      — (str) => number
 *   validateCounty     — (name, data) => void
 *   loadCounties       — () => Promise<void>
 */

const DATA_URL      = './counties.json';
const CACHE_KEY     = 'kenya_counties_data_v1';
const FETCH_TIMEOUT = 8_000;

// Mutable exports populated by loadCounties()
export let countiesData       = {};
export let REGION_COLORS      = {};
export let KENYA_POP_MILLIONS = 55;

export function parseGcpValue(gcpStr) {
  if (!gcpStr) return 0;
  const cleaned = gcpStr.replace(/[^0-9.,]/g, '').replace(/,/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

const REQUIRED_FIELDS = [
  'code','cap','pop','popM','area','region','governor',
  'known','funfact','landmarks','industries','gcp','gcpTier',
  'gcpHighlights','geo','connectivity','subcounties',
];
export function validateCounty(name, data) {
  for (const field of REQUIRED_FIELDS) {
    if (data[field] === undefined || data[field] === null)
      console.warn(`[counties] "${name}" missing field: "${field}"`);
  }
}

async function fetchData() {
  try {
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) return JSON.parse(cached);
  } catch { /* fall through */ }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT);
  let res;
  try {
    res = await fetch(DATA_URL, { signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
  if (!res.ok) throw new Error(`HTTP ${res.status} loading counties.json`);
  const data = await res.json();
  try { sessionStorage.setItem(CACHE_KEY, JSON.stringify(data)); } catch { /* quota */ }
  return data;
}

export async function loadCounties() {
  const data = await fetchData();
  Object.assign(countiesData, data.counties);
  Object.assign(REGION_COLORS, data.regionColors);
  KENYA_POP_MILLIONS = data.kenyaPopMillions ?? 55;
  Object.entries(countiesData).forEach(([name, d]) => validateCounty(name, d));
}