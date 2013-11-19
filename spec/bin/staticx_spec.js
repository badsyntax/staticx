var path = require('path');
var spawn = require('child_process').spawn;
var pkg = require('../../package.json');
var binPath = path.resolve('bin/staticx');

function test(args, stdout, exit) {
  var process = spawn(binPath, args);
  process.stdout.on('data', stdout);
  process.on('exit', exit);
}

describe('Bin', function() {

  it('Should show the package version', function(done) {
    function runTests(data) {
      expect(data.toString().trim()).toEqual(pkg.version);
    }
    test(['-V'], runTests, function() {
      test(['--version'], runTests, function(code) {
        done(code === 0 ? null : 'Process exited with code' + code);
      });
    });
  });

  it('Should show the usage instructions', function(done) {
    function runTests(data) {
      expect(data.toString().trim().length).toBeGreaterThan(0);
    }
    test(['-h'], runTests, function() {
      test(['--help'], runTests, function(code) {
        done(code === 0 ? null : 'Process exited with code' + code);
      });
    });
  });
});
