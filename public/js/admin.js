'use strict';

/* ============================================================
 * Listas repetíveis genéricas
 * Estrutura no HTML:
 *   <div class="list" data-list="services">
 *     <div class="list-row"> ...inputs com data-key... <button class="row-remove"> </div>
 *     <template> ...uma linha modelo... </template>
 *   </div>
 *   <button data-add="services">+ Adicionar</button>
 *
 * Cada input/select/textarea de campo usa data-key="title" (ou data-key=""
 * para listas escalares). Checkboxes booleanos usam data-key + data-bool.
 * Wrappers de imagem usam <div class="img-field" data-key="image">.
 * ============================================================ */

function computeName(listPath, i, key, bool) {
  let n = listPath + '[' + i + ']';
  if (key) n += '.' + key;
  if (bool) n += '__bool';
  return n;
}

function renumber(container) {
  const listPath = container.getAttribute('data-list');
  const rows = Array.from(container.children).filter((el) => el.classList && el.classList.contains('list-row'));
  rows.forEach((row, i) => {
    const num = row.querySelector('.row-num');
    if (num) num.textContent = String(i + 1).padStart(2, '0');

    row.querySelectorAll('input[data-key], select[data-key], textarea[data-key]').forEach((inp) => {
      const key = inp.getAttribute('data-key');
      const bool = inp.hasAttribute('data-bool');
      inp.setAttribute('name', computeName(listPath, i, key, bool));
    });

    row.querySelectorAll('.img-field[data-key]').forEach((wrap) => {
      const key = wrap.getAttribute('data-key');
      const field = computeName(listPath, i, key, false);
      wrap.setAttribute('data-field', field);
      const hidden = wrap.querySelector('input[type=hidden]');
      if (hidden) hidden.setAttribute('name', field);
    });
  });
}

function bindRow(row, container) {
  const rm = row.querySelector('.row-remove');
  if (rm && !rm.dataset.bound) {
    rm.dataset.bound = '1';
    rm.addEventListener('click', () => {
      row.remove();
      renumber(container);
    });
  }
  row.querySelectorAll('.img-field').forEach(bindImageField);
  row.querySelectorAll('[data-logo-type]').forEach(bindLogoType);
}

function addRow(listPath) {
  const container = document.querySelector('.list[data-list="' + listPath + '"]');
  if (!container) return;
  const tpl = container.querySelector('template');
  const frag = tpl.content.cloneNode(true);
  container.insertBefore(frag, tpl);
  const newRow = tpl.previousElementSibling;
  renumber(container);
  bindRow(newRow, container);
}

/* ============================================================
 * Upload de imagem via fetch (sem recarregar a página)
 * ============================================================ */
function bindImageField(wrap) {
  if (wrap.dataset.bound) return;
  wrap.dataset.bound = '1';
  const input = wrap.querySelector('input[type=file]');
  if (!input) return;
  input.addEventListener('change', async () => {
    if (!input.files || !input.files[0]) return;
    await uploadImage(wrap, input.files[0]);
    input.value = '';
  });
}

async function uploadImage(wrap, file) {
  const field = wrap.getAttribute('data-field');
  const status = wrap.querySelector('.img-status');
  const thumb = wrap.querySelector('.thumb');
  if (status) { status.textContent = 'Enviando…'; status.className = 'img-status busy'; }

  const fd = new FormData();
  fd.append('field', field);
  fd.append('image', file);

  try {
    const res = await fetch('/admin/upload', {
      method: 'POST',
      body: fd,
      headers: { Accept: 'application/json' },
    });
    const data = await res.json();
    if (!data.ok) throw new Error(data.error || 'falha no envio');
    if (thumb) thumb.style.backgroundImage = "url('" + data.path + "')";
    const hidden = wrap.querySelector('input[type=hidden]');
    if (hidden) hidden.value = data.path;
    // logo: ao enviar imagem, muda o tipo para "Imagem" automaticamente
    if (wrap.classList.contains('logo-image')) {
      const row = wrap.closest('.list-row');
      const sel = row && row.querySelector('[data-logo-type]');
      if (sel) { sel.value = 'image'; sel.dispatchEvent(new Event('change')); }
    }
    if (status) { status.textContent = 'Atualizada · ' + data.path; status.className = 'img-status done'; }
  } catch (e) {
    if (status) { status.textContent = 'Erro: ' + e.message; status.className = 'img-status err'; }
  }
}

/* ============================================================
 * Logos de cliente: alternar entre texto e imagem
 * ============================================================ */
function bindLogoType(select) {
  if (select.dataset.bound) return;
  select.dataset.bound = '1';
  const row = select.closest('.list-row');
  const apply = () => {
    const isImg = select.value === 'image';
    const txt = row.querySelector('.logo-text');
    const img = row.querySelector('.logo-image');
    if (txt) txt.style.display = isImg ? 'none' : '';
    if (img) img.style.display = isImg ? '' : 'none';
  };
  select.addEventListener('change', apply);
  apply();
}

/* ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.list').forEach((container) => {
    renumber(container);
    Array.from(container.children)
      .filter((el) => el.classList && el.classList.contains('list-row'))
      .forEach((row) => bindRow(row, container));
  });

  document.querySelectorAll('[data-add]').forEach((btn) => {
    btn.addEventListener('click', () => addRow(btn.getAttribute('data-add')));
  });

  document.querySelectorAll('.img-field').forEach(bindImageField);
});
