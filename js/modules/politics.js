/**
 * Seção "Política e Tempo": abas Relações (diagrama), Comparador e Linha do tempo.
 * A linha do tempo (timeline.js) só é carregada na primeira vez que a aba é aberta.
 */
import { $, $$, h, s } from '../core/dom.js';
import { getRegions, getPolitics } from '../core/data.js';

const shortName = (region) => region.nome.replace(/^(Reino de |Império )/, '');

export async function initPolitics(section) {
  const [regions, politics] = await Promise.all([getRegions(), getPolitics()]);
  renderRelations($('#p0'), regions, politics.diagrama);
  renderComparator($('#p1'), regions);
  setupTabs(section);
}

/* ---------- abas ---------- */
function setupTabs(section) {
  let timelineStarted = false;
  let relationsStarted = false;
  const panels = $$('.pp', section);
  const show = (i) => {
    $$('#pt button', section).forEach((b, j) => b.classList.toggle('on', j == i));
    panels.forEach((p, j) => (p.hidden = j != i));
    if (i == 2 && !timelineStarted) {
      timelineStarted = true;
      import('./timeline.js')
        .then((m) => m.initTimeline(panels[2]))
        .catch((err) => {
          timelineStarted = false;
          console.error(err);
          panels[2].replaceChildren(h('p', { class: 'sub' }, 'Não foi possível carregar a linha do tempo.'));
        });
    }
    if (i == 3 && !relationsStarted) {
      relationsStarted = true;
      import('./relations.js')
        .then((m) => m.initRelations(panels[3]))
        .catch((err) => {
          relationsStarted = false;
          console.error(err);
          panels[3].replaceChildren(h('p', { class: 'sub' }, 'Não foi possível carregar os vínculos.'));
        });
    }
  };
  $('#pt', section).addEventListener('click', (e) => {
    const button = e.target.closest('button[data-tab]');
    if (button) show(Number(button.dataset.tab));
  });
}

/* ---------- Relações: diagrama circular ---------- */
function renderRelations(container, { lista, porId }, info) {
  const ids = lista.map((r) => r.id).filter((k) => k != info.inimigoComum);
  const n = ids.length;
  const pos = {};
  ids.forEach((k, i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    pos[k] = [380 + 190 * Math.cos(a), 270 + 190 * Math.sin(a), a];
  });

  // arestas únicas por par; a última declaração (aliança ou rivalidade) vale
  const edges = new Map();
  lista.forEach((r) =>
    [
      [r.aliados, 'a'],
      [r.inimigos, 'e'],
    ].forEach(([list, type]) =>
      list.forEach((k) => {
        if (pos[k] && pos[r.id]) edges.set([r.id, k].sort().join('-'), [r.id, k, type]);
      }),
    ),
  );

  const svg = s('svg', { viewBox: '0 0 760 540', id: 'rg', role: 'img', 'aria-label': 'Diagrama de alianças e rivalidades' });
  edges.forEach(([a, b, type]) =>
    svg.append(
      s('line', {
        'data-a': a,
        'data-b': b,
        x1: pos[a][0],
        y1: pos[a][1],
        x2: pos[b][0],
        y2: pos[b][1],
        stroke: type == 'a' ? '#6fcf7f' : '#e0584f',
        'stroke-width': 3,
        'stroke-dasharray': type == 'e' ? '8 6' : null,
      }),
    ),
  );

  const highlight = (key) => {
    const lines = [...svg.querySelectorAll('line')];
    lines.forEach((l) => (l.style.opacity = !key || l.dataset.a == key || l.dataset.b == key ? 1 : 0.08));
    svg.querySelectorAll('.nd').forEach((g) => {
      const k = g.dataset.k;
      const related = lines.some((l) => (l.dataset.a == key && l.dataset.b == k) || (l.dataset.b == key && l.dataset.a == k));
      g.style.opacity = !key || k == key || related ? 1 : 0.25;
    });
  };
  const open = (id) => () => {
    location.hash = id;
  };

  ids.forEach((k) => {
    const [x, y, a] = pos[k];
    const c = Math.cos(a);
    const sn = Math.sin(a);
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
            click: open(k),
          },
        },
        s('circle', { cx: x, cy: y, r: 24, fill: porId[k].cor, stroke: '#fff', 'stroke-width': 2 }),
        s(
          'text',
          { x: x + c * 34, y: y + sn * 34 + 4, 'text-anchor': Math.abs(c) < 0.3 ? 'middle' : c > 0 ? 'start' : 'end' },
          shortName(porId[k]),
        ),
      ),
    );
  });

  // inimigo comum (fora do círculo)
  const common = porId[info.inimigoComum];
  svg.append(
    s(
      'g',
      { class: 'nd', 'data-k': common.id, tabindex: 0, on: { click: open(common.id) } },
      s('circle', { cx: 672, cy: 64, r: 34, fill: 'none', stroke: '#e0584f', 'stroke-width': 2, 'stroke-dasharray': '6 5' }),
      s('circle', { cx: 672, cy: 64, r: 24, fill: common.cor, stroke: '#fff', 'stroke-width': 2 }),
      s('text', { x: 672, y: 122, 'text-anchor': 'middle' }, common.nome),
    ),
    s('text', { x: 672, y: 140, 'text-anchor': 'middle', style: { fill: 'var(--mut)', fontSize: '12px' } }, info.legendaInimigoComum),
  );

  container.replaceChildren(
    svg,
    h(
      'div',
      { class: 'leg' },
      h('span', null, h('u'), 'Aliança'),
      h('span', { class: 'e' }, h('u'), 'Rivalidade'),
      h('span', null, info.nota),
    ),
  );
}

/* ---------- Comparador de regiões ---------- */
function renderComparator(container, { lista, porId, campos }) {
  const names = (ids) => (ids.length ? ids.map((k) => (porId[k] ? porId[k].nome : k)).join(', ') : 'Nenhum');
  const defaults = ['sar', 'rav', 'dra'];
  const selects = defaults.map((value, i) =>
    h(
      'select',
      { id: 'cs' + i, 'aria-label': `Região ${i + 1}`, on: { change: compare } },
      h('option', { value: '' }, '—'),
      lista.map((r) => h('option', { value: r.id, selected: r.id == value }, r.nome)),
    ),
  );
  const table = h('table', { id: 'ct' });

  function compare() {
    const chosen = selects.map((sel) => sel.value).filter(Boolean).map((k) => porId[k]);
    const row = (label, get, markEqual) => {
      const values = chosen.map(get);
      const equal = markEqual && values.length > 1 && values.every((x) => x == values[0]);
      return h('tr', { class: equal ? 'eq' : '' }, h('td', null, label), values.map((x) => h('td', null, x)));
    };
    table.replaceChildren(
      h(
        'tbody',
        null,
        h('tr', null, h('th'), chosen.map((r) => h('th', { style: { color: r.cor } }, r.nome))),
        row('Lema', (r) => r.lema),
        campos.map((campo, i) => row(campo, (r) => r.resumoLista[i], true)),
        row('Aliados', (r) => names(r.aliados)),
        row('Inimigos', (r) => names(r.inimigos)),
      ),
    );
  }

  container.replaceChildren(
    h('p', { class: 'sub' }, 'Escolha até três regiões. Linhas em cinza têm o mesmo valor em todas.'),
    h('div', { class: 'cmp' }, selects),
    h('div', { class: 'ctw' }, table),
  );
  compare();
}
