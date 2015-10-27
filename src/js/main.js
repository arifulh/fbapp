(function(){

  var templates = {
    apiCommentsUrl: _.template('http://gdata.youtube.com/feeds/api/videos/<%= v %>/comments?alt=json-in-script&v=2&max-results=50&callback=comments&fields=entry(content)&callback=comments'),
    apiQueryUrl:  _.template('https://www.googleapis.com/youtube/v3/search?videoEmbeddable=true<%= pageToken %>&alt=json&order=viewCount&part=snippet&type=video&maxResults=50&key=AIzaSyDPZAqiz9bNw6v3oJBPi_ECREDOtwWXGNo&q=<%= query %>&callback=test'),
    searchResult: _.template('<% _.forEach(items, function(i) { %> <li  data-id="<%= i.id.videoId %>" class="collection-item"><div class="search-item" ><img width=45 height=25 style="vertical-align: middle; margin-right: 4px" src="<%= i.snippet.thumbnails.default.url %>" /> <%= i.snippet.title %></div></li><% }); %> '),
  }

window.timeline = window.t = [];
t[1] = "Bush: Sir, they should really drag us into the street and shoot us."
t[3] = "Ashcroft: Why don't you do something else with your life."
t[2] = "Bush: Sir, I can only drink Karachi milkshakes."
t[5] = "Bush: I have one friend, he hates me"
t[11] = "Bush: This man here is my best friend"
t[34] = "Bush: We massage eachothers arms."
t[22] = "Bush: Sir, I will now inject him with deadly poison"
t[33] = "Bush: My friend enjoys magicians"

    
  window.onYouTubeIframeAPIReady = function() {
    var player =  new YT.Player(app.config.pid, {
      width: app.config.width,
      videoId: app.config.videoId,
      playerVars: app.config.playerVars,
      events: {
        'onReady': function() { app.start();   },
        'onStateChange': function(e) { app.onStateChange(e) }
      }
    });

    app.setPlayer(player);

  }
  var last = 0;
  var tt = _.template('<blockquote data-range="<%= range %>" class="pull-<%= alt %>"><p><%= obj.line %></p><small><%= obj.timestamp %>s <%= obj.chara %></small></blockquote>');

  var app = {
    config: { 
      pid: 'player1',
      width: 520,
      videoId: 'M7lc1UVf-VE',
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
    },

    init: function() {
      this.timer = new Timer()
      this.timer.on('update', this.onTimerUpdate.bind(this));
    },

    setPlayer: function(player) {
      this.player = player;
    },

    onTimerUpdate: function(elapsed) {
      if (Math.abs(this.player.getCurrentTime()-elapsed) > 5) {
        this.timer.start(this.player.getCurrentTime(),this.currentDuration)
                        // $("#transcript blockquote:lt(3)").remove();

      }

         var i = timeline[elapsed];
         if (i) {
           var chara = i.split(':')[0], line = i.split(':')[1];
          $("#transcript").append(tt({ chara: chara, line: line, alt: 'left', range: elapsed }))
              // if ($("#transcript blockquote").length > 4)
                    // $("#transcript blockquote:lt(3)").remove();

           }
       
      console.log(elapsed, Math.floor(this.player.getCurrentTime()));



    },

    onStateChange: function(e) {
      if (e.data === 2 || e.data === 0) {
        this.timer.pause();
      }
       else if (e.data === 1) {
        this.timer.start(this.player.getCurrentTime(),this.currentDuration)
       } 
       else if (e.data === -1) {
        // this.timer.start(this.player.getCurrentTime(),this.currentDuration)
       } 
    },

    start: function() {
      var start = Math.floor(this.player.getCurrentTime() || 0),
        end = Math.floor(this.player.getDuration());
      this.player.seekTo(start);
      this.currentDuration = end;
    }




  }

  // init
  $(function() {
    app.init();
  })

  
}());
