(function (window) {

  var hash = window.location.hash,
    videoId, comments;
  if (hash) { // videoId = hash.replace('#ytid=', '');

    hash = hash.split('&');

    if (hash) {
      hash.forEach(function (h) {

        if (h.split('=')[0].replace('#', '') === 'ytid')
          videoId = h.split('=')[1];
        if (h.split('=')[0].replace('#', '') === 'c')
          comments = h.split('=')[1];

      });
    }
  }

  // console.log(videoId, comments)
  var app = {
    config: null
  };
  app.config = {
    pid: 'player1',
    width: 520,
    videoId: videoId || 'YQHsXMglC9A',
    playerVars: {
      'autoplay': true,
      'controls': 1,
      'hd': 1,
      'modestbranding': 1,
      'playsinline': 1,
      'showinfo': 0,
      'autohide': 0,
      'color': 'white',
      'theme': 'light',
      'html5': 1,
      'enablejsapi': 1,
      'rel': 0,
      'iv_load_policy': 3,
      'disablekb': 1
    }
  };

  var player;
  window.onYouTubeIframeAPIReady = function () {
    player = new YT.Player(app.config.pid, {
      width: app.config.width,
      videoId: app.config.videoId,
      playerVars: app.config.playerVars,

      events: {
        'onReady': function (e) {

          var duration = player.getDuration();
          var data = _.range(0, duration).map(function (i) {
            return {
              t: i,
              l: '',
              cls: ''
            };
          });

          app.init(data);

        },
        'onStateChange': function (e) {
          app.onStateChange(e);
        }
      }
    });
  };


  app.init = function (data) {
    if (comments) {
      comments = JSON.parse(decodeURIComponent(decodeURI(comments)));
    }
    var dd = comments || [{}];
    dd.forEach(
      function (d) {
        data[d.t] = {
          t: d.t,
          l: d.l
        };
      });

    var transscripEl = $("#transcript");

    function Timeline(emit, refresh) {
      var items = data;
      var itemHeight = 21;
      var inRangeItems = [];

      window.addEventListener("scroll", onScrollUpdate, false);
      var transscripEl = $("#transcript");

      function onScrollUpdate(ev) {
        var top = this.scrollY,
          left = this.scrollX;
        transscripEl.css('transform', 'translate(0,' + top +
          'px )');
        preload();
      }

      var preload = function () {
        var from = Math.floor(window.scrollY / itemHeight);
        var to = ((from + ((window.innerHeight * 2 /
          itemHeight))));

        inRangeItems = _.filter(items, function (i) {
          return i.t >= from && i.t <= to;
        });

        refresh();
      };

      preload();

      var timer = app.timer = new Timer();
      timer.on('update', function (elapsed) {
        if (Math.abs(player.getCurrentTime() - elapsed) > 5) {
          timer.start(player.getCurrentTime(), player.getDuration());
        }

        if (items[elapsed].l) app.speak(items[elapsed]);
      });
      timer.start(player.getCurrentTime(), player.getDuration());



      return {
        render: render,
        on: {
          userInput: onUserInput
        }
      };

      function onUserInput(e) {
        items[e.t] = {
          t: e.t,
          l: e.val,
          cls: ''
        };
        onScrollUpdate();
      }

      function render() {

        window.location.hash = ('ytid=' + app.config.videoId + '&' + 'c=' +
          ((encodeURIComponent(JSON.stringify(
            (_.filter(
              items,
              function (i) {
                return i.l !== '';
              })))))));
        return ["div", [
          Transcript, inRangeItems
        ]];
      }
    }

    function InputBox(emit, refresh) {

      function render(inputTop) {
        return ["input", {
          type: "text",
          class: 'input-text',
          style: 'top: ' + inputTop.top + 'px;',

          onkeyup: function (evt) {
            var val = evt.target.value;
            inputTop.val = val;
            emit('userInput', inputTop);
          },

          onfous: function (evt) {
            inputTop.val = '';
            emit('userInput', inputTop);
            evt.target.value = '';
          },

          onblur: function (evt) {
            inputTop.val = '';
            evt.target.value = '';
          }
        }];
      }

      return {
        render: render
      };
    }

    function Transcript(emit, refresh) {
      var inputTop = {};

      return {
        render: render,
      };

      function render(it) {
        return [
          [InputBox, inputTop],

          it.map(function (itemText) {
            return [
              ["a", {
                  'data-t': itemText.t,
                  onmousedown: function (evt) {
                    inputTop = {
                      top: evt.target.getBoundingClientRect()
                        .top,
                      t: itemText.t
                    };
                    refresh();
                  },
                },
                ['span.l', itemText.l],
                ['span', itemText.t]
              ]
            ];
          })
        ];
      }
    }

    var instance = domChanger(Timeline, document.getElementById(
      'transcript'));
    instance.update();
  };

  app.onStateChange = function (e) {
    console.log(e);
  };

  app.speak = function (line) {
    if (!app.speaker) app.speaker = new Speaker();
    app.speaker(line.l);
    window.scrollTo(0, elapsed * 21);
  };

  app.save = function () {

  };


}(window));
