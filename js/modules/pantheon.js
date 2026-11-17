/** Seção "O Panteão": deuses agrupados por nível. */
import { $, h } from '../core/dom.js';
import { getPantheon } from '../core/data.js';
import { reveal } from '../core/reveal.js';

export async function initPantheon() {
  const tiers = await getPantheon();
  const container = $('#pan');
  container.replaceChildren(
    ...tiers.map((tier) =>
      h(
        'div',
        { class: 'tier' },
        h('h3', null, tier.nivel),
        h(
          'div',
          { class: 'tags' },
          tier.deuses.map((d) => h('span', null, h('b', null, d.nome), d.dominio ? ' · ' + d.dominio : '')),
        ),
      ),
    ),
  );
  reveal(container.querySelectorAll('.tier'));
}
