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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpIHsgXG4gICAgXG4gICAgLy8gKGZ1bmN0aW9uKHdpbmRvdyl7IFxuXG4gICAgLy8gICAgIHlvdXR1YmVqcy5sb2FkU2NyaXB0ID0gZnVuY3Rpb24gKCkge1xuICAgIC8vICAgICAgIGlmICh3aW5kb3cuWVQpIHJldHVybjsgXG4gICAgLy8gICAgICAgdmFyIHMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcbiAgICAvLyAgICAgICBzLnNyYyA9ICdodHRwczovL3d3dy55b3V0dWJlLmNvbS9pZnJhbWVfYXBpJztcbiAgICAvLyAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHMpO1xuXG4gICAgLy8gICAgICAgd2luZG93Lm9uWW91VHViZUlmcmFtZUFQSVJlYWR5ID0gZnVuY3Rpb24oKSB7XG4gICAgLy8gICAgICAgICAgIHBsYWhlcnIgPSBuZXcgWVQuUGxheWVyKCdwbGF5ZXInLCB7XG4gICAgLy8gICAgICAgICAgIGhlaWdodDogJzM5MCcsXG4gICAgLy8gICAgICAgICAgIHdpZHRoOiAnNjQwJyxcbiAgICAvLyAgICAgICAgICAgdmlkZW9JZDogJ003bGMxVVZmLVZFJyxcbiAgICAvLyAgICAgICAgICAgZXZlbnRzOiB7XG4gICAgLy8gICAgICAgICAgICAgJ29uUmVhZHknOiBvblBsYXllclJlYWR5LFxuICAgIC8vICAgICAgICAgICAgICdvblN0YXRlQ0NoYW5nZSc6IG9uUGxheWVyU3RhdGVDaGFuZ2VcbiAgICAvLyAgICAgICAgICAgfVxuICAgIC8vICAgICAgICAgfSlcblxuICAgIC8vICAgICAgcmV0dXJuIHlvdXR1YmVqcztcbiAgICAvLyAgICB9XG5cbiAgdmFyIHRlbXBsYXRlcyA9IHtcbiAgICBhcGlDb21tZW50c1VybDogXy50ZW1wbGF0ZSgnaHR0cDovL2dkYXRhLnlvdXR1YmUuY29tL2ZlZWRzL2FwaS92aWRlb3MvPCU9IHYgJT4vY29tbWVudHM/YWx0PWpzb24taW4tc2NyaXB0JnY9MiZtYXgtcmVzdWx0cz01MCZjYWxsYmFjaz1jb21tZW50cyZmaWVsZHM9ZW50cnkoY29udGVudCkmY2FsbGJhY2s9Y29tbWVudHMnKSxcbiAgICBhcGlRdWVyeVVybDogIF8udGVtcGxhdGUoJ2h0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL3lvdXR1YmUvdjMvc2VhcmNoP3ZpZGVvRW1iZWRkYWJsZT10cnVlPCU9IHBhZ2VUb2tlbiAlPiZhbHQ9anNvbiZvcmRlcj12aWV3Q291bnQmcGFydD1zbmlwcGV0JnR5cGU9dmlkZW8mbWF4UmVzdWx0cz01MCZrZXk9QUl6YVN5RFBaQXFpejliTnc2djNvSkJQaV9FQ1JFRE90d1dYR05vJnE9PCU9IHF1ZXJ5ICU+JmNhbGxiYWNrPXRlc3QnKSxcbiAgICBzZWFyY2hSZXN1bHQ6IF8udGVtcGxhdGUoJzwlIF8uZm9yRWFjaChpdGVtcywgZnVuY3Rpb24oaSkgeyAlPiA8bGkgIGRhdGEtaWQ9XCI8JT0gaS5pZC52aWRlb0lkICU+XCIgY2xhc3M9XCJjb2xsZWN0aW9uLWl0ZW1cIj48ZGl2IGNsYXNzPVwic2VhcmNoLWl0ZW1cIiA+PGltZyB3aWR0aD00NSBoZWlnaHQ9MjUgc3R5bGU9XCJ2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlOyBtYXJnaW4tcmlnaHQ6IDRweFwiIHNyYz1cIjwlPSBpLnNuaXBwZXQudGh1bWJuYWlscy5kZWZhdWx0LnVybCAlPlwiIC8+IDwlPSBpLnNuaXBwZXQudGl0bGUgJT48L2Rpdj48L2xpPjwlIH0pOyAlPiAnKSxcbiAgfVxuXG4gIHZhciBUaW1lciA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHRpbWUgPSArbmV3IERhdGUoKS8xMDAwLCBlbGFwc2VkID0gMCwgZnJvbSA9IDAsIHRvID0gbnVsbCwgcmVwZWF0ID0gZmFsc2U7XG4gICAgICB2YXIgc3RvcCA9IGZhbHNlO1xuICAgICAgdmFyIGNhbGxiYWNrcyA9IHt9O1xuICAgICAgdmFyIHRocm90dGxlID0gMDtcbiAgICAgIGZ1bmN0aW9uIHRpY2sgKCkge1xuICAgICAgICB2YXIgb2xkID0gdGltZTtcbiAgICAgICAgdGltZSA9ICtuZXcgRGF0ZSgpO1xuICAgICAgICBlbGFwc2VkID0gKCBlbGFwc2VkICsgKCh0aW1lLzEwMDAtb2xkLzEwMDApKSApO1xuICAgICAgICBcbiAgICAgICAgaWYgKHRocm90dGxlICE9PSBNYXRoLmZsb29yKGVsYXBzZWQpKSB7XG4gICAgICAgICAgdGhyb3R0bGUgPSBlbGFwc2VkID0gTWF0aC5mbG9vcihlbGFwc2VkKTtcbiAgICAgICAgICBjYWxsYmFja3MudXBkYXRlKChlbGFwc2VkKSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodG8gJiYgZWxhcHNlZCA+IHRvICYmICFyZXBlYXQpIHtcbiAgICAgICAgICBzdG9wID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodG8gJiYgZWxhcHNlZCA+IHRvICYmIHJlcGVhdCkge1xuICAgICAgICAgIGVsYXBzZWQgPSAwO1xuICAgICAgICB9XG4gICAgICAgIGlmICghc3RvcCkgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aWNrKTtcbiAgICAgIH1cbiBcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHN0YXJ0OiBmdW5jdGlvbihmcm9tLCBlbmQsIGxvb3ApIHtcbiAgICAgICAgICBpZiAoZnJvbSkgZWxhcHNlZCA9IGZyb207XG4gICAgICAgICAgaWYgKGVuZCkgdG8gPSBlbmQ7XG4gICAgICAgICAgaWYgKGxvb3ApIHJlcGVhdCA9IGxvb3A7XG4gICAgICAgICAgc3RvcCA9IGZhbHNlO1xuICAgICAgICAgIHRpbWUgPSArbmV3IERhdGUoKTtcbiAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRpY2spO1xuICAgICAgICB9LFxuICAgICAgICBwYXVzZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgc3RvcCA9IHRydWU7XG4gICAgICAgIH0sXG4gICAgICAgIHJlc3RhcnQ6IGZ1bmN0aW9uKGZyb20sIGVuZCwgcmVwZWF0KSB7XG4gICAgICAgICAgZWxhcHNlZCA9IDA7XG4gICAgICAgICAgdGhpcy5zdGFydChmcm9tLCBlbmQsIHJlcGVhdClcbiAgICAgICAgfSxcbiAgICAgICAgb246IGZ1bmN0aW9uKG5hbWUsIGNiKSB7XG4gICAgICAgICAgY2FsbGJhY2tzW25hbWVdID0gY2I7XG4gICAgICAgIH1cblxuICAgICAgfVxuICBcbiAgfTtcblxuICAgIHZhciBTcGVlY2h5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5jYWNoZSA9IFtdO1xuICAgICAgdGhpcy50aW1lbGluZSA9IFtdO1xuICAgICAgdGhpcy5tZXNzYWdlID0gW107XG4gICAgICB0aGlzLnl0dWQgPSAneXRzcGVlY2h5JztcbiAgICAgIHRoaXMuc3BlYWsgPSBzcGVha2VyXG4gIH0gIFxuXG4gIHZhciB0aW1lciA9IG5ldyBUaW1lcigpXG4gIHRpbWVyLm9uKCd1cGRhdGUnLCBmdW5jdGlvbihlbGFwc2VkICkge1xuICAgICAgbG9nLmxvZyhlbGFwc2VkKVxuICB9KTtcblxuICAvLyBtYWluUGxheWVyLnNlZWtUbyhzdGFydCk7XG4gIC8vIHRpbWVyLnN0YXJ0KE1hdGguZmxvb3IobWFpblBsYXllci5nZXRDdXJyZW50VGltZSgpKSwgTWF0aC5mbG9vcihtYWluUGxheWVyLmdldER1cmF0aW9uKCkpLCB0cnVlKTtcblxufS5jYWxsKHRoaXMpKVxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9