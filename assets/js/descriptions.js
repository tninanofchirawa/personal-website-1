/**
 * Role: Descriptions Compatibility Wrapper
 * Location of modular files: assets/js/descriptions/ (registry.js, numpy-100.js, pandas-exercises.js, pandas-puzzles.js)
 */
(function (window) {
  'use strict';
  window.TICKET_DESCRIPTIONS = window.TICKET_DESCRIPTIONS || {};
  if (!window.AppDescriptions) {
    window.AppDescriptions = {
      getDescription: function (folder) {
        return window.TICKET_DESCRIPTIONS[folder] || null;
      },
      registerDescription: function (folder, html) {
        if (folder && html) window.TICKET_DESCRIPTIONS[folder] = html;
      }
    };
  }
})(window);
