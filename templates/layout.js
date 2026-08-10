// Envelope comum de toda página: <head>, nav e footer.
const FONTS_ITALIC = 'https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,700;1,800&family=Baskervville&display=swap';
const FONTS_PLAIN = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Baskervville&display=swap';
const CSS = '/assets/css/style.css?v=17';
const NAVJS = '/assets/js/nav.js?v=2';

function nav(ctx, common) {
  const { t, langHome } = ctx;
  const links = common.nav.map(n => `        <a href="${langHome}${n.hash}">${t(n.label)}</a>`).join('\n');
  return `  <!-- NAV -->
  <div class="wrapper">
    <nav>
      <a href="${langHome}" class="nav-logo">${common.brand}</a>
      <div class="nav-links">
${links}
      </div>
      <a href="${common.wa}" target="_blank" rel="noopener" class="nav-menu">${t(common.bookACall)}</a>
      <button class="nav-burger" type="button" aria-label="Open menu" aria-expanded="false"><span></span><span></span><span></span></button>
    </nav>
  </div>`;
}

function footer(ctx, common) {
  const { t, langHome } = ctx;
  const f = common.footer;
  const links = common.nav.map(n => `          <a href="${langHome}${n.hash}">${t(n.label)}</a>`).join('\n');
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
  const { ctx, common, title, description, bodyClass = '', body, italic = false, scripts = '' } = o;
  return `<!DOCTYPE html>
<html lang="${ctx.lang}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="icon" type="image/png" sizes="32x32" href="/assets/img/favicon/favicon-32.png" />
  <link rel="icon" type="image/png" sizes="16x16" href="/assets/img/favicon/favicon-16.png" />
  <link rel="apple-touch-icon" sizes="180x180" href="/assets/img/favicon/apple-touch-icon.png" />
  <meta name="theme-color" content="#02401D" />
  <title>${title}</title>
  <meta name="description" content="${description}" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="${italic ? FONTS_ITALIC : FONTS_PLAIN}" rel="stylesheet" />
  <link rel="stylesheet" href="${CSS}" />
</head>
<body${bodyClass ? ` class="${bodyClass}"` : ''}>

${nav(ctx, common)}

${body}

${footer(ctx, common)}
${scripts}
  <script src="${NAVJS}" defer></script>
</body>
</html>
`;
};
