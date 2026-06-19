(function () {
  const navToggle = document.querySelector('[data-nav-toggle]');
  const nav = document.querySelector('[data-main-nav]');

  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      nav.classList.toggle('is-open');
    });
  }

  const hero = document.querySelector('[data-hero]');

  if (hero) {
    const slides = Array.from(hero.querySelectorAll('[data-hero-slide]'));
    const dots = Array.from(hero.querySelectorAll('[data-hero-dot]'));
    let active = 0;

    const showSlide = function (next) {
      if (!slides.length) {
        return;
      }

      active = (next + slides.length) % slides.length;

      slides.forEach(function (slide, index) {
        slide.classList.toggle('is-active', index === active);
      });

      dots.forEach(function (dot, index) {
        dot.classList.toggle('is-active', index === active);
      });
    };

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        showSlide(index);
      });
    });

    window.setInterval(function () {
      showSlide(active + 1);
    }, 5200);
  }

  const searchInput = document.querySelector('[data-movie-search]');
  const counter = document.querySelector('[data-search-count]');
  const cards = Array.from(document.querySelectorAll('[data-movie-card]'));

  if (searchInput && cards.length) {
    const update = function () {
      const query = searchInput.value.trim().toLowerCase();
      let visible = 0;

      cards.forEach(function (card) {
        const haystack = [
          card.dataset.title,
          card.dataset.year,
          card.dataset.region,
          card.dataset.genre,
          card.dataset.category,
          card.textContent
        ].join(' ').toLowerCase();

        const matched = !query || haystack.includes(query);
        card.classList.toggle('is-hidden', !matched);

        if (matched) {
          visible += 1;
        }
      });

      if (counter) {
        counter.textContent = visible + ' 部';
      }
    };

    searchInput.addEventListener('input', update);
    update();
  }
})();
