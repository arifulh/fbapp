(function (window) {

  function Speaker(voices) {
    var msg = new SpeechSynthesisUtterance();
    msg.voice = speechSynthesis.getVoices()[10]; // Note: some voices don't support altering params
    msg.voiceURI = 'native';
    msg.volume = 1; // 0 to 1
    msg.rate = 1; // 0.1 to 10
    msg.pitch = 1; //0 to 1
    msg.lang = 'en-US';

    return function (txt) {
      msg.text = txt;
      msg.text = msg.text.replace('lol', 'ha ha ha ha');
      msg.voice = speechSynthesis.getVoices()[31];
      speechSynthesis.speak(msg);
    };
  }

  window.Speaker = Speaker;

}(window));
