const actions = require('./pm2-actions.js')
const pm2 = require('pm2')
const appName = 'siret-invader'

let fileIndex = 0
let isPause = false

const conf = {
  script: './pm2-main.js',
  exec_mode: 'cluster',
  instances: 4,
  max_memory_restart: '100M',
  env: {
    'CURRENT_INDEX': 0
  },
  error_file: './pm2-logs/pm2-error.log',
  out_file: './pm2-logs/pm2.log'
}

pm2.connect(async (err) => {
  if (err) {
    console.error(err)
    process.exit(2)
  } else {
    console.log('PM2 connected')

    pm2.start(conf, (err, apps) => {
      if (err) {
        console.log('pm2 start error', err)
      } else {
        setTimeout(() => {
          apps.map(app => {
              const instanceId = app.pm2_env.pm_id
              actions.sendJobToInstance(instanceId, fileIndex)
          })
        }, 2000)

        listenInstances()
      }
    })
  }
})

const listenInstances = () => {
  pm2.launchBus((err, bus) => {
    // Contains : {process, data, at}
    // process.pm_id
    bus.on('instance::ready', (packet) => {
      const processId = packet.process.pm_id
      const data = packet.data
      console.log(processId, 'instance::ready', processId)
      actions.sendJobToInstance(processId, fileIndex)
    })

    bus.on('action::onFileFound', (packet) => {
      const processId = packet.process.pm_id
      const data = packet.data
      console.log(processId, 'action::onFileFound', processId)
      pm2.delete(processId)
    });

    bus.on('action::onFileNotFound', (packet) => {
      const processId = packet.process.pm_id
      const data = packet.data
      console.log(processId, 'action::onFileNotFound', processId)
      pm2.delete(processId)
    });
  });
}

process.on('SIGINT', () => {
  isPause = true
  console.log('pause enabled')
  process.exit(0)
})







