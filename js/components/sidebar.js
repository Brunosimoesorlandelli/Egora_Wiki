/** Barra lateral da página de região: resumo, aliados e inimigos (+ painel do Modo Mestre). */
import { h } from '../core/dom.js';
import { createRegionChips } from './cards.js';

export function createRegionSidebar(region, { campos, porId, masterPanel }) {
  return h(
    'aside',
    null,
    h('h3', { style: { marginTop: '0' } }, 'Resumo'),
    h('dl', null, campos.map((campo, i) => [h('dt', null, campo), h('dd', null, region.resumoLista[i])])),
    h('h3', null, 'Aliados'),
    h('div', { class: 'tags' }, createRegionChips(region.aliados, porId)),
    h('h3', null, 'Inimigos'),
    h('div', { class: 'tags' }, createRegionChips(region.inimigos, porId)),
    masterPanel,
  );
}
