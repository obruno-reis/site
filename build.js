// Gerador estático do site (EN agora; PT na Fase 2). Sem dependências.
// Uso: node build.js  → gera a pasta dist/
const fs = require('fs');
const path = require('path');
const layout = require('./templates/layout.js');
const homeTpl = require('./templates/home.js');
const projectTpl = require('./templates/project.js');

const ROOT = __dirname;
const DIST = path.join(ROOT, 'dist');
const LANGS = ['en']; // Fase 2: ['en', 'pt']

const read = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, 'content', p), 'utf8'));
const common = read('common.json');
const home = read('home.json');
const order = read('projects.json').order;
const projects = order.map((slug) => read(path.join('projects', slug + '.json')));

function pick(field, lang) {
  if (field && typeof field === 'object' && !Array.isArray(field)) {
    return field[lang] != null ? field[lang] : field.en;
  }
  return field;
}

function makeCtx(lang) {
  const langHome = lang === 'en' ? '/' : `/${lang}/`;
  return {
    lang,
    langHome,
    t: (f) => pick(f, lang),
    asset: (p) => '/' + p,
    projectUrl: (slug) => langHome + 'projetos/' + slug + '.html',
  };
}

function write(rel, content) {
  const full = path.join(DIST, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content);
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.name === '.DS_Store') continue;
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

// 1) limpa e recria dist/
fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });

// 2) copia os assets estáticos
copyDir(path.join(ROOT, 'assets'), path.join(DIST, 'assets'));

// 3) gera as páginas por idioma
let pages = 0;
for (const lang of LANGS) {
  const ctx = makeCtx(lang);
  const base = lang === 'en' ? '' : lang + '/';

  // HOME
  const rendered = homeTpl(ctx, common, home, projects);
  write(
    path.join(base, 'index.html'),
    layout({
      ctx, common,
      title: ctx.t(home.meta.title),
      description: ctx.t(home.meta.description),
      bodyClass: 'home',
      italic: true,
      body: rendered.body,
      scripts: rendered.scripts,
    })
  );
  pages++;

  // PÁGINAS DE CASE
  for (const p of projects) {
    write(
      path.join(base, 'projetos', p.slug + '.html'),
      layout({
        ctx, common,
        title: ctx.t(p.metaTitle),
        description: ctx.t(p.metaDesc),
        italic: false,
        body: projectTpl(ctx, common, p),
      })
    );
    pages++;
  }
}

console.log(`Build OK — ${pages} páginas geradas em dist/ (idiomas: ${LANGS.join(', ')})`);
