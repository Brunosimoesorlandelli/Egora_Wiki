/** Aba "Vínculos" (Política e Tempo): árvores de família, grupos e diagrama de relações entre personagens. */
import { h, s } from '../core/dom.js';
import { getRegions } from '../core/data.js';
import { getRelationGraph } from '../core/relations.js';
import { createCollection } from '../components/family-tree.js';

export async function initRelations(container) {
  const [{ porId }, graph] = await Promise.all([getRegions(), getRelationGraph()]);
  const choices = [['todos', 'Todos'], ...graph.colecoes.map((c) => [c.id, c.curto || c.nome])];
  const bar = h('div', { class: 'bar' }, choices.map(([id, nome]) => h('button', { 'data-c': id }, nome)));
  const out = h('div');

  function draw(id) {
    [...bar.children].forEach((b) => b.classList.toggle('on', b.dataset.c == id));
    const col = graph.colecoes.find((c) => c.id == id);
    out.replaceChildren(
      col ? h('div', { style: { '--acc': porId[col.regiao].cor } }, h('p', { class: 'sub' }, col.nota), createCollection(col)) : null,
      renderDiagram(graph, porId, col),
    );
  }
  bar.addEventListener('click', (e) => {
    const b = e.target.closest('button[data-c]');
    if (b) draw(b.dataset.c);
  });
  container.replaceChildren(
    h('p', { class: 'sub' }, 'Escolha uma família ou grupo. Passe o mouse num personagem para isolar seus vínculos; clique para abrir a ficha.'),
    bar,
    out,
  );
  draw(graph.colecoes[0].id);
}

function renderDiagram(graph, porId, col) {
  const edges = graph.edges.filter((e) => (col ? col.keys.has(e.a) && col.keys.has(e.b) : e.tipo != 'grupo'));
  const keys = col ? [...col.keys] : [...new Set(edges.flatMap((e) => [e.a, e.b]))];
  const n = keys.length;
  const big = n > 16;
  const W = 1000;
  const H = big ? 760 : 600;
  const R = big ? 290 : 210;
  const r = big ? 15 : 22;
  const pos = {};
  keys.forEach((k, i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    pos[k] = [W / 2 + R * Math.cos(a), H / 2 + R * Math.sin(a), a];
  });

  const svg = s('svg', { viewBox: `0 0 ${W} ${H}`, id: 'rg2', role: 'img', 'aria-label': 'Diagrama de relações entre personagens' });
  edges.forEach((e) =>
    svg.append(
      s('line', {
        'data-a': e.a,
        'data-b': e.b,
        x1: pos[e.a][0],
        y1: pos[e.a][1],
        x2: pos[e.b][0],
        y2: pos[e.b][1],
        stroke: graph.tipos[e.tipo].cor,
        'stroke-width': 2.5,
        'stroke-opacity': e.tipo == 'grupo' ? 0.4 : 1,
      }),
    ),
  );

  const lines = [...svg.querySelectorAll('line')];
  const highlight = (key) => {
    lines.forEach((l) => (l.style.opacity = !key || l.dataset.a == key || l.dataset.b == key ? 1 : 0.08));
    svg.querySelectorAll('.nd').forEach((g) => {
      const k = g.dataset.k;
      const related = lines.some((l) => (l.dataset.a == key && l.dataset.b == k) || (l.dataset.b == key && l.dataset.a == k));
      g.style.opacity = !key || k == key || related ? 1 : 0.25;
    });
  };

  keys.forEach((k) => {
    const node = graph.nodes.get(k);
    const [x, y, a] = pos[k];
    const c = Math.cos(a);
    const sn = Math.sin(a);
    const color = (porId[node.regiao] || {}).cor || '#888';
    const open = () => {
      if (node.id) location.hash = 'p-' + node.id;
    };
    svg.append(
      s(
        'g',
        {
          class: 'nd',
          'data-k': k,
          tabindex: 0,
          on: {
            mouseenter: () => highlight(k),
            mouseleave: () => highlight(),
            focus: () => highlight(k),
            blur: () => highlight(),
            click: open,
            keydown: (e) => {
              if (e.key == 'Enter' || e.key == ' ') {
                e.preventDefault();
                open();
              }
            },
          },
        },
        s('circle', { cx: x, cy: y, r, fill: node.id ? color : 'none', stroke: node.id ? '#fff' : color, 'stroke-width': 2, 'stroke-dasharray': node.id ? null : '4 3' }),
        s(
          'text',
          { x: x + c * (r + 10), y: y + sn * (r + 10) + 4, 'text-anchor': Math.abs(c) < 0.3 ? 'middle' : c > 0 ? 'start' : 'end', style: big ? { fontSize: '11px' } : null },
          node.nome,
        ),
      ),
    );
  });

  const used = new Set(edges.map((e) => e.tipo));
  return h(
    'div',
    null,
    svg,
    h('div', { class: 'leg' }, Object.entries(graph.tipos).filter(([t]) => used.has(t)).map(([, t]) => h('span', null, h('u', { style: { borderTopColor: t.cor } }), t.nome))),
  );
}
