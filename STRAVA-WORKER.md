# Strava no card do avatar — setup do Cloudflare Worker

O site é estático e não guarda segredos. Um **Cloudflare Worker** (grátis) guarda suas
credenciais do Strava e devolve a sua **última atividade** em JSON para o widget.
Setup único (~15 min). Depois é automático: o Worker atualiza sozinho e o site só lê.

O código está em [`worker/strava.js`](worker/strava.js) e [`worker/wrangler.toml`](worker/wrangler.toml).

---

## 1. Criar o app no Strava (pega Client ID e Secret)

1. Abra <https://www.strava.com/settings/api> (logado na sua conta).
2. Crie o app. No campo **Authorization Callback Domain** coloque: `localhost`
3. Anote o **Client ID** e o **Client Secret**.

## 2. Autorizar uma vez (pega o refresh_token)

1. Cole no navegador (troque `SEU_CLIENT_ID`):

   ```
   https://www.strava.com/oauth/authorize?client_id=SEU_CLIENT_ID&response_type=code&redirect_uri=http://localhost/exchange_token&approval_prompt=force&scope=activity:read
   ```

2. Clique **Authorize**. O navegador tenta abrir `http://localhost/exchange_token?...&code=XXXXX&...`
   (a página não carrega — normal). **Copie o valor de `code`** que aparece na barra de endereço.

3. No terminal, troque os valores e rode:

   ```bash
   curl -X POST https://www.strava.com/oauth/token \
     -d client_id=SEU_CLIENT_ID \
     -d client_secret=SEU_CLIENT_SECRET \
     -d code=O_CODE_QUE_VOCE_COPIOU \
     -d grant_type=authorization_code
   ```

4. Na resposta JSON, copie o **`refresh_token`**. (Esse não expira; é o que o Worker usa.)

## 3. Publicar o Worker

```bash
cd worker
npx wrangler login          # abre o navegador pra logar na Cloudflare (conta grátis)
npx wrangler secret put STRAVA_CLIENT_ID       # cola o Client ID
npx wrangler secret put STRAVA_CLIENT_SECRET   # cola o Client Secret
npx wrangler secret put STRAVA_REFRESH_TOKEN   # cola o refresh_token do passo 2
npx wrangler deploy
```

No fim o Wrangler mostra a URL pública, algo como:
`https://brunoreis-strava.SEU-SUBDOMINIO.workers.dev`

Teste no navegador — deve devolver um JSON com `name`, `distance`, etc.

## 4. Ligar no site

1. Em [`content/common.json`](content/common.json), no bloco `avatar.strava`, cole a URL no `endpoint`:

   ```json
   "strava": { "endpoint": "https://brunoreis-strava.SEU-SUBDOMINIO.workers.dev", "profile": "" }
   ```

2. Rebuild + deploy (sem gastar créditos da Netlify):

   ```bash
   node build.js
   npx netlify deploy --prod --dir=dist
   ```

Pronto. O card do avatar passa a mostrar a última corrida ao vivo. Se o `endpoint`
ficar vazio ou o Worker sair do ar, a linha do Strava simplesmente não aparece — o
resto do card (contato + redes) continua funcionando.

---

### Observações
- O CORS está travado em `https://brunoreis.cc` (em `wrangler.toml`, `ALLOW_ORIGIN`).
  Para testar em `localhost`, mude temporariamente essa variável e faça `deploy` de novo.
- O Worker cacheia a resposta por 10 min, então visitas repetidas não estouram o
  limite de requisições do Strava.
