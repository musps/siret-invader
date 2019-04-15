
process.on('message', ({ type, data, topic }) => {
  switch (type) {
    case 'action::onFileNotFound':
      console.log('action::onFileNotFound')
      break
    case 'action::onFileFound':
      console.log('action::onFileFound')
      break
    default:
      break
  }
})

process.stdin.resume();
