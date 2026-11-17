/** Árvore de família e grupo de membros (peças reutilizáveis; devolvem elementos DOM). */
import { h } from '../core/dom.js';

function person(n, self) {
  const inner = [
    n.imagem ? h('img', { src: n.imagem, alt: '', loading: 'lazy' }) : null,
    h('span', null, h('b', null, n.nome), n.papel ? h('small', null, n.papel) : null),
  ];
  if (!n.id) return h('span', { class: 'fp ghost' }, inner);
  return h('a', { class: 'fp' + (n.key === self ? ' me' : ''), href: '#p-' + n.id, 'aria-current': n.key === self ? 'true' : null }, inner);
}

function branch(node, self) {
  const couple = node.pais.flatMap((p, i) => (i ? [h('span', { class: 'fj', 'aria-label': 'cônjuge' }, '⚭'), person(p, self)] : [person(p, self)]));
  return h('li', null, h('div', { class: 'fc' }, couple), node.filhos.length ? h('ul', null, node.filhos.map((f) => branch(f, self))) : null);
}

/** `col` vem de getRelationGraph(); `self` é a chave do personagem a destacar (opcional). */
export function createCollection(col, self) {
  if (col.arvore) return h('div', { class: 'tree' }, h('ul', null, branch(col.arvore, self)));
  return h('div', { class: 'fg' }, col.membros.map((m) => person(m, self)));
}
