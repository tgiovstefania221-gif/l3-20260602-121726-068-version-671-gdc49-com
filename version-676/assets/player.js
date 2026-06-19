(function () {
  function start(source) {
    var root = document.getElementById("movie-player");
    if (!root) {
      return;
    }
    var video = root.querySelector("video");
    var button = root.querySelector("[data-play]");
    var message = root.querySelector("[data-player-message]");
    var hls = null;
    var ready = false;

    function showMessage(text) {
      if (!message) {
        return;
      }
      message.textContent = text;
      message.classList.add("is-visible");
    }

    function hideMessage() {
      if (message) {
        message.textContent = "";
        message.classList.remove("is-visible");
      }
    }

    function bindSource() {
      if (ready) {
        return;
      }
      ready = true;
      hideMessage();
      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(source);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.ERROR, function (event, data) {
          if (data && data.fatal) {
            showMessage("影片加载失败，请稍后再试");
          }
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = source;
      } else {
        showMessage("当前环境暂时无法播放该影片");
      }
    }

    function play() {
      bindSource();
      if (button) {
        button.classList.add("is-hidden");
      }
      var promise = video.play();
      if (promise && typeof promise.catch === "function") {
        promise.catch(function () {
          if (button) {
            button.classList.remove("is-hidden");
          }
        });
      }
    }

    if (button) {
      button.addEventListener("click", play);
    }
    video.addEventListener("click", function () {
      if (video.paused) {
        play();
      }
    });
    video.addEventListener("play", function () {
      if (button) {
        button.classList.add("is-hidden");
      }
    });
    video.addEventListener("error", function () {
      showMessage("影片加载失败，请稍后再试");
    });
    window.addEventListener("pagehide", function () {
      if (hls) {
        hls.destroy();
      }
    });
  }

  window.ClassicMoviePlayer = {
    start: start
  };
}());
