// Envelope comum de toda página: <head>, nav e footer.
const FONTS_ITALIC = 'https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,700;1,800&family=Baskervville&display=swap';
const FONTS_PLAIN = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Baskervville&display=swap';
const CSS = '/assets/css/style.css?v=30';
const NAVJS = '/assets/js/nav.js?v=2';
const LANGJS = '/assets/js/lang.js?v=1';
const AVATARJS = '/assets/js/avatar.js?v=1';
const SITE = 'https://brunoreis.cc';

// href de um item de nav: página (path) ou âncora da home (hash).
function navHref(langHome, n) {
  return n.path ? `${langHome}${n.path}` : `${langHome}${n.hash}`;
}

// Widget de avatar: botão redondo + card (contato, Strava, redes).
function avatarWidget(ctx, common) {
  const { t, asset } = ctx;
  const a = common.avatar;
  if (!a) return '';
  const f = common.footer;
  const endpoint = (a.strava && a.strava.endpoint) || '';
  return `      <div class="avatar-wrap">
        <button class="avatar-btn" type="button" aria-label="${a.name}" aria-expanded="false" aria-controls="avatarCard">
          <img src="${asset(a.img)}" alt="${a.name}" />
        </button>
        <div class="avatar-card" id="avatarCard" role="dialog" aria-label="${a.name}" hidden>
          <button class="avatar-card__close" type="button" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          <div class="avatar-card__head">
            <span class="avatar-card__pic"><img src="${asset(a.img)}" alt="" /></span>
            <div>
              <div class="avatar-card__name">${a.name}</div>
              <a class="avatar-card__hire" href="${common.wa}" target="_blank" rel="noopener">${t(a.hireLabel)} <span aria-hidden="true">&rarr;</span></a>
            </div>
          </div>
          <div class="avatar-card__contact">
            <a href="mailto:${f.email}">${f.email}</a>
            <a href="${f.phoneLink}" target="_blank" rel="noopener">${f.phone}</a>
          </div>
          <div class="avatar-strava" data-endpoint="${endpoint}" data-run-label="${t(a.runLabel)}" hidden></div>
          <div class="avatar-card__socials">
            <a href="${f.instagram}" target="_blank" rel="noopener">Instagram</a>
            <a href="${f.linkedin}" target="_blank" rel="noopener">LinkedIn</a>
            <a href="${common.wa}" target="_blank" rel="noopener">WhatsApp</a>
          </div>
        </div>
      </div>`;
}

// Seletor EN|PT. `variant` = 'bar' (pílula, desktop) ou 'menu' (dentro do overlay mobile).
function langSwitch(ctx, alt, variant) {
  const cls = variant === 'menu' ? 'lang-switch lang-switch--menu' : 'lang-switch lang-switch--bar';
  const opt = (code, url, hl, label) =>
    `<a href="${url}" class="lang-opt${ctx.lang === code ? ' is-active' : ''}" data-lang="${code}" hreflang="${hl}" aria-label="${label}">${code.toUpperCase()}</a>`;
  return `<div class="${cls}" role="group" aria-label="Language">${opt('en', alt.en, 'en', 'English')}<span class="lang-sep" aria-hidden="true">/</span>${opt('pt', alt.pt, 'pt-BR', 'Português')}</div>`;
}

function nav(ctx, common, alt) {
  const { t, langHome } = ctx;
  const links = common.nav.map(n => `        <a href="${navHref(langHome, n)}">${t(n.label)}</a>`).join('\n');
  return `  <!-- NAV -->
  <div class="wrapper">
    <nav>
${avatarWidget(ctx, common)}
      <a href="${langHome}" class="nav-logo">${common.brand}</a>
      <div class="nav-links">
        ${langSwitch(ctx, alt, 'menu')}
${links}
      </div>
      ${langSwitch(ctx, alt, 'bar')}
      <a href="${common.wa}" target="_blank" rel="noopener" class="nav-menu">${t(common.bookACall)}</a>
      <button class="nav-burger" type="button" aria-label="Open menu" aria-expanded="false"><span></span><span></span><span></span></button>
    </nav>
  </div>`;
}

function footer(ctx, common) {
  const { t, langHome } = ctx;
  const f = common.footer;
  const links = common.nav.map(n => `          <a href="${navHref(langHome, n)}">${t(n.label)}</a>`).join('\n');
  return `  <!-- FOOTER -->
  <footer>
    <div class="footer-inner">
      <div>
        <div class="footer-logo">${common.brand}</div>
        <p class="footer-tagline">${t(f.tagline)}</p>
        <div class="footer-socials">
          <a href="${f.linkedin}" class="social-btn" target="_blank" rel="noopener" aria-label="LinkedIn">in</a>
          <a href="${f.instagram}" class="social-btn" target="_blank" rel="noopener" aria-label="Instagram">◎</a>
        </div>
      </div>
      <div>
        <div class="footer-nav-label">${t(f.navLabel)}</div>
        <div class="footer-nav-links">
${links}
          <a href="${common.wa}" target="_blank" rel="noopener">${t(common.bookACall)}</a>
        </div>
      </div>
      <div>
        <div class="footer-nav-label">${t(f.contactLabel)}</div>
        <div class="footer-contact">
          <a href="mailto:${f.email}">${f.email}</a><br />
          <a href="${f.phoneLink}">${f.phone}</a><br />
          ${f.handle}
        </div>
      </div>
    </div>
    <div class="footer-bottom">${common.copyright}</div>
  </footer>`;
}

module.exports = function layout(o) {
  const { ctx, common, title, description, bodyClass = '', body, italic = false, scripts = '', alt = { en: '/', pt: '/pt/' } } = o;
  const canonical = ctx.lang === 'pt' ? alt.pt : alt.en;
  const ogLocale = ctx.lang === 'pt' ? 'pt_BR' : 'en_US';
  const ogLocaleAlt = ctx.lang === 'pt' ? 'en_US' : 'pt_BR';
  return `<!DOCTYPE html>
<html lang="${ctx.lang === 'pt' ? 'pt-BR' : 'en'}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <script src="${LANGJS}"></script>
  <link rel="icon" type="image/png" sizes="32x32" href="/assets/img/favicon/favicon-32.png" />
  <link rel="icon" type="image/png" sizes="16x16" href="/assets/img/favicon/favicon-16.png" />
  <link rel="apple-touch-icon" sizes="180x180" href="/assets/img/favicon/apple-touch-icon.png" />
  <meta name="theme-color" content="#02401D" />
  <title>${title}</title>
  <meta name="description" content="${description}" />
  <link rel="canonical" href="${SITE}${canonical}" />
  <link rel="alternate" hreflang="en" href="${SITE}${alt.en}" />
  <link rel="alternate" hreflang="pt-BR" href="${SITE}${alt.pt}" />
  <link rel="alternate" hreflang="x-default" href="${SITE}${alt.en}" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Bruno Reis" />
  <meta property="og:locale" content="${ogLocale}" />
  <meta property="og:locale:alternate" content="${ogLocaleAlt}" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:url" content="${SITE}${canonical}" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="${italic ? FONTS_ITALIC : FONTS_PLAIN}" rel="stylesheet" />
  <link rel="stylesheet" href="${CSS}" />
</head>
<body${bodyClass ? ` class="${bodyClass}"` : ''}>

${nav(ctx, common, alt)}

${body}

${footer(ctx, common)}
${scripts}
  <script src="${NAVJS}" defer></script>
  <script src="${AVATARJS}" defer></script>
</body>
</html>
`;
};
