// Theme toggle — cycles system → light → dark → system on button click.
// Updates data-theme attribute on <html> (removes it for "system").
// Persists choice to localStorage under key 'pihuw-theme'.
(function () {
  var ORDER = ['system', 'light', 'dark'];
  var ICONS = { system: 'fa-circle-half-stroke', light: 'fa-sun', dark: 'fa-moon' };

  function current() {
    return document.documentElement.getAttribute('data-theme') || 'system';
  }

  function effectiveIcon(theme) {
    return ICONS[theme];
  }

  function apply(theme) {
    if (theme === 'system') {
      document.documentElement.removeAttribute('data-theme');
      localStorage.removeItem('pihuw-theme');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('pihuw-theme', theme);
    }
    // Update all toggle button icons on the page. A fresh <i> is drawn by the
    // Font Awesome webfont CSS (no FA SVG+JS since v0.4.17).
    document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
      btn.innerHTML = '<i class="fa-solid ' + effectiveIcon(theme) + '"></i>';
      btn.setAttribute('title', 'Theme: ' + theme);
      btn.setAttribute('data-theme-state', theme);
    });
  }

  function cycle() {
    var idx = ORDER.indexOf(current());
    apply(ORDER[(idx + 1) % ORDER.length]);
  }

  document.addEventListener('DOMContentLoaded', function () {
    // Initialise icon to match current state
    apply(current());
    // Wire up click handlers
    document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
      btn.addEventListener('click', cycle);
    });
  });
}());
