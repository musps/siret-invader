const pm2 = require('pm2')

const sendJobToInstance = (instanceId, fileIndex) => {
  const nextindex = fileIndex
  fileIndex++

  pm2.sendDataToProcessId({
    type : 'action::startJob',
    id: instanceId,
    data : {
      fileIndex: nextindex
    },
    topic: 'DEFAULT_TOPIC'
  }, (err, res) => {
    console.log('instance', instanceId, 'sendJobToInstance err', err)
  })
}

const sendPauseToInstance = (instanceId) => {
  isPause = true

  pm2.sendDataToProcessId({
    type : 'action::pauseJob',
    id: instanceId,
    data : {
      pause: true
    },
    topic: 'DEFAULT_TOPIC'
  }, (err, res) => {
    console.log('instance', instanceId, 'sendPauseToInstance err', err)
  })
}

const sendRemuseToInstance = (instanceId) => {
  isPause = true

  pm2.sendDataToProcessId({
    type : 'action::resumeJob',
    id: instanceId,
    data : {
      pause: false
    },
    topic: 'DEFAULT_TOPIC'
  }, (err, res) => {
    console.log('instance', instanceId, 'sendRemuseToInstance err', err)
  })
}


module.exports = {
  sendJobToInstance,
  sendPauseToInstance,
  sendRemuseToInstance
}
