var qsa = require('fdom/qsa');
var http = require('http');
var concat = require('concat-stream');
var h = require('hyperscript');
var cuid = require('cuid');
var reTrailingSlash = /\/.*$/;

function displaySample(target, sample, code) {
  var el = h('pre', h('code', { className: 'javascript' }, code));
  var content = h('div', { id: cuid(), className: 'code-sample active' },
    h('pre', [
      'npm install -g rtc-faq',
      'rtc-faq ' + sample
    ].join('\n')),
    el
  );

  // highlight
  hljs.highlightBlock(el);

  // TODO: remove previous highlight blocks?


  // insert the code
  target.insertAdjacentElement('afterend', content);

  return '#' + content.id;
}

function loadSample(evt) {
  var sample = evt.target.innerText;
  var req;

  if (evt.target.dataset.code) {
    return document.querySelector(evt.target.dataset.code).classList.toggle('active');
  }

  req = http.get(location.origin + location.pathname.replace(reTrailingSlash, '') + '/examples/' + sample + '.js');
  req.on('response', function(res) {
    res.pipe(concat(function(data) {
      evt.target.dataset.code = displaySample(evt.target, sample, data);
    }));
  });
}

qsa('a[data-sample]').forEach(function(el) {
  el.addEventListener('click', loadSample);
});

console.log('initializing');
