// Corpo da home. Retorna { body, scripts }.
const HOME_SCRIPT = `  <script>
    // Carrossel de reviews, setas ‹ ›
    (function () {
      var track = document.getElementById('reviewsTrack');
      if (!track) return;
      function step() {
        var card = track.querySelector('.review-card');
        var gap = 14;
        return card ? card.getBoundingClientRect().width + gap : 320;
      }
      document.querySelectorAll('.rev-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
          track.scrollBy({ left: Number(btn.dataset.dir) * step(), behavior: 'smooth' });
        });
      });
    })();

    // Reveal on scroll: fade-in de cada seção quando entra na viewport.
    (function () {
      var els = [].slice.call(document.querySelectorAll('.reveal, .reveal-group'));
      if (!els.length) return;
      function check() {
        var vh = window.innerHeight || document.documentElement.clientHeight;
        for (var i = els.length - 1; i >= 0; i--) {
          var r = els[i].getBoundingClientRect();
          if (r.top < vh * 0.9 && r.bottom > 0) {
            els[i].classList.add('is-in');
            els.splice(i, 1);
          }
        }
      }
      window.addEventListener('scroll', check, { passive: true });
      window.addEventListener('resize', check);
      window.addEventListener('load', check);
      check();
    })();

    // Hero peek: ao passar o mouse em cada palavra do H1, mostra um case
    // num cartãozinho que segue o cursor. Só em dispositivos com hover fino.
    (function () {
      if (window.matchMedia && window.matchMedia('(hover: none)').matches) return;
      var h1 = document.querySelector('.hero h1');
      if (!h1) return;

      var cases = [].slice.call(document.querySelectorAll('.projects-grid .project-card')).map(function (a) {
        var img = a.querySelector('img');
        var title = a.querySelector('.project-card__title');
        return { img: img ? img.getAttribute('src') : '', label: title ? title.textContent.trim() : '' };
      }).filter(function (c) { return c.img; });
      if (!cases.length) return;

      // Envolve cada palavra do H1 num <span class="hw"> com um case atribuído.
      var wi = 0;
      function wrap(node) {
        [].slice.call(node.childNodes).forEach(function (n) {
          if (n.nodeType === 3) {
            if (!n.nodeValue.trim()) return;
            var frag = document.createDocumentFragment();
            n.nodeValue.split(/(\\s+)/).forEach(function (tok) {
              if (tok === '' || /^\\s+$/.test(tok)) { frag.appendChild(document.createTextNode(tok)); return; }
              var s = document.createElement('span');
              s.className = 'hw';
              var c = cases[wi % cases.length]; wi++;
              s.setAttribute('data-img', c.img);
              s.textContent = tok;
              frag.appendChild(s);
            });
            node.replaceChild(frag, n);
          } else if (n.nodeType === 1) {
            wrap(n);
          }
        });
      }
      [].slice.call(h1.querySelectorAll('.h1-line')).forEach(wrap);

      var peek = document.createElement('div');
      peek.id = 'heroPeek';
      peek.innerHTML = '<div class="peek-card"><img alt="" /></div>';
      document.body.appendChild(peek);
      var pImg = peek.querySelector('img');
      var on = false;

      h1.addEventListener('mouseover', function (e) {
        var t = e.target.closest ? e.target.closest('.hw') : null;
        if (!t) return;
        if (pImg.getAttribute('src') !== t.getAttribute('data-img')) pImg.src = t.getAttribute('data-img');
        peek.classList.add('is-on'); on = true;
      });
      h1.addEventListener('mousemove', function (e) {
        if (!on) return;
        var w = 230, off = 22;
        var left = e.clientX + off;
        if (left + w > window.innerWidth - 8) left = e.clientX - off - w;
        peek.style.left = left + 'px';
        peek.style.top = (e.clientY + off) + 'px';
      });
      h1.addEventListener('mouseout', function (e) {
        var to = e.relatedTarget;
        if (to && to.closest && to.closest('.hero h1')) return;
        peek.classList.remove('is-on'); on = false;
      });
    })();
  </script>`;

module.exports = function home(ctx, common, home, projects) {
  const { t, asset, langHome, projectUrl } = ctx;
  const h = home;

  const marquee = `<span class="serif">${t(h.marquee)}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>`;
  const heroLines = t(h.hero.lines).map(l => `        <span class="h1-line h1-line--nowrap">${l}</span>`).join('\n');

  // 03 — THE GAP
  const gapItems = h.gap.items.map(it => `          <li style="position:relative;padding-left:24px;font-size:17px;color:var(--muted);line-height:1.55;">
            <span style="position:absolute;left:0;color:var(--accent);font-weight:600;">—</span>${t(it)}
          </li>`).join('\n');

  // 04 — WHAT USUALLY GETS TRIED FIRST
  const triedLines = h.tried.lines.map(l => `      <p class="section-lead" style="max-width:640px;margin-top:16px;">${t(l)}</p>`).join('\n');

  // 05 — WHAT I DO (three layers)
  const services = h.services.cards.map(c => `        <div class="service-card">
          <img class="service-bg" src="${asset(c.bg)}" alt="" loading="lazy" />
          <span class="service-num">${c.num}</span>
          <div><h3>${t(c.title)}</h3><p>${t(c.text)}</p></div>
        </div>`).join('\n');

  // 06 — BUILD OR EVOLVE
  const beCards = h.buildEvolve.cards.map(c => `        <div style="background:var(--card);border:1px solid var(--line);border-radius:var(--radius-lg);padding:34px 32px;display:flex;flex-direction:column;">
          <div style="font-size:12px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--accent);margin-bottom:16px;">${c.num} — ${c.name}</div>
          <h3 style="font-size:23px;font-weight:700;letter-spacing:-.6px;line-height:1.15;margin-bottom:14px;">${t(c.tagline)}</h3>
          <p style="font-size:16px;color:var(--muted);line-height:1.65;margin-bottom:24px;">${t(c.desc)}</p>
          <div style="font-size:11px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--muted-2);margin-bottom:6px;">${t(h.buildEvolve.leaveLabel)}</div>
          <p style="font-size:15.5px;color:var(--ink);line-height:1.6;margin-bottom:18px;">${t(c.leaveWith)}</p>
          <div style="font-size:11px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--muted-2);margin-bottom:6px;">${t(h.buildEvolve.timelineLabel)}</div>
          <p style="font-size:15.5px;color:var(--ink);">${t(c.timeline)}</p>
        </div>`).join('\n');

  // 07 — SELECTED WORK (grid de projetos)
  const cards = projects.map(p => `        <a href="${projectUrl(p.slug)}" class="project-card">
          <img src="${asset(p.card.cover)}" alt="${t(p.card.title)}" loading="lazy"${p.card.coverStyle ? ` style="${p.card.coverStyle}"` : ''} />
          <div class="project-card__meta">
            <div class="project-card__handle">${t(p.card.handle)}</div>
            <div class="project-card__title">${t(p.card.title)}</div>
          </div>
        </a>`).join('\n\n');

  // 08 — THE PROCESS
  const steps = h.process.steps.map(s => `        <div class="process-step reveal">
          <div class="process-num">${s.num}</div>
          <h3>${t(s.title)}</h3>
          <p>${t(s.text)}</p>
        </div>`).join('\n');

  // 09 — WHY ME (about)
  const aboutParas = h.about.paras.map(p => `          <p>${t(p)}</p>`).join('\n');

  // 10 — CLIENT REVIEWS
  const reviews = h.testimonials.items.map(it => `        <div class="review-card">
          <div class="qmark">&ldquo;</div>
          <p>${t(it.quote)}</p>
          <div class="review-author"><img class="avatar" src="${asset(it.avatar)}" alt="${it.name}" loading="lazy" /><div><div class="who">${it.name}</div><div class="role">${t(it.role)}</div></div></div>
        </div>`).join('\n');

  // 11 — WHO THIS IS FOR
  const goodItems = h.whoFor.goodItems.map(it => `          <li style="position:relative;padding-left:24px;font-size:16.5px;color:var(--muted);line-height:1.55;">
            <span style="position:absolute;left:0;color:var(--accent);font-weight:600;">+</span>${t(it)}
          </li>`).join('\n');
  const badItems = h.whoFor.badItems.map(it => `          <li style="position:relative;padding-left:24px;font-size:16.5px;color:var(--muted);line-height:1.55;">
            <span style="position:absolute;left:0;color:var(--muted-2);font-weight:600;">–</span>${t(it)}
          </li>`).join('\n');

  // 12 — FAQ
  const faqItems = h.faq.items.map((it, i) => `        <div style="border-top:1px solid var(--line);${i === h.faq.items.length - 1 ? 'border-bottom:1px solid var(--line);' : ''}padding:26px 0;">
          <h3 style="font-size:19px;font-weight:700;letter-spacing:-.3px;margin-bottom:10px;">${t(it.q)}</h3>
          <p style="font-size:16px;color:var(--muted);line-height:1.65;max-width:660px;">${t(it.a)}</p>
        </div>`).join('\n');

  const body = `  <!-- ─── 01 · HERO ─── -->
  <header class="wrapper">
    <div class="marquee" aria-hidden="true">
      <div class="marquee__track">
        ${marquee}
        ${marquee}
      </div>
    </div>
    <div class="hero">
      <p class="hero-sub">${t(h.hero.eyebrow)}</p>
      <h1>
${heroLines}
      </h1>
      <p class="section-lead" style="max-width:660px;margin:0 auto 32px;text-align:center;">${t(h.hero.sub)}</p>
      <div class="hero-ctas">
        <a href="${common.wa}" target="_blank" rel="noopener" class="btn btn-hero">${t(h.hero.ctaPrimary)}</a>
        <a href="${langHome}#projects" class="btn btn-outline">${t(h.hero.ctaWork)}</a>
      </div>
    </div>
  </header>

  <!-- ─── 02 · PROOF BAR ─── -->
  <section class="home-section" style="padding:64px 0;">
    <div class="wrapper reveal">
      <p class="serif" style="text-align:center;max-width:700px;margin:0 auto;font-size:22px;line-height:1.5;color:var(--ink);">&ldquo;${t(h.proof.quote)}&rdquo;</p>
      <p style="text-align:center;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--muted-2);margin-top:14px;"><a href="https://instagram.com/merarimachado" target="_blank" rel="noopener" class="proof-author-link">${h.proof.author}</a> — ${t(h.proof.role)}</p>
    </div>
  </section>

  <!-- ─── 03 · THE GAP ─── -->
  <section class="home-section">
    <div class="wrapper reveal">
      <div class="gap-grid reveal-group">
        <div>
          <p class="eyebrow">${t(h.gap.eyebrow)}</p>
          <h2 class="section-title" style="margin-bottom:20px;">${t(h.gap.title)}</h2>
          <p class="section-lead">${t(h.gap.lead)}</p>
        </div>
        <div>
          <p style="font-size:13px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--ink);margin:0 0 16px;">${t(h.gap.recogniseLabel)}</p>
          <ul style="list-style:none;display:grid;gap:14px;">
${gapItems}
          </ul>
          <p style="margin-top:28px;font-size:18px;font-weight:600;letter-spacing:-.3px;line-height:1.5;color:var(--ink);">${t(h.gap.close)}</p>
        </div>
      </div>
    </div>
  </section>

  <!-- ─── 04 · WHAT USUALLY GETS TRIED FIRST ─── -->
  <section class="home-section section-dark" style="background:#000;">
    <div class="wrapper reveal">
      <div class="usually-grid reveal-group">
        <div>
          <p class="eyebrow">${t(h.tried.eyebrow)}</p>
          <h2 class="section-title">${t(h.tried.title)}</h2>
${triedLines}
        </div>
        <div>
          <video src="${asset(h.tried.video)}" autoplay muted loop playsinline preload="metadata"></video>
        </div>
      </div>
    </div>
  </section>

  <!-- ─── 05 · WHAT I DO ─── -->
  <section id="services" class="home-section">
    <div class="wrapper reveal">
      <p class="eyebrow">${t(h.services.eyebrow)}</p>
      <h2 class="section-title" style="max-width:900px;margin-bottom:20px;">${t(h.services.title)}</h2>
      <p class="section-lead" style="max-width:680px;margin-bottom:40px;">${t(h.services.lead)}</p>
      <div class="services-grid reveal-group">
${services}
      </div>
    </div>
  </section>

  <!-- ─── 06 · BUILD OR EVOLVE ─── -->
  <section class="home-section" style="background:var(--slate);">
    <div class="wrapper reveal">
      <p class="eyebrow">${t(h.buildEvolve.eyebrow)}</p>
      <h2 class="section-title" style="margin-bottom:36px;">${t(h.buildEvolve.title)}</h2>
      <div class="reveal-group" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:14px;">
${beCards}
      </div>
    </div>
  </section>

  <!-- ─── 07 · SELECTED WORK ─── -->
  <section id="projects" class="home-section">
    <div class="wrapper reveal">
      <p class="eyebrow">${t(h.projects.eyebrow)}</p>
      <h2 class="section-title">${t(h.projects.title)}</h2>
      <p class="section-lead" style="margin-bottom:36px;">${t(h.projects.lead)}</p>

      <div class="projects-grid reveal-group">

${cards}

      </div>
    </div>
  </section>

  <!-- ─── 08 · THE PROCESS ─── -->
  <section class="home-section" style="background:var(--slate);">
    <div class="wrapper process--center">
      <p class="eyebrow reveal">${t(h.process.eyebrow)}</p>
      <h2 class="section-title reveal" style="margin-bottom:36px;">${t(h.process.title)}</h2>
      <div class="process-grid">
${steps}
      </div>
      <div class="reveal process-why" style="margin-top:52px;max-width:680px;">
        <h3 style="font-size:19px;font-weight:700;letter-spacing:-.3px;margin-bottom:12px;">${t(h.process.whyTitle)}</h3>
        <p class="section-lead" style="max-width:680px;">${t(h.process.why)}</p>
      </div>
    </div>
  </section>

  <!-- ─── 09 · WHY ME ─── -->
  <section id="about" class="home-section">
    <div class="wrapper reveal">
      <div class="about-grid">
        <div class="about-photo" id="aboutPhoto">
          <img src="${asset(h.about.photo)}" alt="${t(h.about.photoAlt)}"
               onerror="var p=document.getElementById('aboutPhoto');p.classList.add('is-empty');this.style.display='none';document.getElementById('aboutPhotoHint').style.display='block';" />
          <span id="aboutPhotoHint" style="display:none;">Coloque a foto original em<br>assets/img/about/bruno.jpg</span>
        </div>
        <div class="about-text">
          <h2 class="section-title">${t(h.about.title)}</h2>
${aboutParas}
        </div>
      </div>
    </div>
  </section>

  <!-- ─── 10 · CLIENT REVIEWS (carrossel) ─── -->
  <section id="testimonials" class="home-section" style="background:var(--slate);">
    <div class="wrapper reveal">

      <div class="reviews-head">
        <div class="reviews-head__img">
          <img src="${asset(h.testimonials.headImg)}" alt="${t(h.testimonials.headImgAlt)}" loading="lazy" />
        </div>
        <div class="reviews-head__text">
          <p class="eyebrow">${t(h.testimonials.eyebrow)}</p>
          <h2 class="section-title">${t(h.testimonials.title)}</h2>
          <p class="lead">${t(h.testimonials.lead)}</p>
          <a href="${common.wa}" target="_blank" rel="noopener" class="btn btn-primary">${t(common.bookACall)}</a>
        </div>
      </div>

      <div class="reviews-topbar">
        <button class="rev-btn" type="button" data-dir="-1" aria-label="Previous">‹</button>
        <button class="rev-btn" type="button" data-dir="1" aria-label="Next">›</button>
      </div>

      <div class="reviews-track" id="reviewsTrack">
${reviews}
      </div>

    </div>
  </section>

  <!-- ─── 11 · WHO THIS IS FOR ─── -->
  <section class="home-section">
    <div class="wrapper reveal">
      <p class="eyebrow">${t(h.whoFor.eyebrow)}</p>
      <h2 class="section-title" style="margin-bottom:36px;">${t(h.whoFor.title)}</h2>
      <div class="reveal-group" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:40px;">
        <div>
          <h3 style="font-size:18px;font-weight:700;letter-spacing:-.3px;margin-bottom:20px;">${t(h.whoFor.goodTitle)}</h3>
          <ul style="list-style:none;display:grid;gap:14px;">
${goodItems}
          </ul>
        </div>
        <div>
          <h3 style="font-size:18px;font-weight:700;letter-spacing:-.3px;margin-bottom:20px;">${t(h.whoFor.badTitle)}</h3>
          <ul style="list-style:none;display:grid;gap:14px;">
${badItems}
          </ul>
        </div>
      </div>
    </div>
  </section>

  <!-- ─── 12 · FAQ ─── -->
  <section class="home-section" style="background:var(--slate);">
    <div class="wrapper reveal">
      <p class="eyebrow">${t(h.faq.eyebrow)}</p>
      <h2 class="section-title" style="margin-bottom:36px;">${t(h.faq.title)}</h2>
      <div class="reveal-group" style="max-width:760px;">
${faqItems}
      </div>
    </div>
  </section>

  <!-- ─── FINAL CTA ─── -->
  <section class="home-section">
    <div class="wrapper reveal">
      <div class="contact">
        <h2>${t(h.contact.title)}</h2>
        <p>${t(h.contact.text)}</p>
        <a href="${common.wa}" target="_blank" rel="noopener" class="btn btn-primary">${t(h.contact.cta)}</a>
      </div>
    </div>
  </section>`;

  return { body, scripts: HOME_SCRIPT };
};
