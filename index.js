var path = require('path');
var fs = require('fs');
var beefy = require('beefy');
var launcher = require('browser-launcher');
var kgo = require('kgo');
var port = process.env.PORT || 9966;
var uri = 'http://localhost:' + port + '/';
var configPath = path.resolve(__dirname, 'config');

exports.run = function(opts) {
  var baseOpts = [
    '--use-fake-ui-for-media-stream'
  ].concat((opts || {}).options || []);
  var example = path.resolve(__dirname, 'examples', ((opts || {}).sample || 'simple') + '.js');
  var handler = beefy({
    entries: [ example ],
    cwd: path.dirname(example)
  });

  if (! fs.existsSync(example)) {
    console.error('could not find sample: ' + opts.sample + '\n');
    return exports.displaySamples();
  }

  kgo
  ('start-server', function(done) {
    require('http').createServer(handler).listen(port, done);
  })
  ('init', ['!start-server'], function(done) {
    require('mkdirp')(path.resolve(__dirname, 'config'), done);
  })
  ('config-a', ['!init'], function(done) {
    launcher({ config: path.join(configPath, 'a', 'config.json') }, done);
  })
  ('config-b', ['!init', '!config-a'], function(done) {
    launcher({ config: path.join(configPath, 'b', 'config.json') }, done);
  })
  ('launch-a', ['config-a'], function(launch, done) {
    launch(uri, { browser: 'chrome', options: baseOpts }, done);
  })
  ('launch-b', ['config-b'], function(launch, done) {
    launch(uri, { browser: 'chrome', options: baseOpts.concat([ '--use-fake-device-for-media-stream' ]) }, done);
  })
  ('run', ['launch-a', 'launch-b'], function(a, b, done) {
    a.on('exit', process.exit.bind(process));
    b.on('exit', process.exit.bind(process));
  })
  .on('error', console.error.bind(console));
};

exports.displaySamples = function() {
  fs.readdir(path.resolve(__dirname, 'examples'), function(err, files) {
    if (err) {
      return console.error(err);
    }

    console.log('usage: rtc-faq <sample>\n');
    console.log('where <sample> is one of the samples listed below:');
    files.forEach(function(filename) {
      console.log('- ' + path.basename(filename, '.js'));
    });
  });
};
