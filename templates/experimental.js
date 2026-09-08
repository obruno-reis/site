// Corpo da página Experimental (projetos paralelos feitos com IA).
module.exports = function experimental(ctx, common, page) {
  const { t, asset } = ctx;

  const cards = page.projects.map(p => {
    const tags = (p.tags || []).map(tag => `<span class="exp-tag">${t(tag)}</span>`).join('');
    return `        <a href="${p.url}" target="_blank" rel="noopener" class="exp-card">
          <div class="exp-card__media"><img src="${asset(p.img)}" alt="${p.title}" loading="lazy" /></div>
          <div class="exp-card__body">
            <div class="exp-tags">${tags}</div>
            <h3 class="exp-card__title">${p.title}</h3>
            <p class="exp-card__blurb">${t(p.blurb)}</p>
            <span class="exp-card__cta">${t(page.visitLabel)} <span aria-hidden="true">&rarr;</span></span>
          </div>
        </a>`;
  }).join('\n\n');

  return `  <section class="home-section" style="padding-top:120px;">
    <div class="wrapper">
      <p class="eyebrow">${t(page.eyebrow)}</p>
      <h1 class="section-title" style="margin-bottom:20px;">${t(page.title)}</h1>
      <p class="section-lead" style="max-width:640px;margin-bottom:48px;">${t(page.lead)}</p>

      <div class="exp-grid">

${cards}

      </div>
    </div>
  </section>`;
};
