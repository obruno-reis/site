# Site Bruno Reis — brunoreis.cc

Site de portfólio gerado por um **gerador estático próprio** (Node, sem dependências).
Você edita **conteúdo** (arquivos JSON) e o `build.js` gera as páginas. Deploy contínuo pelo Netlify.

## Como funciona
```
content/ (textos, EN e PT)  +  templates/ (estrutura)  --build.js-->  dist/ (site pronto)
```

## Editar o site

- **Textos** → `content/`:
  - `content/home.json` — a home (hero, about, processo, serviços, depoimentos…).
  - `content/common.json` — nav, rodapé, contato, botão "Book a call".
  - `content/projects/<slug>.json` — cada case (título, descrição, timeline, imagens, etc.).
  - `content/projects.json` — a ordem dos projetos na home.
- Cada texto tem `{ "en": "...", "pt": "..." }`. Se faltar `pt`, cai no `en`.
- **Imagens** → `assets/img/…`. **Design** (CSS) → `assets/css/style.css`.
- **Estrutura das páginas** (raramente muda) → `templates/`.

## Ver localmente
```bash
npm run build                              # gera dist/
python3 -m http.server 5500 --directory dist
# abrir http://localhost:5500
```

## Publicar
```bash
git add -A
git commit -m "descrição da mudança"
git push
```
O Netlify roda `node build.js` e publica sozinho em brunoreis.cc.

## Estrutura
```
build.js            # o gerador
package.json        # script de build
netlify.toml        # command = node build.js, publish = dist
content/            # TEXTOS (o que você edita no dia a dia)
templates/          # estrutura HTML (layout, home, project)
assets/             # css, js, imagens
dist/               # GERADO — não editar à mão (fora do git)
```

## Idiomas
- Fase atual: **EN** (raiz `/`).
- Fase 2 (planejada): **PT** em `/pt/`, com seletor EN|PT e auto-detecção. Já basta preencher os campos `pt` no `content/` e ativar `pt` em `build.js` (`LANGS`).
