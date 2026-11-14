/**
 * Role: Ticket Description Registry
 * Role 1: Central registry for handwritten study track descriptions with the 4 canonical sections.
 * Role 2: Provides getDescription and registerDescription helpers.
 */
(function (window) {
  'use strict';

  window.TICKET_DESCRIPTIONS = window.TICKET_DESCRIPTIONS || {};

  function getDescription(folder) {
    if (!folder) return null;
    return window.TICKET_DESCRIPTIONS[folder] || null;
  }

  function registerDescription(folder, html) {
    if (!folder || !html) return;
    window.TICKET_DESCRIPTIONS[folder] = html;
  }

  window.AppDescriptions = {
    getDescription,
    registerDescription
  };
})(window);
