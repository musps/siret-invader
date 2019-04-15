const fs = require('fs')

const processId = process.env.pm_id || null
console.log('process start', processId)

process.on('message', ({ type, data, topic }) => {
  console.log('message', type)

  switch (type) {
    case 'action::startJob':
      console.log('ok')
      startJob(data)
      break
    default:
      break
  };
})

const insertData = (targetIndex) => {
  const targetFile = `./task/output-${targetIndex}.csv`

  if (! fs.existsSync(targetFile)) {
    onFileNotFound(targetIndex)
  } else {
    onFileFound(targetFile)
  }
}

const onFileNotFound = (targetIndex) => {
  const message  = 'The following file was not found : ' + targetIndex
  process.send({
    type: 'action::onFileNotFound',
    data: {
      success: false,
      message: message
    }
  })
}

const onFileFound = (targetFile) => {
  process.send({
    type: 'action::onFileFound',
    data: {
      success: true,
      message: null
    }
  })
}

//insertData(11000)

const startJob = (data) => {
  console.log('startJob', data)
}
