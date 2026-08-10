// Seletor de idioma EN/PT + auto-detecção na 1ª visita.
// Carregado no <head> (blocking) para redirecionar ANTES de pintar (sem flash).
//
// Regras:
// - Escolha manual (clique no seletor) fica salva em localStorage e é respeitada
//   nos dois sentidos em toda visita.
// - Sem escolha salva: só auto-encaminha EN -> PT quando o navegador está em
//   português. Nunca faz PT -> EN sozinho, para não "sequestrar" um link /pt/
//   compartilhado com alguém de navegador em inglês.
(function () {
  var KEY = 'lang-pref';
  function get() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function set(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  var path = location.pathname;
  var isPt = path === '/pt' || path.indexOf('/pt/') === 0;
  var current = isPt ? 'pt' : 'en';

  // Mapeia a URL atual para o par no outro idioma (funciona com .html e pretty URLs).
  function counterpart(lang) {
    if (lang === 'pt') {
      if (current === 'pt') return path;
      return '/pt' + (path === '/' ? '/' : path);
    }
    if (current === 'en') return path;
    var rest = path.replace(/^\/pt(?=\/|$)/, '');
    return rest === '' ? '/' : rest;
  }
  function go(lang) { location.replace(counterpart(lang) + location.hash); }

  var stored = get();
  if (stored) {
    if (stored !== current) go(stored);
  } else if (current === 'en') {
    var langs = navigator.languages || [navigator.language || ''];
    var prefersPt = langs.some(function (l) { return /^pt\b/i.test(l); });
    if (prefersPt) go('pt');
  }

  // Salva a escolha manual ao clicar no seletor.
  document.addEventListener('DOMContentLoaded', function () {
    var opts = document.querySelectorAll('.lang-opt');
    for (var i = 0; i < opts.length; i++) {
      (function (a) {
        a.addEventListener('click', function () { set(a.getAttribute('data-lang')); });
      })(opts[i]);
    }
  });
})();
