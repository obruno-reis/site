// Widget de avatar na navbar: abre/fecha o card e busca a última atividade do Strava.
// O dado do Strava vem de um Cloudflare Worker (endpoint em content/common.json).
// Se não houver endpoint ou o fetch falhar, a linha do Strava simplesmente não aparece.
(function () {
  var wrap = document.querySelector('.avatar-wrap');
  if (!wrap) return;
  var btn = wrap.querySelector('.avatar-btn');
  var card = wrap.querySelector('.avatar-card');
  var closeBtn = wrap.querySelector('.avatar-card__close');
  if (!btn || !card) return;

  var isPt = (document.documentElement.lang || '').toLowerCase().indexOf('pt') === 0;

  function setOpen(open) {
    card.hidden = !open;
    wrap.classList.toggle('is-open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.classList.toggle('avatar-open', open);
    if (open) loadStrava();
  }
  function close() { setOpen(false); }

  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    setOpen(card.hidden);
  });
  if (closeBtn) closeBtn.addEventListener('click', function (e) { e.stopPropagation(); close(); });
  card.addEventListener('click', function (e) { e.stopPropagation(); });
  document.addEventListener('click', function (e) { if (!wrap.contains(e.target)) close(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });

  // ─── Strava ───
  var loaded = false;
  function loadStrava() {
    if (loaded) return;
    var box = card.querySelector('.avatar-strava');
    if (!box) return;
    var endpoint = box.getAttribute('data-endpoint');
    if (!endpoint) return; // sem Worker configurado: linha fica oculta
    loaded = true;
    fetch(endpoint, { mode: 'cors' })
      .then(function (r) { return r.ok ? r.json() : Promise.reject(); })
      .then(function (a) { render(box, a); })
      .catch(function () { loaded = false; }); // deixa tentar de novo numa próxima abertura
  }

  function render(box, a) {
    if (!a || typeof a.distance !== 'number') return;
    var label = box.getAttribute('data-run-label') || 'Last run';
    var km = (a.distance / 1000).toFixed(2) + ' km';
    var pace = paceStr(a.moving_time, a.distance);
    var ago = timeAgo(a.start_date);
    var name = a.name || (a.type || 'Activity');
    var line = name + ' · ' + km + (pace ? ' → ' + pace : '');
    var href = a.id ? 'https://www.strava.com/activities/' + a.id : null;
    var inner =
      '<span class="strava-ico" aria-hidden="true">' + icon(a.type) + '</span>' +
      '<span class="strava-main"><span class="strava-label">' + label + '</span>' +
      '<span class="strava-name">' + esc(line) + '</span></span>' +
      (ago ? '<span class="strava-ago">' + ago + '</span>' : '');
    if (href) {
      box.innerHTML = '<a class="strava-row" href="' + href + '" target="_blank" rel="noopener">' + inner + '</a>';
    } else {
      box.innerHTML = '<div class="strava-row">' + inner + '</div>';
    }
    box.hidden = false;
  }

  function paceStr(sec, meters) {
    if (!sec || !meters) return '';
    var perKm = sec / (meters / 1000); // segundos por km
    var m = Math.floor(perKm / 60);
    var s = Math.round(perKm % 60);
    if (s === 60) { m += 1; s = 0; }
    return m + ':' + (s < 10 ? '0' : '') + s + ' /km';
  }

  function timeAgo(iso) {
    if (!iso) return '';
    var then = new Date(iso).getTime();
    if (isNaN(then)) return '';
    var diff = Math.max(0, Date.now() - then);
    var mins = Math.floor(diff / 60000);
    var suffix = isPt ? ' atrás' : ' ago';
    if (mins < 1) return isPt ? 'agora' : 'just now';
    if (mins < 60) return mins + 'min' + suffix;
    var hrs = Math.floor(mins / 60);
    if (hrs < 24) return hrs + 'h' + suffix;
    var days = Math.floor(hrs / 24);
    if (days < 7) return days + (isPt ? 'd' : 'd') + suffix;
    var wks = Math.floor(days / 7);
    return wks + (isPt ? 'sem' : 'w') + suffix;
  }

  function icon(type) {
    if (type === 'Ride' || type === 'VirtualRide') return '🚴';
    if (type === 'Swim') return '🏊';
    if (type === 'Walk' || type === 'Hike') return '🥾';
    return '🏃';
  }

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
})();
