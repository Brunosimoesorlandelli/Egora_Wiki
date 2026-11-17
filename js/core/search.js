/**
 * Índice e consulta da busca. O índice é montado na primeira vez que a busca
 * é aberta, carregando só então os dados de personagens, panteão, raças e glossário.
 */
import { getRegions, getCharacters, getPantheon, getRaces, getGlossary } from './data.js';

/** Remove acentos e põe em minúsculas, para a busca ignorar diferenças de grafia. */
const normalize = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

let indexPromise = null;

async function buildIndex() {
  const [{ lista, porId }, characters, pantheon, races, glossary] = await Promise.all([
    getRegions(),
    getCharacters(),
    getPantheon(),
    getRaces(),
    getGlossary(),
  ]);
  // Cada entrada: [tipo, título, subtítulo, href, texto extra pesquisável]
  const index = [];
  lista.forEach((r) => index.push(['Região', r.nome, r.lema, '#' + r.id, r.historia + ' ' + r.figuras]));
  characters.forEach((c) => index.push(['Personagem', c.nome, c.papel + ' · ' + porId[c.regiao].nome, '#p-' + c.id]));
  pantheon.forEach((tier) =>
    tier.deuses.forEach((d) => index.push(['Deus', d.nome, (d.dominio || '') + ' · ' + tier.nivel, '#panteao'])),
  );
  races.forEach((x) => index.push(['Raça', x, '', '#racas']));
  glossary.forEach((g) => index.push(['Glossário', g.termo, g.definicao, '#g-' + g.id]));
  return index;
}

export function prepareSearch() {
  if (!indexPromise) {
    indexPromise = buildIndex().catch((err) => {
      indexPromise = null;
      throw err;
    });
  }
  return indexPromise;
}

/** Até 12 resultados: título começa com a busca (0), contém (1) ou texto extra contém (2). */
export async function search(query) {
  const q = normalize(query.trim());
  if (!q) return [];
  const index = await prepareSearch();
  return index
    .map((e) => {
      const title = normalize(e[1]);
      const rank = title.startsWith(q)
        ? 0
        : title.includes(q)
          ? 1
          : normalize(e[2] + ' ' + (e[4] || '')).includes(q)
            ? 2
            : 9;
      return [rank, e];
    })
    .filter((x) => x[0] < 9)
    .sort((a, b) => a[0] - b[0])
    .slice(0, 12)
    .map((x) => x[1]);
}
