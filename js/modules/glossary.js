/** Seção "Glossário": termos e organizações, cada um ligado à sua região. */
import { $, h } from '../core/dom.js';
import { getRegions, getGlossary } from '../core/data.js';
import { reveal } from '../core/reveal.js';

export async function initGlossary() {
  const [{ porId }, glossary] = await Promise.all([getRegions(), getGlossary()]);
  const container = $('#gls');
  container.replaceChildren(
    ...glossary.map((g) => {
      const region = porId[g.regiao];
      return h(
        'div',
        { class: 'gi', id: 'g-' + g.id, style: { '--c': region.cor } },
        h('b', null, g.termo),
        h('p', null, g.definicao),
        h('a', { href: '#' + g.regiao }, region.nome),
      );
    }),
  );
  reveal(container.querySelectorAll('.gi'));
}
