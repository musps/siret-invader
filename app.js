const processId = process.env.pm_id || null

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

process.on('message', ({ type, data, topic }) => {
  console.log('message', type)
})
