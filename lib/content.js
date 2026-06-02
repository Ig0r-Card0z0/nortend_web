'use strict';

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const CONTENT_PATH = path.join(DATA_DIR, 'content.json');
const DEFAULT_PATH = path.join(DATA_DIR, 'content.default.json');
const BACKUP_PATH = path.join(DATA_DIR, 'content.backup.json');

/**
 * Garante que data/content.json exista. Na primeira execução (deploy novo),
 * copia a partir de content.default.json — assim um deploy nunca sobrescreve
 * o conteúdo de produção já editado.
 */
function ensureContent() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(CONTENT_PATH)) {
    const seed = fs.readFileSync(DEFAULT_PATH, 'utf8');
    fs.writeFileSync(CONTENT_PATH, seed, 'utf8');
    console.log('[content] content.json criado a partir de content.default.json');
  }
}

function load() {
  ensureContent();
  const raw = fs.readFileSync(CONTENT_PATH, 'utf8');
  return JSON.parse(raw);
}

/** Salva o conteúdo de forma atômica e mantém um backup da versão anterior. */
function save(obj) {
  ensureContent();
  // backup da versão atual antes de sobrescrever
  try {
    if (fs.existsSync(CONTENT_PATH)) {
      fs.copyFileSync(CONTENT_PATH, BACKUP_PATH);
    }
  } catch (e) {
    console.warn('[content] falha ao gerar backup:', e.message);
  }
  const tmp = CONTENT_PATH + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(obj, null, 2), 'utf8');
  fs.renameSync(tmp, CONTENT_PATH);
}

/* ------------------------------------------------------------------ *
 * Parser de formulário: transforma chaves achatadas (dot/bracket)    *
 * vindas do <form> do admin em um objeto aninhado.                   *
 *   "hero.lede"          -> { hero: { lede: ... } }                  *
 *   "services[0].title"  -> { services: [ { title: ... } ] }         *
 *   "trustStrip[2]"      -> { trustStrip: [ , , ... ] }              *
 * ------------------------------------------------------------------ */
function setDeep(target, keyPath, value) {
  const tokens = [];
  keyPath.replace(/[^.[\]]+/g, (m) => tokens.push(m));
  let node = target;
  for (let i = 0; i < tokens.length; i++) {
    const tok = tokens[i];
    const isIndex = /^\d+$/.test(tok);
    const key = isIndex ? Number(tok) : tok;
    const last = i === tokens.length - 1;
    if (last) {
      node[key] = value;
    } else {
      const nextIsIndex = /^\d+$/.test(tokens[i + 1]);
      if (node[key] == null) node[key] = nextIsIndex ? [] : {};
      node = node[key];
    }
  }
  return target;
}

/**
 * Converte os campos de um POST do admin (req.body, todos strings) em um
 * objeto de conteúdo. Campos com caminho "__bool" no final viram booleanos.
 * Arrays podem vir com índices esparsos; compactamos no final.
 */
function bodyToContent(body) {
  const out = {};
  for (const rawKey of Object.keys(body)) {
    let key = rawKey;
    let value = body[rawKey];
    // checkbox booleano: name="hero.card.items[0].on__bool"
    if (key.endsWith('__bool')) {
      key = key.slice(0, -'__bool'.length);
      value = value === 'on' || value === 'true' || value === '1';
    }
    setDeep(out, key, value);
  }
  compactArrays(out);
  return out;
}

/** Remove buracos (undefined) de arrays gerados por índices esparsos. */
function compactArrays(node) {
  if (Array.isArray(node)) {
    for (let i = node.length - 1; i >= 0; i--) {
      if (node[i] === undefined || node[i] === null) node.splice(i, 1);
      else compactArrays(node[i]);
    }
  } else if (node && typeof node === 'object') {
    for (const k of Object.keys(node)) compactArrays(node[k]);
  }
}

/**
 * Merge profundo de `incoming` sobre `base`.
 * Regras:
 *  - objetos: mescla recursivamente (campos não enviados pelo form são preservados);
 *  - arrays: se `incoming` tem o array, substitui inteiro (remoção de linhas funciona);
 *  - escalares: `incoming` sobrescreve.
 * Isso evita perder dados caso algum campo não esteja no formulário do admin.
 */
function deepMerge(base, incoming) {
  if (Array.isArray(incoming)) return incoming;
  if (incoming && typeof incoming === 'object') {
    const out = (base && typeof base === 'object' && !Array.isArray(base)) ? { ...base } : {};
    for (const k of Object.keys(incoming)) {
      out[k] = deepMerge(base ? base[k] : undefined, incoming[k]);
    }
    return out;
  }
  return incoming;
}

module.exports = {
  CONTENT_PATH,
  DEFAULT_PATH,
  ensureContent,
  load,
  save,
  bodyToContent,
  deepMerge,
};
