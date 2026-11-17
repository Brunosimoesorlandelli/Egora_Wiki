/**
 * Links automáticos: nomes de regiões e termos do glossário citados em textos
 * viram links (#<região> ou #g-<termo>), exceto a própria região da página.
 */
import { getRegions, getGlossary } from './data.js';

let linkerPromise = null;

async function buildLinker() {
  const [{ lista }, glossary] = await Promise.all([getRegions(), getGlossary()]);
  const entries = []; // [texto, href, classe, regiãoDona]
  lista.forEach((r) =>
    [r.nome, r.nome.replace(/^(Reino de |Império |Vila )/, '')].forEach((n) => entries.push([n, '#' + r.id, 'xl', r.id])),
  );
  glossary.forEach((g) =>
    [g.termo, ...(g.variacoes || [])].forEach((n) => entries.push([n, '#g-' + g.id, 'xl g', g.regiao])),
  );
  entries.sort((a, b) => b[0].length - a[0].length); // nomes mais longos primeiro
  const byText = new Map(entries.map((x) => [x[0], x]));
  const escape = (t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(
    '(?<![\\p{L}])(' + entries.map((x) => escape(x[0])).join('|') + ')(?![\\p{L}])',
    'gu',
  );

  /** Devolve um DocumentFragment com o texto e os links (sem usar innerHTML). */
  return function linkify(text, selfId) {
    const frag = document.createDocumentFragment();
    let last = 0;
    pattern.lastIndex = 0;
    let m;
    while ((m = pattern.exec(text))) {
      const entry = byText.get(m[0]);
      if (entry[3] === selfId) continue; // não linka a própria região
      if (m.index > last) frag.append(text.slice(last, m.index));
      const a = document.createElement('a');
      a.className = entry[2];
      a.setAttribute('href', entry[1]);
      a.textContent = m[0];
      frag.append(a);
      last = m.index + m[0].length;
    }
    if (last < text.length) frag.append(text.slice(last));
    return frag;
  };
}

export function getLinker() {
  if (!linkerPromise) {
    linkerPromise = buildLinker().catch((err) => {
      linkerPromise = null;
      throw err;
    });
  }
  return linkerPromise;
}
