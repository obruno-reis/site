// Seletor de idioma EN/PT/DE + auto-detecção na 1ª visita.
// Carregado no <head> (blocking) para redirecionar ANTES de pintar (sem flash).
//
// Regras:
// - Escolha manual (clique no seletor) fica salva em localStorage e é respeitada
//   em toda visita, em qualquer sentido.
// - Sem escolha salva: só auto-encaminha a partir do EN, quando o navegador está
//   em português (-> PT) ou alemão (-> DE). Nunca sai de /pt/ ou /de/ sozinho,
//   para não "sequestrar" um link compartilhado com alguém de outro idioma.
(function () {
  var KEY = 'lang-pref';
  var PREFIXED = ['pt', 'de']; // idiomas servidos em /<lang>/ (EN fica na raiz)
  function get() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function set(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  var path = location.pathname;
  var current = 'en';
  for (var i = 0; i < PREFIXED.length; i++) {
    var l = PREFIXED[i];
    if (path === '/' + l || path.indexOf('/' + l + '/') === 0) current = l;
  }

  // Mapeia a URL atual para o par no outro idioma (funciona com .html e pretty URLs).
  function counterpart(lang) {
    if (lang === current) return path;
    var rest = current === 'en' ? path : path.replace(new RegExp('^/' + current + '(?=/|$)'), '');
    if (rest === '') rest = '/';
    return lang === 'en' ? rest : '/' + lang + rest;
  }
  function go(lang) { location.replace(counterpart(lang) + location.hash); }

  var stored = get();
  if (stored === 'en' || PREFIXED.indexOf(stored) !== -1) {
    if (stored !== current) go(stored);
  } else if (current === 'en') {
    var langs = navigator.languages || [navigator.language || ''];
    for (var j = 0; j < langs.length; j++) {
      if (/^pt\b/i.test(langs[j])) { go('pt'); break; }
      if (/^de\b/i.test(langs[j])) { go('de'); break; }
    }
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
