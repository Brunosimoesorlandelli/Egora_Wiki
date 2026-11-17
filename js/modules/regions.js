/** Seção "As Regiões": grade de cards. */
import { $ } from '../core/dom.js';
import { getRegions } from '../core/data.js';
import { createRegionCard } from '../components/cards.js';
import { reveal } from '../core/reveal.js';

export async function initRegions() {
  const { lista } = await getRegions();
  const grid = $('#grid');
  grid.replaceChildren(...lista.map(createRegionCard));
  reveal(grid.querySelectorAll('.card'));
}
