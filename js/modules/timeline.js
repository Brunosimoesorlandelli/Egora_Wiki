/** Linha do tempo (aba "Linha do tempo" da seção Política e Tempo). */
import { h } from '../core/dom.js';
import { getRegions, getTimeline } from '../core/data.js';
import { reveal } from '../core/reveal.js';

export async function initTimeline(container) {
  const [{ porId }, timeline] = await Promise.all([getRegions(), getTimeline()]);
  container.replaceChildren(
    h('p', { class: 'sub' }, timeline.nota),
    h(
      'div',
      { class: 'tl' },
      timeline.linhaDoTempo.map((ev) => {
        const region = porId[ev.regiao];
        return h(
          'div',
          { class: 'te', style: { '--c': region.cor } },
          h('small', null, ev.quando),
          h('b', null, ev.titulo),
          h('p', null, ev.texto),
          h('div', { class: 'tags' }, h('a', { href: '#' + ev.regiao, style: { '--c': region.cor } }, region.nome)),
        );
      }),
    ),
  );
  reveal(container.querySelectorAll('.te'));
}
