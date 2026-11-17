/** Animação de entrada (fade + subida) dos elementos ao rolar a página. */
let observer = null;

export function initReveal() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!('IntersectionObserver' in window)) return;
  observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          observer.unobserve(e.target);
        }
      }),
    { threshold: 0.08 },
  );
  reveal(document.querySelectorAll('section>h2,section>.sub,.map'));
}

/** Aplica a animação aos elementos informados (chamado também pelos módulos após renderizar). */
export function reveal(elements) {
  if (!observer) return;
  [...elements].forEach((el, i) => {
    el.classList.add('rv');
    el.style.transitionDelay = (i % 6) * 70 + 'ms';
    observer.observe(el);
  });
}
