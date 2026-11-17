/** Interface da busca: janela, resultados, navegação por teclado e atalhos (/ e Ctrl+K). */
import { $, h } from '../core/dom.js';
import { search, prepareSearch } from '../core/search.js';

let results = [];
let selected = 0;
let requestId = 0;

const overlay = () => $('#sr');
const isOpen = () => !overlay().hidden;

function render() {
  const box = $('#so2');
  if (!results.length) {
    box.replaceChildren(h('p', { class: 'sub' }, 'Nada encontrado.'));
    return;
  }
  box.replaceChildren(
    ...results.map((e, i) =>
      h(
        'a',
        { href: e[3], class: i === selected ? 'on' : '', on: { click: closeSearch } },
        h('small', null, e[0]),
        h('b', null, e[1]),
        h('span', null, e[2].slice(0, 90)),
      ),
    ),
  );
}

async function onInput() {
  const mine = ++requestId;
  const query = $('#si').value;
  if (!query.trim()) {
    results = [];
    $('#so2').replaceChildren();
    return;
  }
  try {
    const found = await search(query);
    if (mine !== requestId) return; // chegou resposta de uma digitação antiga
    results = found;
  } catch (err) {
    console.error(err);
    if (mine !== requestId) return;
    $('#so2').replaceChildren(h('p', { class: 'sub' }, 'Não foi possível carregar os dados da busca.'));
    return;
  }
  selected = 0;
  render();
}

export function openSearch() {
  overlay().hidden = false;
  $('#si').value = '';
  $('#so2').replaceChildren();
  $('#si').focus();
  prepareSearch().catch(() => {}); // começa a carregar o índice enquanto a pessoa digita
}

export function closeSearch() {
  overlay().hidden = true;
}

export function isSearchOpen() {
  return isOpen();
}

export function initSearchBar() {
  $('#si').addEventListener('input', onInput);
  window.addEventListener(
    'keydown',
    (e) => {
      if (isOpen()) {
        if (e.key === 'Escape') {
          e.stopImmediatePropagation();
          closeSearch();
        } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
          e.preventDefault();
          selected = (selected + (e.key === 'ArrowDown' ? 1 : results.length - 1)) % Math.max(results.length, 1);
          render();
        } else if (e.key === 'Enter') {
          const link = $('#so2 a.on');
          if (link) link.click();
        }
        return;
      }
      if (
        (e.key === '/' && !/INPUT|SELECT|TEXTAREA/.test(e.target.tagName)) ||
        ((e.ctrlKey || e.metaKey) && e.key === 'k')
      ) {
        e.preventDefault();
        openSearch();
      }
    },
    true,
  );
}
