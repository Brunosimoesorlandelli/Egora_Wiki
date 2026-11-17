/** Sobreposição em tela cheia (usada pela página de região). */
export function createModal(root, { closeButton } = {}) {
  return {
    isOpen: () => root.classList.contains('on'),
    open() {
      root.classList.add('on');
      root.scrollTop = 0;
      if (closeButton) closeButton.focus({ preventScroll: true });
      document.body.style.overflow = 'hidden';
    },
    close() {
      root.classList.remove('on');
      document.body.style.overflow = '';
    },
  };
}
