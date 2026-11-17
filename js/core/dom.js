/**
 * Utilitários de DOM.
 * Toda renderização de conteúdo usa createElement/textContent (nunca innerHTML),
 * então textos vindos dos JSON nunca são interpretados como HTML.
 */
const SVG_NS = 'http://www.w3.org/2000/svg';

export const $ = (selector, root = document) => root.querySelector(selector);
export const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

function applyProps(el, props) {
  for (const [key, value] of Object.entries(props || {})) {
    if (value == null || value === false) continue;
    if (key === 'text') el.textContent = value;
    else if (key === 'style') {
      for (const [prop, val] of Object.entries(value)) {
        if (prop.startsWith('--')) el.style.setProperty(prop, val);
        else el.style[prop] = val;
      }
    } else if (key === 'data') {
      for (const [name, val] of Object.entries(value)) el.dataset[name] = val;
    } else if (key === 'on') {
      for (const [type, fn] of Object.entries(value)) el.addEventListener(type, fn);
    } else el.setAttribute(key, value === true ? '' : String(value));
  }
}

function appendChildren(el, children) {
  for (const child of children.flat(Infinity)) {
    if (child == null || child === false) continue;
    el.append(child instanceof Node ? child : document.createTextNode(String(child)));
  }
}

/** Cria um elemento HTML: h('div', { class: 'card', style: { '--c': '#fff' } }, 'texto', outroNo) */
export function h(tag, props, ...children) {
  const el = document.createElement(tag);
  applyProps(el, props);
  appendChildren(el, children);
  return el;
}

/** Cria um elemento SVG (mesma assinatura de h). */
export function s(tag, props, ...children) {
  const el = document.createElementNS(SVG_NS, tag);
  applyProps(el, props);
  appendChildren(el, children);
  return el;
}

/** Mostra uma mensagem de erro amigável dentro de um contêiner. */
export function showError(container, message) {
  if (!container) return;
  container.append(h('p', { class: 'sub', role: 'alert' }, message));
}
