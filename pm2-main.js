const processId = process.env.pm_id || null
let isPause = true

console.log('process start', processId)

// Check if script is start by PM2.
if (!processId) {
  process.exit(0)
}

/**
const sendInstanceIsReady = () => {
  process.send({
    type : 'instance::ready',
    data : {
     success : true
    }
  });
}
setTimeout(() => {
  sendInstanceIsReady()
}, 1000)
*/

const startJob = (data) => {
  isPause = false
  setInterval(() => {
    if (! isPause) {
      console.log('time processId', processId)
    }
  }, 2000)
}

const pauseJob = () => {
  console.log('pausejob', processId)
  isPause = true
}

process.on('message', ({ type, data, topic }) => {
  switch (type) {
    case 'action::startJob':
      startJob(data)
      break
    case 'action::pauseJob':
      pauseJob()
      break;
    default:
      console.log('no action found', type)
      break
  }
})

process.on('SIGINT', () => {
  console.log('test SIGINT')
  process.exit(0)
})
