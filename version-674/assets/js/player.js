import { H as Hls } from './hls-vendor-dru42stk.js';

function toArray(value) {
  return Array.prototype.slice.call(value || []);
}

function attachHls(video) {
  var source = video.getAttribute('data-video-src');
  if (!source) {
    return;
  }

  if (Hls && Hls.isSupported()) {
    var hls = new Hls({
      enableWorker: true,
      lowLatencyMode: true
    });
    hls.loadSource(source);
    hls.attachMedia(video);
    hls.on(Hls.Events.ERROR, function (_, data) {
      if (data && data.fatal) {
        console.warn('HLS playback warning:', data.type, data.details);
      }
    });
    video._hlsInstance = hls;
  } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = source;
  }
}

function setupPlayerBox(box) {
  var video = box.querySelector('video[data-video-src]');
  var button = box.querySelector('[data-player-toggle]');
  if (!video) {
    return;
  }

  attachHls(video);

  function playOrPause() {
    if (video.paused) {
      video.play().then(function () {
        box.classList.add('is-playing');
      }).catch(function (error) {
        console.warn('Video play failed:', error);
      });
    } else {
      video.pause();
      box.classList.remove('is-playing');
    }
  }

  if (button) {
    button.addEventListener('click', playOrPause);
  }

  video.addEventListener('play', function () {
    box.classList.add('is-playing');
  });
  video.addEventListener('pause', function () {
    box.classList.remove('is-playing');
  });
  video.addEventListener('ended', function () {
    box.classList.remove('is-playing');
  });
}

document.addEventListener('DOMContentLoaded', function () {
  toArray(document.querySelectorAll('[data-player-box]')).forEach(setupPlayerBox);
});
