/**
 * Carregamento sob demanda das seções da página.
 * O código (import()) e os dados de cada seção só são carregados quando ela
 * está perto da área visível, ou quando a navegação/busca leva até ela.
 */
import { $, showError } from './dom.js';

const SECTIONS = {
  mapa: () => import('../modules/map.js').then((m) => m.initMap),
  regioes: () => import('../modules/regions.js').then((m) => m.initRegions),
  personagens: () => import('../modules/characters.js').then((m) => m.initCharacters),
  politica: () => import('../modules/politics.js').then((m) => m.initPolitics),
  panteao: () => import('../modules/pantheon.js').then((m) => m.initPantheon),
  racas: () => import('../modules/races.js').then((m) => m.initRaces),
  glossario: () => import('../modules/glossary.js').then((m) => m.initGlossary),
};

export const SECTION_IDS = Object.keys(SECTIONS);

const started = new Map();

/** Inicializa a seção (uma única vez) e devolve uma Promise que resolve quando ela estiver pronta. */
export function ensureSection(id) {
  if (!SECTIONS[id]) return Promise.resolve();
  if (!started.has(id)) {
    const container = document.getElementById(id);
    started.set(
      id,
      SECTIONS[id]()
        .then((init) => init(container))
        .catch((err) => {
          console.error(`Falha ao iniciar a seção "${id}":`, err);
          showError(container, 'Não foi possível carregar esta seção. Recarregue a página para tentar de novo.');
        }),
    );
  }
  return started.get(id);
}

/** Observa as seções e inicializa cada uma quando se aproxima da tela. */
export function initLazySections() {
  if (!('IntersectionObserver' in window)) {
    SECTION_IDS.forEach(ensureSection);
    return;
  }
  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          observer.unobserve(e.target);
          ensureSection(e.target.id);
        }
      }),
    { rootMargin: '600px 0px' },
  );
  SECTION_IDS.forEach((id) => {
    const el = $('#' + id);
    if (el) observer.observe(el);
  });
}
