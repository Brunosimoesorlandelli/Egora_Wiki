/**
 * Carregamento dos dados da wiki (arquivos JSON em /data).
 * Cada arquivo é buscado uma única vez, sob demanda, e fica em cache.
 * O caminho é resolvido a partir deste arquivo (import.meta.url), por isso
 * funciona em qualquer subdiretório, como o do GitHub Pages.
 */
const cache = new Map();

function loadJSON(file) {
  if (!cache.has(file)) {
    const url = new URL(`../../data/${file}`, import.meta.url);
    const promise = fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status} ao carregar ${file}`);
        return res.json();
      })
      .catch((err) => {
        cache.delete(file); // permite tentar de novo depois
        throw new Error(`Falha ao carregar data/${file}: ${err.message}`);
      });
    cache.set(file, promise);
  }
  return cache.get(file);
}

function expect(value, check, file, what) {
  if (!check(value)) throw new Error(`data/${file}: formato inválido (${what})`);
  return value;
}

const isArray = Array.isArray;
const byId = (list) => Object.assign(Object.create(null), Object.fromEntries(list.map((x) => [x.id, x])));

/** Regiões já combinadas com alianças/rivalidades de politics.json. */
export function getRegions() {
  return Promise.all([loadJSON('regions.json'), loadJSON('politics.json')]).then(([regions, politics]) => {
    expect(regions.regioes, isArray, 'regions.json', 'regioes');
    expect(regions.camposResumo, isArray, 'regions.json', 'camposResumo');
    const rel = expect(politics.relacoes, (v) => v && typeof v === 'object', 'politics.json', 'relacoes');
    const lista = regions.regioes.map((r) => ({
      id: r.id,
      nome: r.nome,
      lema: r.lema,
      cor: r.cor,
      mapa: r.mapa,
      capital: r.capital || '',
      imagem: r.imagem,
      bioma: r.bioma || 'plains',
      historia: r.historia || [],
      figuras: r.figuras || [],
      // valores do resumo na ordem de camposResumo ("—" quando ausente)
      resumoLista: regions.camposResumo.map((k) => (r.resumo || {})[k] || '—'),
      aliados: (rel[r.id] || {}).aliados || [],
      inimigos: (rel[r.id] || {}).inimigos || [],
      segredos: r.segredos || [],
      abas: r.abas || [],
    }));
    return { campos: regions.camposResumo, lista, porId: byId(lista) };
  });
}

export const getPolitics = () => loadJSON('politics.json');
export const getTerritories = () => loadJSON('map-territories.json');
export const getCharacters = () =>
  loadJSON('characters.json').then((d) => expect(d.personagens, isArray, 'characters.json', 'personagens'));
export const getGlossary = () =>
  loadJSON('glossary.json').then((d) => expect(d.glossario, isArray, 'glossary.json', 'glossario'));
export const getTimeline = () => loadJSON('timeline.json').then((d) => expect(d, (v) => isArray(v.linhaDoTempo), 'timeline.json', 'linhaDoTempo'));
export const getPantheon = () =>
  loadJSON('pantheon.json').then((d) => expect(d.panteao, isArray, 'pantheon.json', 'panteao'));
export const getRaces = () => loadJSON('races.json').then((d) => expect(d.racas, isArray, 'races.json', 'racas'));
