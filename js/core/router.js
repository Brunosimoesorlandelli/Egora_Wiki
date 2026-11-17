/**
 * Roteamento por hash (#).
 *   #<id de região>       → abre a página da região (tela cheia)
 *   #mapa, #glossario...  → rola até a seção (inicializando-a antes, se preciso)
 *   #g-<termo>            → rola até o termo do glossário
 * Qualquer outro hash fecha a página de região.
 */
import { getRegions } from './data.js';
import { ensureSection, SECTION_IDS } from './loader.js';
import { emit } from './state.js';

let token = 0; // descarta resultados de navegações antigas (cliques rápidos)
let regionView = null;
let characterView = null;

async function route() {
  const mine = ++token;
  const id = location.hash.slice(1);
  emit('route', id);

  let regions = null;
  if (id) {
    try {
      regions = await getRegions();
    } catch (err) {
      console.error(err);
    }
    if (mine !== token) return;
  }

  if (regions && regions.porId[id]) {
    regionView = regionView || (await import('../modules/region-view.js'));
    if (mine !== token) return;
    await regionView.openRegion(id);
    return;
  }

  if (id.startsWith('p-')) {
    characterView = characterView || (await import('../modules/character-view.js'));
    if (mine !== token) return;
    await characterView.openCharacter(id.slice(2));
    return;
  }

  if (regionView) regionView.closeRegion();
  if (characterView) characterView.closeCharacter();
  await scrollToTarget(id, mine);
}

async function scrollToTarget(id, mine) {
  const sectionId = SECTION_IDS.includes(id) ? id : id.startsWith('g-') ? 'glossario' : null;
  if (!sectionId) return;
  await ensureSection(sectionId);
  if (mine !== token) return;
  const target = document.getElementById(id);
  if (!target) return;
  target.scrollIntoView();
  // O :target do CSS só vale para elementos que já existiam na navegação;
  // esta classe garante o destaque do termo mesmo quando a seção foi criada agora.
  document.querySelectorAll('.is-target').forEach((el) => el.classList.remove('is-target'));
  if (id.startsWith('g-')) target.classList.add('is-target');
}

export function initRouter() {
  window.addEventListener('hashchange', route);
  return route();
}
