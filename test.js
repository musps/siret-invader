const Entrypoint = require('@pm2/io').Entrypoint

new class App extends Entrypoint {
  // This is the very first method called on startup
  onStart (cb) {
    console.log('onStart')
    setInterval(() => {

    }, 2000)

    return cb()
  }

  // This is the very last method called on exit || uncaught exception
  onStop(err, cb, code, signal) {
    console.log('onStop') 
  }

  // Here we declare some process metrics
  sensors () {
  }

  // Here are some actions to interact with the app in live
  actuators () {
  }
}



process.on('SIGINT', function() {
  console.log('test SIGINT', 'ok');
  process.exit(0);
});

