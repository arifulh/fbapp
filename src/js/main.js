(function () {

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

  window.onYouTubeIframeAPIReady = function () {
    var player = new YT.Player(app.config.pid, {
      width: app.config.width,
      videoId: app.config.videoId,
      playerVars: app.config.playerVars,
      events: {
        'onReady': function () {
          app.start();
        },
        'onStateChange': function (e) {
          app.onStateChange(e);
        }
      }
    });

    app.setPlayer(player);

  };

  var app = {
    __init: false,

    config: {
      pid: 'player1',
      width: 520,
      videoId: 'M7lc1UVf-VE',
      playerVars: {
        'autoplay': false,
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
    },

    init: function () {
      var timeline = this.timeline = new Timeline();
      this.timer = new Timer();
      this.timer.on('update', this.onTimerUpdate.bind(this));
      this.__init = true;
    },

    insert: function (data) {
      if (!data) return;
      this.timeline.insert(data);
    },

    setPlayer: function (player) {
      this.player = player;
    },

    onTimerUpdate: function (elapsed) {
      if (Math.abs(this.player.getCurrentTime() - elapsed) > 8) {
        this.timer.start(this.player.getCurrentTime(), this.currentDuration);
        $("#transcript blockquote").remove();
      }
      var transcript = $("#transcript ul");
      var node = this.timeline.list(elapsed)[0];
      var a = $('<a href=""></a>');

      if (node) {
        a.html(node.data.l);
        console.log(node.data.l);
      }
      console.log(node);

    },

    onStateChange: function (e) {
      if (e.data === 2 || e.data === 0) {
        this.timer.pause();
      } else if (e.data === 1) {
        this.timer.start(this.player.getCurrentTime(), this.currentDuration);
      } else if (e.data === -1) {
        // this.timer.start(this.player.getCurrentTime(),this.currentDuration)
      }
    },

    start: function () {
      if (!app.__init) return;
      var start = Math.floor(this.player.getCurrentTime() || 0),
        end = Math.floor(this.player.getDuration());
      this.player.seekTo(start);
      this.currentDuration = end;
    }
  };

  // init
  $(function () {
    var data = transcriptTestCallback();
    app.init();
    app.insert(data)
    window.app = app;
  });



}());
