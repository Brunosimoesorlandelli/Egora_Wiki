/**
 * Grafo de relações entre personagens, montado a partir de data/relationships.json.
 * Famílias (árvores) geram cônjuge/filhos/pais/irmãos; grupos ligam todos os membros;
 * "vinculos" são relações avulsas. Personagens sem ficha viram nós "fantasma" (id nulo).
 */
import { getCharacters, getRelations } from './data.js';

let promise = null;

export function getRelationGraph() {
  if (!promise) {
    promise = build().catch((err) => {
      promise = null;
      throw err;
    });
  }
  return promise;
}

const slug = (t) =>
  t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

async function build() {
  const [chars, data] = await Promise.all([getCharacters(), getRelations()]);
  const byId = new Map(chars.map((c) => [c.id, c]));
  const nodes = new Map(); // chave → { key, id, nome, papel, imagem, regiao }
  const edges = []; // { a, b, tipo, col } (uma por par/tipo/coleção)
  const links = new Map(); // chave → [{ outro, rotulo, tipo, col }]
  const seen = new Set();
  let region = null; // região padrão dos nós fantasma da coleção atual

  const ref = (x) => {
    const def = typeof x === 'string' ? { id: x } : x;
    const c = def.id && byId.get(def.id);
    const key = c ? c.id : 'x-' + slug(def.nome || def.id);
    if (!nodes.has(key)) {
      nodes.set(key, {
        key,
        id: c ? c.id : null,
        nome: c ? c.nome : def.nome || def.id,
        papel: c ? c.papel : def.nota || '',
        imagem: c ? c.imagem : '',
        regiao: c ? c.regiao : def.regiao || region,
      });
    }
    return nodes.get(key);
  };
  const push = (a, b, rotulo, tipo, col) => {
    if (!links.has(a.key)) links.set(a.key, []);
    links.get(a.key).push({ outro: b, rotulo, tipo, col });
  };
  /** ab = como B aparece na ficha de A; ba = como A aparece na ficha de B. */
  const add = (a, b, tipo, ab, ba, col) => {
    if (a === b) return;
    const k = [a.key, b.key].sort().join('|') + '|' + tipo + '|' + col;
    if (seen.has(k)) return;
    seen.add(k);
    edges.push({ a: a.key, b: b.key, tipo, col });
    push(a, b, ab, tipo, col);
    push(b, a, ba, tipo, col);
  };

  const colecoes = data.colecoes.map((def) => {
    region = def.regiao;
    const col = { ...def, keys: new Set() };
    if (def.arvore) {
      const walk = (n) => {
        const pais = n.pais.map(ref);
        pais.forEach((p) => col.keys.add(p.key));
        if (pais.length > 1) add(pais[0], pais[1], 'familia', 'Cônjuge', 'Cônjuge', def.id);
        const filhos = (n.filhos || []).map(walk);
        filhos.forEach((f) => pais.forEach((p) => add(p, f.pais[0], 'familia', 'Filhos', 'Pais', def.id)));
        for (let i = 0; i < filhos.length; i++)
          for (let j = i + 1; j < filhos.length; j++)
            add(filhos[i].pais[0], filhos[j].pais[0], 'familia', 'Irmãos', 'Irmãos', def.id);
        return { pais, filhos };
      };
      col.arvore = walk(def.arvore);
    } else {
      col.membros = def.membros.map(ref);
      col.membros.forEach((m) => col.keys.add(m.key));
      for (let i = 0; i < col.membros.length; i++)
        for (let j = i + 1; j < col.membros.length; j++)
          add(col.membros[i], col.membros[j], 'grupo', def.nome, def.nome, def.id);
    }
    return col;
  });

  region = null;
  (data.vinculos || []).forEach((v) => add(ref(v.a), ref(v.b), v.tipo, v.ab, v.ba, 'vinculos'));

  return { tipos: data.tipos, colecoes, nodes, edges, links };
}
