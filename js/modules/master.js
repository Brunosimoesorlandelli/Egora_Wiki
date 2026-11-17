/**
 * Modo Mestre: mostra os "segredos" de cada região e um bloco de anotações
 * pessoais (salvas no navegador), com exportação/importação em JSON.
 */
import { $, h } from '../core/dom.js';
import { storage, KEYS } from '../core/storage.js';
import { state, emit } from '../core/state.js';

const noteKey = (id) => KEYS.notePrefix + id;

function syncButton() {
  const button = $('#mmb');
  if (!button) return;
  button.classList.toggle('on', state.masterMode);
  button.setAttribute('aria-pressed', state.masterMode);
}

export function isMasterOn() {
  return state.masterMode;
}

export function initMaster() {
  state.masterMode = storage.get(KEYS.master) === '1';
  syncButton();
}

export function toggleMaster() {
  state.masterMode = !state.masterMode;
  storage.set(KEYS.master, state.masterMode ? '1' : '0');
  syncButton();
  emit('master:change', state.masterMode);
}

/** Todas as anotações salvas: { <idRegião>: texto }. */
function collectNotes() {
  const notes = {};
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith(KEYS.notePrefix)) notes[key.slice(KEYS.notePrefix.length)] = localStorage.getItem(key);
    }
  } catch (e) {
    /* localStorage indisponível */
  }
  return notes;
}

/** Painel do mestre para a barra lateral da região (ou null se o modo estiver desligado). */
export function createMasterPanel(region) {
  if (!state.masterMode) return null;

  const notes = h('textarea', { id: 'nt', rows: 7 });
  notes.value = storage.get(noteKey(region.id)) || '';
  notes.addEventListener('input', () => storage.set(noteKey(region.id), notes.value));

  const backup = h('textarea', {
    id: 'nb',
    rows: 5,
    placeholder: 'Exporte para copiar o JSON, ou cole aqui um JSON para importar',
  });
  const message = h('small', { id: 'nm' });

  const exportNotes = () => {
    const all = collectNotes();
    backup.value = JSON.stringify(all, null, 1);
    message.textContent = Object.keys(all).length + ' região(ões) com anotações. Copie o texto acima.';
  };
  const importNotes = () => {
    try {
      const all = JSON.parse(backup.value);
      Object.entries(all).forEach(([k, v]) => localStorage.setItem(noteKey(k), v));
      message.textContent = 'Importado.';
      notes.value = localStorage.getItem(noteKey(region.id)) || '';
    } catch (e) {
      message.textContent = 'Não consegui ler esse JSON.';
    }
  };

  return h(
    'div',
    { class: 'mst' },
    h('h3', null, 'Modo mestre'),
    region.segredos.length
      ? [h('p', { class: 'sub' }, 'Segredos'), h('ul', null, region.segredos.map((t) => h('li', null, t)))]
      : null,
    h('label', { for: 'nt', class: 'sub' }, 'Suas anotações, salvas neste navegador'),
    notes,
    h(
      'details',
      { class: 'noprint' },
      h('summary', null, 'Backup das anotações'),
      backup,
      h(
        'div',
        { class: 'tags' },
        h('button', { class: 'sbtn', on: { click: exportNotes } }, 'Exportar'),
        h('button', { class: 'sbtn', on: { click: importNotes } }, 'Importar'),
      ),
      message,
    ),
  );
}
