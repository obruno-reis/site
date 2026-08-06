# Site Bruno Reis — portfólio (2026)

Site estático em HTML/CSS puro (sem framework, sem build step). Fácil de editar e pronto para deploy.

## Estrutura

```
site/
├── index.html                 # Home
├── projetos/
│   ├── dox-ia.html            # ✅ case completo (texto a confirmar)
│   ├── brain-gym.html         # ✅ case completo (textos do material)
│   ├── icim.html              # ✅ case completo (textos do material)
│   ├── menttalis.html         # ✅ case completo (textos do material)
│   ├── youtube.html           # 🚧 esqueleto (sem material)
│   ├── clinica-psicologia.html# 🚧 esqueleto
│   ├── comunidade-maes.html   # 🚧 esqueleto
│   ├── guerrilha-way.html     # 🚧 esqueleto
│   └── nutricionista.html     # 🚧 esqueleto
└── assets/
    ├── css/style.css          # todo o sistema visual (tokens no topo, em :root)
    └── img/                    # imagens locais copiadas de PROJECTS/
        ├── dox-ia/  brain-gym/  menttalis/
        └── icim/ (+ icim/widescreen/)
```

Editar cores/tipografia: abrir `assets/css/style.css` e mexer nas variáveis em `:root` (topo do arquivo).

## Rodar localmente

Basta abrir `site/index.html` no navegador (duplo clique). Todos os caminhos são relativos.

## Deploy (qualquer um destes)

O diretório a publicar é a pasta **`site/`**.

- **Netlify:** arraste a pasta `site/` em app.netlify.com/drop, ou conecte o repositório e defina "Publish directory" = `site`.
- **Vercel:** `vercel` na pasta `site/` (Framework preset: *Other*), ou defina Root Directory = `site`.
- **GitHub Pages:** publique o conteúdo de `site/` na branch/pasta configurada.

Nenhum comando de build é necessário.

## Adicionar um novo case

1. Duplique `projetos/menttalis.html` (estrutura completa: título → subtítulo → info-cards → imagens empilhadas → Project Goals → nome+descrição → The Result → Next Projects).
2. Copie as imagens para `assets/img/<slug>/`.
3. Troque `src`, textos e o card na grade da home (`index.html`, seção `#projects`).

---

## ✅ Checklist — o que falta antes de publicar

### Cases completos (texto final + timeline) — ✅ TODOS os 9
- [x] Dox IA — 2 weeks
- [x] Brain Gym — 3 weeks
- [x] Institute CIM — 4 weeks
- [x] Menttalis — 3 weeks
- [x] Italo Mundo Afora — 2 weeks
- [x] Clínica Mar Atlântico — 2 weeks
- [x] Thiago Castro Community — 4 weeks
- [x] Guerrilha Way — 4 weeks
- [x] Dra. Tuany Lannes — 3 weeks

### Testimonials — ⚠️ importante
- [ ] Os depoimentos da home ainda são **placeholder do template Framer "For:Human"** (não são reais). Substituir por depoimentos verdadeiros. (Bruno vai coletar.)
- [ ] Merari Machado (Menttalis) é cliente real — vale pedir um depoimento de verdade a ela.

### Foto da seção "About Me" — ✅
- [x] `site/assets/img/about/bruno.png` no lugar.

### Links / detalhes
- [x] LinkedIn real: `https://www.linkedin.com/in/obrunoreis/`
- [x] Instagram `@obruno_reis`
- [ ] Ícones sociais no rodapé são caracteres simples (in / ◎) — trocar por SVGs de marca se quiser.

Idioma: **todo o site está em inglês** (home e páginas de projeto).
