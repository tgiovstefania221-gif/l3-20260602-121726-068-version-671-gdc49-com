import { H as Hls } from './hls-dru42stk.js';

function setupPlayer(root) {
  const video = root.querySelector('video');
  const button = root.querySelector('.player-cover');
  const source = root.getAttribute('data-stream');
  let loaded = false;
  let hls = null;

  if (!video || !button || !source) {
    return;
  }

  const load = function () {
    if (loaded) {
      return;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
    } else if (Hls && Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(source);
      hls.attachMedia(video);
    } else {
      video.src = source;
    }

    loaded = true;
  };

  const play = async function () {
    load();
    root.classList.add('is-playing');
    video.controls = true;

    try {
      await video.play();
    } catch (error) {
      root.classList.remove('is-playing');
      video.controls = true;
    }
  };

  button.addEventListener('click', play);
  video.addEventListener('click', function () {
    if (video.paused) {
      play();
    }
  });

  window.addEventListener('beforeunload', function () {
    if (hls) {
      hls.destroy();
      hls = null;
    }
  });
}

document.querySelectorAll('[data-player]').forEach(setupPlayer);
