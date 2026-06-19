import { H as Hls } from './hls-dru42stk.js';

document.addEventListener('DOMContentLoaded', function () {
  var players = Array.prototype.slice.call(document.querySelectorAll('[data-video-url]'));

  players.forEach(function (player) {
    var source = player.dataset.videoUrl;
    var video = player.querySelector('video');
    var button = player.querySelector('[data-play-button]');
    var status = player.querySelector('[data-player-status]');
    var hls = null;
    var initialized = false;

    function setStatus(message) {
      if (status) {
        status.textContent = message || '';
      }
    }

    function playVideo() {
      var playPromise = video.play();

      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(function () {
          setStatus('请再次点击播放器中的播放按钮开始播放');
        });
      }
    }

    function initialize() {
      if (!video || !source) {
        setStatus('当前播放源暂不可用');
        return;
      }

      if (button) {
        button.classList.add('is-hidden');
      }

      setStatus('正在加载播放源…');

      if (initialized) {
        playVideo();
        return;
      }

      initialized = true;

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
        video.addEventListener('loadedmetadata', function () {
          setStatus('');
          playVideo();
        }, { once: true });
        video.load();
        return;
      }

      if (Hls && Hls.isSupported()) {
        hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });

        hls.loadSource(source);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, function () {
          setStatus('');
          playVideo();
        });

        hls.on(Hls.Events.ERROR, function (event, data) {
          if (data && data.fatal) {
            setStatus('播放源加载失败，请刷新页面后重试');
            if (hls) {
              hls.destroy();
              hls = null;
            }
            initialized = false;
            if (button) {
              button.classList.remove('is-hidden');
            }
          }
        });
        return;
      }

      video.src = source;
      video.load();
      setStatus('如果浏览器支持该格式，将自动开始播放');
      playVideo();
    }

    if (button) {
      button.addEventListener('click', initialize);
    }

    if (video) {
      video.addEventListener('play', function () {
        if (button) {
          button.classList.add('is-hidden');
        }
        setStatus('');
      });
    }
  });
});
