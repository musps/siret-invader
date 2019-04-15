const processId = process.env.pm_id || null

// Check if script is start by PM2.
if (!processId) {
  process.exit(0)
}

console.log('process start', processId)

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

const startJob = (data) => {
  console.log('startJob', data)
  setInterval(() => {
    console.log('time processId', processId)
  }, 2000)
}

process.on('message', ({ type, data, topic }) => {
  console.log('new message')
  switch (type) {
    case 'action::startJob':
      startJob(data)
      break
    default:
      console.log('no action found', type)
      break
  }
})

process.on('SIGINT', function() {
  console.log('test SIGINT', 'ok');

  setTimeout(() => {
    console.log('process', processId, 'killed');
    process.exit(0);
  }, 2000)
});
