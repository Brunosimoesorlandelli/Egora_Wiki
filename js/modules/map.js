/**
 * Mapa interativo: arrastar, zoom (botões, Ctrl+roda, pinça), territórios
 * recortados (SVG), destaque de alianças/rivalidades, camadas temáticas e legenda.
 */
import { $, $$, h, s } from '../core/dom.js';
import { getRegions, getTerritories } from '../core/data.js';
import { on } from '../core/state.js';

const MAX_ZOOM = 6;
const DRAG_THRESHOLD = 6; // px de arrasto a partir dos quais um clique é ignorado

// [rótulo, índice do campo de resumo (-1 = cor própria de cada região)]
const LAYERS = [['Regiões', -1], ['Política', 0], ['Tecnologia', 1], ['Bioma', 7], ['Religião', 5]];
const PALETTE = ['#e0707f', '#4fb6e0', '#a9d36a', '#f1d15a', '#a58ad4', '#f08a3c', '#5ec2a0', '#e87fc0', '#cfc4a8', '#9a9a9a'];

/** Agrupa valores parecidos na camada Religião ("Politeísta (X)" e "Politeísta (Y)" viram um grupo). */
const groupKey = (field, value) =>
  field == 5 ? (value.startsWith('Um deus') ? 'Um deus por grupo' : value.split(' (')[0]) : value;

export async function initMap() {
  const [{ lista, porId }, territories] = await Promise.all([getRegions(), getTerritories()]);
  const [vbW, vbH] = territories.viewBox;
  const paths = territories.territorios;
  const extraHit = territories.areaDeToqueAmpliada;

  const map = $('#map');
  const mv = $('#mv');
  const tr = $('#tr');
  const tooltip = $('#tt');

  /* ---------- pan & zoom ---------- */
  const T = { k: 1, x: 0, y: 0 };
  const pointers = new Map();
  let moved = 0;

  function applyTransform() {
    const w = map.clientWidth;
    const hgt = map.clientHeight;
    T.k = Math.min(MAX_ZOOM, Math.max(1, T.k));
    T.x = Math.min(0, Math.max(w - w * T.k, T.x));
    T.y = Math.min(0, Math.max(hgt - hgt * T.k, T.y));
    mv.style.transform = `translate(${T.x}px,${T.y}px) scale(${T.k})`;
    mv.style.setProperty('--k', T.k);
  }

  /** factor 0 = resetar; senão multiplica o zoom em torno de (cx, cy). */
  function zoom(factor, cx, cy) {
    if (!factor) {
      T.k = 1;
      T.x = T.y = 0;
      return applyTransform();
    }
    const w = map.clientWidth;
    const hgt = map.clientHeight;
    cx = cx ?? w / 2;
    cy = cy ?? hgt / 2;
    const k = Math.min(MAX_ZOOM, Math.max(1, T.k * factor));
    const ratio = k / T.k;
    T.x = cx - (cx - T.x) * ratio;
    T.y = cy - (cy - T.y) * ratio;
    T.k = k;
    applyTransform();
  }

  const pinchDistance = () => {
    const a = [...pointers.values()];
    return Math.hypot(a[0][0] - a[1][0], a[0][1] - a[1][1]);
  };

  map.addEventListener('pointerdown', (e) => {
    pointers.set(e.pointerId, [e.clientX, e.clientY]);
    moved = 0;
  });
  window.addEventListener('pointermove', (e) => {
    const old = pointers.get(e.pointerId);
    if (!old) return;
    const d0 = pointers.size > 1 ? pinchDistance() : 0;
    pointers.set(e.pointerId, [e.clientX, e.clientY]);
    if (pointers.size > 1) {
      const factor = pinchDistance() / d0;
      const box = map.getBoundingClientRect();
      const a = [...pointers.values()];
      zoom(factor, (a[0][0] + a[1][0]) / 2 - box.left, (a[0][1] + a[1][1]) / 2 - box.top);
      moved = 9;
    } else {
      const dx = e.clientX - old[0];
      const dy = e.clientY - old[1];
      moved += Math.abs(dx) + Math.abs(dy);
      if (moved > DRAG_THRESHOLD) {
        T.x += dx;
        T.y += dy;
        applyTransform();
      }
    }
  });
  ['pointerup', 'pointercancel'].forEach((type) => window.addEventListener(type, (e) => pointers.delete(e.pointerId)));
  // depois de arrastar, o clique que "sobra" não deve abrir a região
  map.addEventListener(
    'click',
    (e) => {
      if (moved > DRAG_THRESHOLD) {
        e.stopPropagation();
        e.preventDefault();
      }
    },
    true,
  );
  map.addEventListener(
    'wheel',
    (e) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      e.preventDefault();
      const box = map.getBoundingClientRect();
      zoom(e.deltaY < 0 ? 1.2 : 1 / 1.2, e.clientX - box.left, e.clientY - box.top);
    },
    { passive: false },
  );

  $('.zb', map).addEventListener('click', (e) => {
    const button = e.target.closest('button[data-action]');
    if (!button) return;
    const action = button.dataset.action;
    if (action === 'zoom-in') zoom(1.4);
    else if (action === 'zoom-out') zoom(1 / 1.4);
    else if (action === 'zoom-reset') zoom(0);
    else if (action === 'toggle-borders') {
      const hidden = tr.classList.toggle('nb');
      button.setAttribute('aria-pressed', String(!hidden));
    }
  });

  /* ---------- territórios ---------- */
  $('#bs').replaceChildren(
    ...Object.entries(paths).map(([k, d]) =>
      s('path', { id: 't-' + k, class: 't', 'data-k': k, tabindex: 0, role: 'link', 'aria-label': porId[k].nome, d, 'fill-rule': 'evenodd' }),
    ),
    ...extraHit.map((k) => s('path', { class: 'th', 'data-k': k, d: paths[k] })),
  );

  /* ---------- destaque de região (hover/foco) ---------- */
  let current; // id destacado no momento
  const territory = (id) => document.getElementById('t-' + id);
  const outline = (k, cls) => (paths[k] ? s('path', { class: 'o ' + cls, d: paths[k], 'fill-rule': 'evenodd' }) : null);
  const kx = vbW / 100; // coordenadas do pino (0-100) → viewBox
  const ky = vbH / 100;

  function highlight(id) {
    if (id === current) return;
    current = id;
    const lines = $('#ln');
    const hl = $('#hl');
    $$('path.i', tr).forEach((p) => p.classList.remove('i'));
    if (!id) {
      tr.classList.remove('f');
      hl.replaceChildren();
      lines.replaceChildren();
      return;
    }
    const r = porId[id];
    const valid = (list) => list.filter((k) => porId[k]);
    const line = (k, color, dashed) =>
      s('line', {
        x1: r.mapa.x * kx,
        y1: r.mapa.y * ky,
        x2: porId[k].mapa.x * kx,
        y2: porId[k].mapa.y * ky,
        stroke: color,
        'stroke-width': 2.5,
        'stroke-dasharray': dashed ? '7 6' : null,
        'vector-effect': 'non-scaling-stroke',
      });
    let enemies = valid(r.inimigos);
    if (!enemies.length && r.inimigos.length) enemies = lista.map((x) => x.id).filter((k) => k != id); // "Todos os outros"
    const allies = valid(r.aliados);
    const own = territory(id);
    tr.style.setProperty('--hc', (own && own.style.getPropertyValue('--lc')) || r.cor);
    tr.classList.add('f');
    [id, ...allies, ...enemies].forEach((k) => {
      const p = territory(k);
      if (p) p.classList.add('i');
    });
    hl.replaceChildren(
      ...[...enemies.map((k) => outline(k, 'e')), ...allies.map((k) => outline(k, 'a')), outline(id, 'h')].filter(Boolean),
    );
    lines.replaceChildren(...allies.map((k) => line(k, '#6fcf7f')), ...enemies.map((k) => line(k, '#e0584f', true)));
  }

  const regionOf = (e) => e.target.closest && e.target.closest('[data-k]');
  tr.addEventListener('mouseover', (e) => {
    const p = regionOf(e);
    if (p) highlight(p.dataset.k);
  });
  tr.addEventListener('mousemove', (e) => {
    const p = regionOf(e);
    if (!p) return;
    const box = map.getBoundingClientRect();
    const r = porId[p.dataset.k];
    tooltip.textContent = r.nome;
    tooltip.style.setProperty('--c', r.cor);
    tooltip.style.left = e.clientX - box.left + 'px';
    tooltip.style.top = e.clientY - box.top + 'px';
    tooltip.style.opacity = 1;
  });
  tr.addEventListener('mouseout', (e) => {
    const to = e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest('[data-k]');
    if (!to) {
      highlight();
      tooltip.style.opacity = 0;
    }
  });
  tr.addEventListener('click', (e) => {
    const p = regionOf(e);
    if (p) location.hash = p.dataset.k;
  });
  tr.addEventListener('focusin', (e) => {
    const p = regionOf(e);
    if (p) highlight(p.dataset.k);
  });
  tr.addEventListener('focusout', () => highlight());
  tr.addEventListener('keydown', (e) => {
    const p = regionOf(e);
    if (p && (e.key == 'Enter' || e.key == ' ')) {
      e.preventDefault();
      location.hash = p.dataset.k;
    }
  });
  on('route', () => highlight()); // trocar de página limpa o destaque

  /* ---------- camadas temáticas e legenda ---------- */
  const layerBar = $('#lay');
  function setLayer(i) {
    const field = LAYERS[i][1];
    const colors = {};
    $$('button', layerBar).forEach((b, j) => b.classList.toggle('on', j == i));
    lista.forEach((r) => {
      let color = r.cor;
      if (field >= 0) {
        const key = groupKey(field, r.resumoLista[field]);
        color = colors[key] = colors[key] || PALETTE[Object.keys(colors).length % PALETTE.length];
      }
      const t = territory(r.id);
      if (!t) return;
      if (field >= 0) {
        t.style.setProperty('--lc', color);
        t.style.setProperty('--lo', 0.42);
      } else {
        t.style.removeProperty('--lc');
        t.style.removeProperty('--lo');
      }
    });
    $('#leg').replaceChildren(
      ...Object.entries(colors).map(([name, color]) => h('span', { style: { '--c': color } }, h('i'), name)),
      h('span', null, h('u'), 'Aliado'),
      h('span', { class: 'e' }, h('u'), 'Inimigo'),
    );
  }
  layerBar.replaceChildren(...LAYERS.map((layer, i) => h('button', { 'data-layer': i }, layer[0])));
  layerBar.addEventListener('click', (e) => {
    const button = e.target.closest('button[data-layer]');
    if (button) setLayer(Number(button.dataset.layer));
  });
  setLayer(0);
}
