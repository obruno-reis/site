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
      var els = [].slice.call(document.querySelectorAll('.reveal'));
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
  </script>`;

module.exports = function home(ctx, common, home, projects) {
  const { t, asset, langHome, projectUrl } = ctx;
  const h = home;

  const marquee = `<span class="serif">${t(h.marquee)}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>`;
  const heroLines = t(h.hero.lines).map(l => `        <span class="h1-line h1-line--nowrap">${l}</span>`).join('\n');

  const cards = projects.map(p => `        <a href="${projectUrl(p.slug)}" class="project-card">
          <img src="${asset(p.card.cover)}" alt="${t(p.card.title)}" loading="lazy"${p.card.coverStyle ? ` style="${p.card.coverStyle}"` : ''} />
          <div class="project-card__meta">
            <div class="project-card__handle">${t(p.card.handle)}</div>
            <div class="project-card__title">${t(p.card.title)}</div>
          </div>
        </a>`).join('\n\n');

  const aboutParas = h.about.paras.map(p => `          <p>${t(p)}</p>`).join('\n');

  const steps = h.process.steps.map(s => `        <div class="process-step reveal">
          <div class="process-num">${s.num}</div>
          <h3>${t(s.title)}</h3>
          <p>${t(s.text)}</p>
        </div>`).join('\n');

  const services = h.services.cards.map(c => `        <div class="service-card">
          <img class="service-bg" src="${asset(c.bg)}" alt="" loading="lazy" />
          <span class="service-num">${c.num}</span>
          <div><h3>${t(c.title)}</h3><p>${t(c.text)}</p></div>
        </div>`).join('\n');

  const reviews = h.testimonials.items.map(it => `        <div class="review-card">
          <div class="qmark">&ldquo;</div>
          <p>${t(it.quote)}</p>
          <div class="review-author"><img class="avatar" src="${asset(it.avatar)}" alt="${it.name}" loading="lazy" /><div><div class="who">${it.name}</div><div class="role">${t(it.role)}</div></div></div>
        </div>`).join('\n');

  const body = `  <!-- ─── HERO ─── -->
  <header class="wrapper">
    <div class="marquee" aria-hidden="true">
      <div class="marquee__track">
        ${marquee}
        ${marquee}
      </div>
    </div>
    <div class="hero">
      <h1>
${heroLines}
      </h1>
      <div class="hero-ctas">
        <a href="${langHome}#projects" class="btn btn-outline">${t(h.hero.ctaWork)}</a>
        <a href="${common.wa}" target="_blank" rel="noopener" class="btn btn-book">${t(common.bookACall)}</a>
      </div>
    </div>
  </header>

  <!-- ─── PROJECTS ─── -->
  <section id="projects" class="home-section">
    <div class="wrapper reveal">
      <p class="eyebrow">${t(h.projects.eyebrow)}</p>
      <h2 class="section-title">${t(h.projects.title)}</h2>
      <p class="section-lead" style="margin-bottom:36px;">${t(h.projects.lead)}</p>

      <div class="projects-grid">

${cards}

      </div>
    </div>
  </section>

  <!-- ─── ABOUT ─── -->
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

  <!-- ─── PROCESS ─── -->
  <section class="home-section">
    <div class="wrapper">
      <p class="eyebrow reveal">${t(h.process.eyebrow)}</p>
      <h2 class="section-title reveal" style="margin-bottom:36px;">${t(h.process.title)}</h2>
      <div class="process-grid">
${steps}
      </div>
    </div>
  </section>

  <!-- ─── SERVICES ─── -->
  <section id="services" class="home-section" style="background:var(--slate);">
    <div class="wrapper reveal">
      <p class="eyebrow">${t(h.services.eyebrow)}</p>
      <h2 class="section-title" style="margin-bottom:36px;">${t(h.services.title)}</h2>
      <div class="services-grid">
${services}
      </div>
    </div>
  </section>

  <!-- ─── CLIENT REVIEWS (carrossel) ─── -->
  <section id="testimonials" class="home-section">
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

  <!-- ─── CONTACT / CTA ─── -->
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
