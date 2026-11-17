/** Barra de navegação: botões de busca, Modo Mestre e tema. */
import { $ } from './dom.js';
import { cycleTheme } from './theme.js';
import { openSearch } from '../components/search-bar.js';
import { toggleMaster } from '../modules/master.js';

export function initNavigation() {
  $('nav').addEventListener('click', (e) => {
    const button = e.target.closest('[data-action]');
    if (!button) return;
    const action = button.dataset.action;
    if (action === 'search') openSearch();
    else if (action === 'master') toggleMaster();
    else if (action === 'theme') cycleTheme();
  });
}
