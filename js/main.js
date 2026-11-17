/**
 * Ponto de entrada da Egora Wiki.
 * Só coordena: inicializa os sistemas fundamentais e delega o resto
 * (seções e página de região são carregadas sob demanda).
 */
import { initTheme } from './core/theme.js';
import { initReveal } from './core/reveal.js';
import { initNavigation } from './core/navigation.js';
import { initLazySections } from './core/loader.js';
import { initRouter } from './core/router.js';
import { initSearchBar } from './components/search-bar.js';
import { initMaster } from './modules/master.js';

initTheme();
initMaster();
initReveal();
initSearchBar();
initNavigation();
initLazySections();
initRouter();
