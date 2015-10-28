  var app = {
    config: null
  };
  app.config = {
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

  window.onYouTubeIframeAPIReady = function () {
    var player = new YT.Player(app.config.pid, {
      width: app.config.width,
      videoId: app.config.videoId,
      playerVars: app.config.playerVars,
      events: {
        'onReady': function () {

          var duration = player.getDuration();
          var data = _.range(0, duration).map(function (i) {
            return {
              t: i,
              l: '',
              cls: ''
            };
          });

          var transscripEl = $("#transcript");

          function Timeline(emit, refresh) {
            var items = data;
            var itemHeight = 21;
            var inRangeItems = [];


            var timer = new Timer(),
              time = 0;

            timer.on('update', onTimerUpdate);
            timer.start(0, duration);

            window.addEventListener("scroll", onScrollUpdate, false);

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


            function onTimerUpdate(elapsed) {
              time = elapsed;
            }
            preload();

            return {
              render: render,
              cleanup: cleanup
            };

            function render() {
              return ["div", [Transcript, inRangeItems]];
            }


            function cleanup() {
              inRangeItems = [];
            }

          }

          function Transcript(emit, refresh) {

            return {
              render: render,
            };

            function render(it) {

              return ["div", it.map(function (itemText) {
                var curr = itemText;
                return [
                  ["a", itemText.l, itemText.t]
                ];
              })];

              //
              // ["input", {
              //   type: "text",
              //   // value: itemText.l,
              //   onchange: function (curr) {
              //     return function (evt) {
              //       curr.l = evt.target.value;
              //     };
              //   }(curr)
              // }]

              function onClick(evt) {
                evt.target.className = 'active';
                var input = [evt.target];
              }


              // function onChange(evt) {
              //   text = evt.target.value;
              //   console.log(it)
              //     // itemText.l = text;
              // }

            }
          }


          var instance = domChanger(Timeline, document.getElementById(
            'transcript'));
          var dd = transcriptTestCallback();
          dd.forEach(function (d) {
            data[d.t] = {
              t: d.t,
              l: d.l
            };
          });

          instance.update();


        },
        'onStateChange': function (e) {
          app.onStateChange(e);
        }
      }
    });
  };

  //
  //
  // var app = {
  //     __init: false,
  //     __dom: false,
  //
  //     config: {
  //       pid: 'player1',
  //       width: 520,
  //       videoId: 'M7lc1UVf-VE',
  //       playerVars: {
  //         'autoplay': false,
  //         'controls': 1,
  //         'hd': 1,
  //         'modestbranding': 1,
  //         'playsinline': 1,
  //         'showinfo': 0,
  //         'autohide': 0,
  //         'color': 'white',
  //         'theme': 'light',
  //         'html5': 1,
  //         'enablejsapi': 1,
  //         'rel': 0,
  //         'iv_load_policy': 3,
  //         'disablekb': 1
  //       }
  //     },
  //
  //     init: function (cb) {
  //       var timeline = this.timeline = new Timeline();
  //       this.size = 0;
  //       // this.timer = new Timer();
  //       // this.timer.on('update', this.onTimerUpdate.bind(this));
  //
  //
  //       this.__init = true;
  //
  //
  //     },
  //
  //     insert: function (data) {
  //       if (!data) return;
  //
  //       this.timeline.insert(data);
  //       this.size = this.size + data.length;
  //
  //
  //     },
  //
  //     setPlayer: function (player) {
  //       this.player = player;
  //     },
  //
  //     onTimerUpdate: function (elapsed) {
  //       console.log(elapsed);
  //
  //       if (Math.abs(this.player.getCurrentTime() - elapsed) > 5) {
  //         this.timer.start(this.player.getCurrentTime() - 1, this.currentDuration);
  //       }
  //
  //       var node = this.timeline.list(elapsed)[0];
  //       if (node) {
  //         node.data.el.textContent = node.data.l;
  //       }
  //     },
  //
  //     onStateChange: function (e) {
  //       if (e.data === 2 || e.data === 0) {
  //         this.timer.pause();
  //       } else if (e.data === 1) {
  //         this.timer.start(this.player.getCurrentTime(), this.currentDuration);
  //       } else if (e.data === -1) {
  //
  //         if (!this.__dom) {
  //
  //           this.currentDuration = this.player.getDuration();
  //           this.buildTranscriptDom();
  //         }
  //
  //         // this.timer.start(this.player.getCurrentTime(),this.currentDuration)
  //       }
  //     },
  //
  //     start: function () {
  //
  //       var start = Math.floor(this.player.getCurrentTime() || 0),
  //         end = Math.floor(this.player.getDuration());
  //       this.player.seekTo(start);
  //       this.currentDuration = end;
  //     },

  // buildTranscriptDom: function () {
  // var len = Math.floor(this.currentDuration),
  //   ul = document.getElementById('transcript'),
  //   frag = document.createDocumentFragment();

  // var nodes = _.range(0, this.currentDuration)
  //   .map(function (i, ii) {

  //     var li = document.createElement("li");
  //     li.textContent = '';
  //     li.id = 't' + i;
  //     frag.appendChild(li);

  //     return {
  //       l: '',
  //       t: i + 1,
  //       el: li
  //     };
  //   });
  // //
  // ul.appendChild(frag);
  // // this.timeline.insert(nodes);
  // var duration = this.currentDuration;
  // // var data = _.range(0,duration).map(function(i){
  // //       return {t:null, l: null }
  // //   });
  // var data = _.range(0, duration).map(function (i) {
  //   return {
  //     t: i,
  //     l: ' ',
  //     s: false
  //   };
  // });
  //
  // function T(emit, refresh) {
  //   var items = data;
  //
  //   var timer = new Timer();
  //   timer.on('update', function (elapsed) {
  //     console.log(elapsed);
  //   });
  //
  //   return {
  //     render: render,
  //   };
  //
  //   function render() {
  //     return ["div", [Transcript, items]];
  //   }
  //
  // }
  //
  // function Transcript() {
  //   return {
  //     render: render,
  //   };
  //
  //   function render(items) {
  //     return ["ul", items.map(function (itemText) {
  //       return ["li", ['span', itemText.t],
  //         ["a", itemText.l]
  //       ];
  //     })];
  //   }
  // }
  //
  //
  // //
  // // // init
  // // $(function () {
  // //   app.init(function () {
  // //     // app.insert(transcriptTestCallback());
  // //   });
  // //
  // //
  // // });
