(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  function setupMenu() {
    var toggle = document.querySelector("[data-menu-toggle]");
    var nav = document.querySelector("[data-mobile-nav]");
    if (!toggle || !nav) {
      return;
    }
    toggle.addEventListener("click", function () {
      nav.classList.toggle("open");
    });
  }

  function setupHero() {
    var hero = document.querySelector("[data-hero]");
    if (!hero) {
      return;
    }
    var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
    var prev = hero.querySelector("[data-hero-prev]");
    var next = hero.querySelector("[data-hero-next]");
    var index = 0;
    var timer;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("active", i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("active", i === index);
      });
    }

    function play() {
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5000);
    }

    function restart() {
      window.clearInterval(timer);
      play();
    }

    if (prev) {
      prev.addEventListener("click", function () {
        show(index - 1);
        restart();
      });
    }
    if (next) {
      next.addEventListener("click", function () {
        show(index + 1);
        restart();
      });
    }
    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        show(Number(dot.getAttribute("data-hero-dot")) || 0);
        restart();
      });
    });
    show(0);
    play();
  }

  function setupScrollStrips() {
    var strips = Array.prototype.slice.call(document.querySelectorAll("[data-scroll-strip]"));
    strips.forEach(function (strip) {
      var section = strip.closest("section") || document;
      var left = section.querySelector("[data-scroll-left]");
      var right = section.querySelector("[data-scroll-right]");
      function move(amount) {
        strip.scrollBy({ left: amount, behavior: "smooth" });
      }
      if (left) {
        left.addEventListener("click", function () {
          move(-320);
        });
      }
      if (right) {
        right.addEventListener("click", function () {
          move(320);
        });
      }
    });
  }

  function setupSearch() {
    var scopes = Array.prototype.slice.call(document.querySelectorAll("[data-search-scope]"));
    scopes.forEach(function (scope) {
      var input = scope.querySelector("[data-search-input]");
      var chips = Array.prototype.slice.call(scope.querySelectorAll("[data-filter-chip]"));
      var cards = Array.prototype.slice.call(scope.querySelectorAll("[data-filter-card]"));
      var active = "全部";

      function normalize(value) {
        return String(value || "").toLowerCase().trim();
      }

      function apply() {
        var keyword = input ? normalize(input.value) : "";
        cards.forEach(function (card) {
          var haystack = normalize([
            card.getAttribute("data-title"),
            card.getAttribute("data-category"),
            card.getAttribute("data-tags"),
            card.getAttribute("data-year"),
            card.getAttribute("data-region"),
            card.textContent
          ].join(" "));
          var keywordOk = !keyword || haystack.indexOf(keyword) !== -1;
          var chipOk = active === "全部" || haystack.indexOf(normalize(active)) !== -1;
          card.classList.toggle("is-hidden", !(keywordOk && chipOk));
        });
      }

      if (input) {
        input.addEventListener("input", apply);
      }
      chips.forEach(function (chip) {
        chip.addEventListener("click", function () {
          chips.forEach(function (item) {
            item.classList.remove("active");
          });
          chip.classList.add("active");
          active = chip.getAttribute("data-filter-chip") || "全部";
          apply();
        });
      });
    });
  }

  window.initMoviePlayer = function (streamUrl) {
    var video = document.querySelector("[data-video-player]");
    var button = document.querySelector("[data-play-button]");
    var hls;
    var attached = false;

    if (!video || !button || !streamUrl) {
      return;
    }

    function attach() {
      if (attached) {
        return;
      }
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = streamUrl;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(streamUrl);
        hls.attachMedia(video);
      } else {
        video.src = streamUrl;
      }
      attached = true;
    }

    function start() {
      attach();
      button.classList.add("is-hidden");
      video.controls = true;
      var action = video.play();
      if (action && typeof action.catch === "function") {
        action.catch(function () {});
      }
    }

    button.addEventListener("click", start);
    video.addEventListener("click", function () {
      if (!attached) {
        start();
      }
    });
    window.addEventListener("beforeunload", function () {
      if (hls) {
        hls.destroy();
      }
    });
  };

  ready(function () {
    setupMenu();
    setupHero();
    setupScrollStrips();
    setupSearch();
  });
})();
