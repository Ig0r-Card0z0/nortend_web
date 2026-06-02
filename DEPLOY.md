# Deploy — Nortend site (VPS Hostinger · PM2 · Nginx · Let's Encrypt)

Mesmo fluxo do `nr13report`. A app é um Node/Express que serve a landing page
e o painel `/admin`. O conteúdo editável fica em `data/content.json` (criado no
primeiro boot a partir de `data/content.default.json`).

---

## 1. Clonar e instalar

```bash
cd /var/www            # ou onde você mantém os apps
git clone <repo> nortend-site
cd nortend-site
npm install --omit=dev
```

## 2. Configurar variáveis

```bash
cp .env.example .env
nano .env
```

Gere os valores:

```bash
# segredo de sessão
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"

# hash da senha do admin (cole em ADMIN_PASSWORD_HASH)
node -e "console.log(require('bcryptjs').hashSync('SUA_SENHA_AQUI', 10))"
```

Preencha `PORT` (ex. `3000`), `NODE_ENV=production`, `SESSION_SECRET` e
`ADMIN_PASSWORD_HASH`.

## 3. Subir com PM2

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup        # uma vez, para subir no boot da máquina
```

Atualizações futuras de código:

```bash
cd /var/www/nortend-site
git pull
npm install --omit=dev
pm2 reload nortend-site
```

> O `git pull` **não** sobrescreve `data/content.json` nem `public/uploads/`
> (ambos no `.gitignore`). O conteúdo de produção é preservado a cada deploy.

## 4. Nginx (proxy reverso)

`/etc/nginx/sites-available/nortendengenharia.com.br`:

```nginx
server {
    listen 80;
    server_name nortendengenharia.com.br www.nortendengenharia.com.br;

    client_max_body_size 10M;   # uploads de imagem (limite da app é 8 MB)

    location / {
        proxy_pass         http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header   Host              $host;
        proxy_set_header   X-Real-IP         $remote_addr;
        proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
    }
}
```

```bash
ln -s /etc/nginx/sites-available/nortendengenharia.com.br /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
```

> A app já usa `app.set('trust proxy', 1)`, então o cookie seguro de sessão
> funciona corretamente atrás do Nginx em HTTPS.

## 5. HTTPS (Let's Encrypt)

```bash
certbot --nginx -d nortendengenharia.com.br -d www.nortendengenharia.com.br
```

O Certbot reescreve o bloco para a porta 443 e cuida da renovação.

---

## 6. Backup (IMPORTANTE)

O que **não** está no Git e precisa de backup próprio:

| Caminho                  | O que é                                   |
|--------------------------|-------------------------------------------|
| `data/content.json`      | Todo o texto/estrutura editado no admin   |
| `public/uploads/`        | Imagens enviadas pelo admin               |

Exemplo de backup diário (cron):

```bash
0 3 * * * tar czf /root/backups/nortend-$(date +\%F).tgz \
  -C /var/www/nortend-site data/content.json public/uploads
```

A app já mantém `data/content.backup.json` (versão imediatamente anterior a
cada save), mas isso **não** substitui um backup externo.

---

## 7. Notas

- **Sessão em memória:** o login do admin usa `MemoryStore`. Ao reiniciar a app
  (`pm2 reload`), é preciso logar de novo em `/admin`. Para a landing page e os
  visitantes isso é irrelevante. Se um dia quiser sessões persistentes, dá para
  trocar por `connect-sqlite3` ou similar.
- **Primeiro boot:** se `data/content.json` não existir, ele é criado a partir
  de `data/content.default.json`. Para "resetar" o conteúdo ao padrão, pare a
  app, apague `data/content.json` e suba de novo.
- **Healthcheck:** `GET /healthz` → `{"ok":true}`.
