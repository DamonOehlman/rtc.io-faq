var h = require('hyperscript');
var kgo = require('kgo');
var quickconnect = require('rtc-quickconnect');
var screenshare = require('rtc-screenshare');
var getUserMedia = require('getusermedia');

// create a conference instance, and launch in reactive mode (chrome only)
var conference = quickconnect('https://switchboard.rtc.io', {
  iceServers: require('freeice')(),
  room: 'rtc-faq:dynamic-screenshare',
  reactive: true
});

// keep track of the active stream so we can remove it from the conference
var activeStream;

// create a control bar to allow switching between camera and screen
var controls = h('div',
                 h('button', { onclick: captureCam }, 'Web Cam'),
                 h('button', { onclick: captureScreen }, 'Screen')
               );


function activateStream(stream) {
  conference.addStream(activeStream = stream);
}

function captureScreen() {
  if (activeStream) {
    conference.removeStream(activeStream);
  }

  kgo
  ('constraints', screenshare.window)
  ('capture', ['constraints'], getUserMedia)
  ('add-stream', ['capture'], activateStream)
  .on('error', reportError);
}

function captureCam() {
  if (activeStream) {
    conference.removeStream(activeStream);
  }

  kgo({
    constraints: { video: true, audio: true }
  })
  ('capture', ['constraints'], getUserMedia)
  ('add-stream', ['capture'], activateStream)
  .on('error', reportError);
}

function reportError(err) {
  console.error('Captured error: ', err);
}

conference.on('stream:added', function(id, stream) {
  console.log('peer ' + id + ' added stream: ', stream);
});

conference.on('stream:removed', function(id, stream) {
  console.log('peer ' + id + ' removed stream: ', stream);
});

document.body.appendChild(controls);
