var quickconnect = require('rtc-quickconnect');
var capture = require('rtc-capture');
var attach = require('rtc-attach');
var qsa = require('fdom/qsa');
var h = require('hyperscript');
var ctrlAudioOnly = h('div', h('button', { onclick: switchToAudioOnly }, 'Audio Only'));

var activeStream;
var qc = quickconnect('https://switchboard.rtc.io/', {
  iceServers: require('freeice')(),
  room: 'rtc-faq:changestream',
  reactive: true
});

function cap(constraints) {
  capture(constraints, function(err, stream) {
    if (err) {
      return console.error(err);
    }

    if (activeStream) {
      qc.removeStream(activeStream);
    }

    qc.addStream(activeStream = stream);
  });
}

function switchToAudioOnly() {
  cap({ audio: true, video: false });
}

qc.on('stream:added', function(id, stream) {
  attach(stream, function(err, el) {
    if (err) {
      return console.error(err);
    }

    el.dataset.peer = id;
    document.body.appendChild(el);
  });
});

qc.on('stream:removed', function(id) {
  // remove the streams for a particular peer
  qsa('*[data-peer="' + id + '"]').forEach(function(el) {
    el.parentNode.removeChild(el);
  });
});

document.body.appendChild(ctrlAudioOnly);
cap({ audio: true, video: true });
