(function () {
    function ready(fn) {
        if (document.readyState !== "loading") {
            fn();
        } else {
            document.addEventListener("DOMContentLoaded", fn);
        }
    }

    ready(function () {
        var menuButton = document.querySelector(".menu-toggle");
        var mobilePanel = document.querySelector(".mobile-panel");

        if (menuButton && mobilePanel) {
            menuButton.addEventListener("click", function () {
                mobilePanel.classList.toggle("open");
            });
        }

        var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
        var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
        var current = 0;

        function showSlide(index) {
            if (!slides.length) {
                return;
            }

            current = (index + slides.length) % slides.length;

            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("active", slideIndex === current);
            });

            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("active", dotIndex === current);
            });
        }

        if (slides.length) {
            dots.forEach(function (dot, dotIndex) {
                dot.addEventListener("click", function () {
                    showSlide(dotIndex);
                });
            });

            window.setInterval(function () {
                showSlide(current + 1);
            }, 5200);
        }

        var filterRoot = document.querySelector("[data-filter-root]");

        if (filterRoot) {
            var input = filterRoot.querySelector("[data-filter-input]");
            var yearSelect = filterRoot.querySelector("[data-filter-year]");
            var typeSelect = filterRoot.querySelector("[data-filter-type]");
            var regionSelect = filterRoot.querySelector("[data-filter-region]");
            var clearButton = filterRoot.querySelector("[data-filter-clear]");
            var cards = Array.prototype.slice.call(filterRoot.querySelectorAll(".movie-card"));
            var emptyState = filterRoot.querySelector(".empty-state");

            var query = new URLSearchParams(window.location.search).get("q");

            if (query && input) {
                input.value = query;
            }

            function normalize(value) {
                return String(value || "").toLowerCase().trim();
            }

            function applyFilter() {
                var keyword = normalize(input ? input.value : "");
                var yearValue = yearSelect ? yearSelect.value : "";
                var typeValue = typeSelect ? typeSelect.value : "";
                var regionValue = regionSelect ? regionSelect.value : "";
                var visible = 0;

                cards.forEach(function (card) {
                    var content = normalize(card.getAttribute("data-searchable"));
                    var yearOk = !yearValue || card.getAttribute("data-year") === yearValue;
                    var typeOk = !typeValue || card.getAttribute("data-type") === typeValue;
                    var regionOk = !regionValue || card.getAttribute("data-region") === regionValue;
                    var keywordOk = !keyword || content.indexOf(keyword) !== -1;
                    var show = yearOk && typeOk && regionOk && keywordOk;

                    card.style.display = show ? "" : "none";

                    if (show) {
                        visible += 1;
                    }
                });

                if (emptyState) {
                    emptyState.classList.toggle("show", visible === 0);
                }
            }

            [input, yearSelect, typeSelect, regionSelect].forEach(function (node) {
                if (node) {
                    node.addEventListener("input", applyFilter);
                    node.addEventListener("change", applyFilter);
                }
            });

            if (clearButton) {
                clearButton.addEventListener("click", function () {
                    if (input) {
                        input.value = "";
                    }

                    if (yearSelect) {
                        yearSelect.value = "";
                    }

                    if (typeSelect) {
                        typeSelect.value = "";
                    }

                    if (regionSelect) {
                        regionSelect.value = "";
                    }

                    applyFilter();
                });
            }

            applyFilter();
        }
    });

    window.setupMoviePlayer = function (streamUrl) {
        var video = document.getElementById("moviePlayer");
        var cover = document.querySelector(".player-cover");
        var playButton = document.querySelector(".play-button");
        var attached = false;

        if (!video || !streamUrl) {
            return;
        }

        function attachStream() {
            if (attached) {
                return;
            }

            attached = true;

            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = streamUrl;
            } else if (window.Hls && window.Hls.isSupported()) {
                var hls = new window.Hls();
                hls.loadSource(streamUrl);
                hls.attachMedia(video);
            } else {
                video.src = streamUrl;
            }
        }

        function startPlayback() {
            attachStream();

            if (cover) {
                cover.classList.add("hidden");
            }

            var playPromise = video.play();

            if (playPromise && typeof playPromise.catch === "function") {
                playPromise.catch(function () {});
            }
        }

        if (cover) {
            cover.addEventListener("click", startPlayback);
        }

        if (playButton) {
            playButton.addEventListener("click", function (event) {
                event.preventDefault();
                event.stopPropagation();
                startPlayback();
            });
        }

        video.addEventListener("play", function () {
            if (cover) {
                cover.classList.add("hidden");
            }
        });

        video.addEventListener("click", function () {
            if (video.paused) {
                startPlayback();
            }
        });
    };
})();
