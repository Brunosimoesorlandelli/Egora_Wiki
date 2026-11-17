/** Cards e tags reutilizáveis (regiões, personagens, chips de alianças). */
import { h } from '../core/dom.js';

const goTo = (id) => () => {
  location.hash = id;
};

/** Card de região (usa a imagem da região como fundo). */
export function createRegionCard(region) {
  const imageUrl = new URL(region.imagem, document.baseURI).href;
  return h(
    'button',
    {
      class: 'card',
      style: { '--c': region.cor, '--i': `url('${imageUrl}')` },
      on: { click: goTo(region.id) },
    },
    h('div', null, h('b', null, region.nome), h('small', null, region.lema)),
  );
}

/** Card de personagem; abre a região do personagem. */
export function createCharacterCard(character, region) {
  return h(
    'button',
    { class: 'pc', style: { '--c': region.cor }, on: { click: goTo(character.regiao) } },
    h('img', { loading: 'lazy', alt: character.nome, src: character.imagem }),
    h('div', null, h('b', null, character.nome), h('small', null, `${character.papel} · ${region.nome}`)),
  );
}

/** Lista de chips (links para regiões; ids desconhecidos aparecem como texto simples). */
export function createRegionChips(ids, porId) {
  if (!ids.length) return [h('span', null, 'Nenhum')];
  return ids.map((id) => (porId[id] ? h('a', { href: '#' + id }, porId[id].nome) : h('span', null, id)));
}
