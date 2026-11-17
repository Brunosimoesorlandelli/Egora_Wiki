/** Seção "Raças de Egora". */
import { $, h } from '../core/dom.js';
import { getRaces } from '../core/data.js';

export async function initRaces() {
  const races = await getRaces();
  $('#rc').replaceChildren(...races.map((nome) => h('span', null, nome)));
}
