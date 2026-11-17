/** Ficha do personagem (#p-<id>): retrato, região, papel, vínculos, árvores e grupos. Usa o mesmo overlay #v da região. */
import { $, h } from '../core/dom.js';
import { getRegions, getCharacters } from '../core/data.js';
import { getRelationGraph } from '../core/relations.js';
import { createModal } from '../components/modal.js';
import { createCollection } from '../components/family-tree.js';

const view = $('#v');
const content = $('#vc');
const modal = createModal(view, { closeButton: $('.x', view) });
const isChar = () => location.hash.startsWith('#p-');

export function closeCharacter() {
  modal.close();
}

export async function openCharacter(id) {
  try {
    const [regions, chars, graph] = await Promise.all([getRegions(), getCharacters(), getRelationGraph()]);
    const c = chars.find((x) => x.id === id);
    const region = c && regions.porId[c.regiao];
    if (!region) return closeCharacter();
    content.replaceChildren(...buildPage(c, region, chars, graph));
    content.dataset.b = region.bioma;
    modal.open();
  } catch (err) {
    console.error(err);
    content.replaceChildren(h('p', { class: 'sub' }, 'Não foi possível carregar a ficha deste personagem.'));
    modal.open();
  }
}

function buildPage(c, region, chars, graph) {
  const i = chars.indexOf(c);
  const prev = chars[(i + chars.length - 1) % chars.length];
  const next = chars[(i + 1) % chars.length];

  const banner = h(
    'div',
    { class: 'ban', style: { '--bi': `url('${region.imagem}')`, '--acc': region.cor } },
    h('div', null, h('div', { class: 'cap' }, region.nome), h('h2', null, c.nome), h('div', { style: { color: '#ddd' } }, c.papel)),
  );

  // vínculos agrupados por rótulo (grupos aparecem nas seções abaixo)
  const groups = new Map();
  (graph.links.get(c.id) || [])
    .filter((l) => l.tipo !== 'grupo')
    .forEach((l) => groups.set(l.rotulo, [...(groups.get(l.rotulo) || []), l.outro]));
  const chip = (n) =>
    n.id ? h('a', { href: '#p-' + n.id }, n.nome) : h('span', null, n.nome + (n.papel ? ' · ' + n.papel : ''));
  const cols = graph.colecoes.filter((x) => x.keys.has(c.id));

  const main = h(
    'div',
    null,
    h('h3', { style: { marginTop: '0' } }, 'Relações'),
    groups.size
      ? h('dl', { class: 'rel' }, [...groups].map(([rotulo, list]) => [h('dt', null, rotulo), h('dd', null, h('div', { class: 'tags' }, list.map(chip)))]))
      : h('p', { class: 'sub' }, 'Nenhum vínculo registrado ainda.'),
    cols.map((col) => [h('h3', null, col.nome), col.nota ? h('p', { class: 'sub' }, col.nota) : null, createCollection(col, c.id)]),
  );

  const side = h(
    'aside',
    { class: 'cside' },
    h('img', { class: 'cpt', src: c.imagem, alt: c.nome }),
    h('dl', null, h('dt', null, 'Região'), h('dd', null, h('a', { class: 'xl', href: '#' + region.id }, region.nome)), h('dt', null, 'Papel'), h('dd', null, c.papel)),
  );

  const body = h('div', { class: 'body', style: { '--acc': region.cor } }, main, side);
  const nav = h(
    'div',
    { class: 'rn', style: { '--acc': region.cor } },
    h('a', { href: '#p-' + prev.id }, '← ' + prev.nome),
    h('a', { href: '#' + region.id }, region.nome),
    h('a', { href: '#p-' + next.id }, next.nome + ' →'),
  );
  return [banner, body, nav];
}

$('.x', view).addEventListener('click', () => {
  if (isChar()) location.hash = 'personagens';
});
window.addEventListener('keydown', (e) => {
  if (e.key == 'Escape' && modal.isOpen() && isChar()) location.hash = 'personagens';
});
