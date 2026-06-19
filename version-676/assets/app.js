(function () {
  function selectAll(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function setupMenu() {
    var toggle = document.querySelector("[data-menu-toggle]");
    var panel = document.querySelector("[data-mobile-panel]");
    if (!toggle || !panel) {
      return;
    }
    toggle.addEventListener("click", function () {
      panel.classList.toggle("is-open");
    });
  }

  function setupHero() {
    var hero = document.querySelector("[data-hero]");
    if (!hero) {
      return;
    }
    var slides = selectAll("[data-hero-slide]", hero);
    var dots = selectAll("[data-hero-dot]", hero);
    var prev = hero.querySelector("[data-hero-prev]");
    var next = hero.querySelector("[data-hero-next]");
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === index);
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
        timer = null;
      }
    }

    if (prev) {
      prev.addEventListener("click", function () {
        show(index - 1);
        start();
      });
    }
    if (next) {
      next.addEventListener("click", function () {
        show(index + 1);
        start();
      });
    }
    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener("click", function () {
        show(dotIndex);
        start();
      });
    });
    hero.addEventListener("mouseenter", stop);
    hero.addEventListener("mouseleave", start);
    show(0);
    start();
  }

  function setupFilters() {
    var bars = selectAll("[data-filter-bar]");
    bars.forEach(function (bar) {
      var catalog = bar.parentElement.querySelector("[data-catalog]");
      if (!catalog) {
        return;
      }
      var cards = selectAll("[data-movie-card]", catalog);
      bar.addEventListener("click", function (event) {
        var button = event.target.closest("[data-filter]");
        if (!button) {
          return;
        }
        selectAll("[data-filter]", bar).forEach(function (item) {
          item.classList.remove("is-active");
        });
        button.classList.add("is-active");
        var field = button.getAttribute("data-filter");
        var value = button.getAttribute("data-value");
        cards.forEach(function (card) {
          var visible = field === "all" || card.getAttribute("data-" + field) === value;
          card.style.display = visible ? "" : "none";
        });
      });
    });
  }

  function cardTemplate(movie) {
    var tags = movie.tags.slice(0, 3).map(function (tag) {
      return "<span>" + escapeHtml(tag) + "</span>";
    }).join("");
    return [
      "<article class=\"movie-card\">",
      "<a class=\"card-image\" href=\"./" + movie.file + "\">",
      "<img src=\"" + movie.cover + "\" alt=\"" + escapeHtml(movie.title) + "\" loading=\"lazy\">",
      "<span class=\"card-play\">▶</span>",
      "</a>",
      "<div class=\"card-body\">",
      "<div class=\"card-meta\"><span>" + escapeHtml(movie.year) + "</span><span>" + escapeHtml(movie.category) + "</span></div>",
      "<a class=\"card-title\" href=\"./" + movie.file + "\">" + escapeHtml(movie.title) + "</a>",
      "<p>" + escapeHtml(movie.oneLine) + "</p>",
      "<div class=\"tag-row\">" + tags + "</div>",
      "</div>",
      "</article>"
    ].join("");
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function setupSearch() {
    var results = document.querySelector("[data-search-results]");
    var summary = document.querySelector("[data-search-summary]");
    var input = document.querySelector("[data-search-input]");
    if (!results || !summary || !window.SEARCH_MOVIES) {
      return;
    }
    var params = new URLSearchParams(window.location.search);
    var query = (params.get("q") || "").trim();
    if (input) {
      input.value = query;
    }
    if (!query) {
      return;
    }
    var normalized = query.toLowerCase();
    var matched = window.SEARCH_MOVIES.filter(function (movie) {
      return movie.searchText.toLowerCase().indexOf(normalized) !== -1;
    }).slice(0, 120);
    if (!matched.length) {
      summary.textContent = "未找到相关影片";
      return;
    }
    summary.textContent = "搜索结果";
    results.innerHTML = matched.map(cardTemplate).join("");
  }

  document.addEventListener("DOMContentLoaded", function () {
    setupMenu();
    setupHero();
    setupFilters();
    setupSearch();
  });
}());
