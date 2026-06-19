import { H as Hls } from './hls.js';

function initializePlayer(container) {
    var video = container.querySelector('video');
    var button = container.querySelector('[data-play-button]');
    var source = container.getAttribute('data-src');
    var hls = null;
    var isReady = false;

    if (!video || !button || !source) {
        return;
    }

    function attachSource() {
        if (isReady) {
            return Promise.resolve();
        }

        isReady = true;

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = source;
            return Promise.resolve();
        }

        if (Hls && Hls.isSupported()) {
            hls = new Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hls.loadSource(source);
            hls.attachMedia(video);
            return new Promise(function (resolve) {
                hls.on(Hls.Events.MANIFEST_PARSED, function () {
                    resolve();
                });
            });
        }

        video.src = source;
        return Promise.resolve();
    }

    function playVideo() {
        button.classList.add('is-hidden');
        attachSource()
            .then(function () {
                return video.play();
            })
            .catch(function () {
                button.classList.remove('is-hidden');
                video.controls = true;
            });
    }

    button.addEventListener('click', playVideo);

    video.addEventListener('play', function () {
        button.classList.add('is-hidden');
    });

    video.addEventListener('pause', function () {
        if (!video.ended) {
            return;
        }
        button.classList.remove('is-hidden');
    });

    window.addEventListener('beforeunload', function () {
        if (hls) {
            hls.destroy();
        }
    });
}

document.querySelectorAll('[data-player]').forEach(initializePlayer);
