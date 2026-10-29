(() => {
  document.body.classList.add('loading');
  const loader = document.getElementById('loader');
  const glow = document.getElementById('cursorGlow');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  window.addEventListener('load', () => {
    const wait = reduce ? 500 : 3000;
    setTimeout(() => {
      loader.classList.add('done');
      document.body.classList.remove('loading');
      document.querySelectorAll('.reveal, .reveal-delay').forEach((el, i) => {
        if (el.getBoundingClientRect().top < window.innerHeight * .9) {
          setTimeout(() => el.classList.add('is-visible'), Math.min(i * 70, 500));
        }
      });
    }, wait);
  });

  if (!reduce && glow) {
    let x = innerWidth / 2, y = innerHeight / 2, tx = x, ty = y;
    window.addEventListener('pointermove', e => { tx = e.clientX; ty = e.clientY; });
    const loop = () => {
      x += (tx - x) * .09; y += (ty - y) * .09;
      glow.style.left = x + 'px'; glow.style.top = y + 'px';
      requestAnimationFrame(loop);
    };
    loop();
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
        const delay = siblings.indexOf(entry.target);
        setTimeout(() => entry.target.classList.add('is-visible'), Math.max(0, delay) * 90);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .14, rootMargin: '0px 0px -5% 0px' });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // Tiny parallax on the large server banner.
  const banner = document.querySelector('.banner-image img');
  if (!reduce && banner) {
    window.addEventListener('scroll', () => {
      const rect = banner.parentElement.getBoundingClientRect();
      const p = (innerHeight - rect.top) / (innerHeight + rect.height);
      banner.style.transform = `scale(1.08) translateY(${(p - .5) * -28}px)`;
    }, { passive: true });
  }
})();
