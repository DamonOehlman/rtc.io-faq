var h = require('hyperscript');
var kgo = require('kgo');
var quickconnect = require('rtc-quickconnect');
var screenshare = require('rtc-screen');
var getUserMedia = require('getusermedia');
var streamui = require('rtc-ui/stream');

// create a conference instance, and launch in reactive mode (chrome only)
var conference = quickconnect('https://switchboard.rtc.io', {
  iceServers: require('freeice')(),
  room: 'rtc-faq:dynamic-screenshare',

  // when streams are added or remove, renegotiate
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
  if (activeStream) {
    conference.removeStream(activeStream);
  }

  conference.addStream(activeStream = stream);
}

function captureScreen() {
  kgo
  ('capture', screenshare)
  ('add-stream', ['capture'], activateStream)
  .on('error', reportError);
}

function captureCam() {
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

streamui(conference, { container: document.body });
document.body.appendChild(controls);
