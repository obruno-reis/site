// Corpo de uma página de projeto (case).
module.exports = function project(ctx, common, p) {
  const { t, asset, langHome, projectUrl } = ctx;
  const ui = common.projectUI;

  const leads = p.lead.map(l => `    <p class="project-lead">${t(l)}</p>`).join('\n');
  const shots = p.shots.map(s => `      <div class="shot"><img src="${asset(s.src)}" alt="${t(s.alt)}" loading="lazy" /></div>`).join('\n');
  const results = p.result.map(r => `      <p class="section-text">${t(r)}</p>`).join('\n');
  const next = p.next.map(n => `        <a href="${projectUrl(n.slug)}" class="next-card">
          <img src="${asset(n.img)}" alt="${t(n.label)}" loading="lazy" />
          <span class="next-card-label">${t(n.label)}</span>
        </a>`).join('\n');

  return `  <div class="wrapper">

    <a href="${langHome}#projects" class="back-link">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 2L4 7L9 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
      ${t(ui.back)}
    </a>

    <!-- TITLE + DESCRIPTION (top) -->
    <h1 class="project-title">${t(p.title)}</h1>
${leads}

    <!-- INFO CARDS -->
    <div class="info-cards">
      <div class="info-card">
        <div class="info-label">${t(ui.category)}</div>
        <div class="info-value">${t(p.category)}</div>
      </div>
      <div class="info-card">
        <div class="info-label">${t(ui.timeline)}</div>
        <div class="info-value">${t(p.timeline)}</div>
      </div>
    </div>

    <!-- FIRST PHOTO -->
    <div class="shot" style="margin-bottom:40px;"><img src="${asset(p.hero.src)}" alt="${t(p.hero.alt)}" /></div>

    <!-- PROJECT GOALS (after first photo) -->
    <div class="section">
      <h2 class="section-heading"><span class="accent">// </span>${t(ui.goals)}</h2>
      <p class="section-text">${t(p.goals)}</p>
    </div>

    <!-- REMAINING PHOTOS -->
    <div class="shots">
${shots}
    </div>

    <!-- THE RESULT (end, before Next Projects) -->
    <div class="section">
      <h2 class="section-heading"><span class="accent">// </span>${t(ui.result)}</h2>
${results}
    </div>

    <!-- NEXT PROJECTS -->
    <div class="section">
      <h2 class="next-heading">${t(ui.next)}</h2>
      <div class="next-grid">
${next}
      </div>
    </div>

  </div>`;
};
