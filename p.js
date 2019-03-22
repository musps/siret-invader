const pm2 = require('pm2')

let fileIndex = 0

const conf = {
  name: 'node-app-1',
  script: './app.js',
  exec_mode: 'cluster',
  instances: 1,
  max_memory_restart: '100M',
  env: {
    'CURRENT_INDEX': 0
  },
  error_file: './pm2-logs/pm2-error.log',
  out_file: './pm2-logs/pm2.log'
}

pm2.connect((err) => {
  if (err) {
    console.error(err)
    process.exit(2)
  } else {
    console.log('PM2 connected')

    pm2.start(conf, (err, apps) => {
      if (err) {
        console.log('error', err)
      } else {

        apps.map(app => {
          const appId = app.pm2_env.pm_id
          console.log('appId', appId)

          setTimeout(() => {
            onSuccessStart(appId)
          }, 2000)
          
        })

        listenForProcess()
      }
    })
  }
})

const onSuccessStart = (id) => {
  pm2.sendDataToProcessId({
    type : 'onProcessStart',
    data : {
      fileIndex: fileIndex
    },
    topic: 'DEFAULT_TOPIC',
    id: id,
  }, (err, res) => {
    fileIndex++
    console.log(err);
    //console.log(res);
  });
}

const listenForProcess = () => {
  pm2.launchBus(function(err, bus) {
    // Contains : {process, data, at}
    // process.pm_id
    bus.on('onProcessStart', (packet) => {
      const processId = packet.process.pm_id
      const data = packet.data

      console.log('new message', processId, data)
    });

    bus.on('processAction:fileCreated', (packet) => {
      const processId = packet.process.pm_id
      const data = packet.data
      console.log('processAction:fileCreated', processId, data)
      onSuccessStart(processId)
    });
  });
}


























