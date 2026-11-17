/** Seção "Personagens": filtro por região e grade de retratos. */
import { $, $$, h } from '../core/dom.js';
import { getRegions, getCharacters } from '../core/data.js';
import { createCharacterCard } from '../components/cards.js';
import { reveal } from '../core/reveal.js';

export async function initCharacters() {
  const [{ porId }, characters] = await Promise.all([getRegions(), getCharacters()]);
  const filters = $('#cf');
  const grid = $('#cgrid');

  function showRegion(regionId) {
    $$('button', filters).forEach((b) => b.classList.toggle('on', b.dataset.f == regionId));
    grid.replaceChildren(
      ...characters.filter((c) => !regionId || c.regiao == regionId).map((c) => createCharacterCard(c, porId[c.regiao])),
    );
  }

  const regionIds = [...new Set(characters.map((c) => c.regiao))];
  filters.replaceChildren(
    h('button', { 'data-f': '' }, 'Todos'),
    ...regionIds.map((id) => h('button', { 'data-f': id }, porId[id].nome)),
  );
  filters.addEventListener('click', (e) => {
    const button = e.target.closest('button[data-f]');
    if (button) showRegion(button.dataset.f);
  });

  showRegion('');
  reveal(grid.querySelectorAll('.pc')); // só na primeira exibição, como antes
}
