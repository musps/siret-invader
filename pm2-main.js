const processId = process.env.pm_id || null
let isPause = true

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

  if (! isPause) {
    setInterval(() => {
      console.log('time processId', processId)
    }, 2000)
  }
}

process.on('message', ({ type, data, topic }) => {
  switch (type) {
    case 'action::startJob':
      startJob(data)
      break
    default:
      console.log('no action found', type)
      break
  }
})

process.on('SIGINT', () => {
  console.log('test SIGINT')
  process.exit(0)
})
