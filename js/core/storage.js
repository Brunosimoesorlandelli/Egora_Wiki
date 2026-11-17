/** Acesso seguro ao localStorage (pode falhar em modo privado ou com cota cheia). */
export const KEYS = {
  theme: 'egt',        // tema visual escolhido
  master: 'egm',       // Modo Mestre ligado ("1") ou desligado ("0")
  notePrefix: 'egn-',  // anotações do mestre: egn-<id da região>
};

export const storage = {
  get(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  },
  set(key, value) {
    try { localStorage.setItem(key, value); return true; } catch (e) { return false; }
  },
};
