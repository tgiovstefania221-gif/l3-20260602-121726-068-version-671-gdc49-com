(function () {
    var toggle = document.querySelector('[data-menu-toggle]');
    var menu = document.querySelector('[data-mobile-menu]');

    if (toggle && menu) {
        toggle.addEventListener('click', function () {
            menu.classList.toggle('is-open');
        });
    }

    document.querySelectorAll('[data-carousel]').forEach(function (carousel) {
        var slides = Array.prototype.slice.call(carousel.querySelectorAll('[data-slide]'));
        var dots = Array.prototype.slice.call(carousel.querySelectorAll('[data-slide-dot]'));
        var previous = carousel.querySelector('[data-slide-prev]');
        var next = carousel.querySelector('[data-slide-next]');
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
            }, 5000);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        if (previous) {
            previous.addEventListener('click', function () {
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

        carousel.addEventListener('mouseenter', stop);
        carousel.addEventListener('mouseleave', start);
        show(0);
        start();
    });

    document.querySelectorAll('[data-tab-button]').forEach(function (button) {
        button.addEventListener('click', function () {
            var target = button.getAttribute('data-tab-button');
            var group = button.closest('.content-section') || document;

            group.querySelectorAll('[data-tab-button]').forEach(function (item) {
                item.classList.toggle('is-active', item === button);
            });

            group.querySelectorAll('[data-tab-panel]').forEach(function (panel) {
                panel.classList.toggle('is-active', panel.getAttribute('data-tab-panel') === target);
            });
        });
    });

    function normalize(value) {
        return String(value || '').trim().toLowerCase();
    }

    function applyFilter(input) {
        var grid = document.querySelector('[data-filter-grid]');
        if (!grid) {
            return;
        }

        var query = normalize(input.value);
        var cards = Array.prototype.slice.call(grid.querySelectorAll('[data-card]'));

        cards.forEach(function (card) {
            var text = normalize([
                card.getAttribute('data-title'),
                card.getAttribute('data-region'),
                card.getAttribute('data-year'),
                card.getAttribute('data-genre'),
                card.getAttribute('data-tags')
            ].join(' '));

            card.classList.toggle('is-hidden-by-filter', query && text.indexOf(query) === -1);
        });
    }

    document.querySelectorAll('[data-filter-input]').forEach(function (input) {
        input.addEventListener('input', function () {
            applyFilter(input);
        });
    });

    var queryInput = document.querySelector('[data-query-sync]');

    if (queryInput) {
        var params = new URLSearchParams(window.location.search);
        var query = params.get('q') || '';
        queryInput.value = query;
        applyFilter(queryInput);
    }
})();
