var path = require('path');
var beefy = require('beefy');
var launcher = require('browser-launcher');
var example = path.resolve(__dirname, 'examples', (process.argv[2] || 'simple') + '.js');
var kgo = require('kgo');
var port = process.env.PORT || 9966;
var uri = 'http://localhost:' + port + '/';
var configPath = path.resolve(__dirname, 'config');

var handler = beefy({
  entries: [ example ],
  cwd: path.dirname(example)
});

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
  launch(uri, { browser: 'chrome' }, done);
})
('launch-b', ['config-b'], function(launch, done) {
  launch(uri, { browser: 'chrome', options: [ '--use-fake-device-for-media-stream' ] }, done);
})
('run', ['launch-a', 'launch-b'], function(a, b, done) {
  console.log(a, b);

  a.on('exit', process.exit.bind(process));
  b.on('exit', process.exit.bind(process));
})
.on('error', console.error.bind(console));
