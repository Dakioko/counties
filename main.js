/**
 * main.js
 * Entry point. Wires map.js and ui.js together.
 *
 * Neither map.js nor ui.js imports the other — this module is the only
 * place that knows about both, resolving the circular dependency entirely.
 *
 * Change from original: initMap now returns its promise chain so we can
 * dispatch the 'mapready' event that triggers the onboarding modal.
 * This replaces the old fragile setTimeout(500) in ui.js.
 */

import { initMap, g, findMatch, updatePinnedPaths } from './map.js';
import { connectMap, showCounty } from './ui.js';

// Give ui.js its read-only handle on the map module's exports.
connectMap({ g, findMatch, updatePinnedPaths });

// Start the map, passing showCounty as the county-click callback.
// Once the GeoJSON is loaded and paths are rendered, fire 'mapready'
// so the onboarding modal knows the page is genuinely ready to use.
initMap(showCounty).then(() => {
  window.dispatchEvent(new CustomEvent('mapready'));
}).catch(() => {
  // Map failed to load — still fire mapready so onboarding isn't blocked.
  // The map itself will show its own error/retry UI.
  window.dispatchEvent(new CustomEvent('mapready'));
});