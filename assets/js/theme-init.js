// Inline in <head> before CSS loads to prevent flash of wrong theme.
// Reads localStorage and sets data-theme attribute immediately.
// Omits the attribute for "system" mode so the OS media query takes over.
(function () {
  var t = localStorage.getItem('pihuw-theme');
  if (t === 'light' || t === 'dark') {
    document.documentElement.setAttribute('data-theme', t);
  }
}());
