/**
 * main.js
 * Entry point. Loads county data, then wires map.js and ui.js together.
 *
 * Data is now fetched from counties.json (with sessionStorage caching) before
 * the map initialises, so countiesData is always populated when map.js and
 * ui.js first access it.
 */

import { loadCounties }                        from './counties.js';
import { initMap, g, findMatch, updatePinnedPaths } from './map.js';
import { connectMap, showCounty }              from './ui.js';

// Give ui.js its read-only handle on the map module's exports.
connectMap({ g, findMatch, updatePinnedPaths });

// Load county data first, then start the map.
loadCounties()
  .then(() => initMap(showCounty))
  .then(() => {
    window.dispatchEvent(new CustomEvent('mapready'));
  })
  .catch(() => {
    // Data or map failed — still fire mapready so UI isn't blocked.
    window.dispatchEvent(new CustomEvent('mapready'));
  });