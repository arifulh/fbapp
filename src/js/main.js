  var app = {
    config: null
  };
  app.config = {
    pid: 'player1',
    width: 520,
    videoId: 'YQHsXMglC9A',
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

  var templates = {

    apiCommentsUrl: _.template(
      'http://gdata.youtube.com/feeds/api/videos/<%= v %>/comments?alt=json-in-script&v=2&max-results=50&callback=comments&fields=entry(content)&callback=comments'
    ),
    apiQueryUrl: _.template(
      'https://www.googleapis.com/youtube/v3/search?videoEmbeddable=true<%= pageToken %>&alt=json&order=viewCount&part=snippet&type=video&maxResults=50&key=AIzaSyDPZAqiz9bNw6v3oJBPi_ECREDOtwWXGNo&q=<%= query %>&callback=test'
    ),
    searchResult: _.template(
      '<% _.forEach(items, function(i) { %> <li  data-id="<%= i.id.videoId %>" class="collection-item"><div class="search-item" ><img width=45 height=25 style="vertical-align: middle; margin-right: 4px" src="<%= i.snippet.thumbnails.default.url %>" /> <%= i.snippet.title %></div></li><% }); %> '
    ),
  };
  var tt = _.template(
    '<blockquote data-range="<%= range %>" class="pull-<%= alt %>"><p><%= obj.line %></p><small><%= obj.timestamp %>s <%= obj.chara %></small></blockquote>'
  );

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

    var dd = transcriptTestCallback();
    dd.forEach(function (d) {
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
    console.log('speaking', line);

  };
