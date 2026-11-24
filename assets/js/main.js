/**
 * Main Site Interactions Engine
 * Scope: Global navigation events, analytics tracking, and responsive UI interactions.
 */
(function () {
  'use strict';

  // 1. Track page navigation clicks (Home, About Me, Dropdown Items)
  function initAnalyticsTracking() {
    document.querySelectorAll('.ga-nav-link').forEach(function (element) {
      element.addEventListener('click', function () {
        var cleanName = this.innerText.trim().replace(/\s+/g, '_').toLowerCase();
        if (typeof gtag === 'function') {
          gtag('event', 'navbar_click', {
            button_name: cleanName,
            link_url: this.getAttribute('href')
          });
        }
      });
    });

    // 2. Track dropdown menu openings
    document.querySelectorAll('.ga-dropdown-toggle').forEach(function (element) {
      element.addEventListener('click', function () {
        var dropdownName = this.innerText.trim().replace(/\s+/g, '_').toLowerCase();
        if (typeof gtag === 'function') {
          gtag('event', 'navbar_dropdown_open', {
            dropdown_name: dropdownName
          });
        }
      });
    });
  }

  // 3. Submenu flyout interaction on desktop and touch devices
  function initSubmenuInteractions() {
    const submenus = document.querySelectorAll('.dropdown-submenu');
    submenus.forEach(function (submenu) {
      const toggle = submenu.querySelector('.submenu-toggle');
      if (toggle) {
        toggle.addEventListener('click', function (e) {
          if (window.innerWidth < 992) {
            e.preventDefault();
            e.stopPropagation();
            submenu.classList.toggle('show');
            const menu = submenu.querySelector('.dropdown-menu');
            if (menu) {
              menu.classList.toggle('show');
            }
          }
        });
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initAnalyticsTracking();
      initSubmenuInteractions();
    });
  } else {
    initAnalyticsTracking();
    initSubmenuInteractions();
  }
})();
