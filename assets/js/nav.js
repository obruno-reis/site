// Menu mobile — abre/fecha o menu de tela cheia (usado em todas as páginas).
(function () {
  var nav = document.querySelector('nav');
  var burger = nav && nav.querySelector('.nav-burger');
  if (!nav || !burger) return;

  function setOpen(open) {
    nav.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.classList.toggle('menu-open', open);
  }
  function close() { setOpen(false); }

  burger.addEventListener('click', function (e) {
    e.stopPropagation();
    setOpen(!nav.classList.contains('open'));
  });

  // fecha ao clicar num link do menu
  nav.querySelectorAll('.nav-links a').forEach(function (a) {
    a.addEventListener('click', close);
  });

  // fecha ao clicar fora ou apertar Esc
  document.addEventListener('click', function (e) { if (!nav.contains(e.target)) close(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
})();
