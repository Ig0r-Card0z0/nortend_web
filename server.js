'use strict';

require('dotenv').config();

const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const express = require('express');
const session = require('express-session');
const multer = require('multer');
const bcrypt = require('bcryptjs');

const contentLib = require('./lib/content');
const render = require('./lib/render');
const { openDb, initSchema, upsertUserByUsername, getUserByUsername, get } = require('./lib/db');

const SQLiteStore = require('connect-sqlite3')(session);

const app = express();
const PORT = process.env.PORT || 3000;
const UPLOAD_DIR = path.join(__dirname, 'public', 'uploads');
const SQLITE_PATH = (() => {
  const raw = (process.env.SQLITE_PATH || './data/app.sqlite').toString();
  return path.isAbsolute(raw) ? raw : path.join(__dirname, raw);
})();
const SESSION_TTL_MS = Number(process.env.SESSION_TTL_MS || (1000 * 60 * 60 * 8));
const ADMIN_USERNAME = (process.env.ADMIN_USERNAME || 'Vida1205').toString();

let db;
let sessionStore;

/* ----------------------------- Config básica ----------------------------- */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('trust proxy', 1); // atrás do Nginx
// extended:false (querystring) mantém as chaves achatadas ("services[0].title"),
// que é o formato que lib/content.js (bodyToContent) sabe interpretar.
// Com extended:true (qs) os colchetes seriam pré-parseados e quebrariam o aninhamento.
app.use(express.urlencoded({ extended: false, limit: '2mb', parameterLimit: 10000 }));
app.use(express.static(path.join(__dirname, 'public')));

sessionStore = new SQLiteStore({
  db: path.basename(SQLITE_PATH),
  dir: path.dirname(SQLITE_PATH),
  table: 'sessions',
  ttl: Math.max(60, Math.floor(SESSION_TTL_MS / 1000)),
  concurrentDB: true,
});

if (sessionStore && typeof sessionStore.on === 'function') {
  sessionStore.on('error', (e) => console.error('[session] erro store:', e));
}

app.use(session({
  name: 'nortend.sid',
  store: sessionStore,
  secret: process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex'),
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: SESSION_TTL_MS,
    secure: process.env.NODE_ENV === 'production' ? 'auto' : false,
  },
}));

// helpers disponíveis em todos os templates
app.locals.emph = render.emph;
app.locals.esc = render.esc;
app.locals.href = render.href;
app.locals.whatsappLink = render.whatsappLink;

/* ------------------------------- Upload ---------------------------------- */
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    // nome derivado do campo de destino => sobrescreve o anterior (sem lixo)
    const field = (req.body.field || 'img').replace(/[^a-z0-9]+/gi, '_').toLowerCase();
    const ext = (path.extname(file.originalname) || '.jpg').toLowerCase();
    const safeExt = ['.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif'].includes(ext) ? ext : '.jpg';
    cb(null, `${field}_${Date.now()}${safeExt}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 }, // 8 MB
  fileFilter: (req, file, cb) => {
    const ok = /^image\/(jpe?g|png|webp|svg\+xml|gif)$/.test(file.mimetype);
    cb(ok ? null : new Error('Formato de imagem não suportado.'), ok);
  },
});

/* ------------------------------- Auth ------------------------------------ */
function validateEmail(email) {
  if (!email) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
}

function normalizePhoneE164BR(raw) {
  const digits = String(raw || '').replace(/\D+/g, '');
  if (!digits) throw new Error('Número vazio.');
  let d = digits;
  if (d.length === 10 || d.length === 11) d = '55' + d;
  if (!(d.length === 12 || d.length === 13) || !d.startsWith('55')) {
    throw new Error('Formato de número inválido.');
  }
  const national = d.slice(2);
  const ddd = national.slice(0, 2);
  const subscriber = national.slice(2);
  if (!/^[1-9]\d$/.test(ddd)) throw new Error('DDD inválido.');
  if (!(subscriber.length === 8 || subscriber.length === 9) || !/^\d+$/.test(subscriber)) {
    throw new Error('Número inválido.');
  }
  return '+' + d;
}

function generateStrongPassword(length) {
  const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const lower = 'abcdefghijkmnopqrstuvwxyz';
  const digits = '23456789';
  const special = '!@#$%&*()-_=+[]{}:,.?';
  const all = upper + lower + digits + special;
  const len = Math.max(12, Number(length || 16));
  const pick = (set) => set[crypto.randomInt(set.length)];
  const chars = [pick(upper), pick(lower), pick(digits), pick(special)];
  for (let i = chars.length; i < len; i++) chars.push(pick(all));
  for (let i = chars.length - 1; i > 0; i--) {
    const j = crypto.randomInt(i + 1);
    const tmp = chars[i];
    chars[i] = chars[j];
    chars[j] = tmp;
  }
  return chars.join('');
}

function isBcryptHash(value) {
  return /^\$2[aby]\$\d{2}\$/.test(String(value || ''));
}

async function ensureAdminUser(options) {
  const username = String((options && options.username) || ADMIN_USERNAME).trim();
  const email = ((options && options.email) || process.env.ADMIN_EMAIL || 'eng.nortend@gmail.com').toString().trim();
  const phoneRaw = ((options && options.phone) || process.env.ADMIN_PHONE || '92 993876271').toString();
  const whatsappRaw = ((options && options.whatsapp) || process.env.ADMIN_WHATSAPP || '92 993876271').toString();

  if (!username) throw new Error('ADMIN_USERNAME ausente.');
  if (!validateEmail(email)) throw new Error('E-mail do admin inválido.');
  const phoneE164 = normalizePhoneE164BR(phoneRaw);
  const whatsappE164 = normalizePhoneE164BR(whatsappRaw);

  const existing = await getUserByUsername(db, username);
  const forceReset = Boolean(options && options.forceReset);

  let passwordHash = existing ? existing.password_hash : null;
  let generatedPassword = null;

  const envHash = (process.env.ADMIN_PASSWORD_HASH || '').toString().trim();
  const envPlain = (process.env.ADMIN_PASSWORD || '').toString();

  if (forceReset) {
    if (envHash) {
      if (!isBcryptHash(envHash)) throw new Error('ADMIN_PASSWORD_HASH inválido (esperado hash bcrypt).');
      passwordHash = envHash;
    } else if (envPlain) {
      passwordHash = bcrypt.hashSync(envPlain, 12);
    } else {
      generatedPassword = generateStrongPassword(18);
      passwordHash = bcrypt.hashSync(generatedPassword, 12);
    }
  } else if (!existing) {
    if (envHash) {
      if (!isBcryptHash(envHash)) throw new Error('ADMIN_PASSWORD_HASH inválido (esperado hash bcrypt).');
      passwordHash = envHash;
    } else if (envPlain) {
      passwordHash = bcrypt.hashSync(envPlain, 12);
    } else {
      generatedPassword = generateStrongPassword(18);
      passwordHash = bcrypt.hashSync(generatedPassword, 12);
    }
  }

  await upsertUserByUsername(db, {
    username,
    password_hash: passwordHash,
    is_admin: true,
    email,
    phone_e164: phoneE164,
    whatsapp_e164: whatsappE164,
  });

  return { username, email, phoneE164, whatsappE164, generatedPassword };
}

async function authenticateUser(username, plain) {
  const u = await getUserByUsername(db, username);
  if (!u) return { ok: false };
  const ok = bcrypt.compareSync(String(plain || ''), u.password_hash);
  if (!ok) return { ok: false };
  if (!u.is_admin) return { ok: false };
  return { ok: true, user: u };
}

function requireAuth(req, res, next) {
  if (req.session && req.session.userId && req.session.isAdmin) return next();
  return res.redirect('/admin/login');
}

/* ------------------------------- Público --------------------------------- */
app.get('/', (req, res) => {
  const c = contentLib.load();
  res.render('index', { c });
});

app.get('/healthz', (req, res) => res.json({ ok: true }));

/* ------------------------------- Admin ----------------------------------- */
app.get('/admin/login', (req, res) => {
  if (req.session && req.session.userId && req.session.isAdmin) return res.redirect('/admin');
  res.render('login', { error: null, username: ADMIN_USERNAME });
});

app.post('/admin/login', async (req, res) => {
  try {
    const username = (req.body.username || '').toString().trim();
    const pw = (req.body.password || '').toString();
    if (!username) return res.status(400).render('login', { error: 'Usuário obrigatório.', username: ADMIN_USERNAME });

    const a = await authenticateUser(username, pw);
    if (a.ok) {
      req.session.userId = a.user.id;
      req.session.username = a.user.username;
      req.session.isAdmin = Boolean(a.user.is_admin);
      return res.redirect('/admin');
    }

    return res.status(401).render('login', { error: 'Credenciais inválidas.', username });
  } catch (e) {
    console.error('[login] erro:', e);
    return res.status(500).render('login', { error: 'Erro ao autenticar.', username: ADMIN_USERNAME });
  }
});

app.post('/admin/logout', requireAuth, (req, res) => {
  req.session.destroy(() => res.redirect('/admin/login'));
});

app.get('/admin', requireAuth, async (req, res) => {
  try {
    const c = contentLib.load();
    const saved = req.query.saved === '1';
    const uploaded = req.query.uploaded === '1';
    const u = await getUserByUsername(db, req.session.username);
    const adminProfile = u ? {
      username: u.username,
      email: u.email,
      phone: u.phone_e164,
      whatsapp: u.whatsapp_e164,
    } : null;
    res.render('admin', { c, saved, uploaded, error: null, adminProfile });
  } catch (e) {
    console.error('[admin] erro:', e);
    const c = contentLib.load();
    res.status(500).render('admin', { c, saved: false, uploaded: false, error: 'Erro ao carregar painel.', adminProfile: null });
  }
});

// Salvar textos/estrutura (form completo)
app.post('/admin/save', requireAuth, (req, res) => {
  try {
    const current = contentLib.load();
    const incoming = contentLib.bodyToContent(req.body);
    const next = contentLib.deepMerge(current, incoming);
    contentLib.save(next);
    res.redirect('/admin?saved=1#topo');
  } catch (e) {
    console.error('[save] erro:', e);
    const c = contentLib.load();
    res.status(500).render('admin', { c, saved: false, uploaded: false, error: 'Erro ao salvar: ' + e.message });
  }
});

// Trocar uma imagem específica (atualiza só aquele caminho no content.json)
app.post('/admin/upload', requireAuth, (req, res) => {
  upload.single('image')(req, res, (uErr) => {
    const wantsJson = req.headers.accept && req.headers.accept.includes('application/json');
    try {
      if (uErr) throw uErr;
      const field = (req.body.field || '').toString();
      if (!field) throw new Error('Campo de destino ausente.');
      if (!req.file) throw new Error('Nenhum arquivo enviado.');

      const publicPath = '/uploads/' + req.file.filename;
      const content = contentLib.load();
      applyImagePath(content, field, publicPath);
      contentLib.save(content);

      if (wantsJson) return res.json({ ok: true, path: publicPath });
      return res.redirect('/admin?uploaded=1#' + anchorFromField(field));
    } catch (e) {
      console.error('[upload] erro:', e);
      if (wantsJson) return res.status(400).json({ ok: false, error: e.message });
      return res.status(400).send('Erro no upload: ' + e.message + ' — <a href="/admin">voltar</a>');
    }
  });
});

/** Define um valor em caminho dot/bracket dentro de um objeto existente. */
function applyImagePath(root, keyPath, value) {
  const tokens = [];
  keyPath.replace(/[^.[\]]+/g, (m) => tokens.push(m));
  let node = root;
  for (let i = 0; i < tokens.length; i++) {
    const tok = tokens[i];
    const key = /^\d+$/.test(tok) ? Number(tok) : tok;
    if (i === tokens.length - 1) { node[key] = value; return; }
    if (node[key] == null) node[key] = /^\d+$/.test(tokens[i + 1]) ? [] : {};
    node = node[key];
  }
}

function anchorFromField(field) {
  return 'sec-' + field.split(/[.[]/)[0];
}

/* ------------------------------ Boot ------------------------------------- */
async function httpReq(opts) {
  const http = require('http');
  return new Promise((resolve, reject) => {
    const req = http.request(opts, (res) => {
      const chunks = [];
      res.on('data', (d) => chunks.push(d));
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: Buffer.concat(chunks).toString('utf8'),
        });
      });
    });
    req.on('error', reject);
    if (opts.body) req.write(opts.body);
    req.end();
  });
}

async function selfTest(adminPassword) {
  const seed = await ensureAdminUser({ username: ADMIN_USERNAME, forceReset: !adminPassword });
  const password = adminPassword || seed.generatedPassword;
  if (!password) throw new Error('Senha de selftest ausente.');

  const server = await new Promise((resolve, reject) => {
    const s = app.listen(0, () => resolve(s));
    s.on('error', reject);
  });

  const port = server.address().port;
  const body = new URLSearchParams({ username: ADMIN_USERNAME, password }).toString();
  const loginRes = await httpReq({
    method: 'POST',
    host: '127.0.0.1',
    port,
    path: '/admin/login',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'content-length': Buffer.byteLength(body),
    },
    body,
  });

  const setCookie = loginRes.headers['set-cookie'];
  if (!setCookie || !setCookie[0]) {
    throw new Error(
      'Sem cookie de sessão no login. status='
        + String(loginRes.statusCode)
        + ' headers='
        + JSON.stringify(Object.keys(loginRes.headers || {})),
    );
  }
  const cookie = setCookie[0].split(';')[0];

  const adminRes = await httpReq({
    method: 'GET',
    host: '127.0.0.1',
    port,
    path: '/admin',
    headers: { cookie },
  });

  const sessCountRow = await get(db, 'SELECT COUNT(*) AS n FROM sessions');
  const ok = adminRes.statusCode === 200
    && adminRes.body.includes('eng.nortend@gmail.com')
    && adminRes.body.includes('+55')
    && sessCountRow
    && Number(sessCountRow.n) >= 1;

  await new Promise((resolve) => server.close(resolve));
  if (!ok) throw new Error('Selftest falhou.');
}

async function main() {
  contentLib.ensureContent();

  db = await openDb(SQLITE_PATH);
  await initSchema(db);

  if (process.argv.includes('--bootstrap-admin')) {
    const forceReset = process.argv.includes('--reset') || process.env.ADMIN_FORCE_RESET === '1';
    const seed = await ensureAdminUser({ username: ADMIN_USERNAME, forceReset });
    console.log('ADMIN_USERNAME=' + seed.username);
    console.log('ADMIN_EMAIL=' + seed.email);
    console.log('ADMIN_PHONE_E164=' + seed.phoneE164);
    console.log('ADMIN_WHATSAPP_E164=' + seed.whatsappE164);
    if (seed.generatedPassword) console.log('ADMIN_PASSWORD=' + seed.generatedPassword);
    return;
  }

  await ensureAdminUser({ username: ADMIN_USERNAME });

  if (process.argv.includes('--selftest')) {
    const pw = (process.env.SELFTEST_PASSWORD || '').toString();
    await selfTest(pw || null);
    console.log('SELFTEST_OK=1');
    return;
  }

  app.listen(PORT, () => {
    console.log(`Nortend site rodando em http://localhost:${PORT}`);
    console.log(`Admin em http://localhost:${PORT}/admin`);
  });
}

main().catch((e) => {
  console.error('[boot] erro:', e);
  process.exitCode = 1;
});
