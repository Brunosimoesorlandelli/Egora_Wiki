/**
 * Página de região (tela cheia): banner, história, figuras, abas, resumo,
 * alianças, navegação entre regiões, impressão e Modo Mestre.
 */
import { $, $$, h } from '../core/dom.js';
import { getRegions } from '../core/data.js';
import { getLinker } from '../core/linkify.js';
import { on } from '../core/state.js';
import { createModal } from '../components/modal.js';
import { createRegionSidebar } from '../components/sidebar.js';
import { isSearchOpen } from '../components/search-bar.js';
import { createMasterPanel, isMasterOn } from './master.js';

const view = $('#v');
const content = $('#vc');
const modal = createModal(view, { closeButton: $('.x', view) });

export function closeRegion() {
  modal.close();
}

export async function openRegion(id) {
  try {
    const [regions, linkify] = await Promise.all([getRegions(), getLinker()]);
    const region = regions.porId[id];
    if (!region) return closeRegion();
    content.replaceChildren(...buildPage(region, regions, linkify));
    content.dataset.b = region.bioma;
    modal.open();
  } catch (err) {
    console.error(err);
    content.replaceChildren(h('p', { class: 'sub' }, 'Não foi possível carregar os dados desta região.'));
    modal.open();
  }
}

/* ---------- montagem da página ---------- */
function buildPage(region, { campos, lista, porId }, linkify) {
  const idx = lista.indexOf(region);
  const prev = lista[(idx + lista.length - 1) % lista.length];
  const next = lista[(idx + 1) % lista.length];
  const imageUrl = new URL(region.imagem, document.baseURI).href;

  const banner = h(
    'div',
    { class: 'ban', style: { '--bi': `url('${imageUrl}')`, '--acc': region.cor } },
    h('div', null, h('div', { class: 'cap' }, region.capital), h('h2', null, region.nome), h('div', { style: { color: '#ddd' } }, region.lema)),
  );

  const main = h(
    'div',
    null,
    region.historia.map((t) => h('p', null, linkify(t, region.id))),
    region.figuras.length
      ? [h('h3', null, 'Figuras de destaque'), h('ul', null, region.figuras.map((f) => h('li', null, linkify(f, region.id))))]
      : null,
    buildTabs(region, linkify),
  );

  const body = h(
    'div',
    { class: 'body', style: { '--acc': region.cor } },
    main,
    createRegionSidebar(region, { campos, porId, masterPanel: isMasterOn() ? createMasterPanel(region) : null }),
  );

  const nav = h(
    'div',
    { class: 'rn', style: { '--acc': region.cor } },
    h('a', { href: '#' + prev.id }, '← ' + prev.nome),
    h('button', { class: 'sbtn', on: { click: () => window.print() } }, '🖨 Imprimir'),
    h('a', { href: '#' + next.id }, next.nome + ' →'),
  );

  return [banner, body, nav];
}

/** Abas internas da região (ex.: "Hierarquia Tyrica"): botões + painéis de cartões. */
function buildTabs(region, linkify) {
  if (!region.abas.length) return null;
  const tabs = h(
    'div',
    { class: 'tabs' },
    region.abas.map((aba, i) => h('button', { class: i ? '' : 'on', 'data-tab': i }, aba.titulo)),
  );
  tabs.addEventListener('click', (e) => {
    const button = e.target.closest('button[data-tab]');
    if (!button) return;
    const i = Number(button.dataset.tab);
    $$('button', tabs).forEach((b, j) => b.classList.toggle('on', j == i));
    $$('.tp', tabs.parentNode).forEach((panel, j) => (panel.hidden = j != i));
  });
  const panels = region.abas.map((aba, i) =>
    h(
      'div',
      { class: 'tp', hidden: i > 0 },
      aba.introducao ? h('p', { class: 'sub' }, linkify(aba.introducao, region.id)) : null,
      h(
        'div',
        { class: 'cg' },
        (aba.cartoes || []).map((c) =>
          h(
            'div',
            { class: 'ce' },
            h('b', null, c.nome),
            c.etiqueta ? h('small', null, c.etiqueta) : null,
            c.texto ? h('p', null, linkify(c.texto, region.id)) : null,
          ),
        ),
      ),
    ),
  );
  return [tabs, panels];
}

/* ---------- eventos da página de região ---------- */
$('.x', view).addEventListener('click', () => {
  if (!location.hash.startsWith('#p-')) location.hash = 'regioes';
});

// Modo Mestre alternado com a página aberta: redesenha a região atual.
on('master:change', () => {
  if (modal.isOpen() && !location.hash.startsWith('#p-')) openRegion(location.hash.slice(1));
});

// Efeito de paralaxe no banner
if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  view.addEventListener(
    'scroll',
    (e) => {
      const banner = $('.ban');
      if (banner) banner.style.setProperty('--pp', Math.min(70, e.target.scrollTop * 0.3) + 'px');
    },
    { passive: true },
  );
}

// ← / → navegam entre regiões; Esc fecha.
window.addEventListener('keydown', async (e) => {
  if (!modal.isOpen() || isSearchOpen() || /INPUT|SELECT/.test(e.target.tagName)) return;
  const { lista, porId } = await getRegions();
  const i = lista.indexOf(porId[location.hash.slice(1)]);
  if (i < 0) return;
  if (e.key == 'ArrowRight') location.hash = lista[(i + 1) % lista.length].id;
  if (e.key == 'ArrowLeft') location.hash = lista[(i + lista.length - 1) % lista.length].id;
});
window.addEventListener('keydown', (e) => {
  if (e.key == 'Escape' && modal.isOpen() && !location.hash.startsWith('#p-')) location.hash = 'regioes';
});
