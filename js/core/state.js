/**
 * Estado global mínimo + barramento de eventos.
 * Os módulos se comunicam por eventos em vez de importarem uns aos outros.
 *   'route'          (id)      — o hash da URL mudou
 *   'master:change'  (ligado)  — Modo Mestre foi alternado
 */
const listeners = new Map();

export function on(event, fn) {
  if (!listeners.has(event)) listeners.set(event, new Set());
  listeners.get(event).add(fn);
  return () => listeners.get(event).delete(fn);
}

export function emit(event, payload) {
  (listeners.get(event) || []).forEach((fn) => fn(payload));
}

export const state = {
  masterMode: false,
};
