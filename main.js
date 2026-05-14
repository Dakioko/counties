/**
 * main.js
 * Entry point. Wires map.js and ui.js together.
 *
 * Neither map.js nor ui.js imports the other — this module is the only
 * place that knows about both, resolving the circular dependency entirely.
 */

import { initMap, g, findMatch, updatePinnedPaths } from './map.js';
import { connectMap, showCounty } from './ui.js';

// Give ui.js its read-only handle on the map module's exports.
connectMap({ g, findMatch, updatePinnedPaths });

// Start the map, passing showCounty as the county-click callback.
initMap(showCounty);
