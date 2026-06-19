(function () {
  function bindPlayer(config) {
    var video = document.getElementById(config.videoId);
    var button = document.getElementById(config.buttonId);
    var cover = document.getElementById(config.coverId);
    var hls = null;
    var ready = false;

    if (!video || !config.url) {
      return;
    }

    function attach() {
      if (ready) {
        return;
      }
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = config.url;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new Hls({ enableWorker: true, lowLatencyMode: true });
        hls.attachMedia(video);
        hls.on(Hls.Events.MEDIA_ATTACHED, function () {
          hls.loadSource(config.url);
        });
      } else {
        video.src = config.url;
      }
      ready = true;
    }

    function hideCover() {
      if (cover) {
        cover.classList.add('is-hidden');
      }
    }

    function start(event) {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      attach();
      hideCover();
      var playTask = video.play();
      if (playTask && typeof playTask.catch === 'function') {
        playTask.catch(function () {});
      }
      setTimeout(function () {
        if (video.paused) {
          var retry = video.play();
          if (retry && typeof retry.catch === 'function') {
            retry.catch(function () {});
          }
        }
      }, 420);
    }

    if (button) {
      button.addEventListener('click', start);
    }
    if (cover) {
      cover.addEventListener('click', start);
    }
    video.addEventListener('click', function () {
      if (!ready) {
        start();
      }
    });
    video.addEventListener('play', hideCover);
    window.addEventListener('beforeunload', function () {
      if (hls) {
        hls.destroy();
      }
    });
  }

  window.SitePlayer = {
    bind: bindPlayer
  };
})();
