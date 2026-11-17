/** Temas visuais: escuro, steampunk e claro. A escolha fica salva no navegador. */
import { $ } from './dom.js';
import { storage, KEYS } from './storage.js';

const THEMES = ['dark', 'steam', 'light'];
const NAMES = { dark: 'Escuro', steam: 'Steampunk', light: 'Claro' };
const root = document.documentElement;

/** Tema em uso: o escolhido ou, se não houver, o do sistema. */
const effective = () =>
  root.dataset.theme || (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');

const updateLabel = (theme) => {
  const button = $('#thb');
  if (button) button.textContent = '◐ ' + NAMES[theme];
};

export function setTheme(theme) {
  root.dataset.theme = theme;
  storage.set(KEYS.theme, theme);
  updateLabel(theme);
}

export function cycleTheme() {
  setTheme(THEMES[(THEMES.indexOf(effective()) + 1) % THEMES.length]);
}

export function initTheme() {
  const saved = storage.get(KEYS.theme);
  if (THEMES.includes(saved)) setTheme(saved);
  else updateLabel(effective());
}
