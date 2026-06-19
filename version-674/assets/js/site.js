(function () {
  function toArray(value) {
    return Array.prototype.slice.call(value || []);
  }

  function normalize(text) {
    return String(text || '').trim().toLowerCase();
  }

  function setupNavigation() {
    var toggle = document.querySelector('[data-nav-toggle]');
    var nav = document.querySelector('[data-site-nav]');
    if (!toggle || !nav) {
      return;
    }
    toggle.addEventListener('click', function () {
      nav.classList.toggle('is-open');
    });
  }

  function setupHero() {
    var hero = document.querySelector('[data-hero]');
    if (!hero) {
      return;
    }
    var slides = toArray(hero.querySelectorAll('[data-hero-slide]'));
    var dots = toArray(hero.querySelectorAll('[data-hero-dot]'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    if (prev) {
      prev.addEventListener('click', function () {
        show(index - 1);
        start();
      });
    }
    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
        start();
      });
    }
    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener('click', function () {
        show(dotIndex);
        start();
      });
    });
    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    show(0);
    start();
  }

  function setupImageFallbacks() {
    toArray(document.querySelectorAll('[data-image-fallback]')).forEach(function (image) {
      image.addEventListener('error', function () {
        image.classList.add('is-missing');
      });
      if (image.complete && image.naturalWidth === 0) {
        image.classList.add('is-missing');
      }
    });
  }

  function setupFilters() {
    var panel = document.querySelector('[data-filter-panel]');
    var list = document.querySelector('[data-filter-list]');
    if (!panel || !list) {
      return;
    }
    var cards = toArray(list.querySelectorAll('[data-filter-card]'));
    var queryInput = panel.querySelector('[data-filter-query]');
    var categorySelect = panel.querySelector('[data-filter-category]');
    var yearSelect = panel.querySelector('[data-filter-year]');
    var typeSelect = panel.querySelector('[data-filter-type]');
    var sortSelect = panel.querySelector('[data-filter-sort]');
    var count = panel.querySelector('[data-filter-count]');
    var params = new URLSearchParams(window.location.search);

    if (queryInput && params.get('q')) {
      queryInput.value = params.get('q');
    }

    function matches(card) {
      var q = normalize(queryInput && queryInput.value);
      var category = normalize(categorySelect && categorySelect.value);
      var year = normalize(yearSelect && yearSelect.value);
      var type = normalize(typeSelect && typeSelect.value);
      var haystack = normalize(card.getAttribute('data-search'));
      var ok = true;

      if (q) {
        ok = ok && haystack.indexOf(q) !== -1;
      }
      if (category) {
        ok = ok && normalize(card.getAttribute('data-category')) === category;
      }
      if (year) {
        ok = ok && normalize(card.getAttribute('data-year')) === year;
      }
      if (type) {
        ok = ok && normalize(card.getAttribute('data-type')) === type;
      }
      return ok;
    }

    function applySort(visibleCards) {
      var mode = sortSelect ? sortSelect.value : 'year-desc';
      visibleCards.sort(function (a, b) {
        if (mode === 'heat-desc') {
          return Number(b.getAttribute('data-heat')) - Number(a.getAttribute('data-heat'));
        }
        if (mode === 'title-asc') {
          return normalize(a.getAttribute('data-title')).localeCompare(normalize(b.getAttribute('data-title')), 'zh-Hans-CN');
        }
        return Number(b.getAttribute('data-year')) - Number(a.getAttribute('data-year'));
      });
      visibleCards.forEach(function (card) {
        list.appendChild(card);
      });
    }

    function update() {
      var visible = [];
      cards.forEach(function (card) {
        var isMatch = matches(card);
        card.classList.toggle('is-hidden', !isMatch);
        if (isMatch) {
          visible.push(card);
        }
      });
      applySort(visible);
      if (count) {
        count.textContent = '显示 ' + visible.length + ' / ' + cards.length + ' 条';
      }
    }

    [queryInput, categorySelect, yearSelect, typeSelect, sortSelect].forEach(function (control) {
      if (!control) {
        return;
      }
      control.addEventListener('input', update);
      control.addEventListener('change', update);
    });
    update();
  }

  function setupNativeHlsFallback() {
    toArray(document.querySelectorAll('video[data-video-src]')).forEach(function (video) {
      var source = video.getAttribute('data-video-src');
      if (!source) {
        return;
      }
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    setupNavigation();
    setupHero();
    setupImageFallbacks();
    setupFilters();
    setupNativeHlsFallback();
  });
}());
