(function() { 
    
    // (function(window){ 

    //     youtubejs.loadScript = function () {
    //       if (window.YT) return; 
    //       var s = document.createElement('script');
    //       s.src = 'https://www.youtube.com/iframe_api';
    //       document.body.appendChild(s);

    //       window.onYouTubeIframeAPIReady = function() {
    //           plaherr = new YT.Player('player', {
    //           height: '390',
    //           width: '640',
    //           videoId: 'M7lc1UVf-VE',
    //           events: {
    //             'onReady': onPlayerReady,
    //             'onStateCChange': onPlayerStateChange
    //           }
    //         })

    //      return youtubejs;
    //    }

  var templates = {
    apiCommentsUrl: _.template('http://gdata.youtube.com/feeds/api/videos/<%= v %>/comments?alt=json-in-script&v=2&max-results=50&callback=comments&fields=entry(content)&callback=comments'),
    apiQueryUrl:  _.template('https://www.googleapis.com/youtube/v3/search?videoEmbeddable=true<%= pageToken %>&alt=json&order=viewCount&part=snippet&type=video&maxResults=50&key=AIzaSyDPZAqiz9bNw6v3oJBPi_ECREDOtwWXGNo&q=<%= query %>&callback=test'),
    searchResult: _.template('<% _.forEach(items, function(i) { %> <li  data-id="<%= i.id.videoId %>" class="collection-item"><div class="search-item" ><img width=45 height=25 style="vertical-align: middle; margin-right: 4px" src="<%= i.snippet.thumbnails.default.url %>" /> <%= i.snippet.title %></div></li><% }); %> '),
  }

  var Timer = function() {
      var time = +new Date()/1000, elapsed = 0, from = 0, to = null, repeat = false;
      var stop = false;
      var callbacks = {};
      var throttle = 0;
      function tick () {
        var old = time;
        time = +new Date();
        elapsed = ( elapsed + ((time/1000-old/1000)) );
        
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
        start: function(from, end, loop) {
          if (from) elapsed = from;
          if (end) to = end;
          if (loop) repeat = loop;
          stop = false;
          time = +new Date();
          window.requestAnimationFrame(tick);
        },
        pause: function() {
          stop = true;
        },
        restart: function(from, end, repeat) {
          elapsed = 0;
          this.start(from, end, repeat)
        },
        on: function(name, cb) {
          callbacks[name] = cb;
        }

      }
  
  };

    var Speechy = function () {
      this.cache = [];
      this.timeline = [];
      this.message = [];
      this.ytud = 'ytspeechy';
      this.speak = speaker
  }  

  var timer = new Timer()
  timer.on('update', function(elapsed ) {
      log.log(elapsed)
  });

  // mainPlayer.seekTo(start);
  // timer.start(Math.floor(mainPlayer.getCurrentTime()), Math.floor(mainPlayer.getDuration()), true);

}.call(this))
