'use strict';

/** Escapa HTML para inserção segura. */
function esc(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Ênfase editorial: converte *palavra* em <em>palavra</em> (serif itálico no
 * design). O resto do texto é escapado. Usado em títulos do Hero e "Em campo".
 */
function emph(str) {
  if (str == null) return '';
  const escaped = esc(str);
  return escaped.replace(/\*([^*]+)\*/g, '<em>$1</em>');
}

/** Monta o link do WhatsApp a partir de número + mensagem. */
function whatsappLink(wa) {
  if (!wa || !wa.number) return '#';
  const num = String(wa.number).replace(/\D/g, '');
  const msg = wa.message ? '?text=' + encodeURIComponent(wa.message) : '';
  return `https://wa.me/${num}${msg}`;
}

/**
 * Resolve um href de conteúdo. Suporta o token {whatsapp} para apontar
 * dinamicamente ao link do WhatsApp configurado.
 */
function href(value, content) {
  if (!value) return '#';
  if (value === '{whatsapp}') return whatsappLink(content.whatsapp);
  return value;
}

module.exports = { esc, emph, whatsappLink, href };
