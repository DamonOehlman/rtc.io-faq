var quickconnect = require('rtc-quickconnect');
var media = require('rtc-media');
var qsa = require('fdom/qsa');
var h = require('hyperscript');
var ctrlAudioOnly = h('div', h('button', { onclick: switchToAudioOnly }, 'Audio Only'));

var activeStream;
var qc = quickconnect('//switchboard.rtc.io/', {
  iceServers: require('freeice')(),
  room: 'faq-changestream',
  reactive: true
});

function capture(constraints) {
  media({ constraints: constraints })
    .once('capture', function(stream) {
      if (activeStream) {
        qc.removeStream(activeStream);
      }

      qc.addStream(activeStream = stream);
    })
    .on('error', function(err) {
      console.error(err);
    });
}

function switchToAudioOnly() {
  capture({ audio: true, video: false });
}

qc.on('stream:added', function(id, stream) {
  console.log('stream added: ', stream.getVideoTracks().length);
  var el = media({ stream: stream }).render(document.body);
  el.dataset.peer = id;
});

qc.on('stream:removed', function(id) {
  // remove the streams for a particular peer
  qsa('*[data-peer="' + id + '"]').forEach(function(el) {
    el.parentNode.removeChild(el);
  });
});

document.body.appendChild(ctrlAudioOnly);
capture({ audio: true, video: true });
