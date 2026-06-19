(function () {
  var menuButton = document.querySelector('[data-menu-toggle]');
  var mobileMenu = document.querySelector('[data-mobile-menu]');

  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', function () {
      mobileMenu.classList.toggle('is-open');
    });
  }

  var yearTarget = document.querySelector('[data-year]');
  if (yearTarget) {
    yearTarget.textContent = new Date().getFullYear();
  }

  document.querySelectorAll('[data-hero]').forEach(function (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var index = 0;

    function show(next) {
      if (!slides.length) {
        return;
      }
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === index);
      });
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener('click', function () {
        show(dotIndex);
      });
    });

    show(0);
    if (slides.length > 1) {
      setInterval(function () {
        show(index + 1);
      }, 5000);
    }
  });

  document.querySelectorAll('[data-filter-panel]').forEach(function (panel) {
    var root = panel.parentElement || document;
    var form = panel.querySelector('[data-filter-form]');
    var input = panel.querySelector('[data-filter-input]');
    var sortSelect = panel.querySelector('[data-sort-select]');
    var categorySelect = panel.querySelector('[data-filter-select="category"]');
    var typeSelect = panel.querySelector('[data-filter-select="type"]');
    var cards = Array.prototype.slice.call(root.querySelectorAll('.movie-card, .movie-row, .rank-row'));
    var grid = root.querySelector('[data-card-grid]') || root.querySelector('.movie-grid') || root.querySelector('.movie-list');

    function textOf(card) {
      return [
        card.dataset.title,
        card.dataset.year,
        card.dataset.region,
        card.dataset.type,
        card.dataset.category,
        card.dataset.genre
      ].join(' ').toLowerCase();
    }

    function apply() {
      var keyword = input ? input.value.trim().toLowerCase() : '';
      var category = categorySelect ? categorySelect.value : '';
      var type = typeSelect ? typeSelect.value : '';
      cards.forEach(function (card) {
        var matchedKeyword = !keyword || textOf(card).indexOf(keyword) !== -1;
        var matchedCategory = !category || textOf(card).indexOf(category.toLowerCase()) !== -1;
        var matchedType = !type || String(card.dataset.type || '').indexOf(type) !== -1;
        card.classList.toggle('hidden-by-filter', !(matchedKeyword && matchedCategory && matchedType));
      });
      sortCards();
    }

    function sortCards() {
      if (!grid || !sortSelect) {
        return;
      }
      var mode = sortSelect.value;
      var sorted = cards.slice().sort(function (a, b) {
        if (mode === 'title') {
          return String(a.dataset.title || '').localeCompare(String(b.dataset.title || ''), 'zh-Hans-CN');
        }
        if (mode === 'score') {
          return Number(b.dataset.score || 0) - Number(a.dataset.score || 0);
        }
        if (mode === 'hot') {
          return Number(b.dataset.hot || 0) - Number(a.dataset.hot || 0);
        }
        return Number(b.dataset.year || 0) - Number(a.dataset.year || 0);
      });
      sorted.forEach(function (card) {
        grid.appendChild(card);
      });
    }

    if (form) {
      form.addEventListener('submit', function (event) {
        event.preventDefault();
      });
    }
    [input, sortSelect, categorySelect, typeSelect].forEach(function (control) {
      if (control) {
        control.addEventListener('input', apply);
        control.addEventListener('change', apply);
      }
    });
    sortCards();
  });
})();
