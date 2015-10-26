function asd() {

    youtubejs.loadScript = function (src) {
      if (!window.YT) appendScript('https://www.youtube.com/iframe_api')
    }

      var player;
      window.onYouTubeIframeAPIReady = function() {
        player =  new YT.Player('player', {
          height: '390',
          width: '640',
          videoId: 'M7lc1UVf-VE',
          events: {
            'onReady': onPlayerReady,
            'onStateCChange': onPlayerStateChange
          }
        })
    }

}