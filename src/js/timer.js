(function () {

  function Timer() {
    var time = +new Date() / 1000,
      elapsed = 0,
      from = 0,
      to = null,
      repeat = false,
      stop = false,
      callbacks = {},
      throttle = 0;

    function tick() {
      var old = time;
      time = +new Date();
      elapsed = (elapsed + ((time / 1000 - old / 1000)));

      if (throttle !== Math.floor(elapsed)) {
        throttle = elapsed = Math.floor(elapsed);
        callbacks.update((elapsed));
      }

      if (to && elapsed > to && !repeat) {
        stop = true;
      }
      if (to && elapsed > to && repeat) {
        elapsed = 0;
      }
      if (!stop) window.requestAnimationFrame(tick);
    }

    return {
      start: function (from, end, loop) {
        if (from) elapsed = from;
        if (end) to = end;
        if (loop) repeat = loop;
        stop = false;
        time = +new Date();
        window.requestAnimationFrame(tick);
      },
      pause: function () {
        stop = true;
      },
      restart: function (from, end, repeat) {
        elapsed = 0;
        this.start(from, end, repeat)
      },
      on: function (name, cb) {
        callbacks[name] = cb;
      }
    }
  };

  window.Timer = Timer;

}());