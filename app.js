const fs = require('fs')
const processId = process.env.pm_id || null

if (!processId) {
  process.exit(2)
}

console.log('process start')
console.log(process.env)

/**
* Listen for messages from PM2 main process.
*
*/
process.on('message', ({ type, data, topic }) => {
  switch (type) {
    case 'onProcessStart':
      onProcessStart(data)
      break;
    default:
      break;
  };
});

const onProcessStart = ({ fileIndex }) => {
  console.log('onProcessStart')

  let filePath = `./debug/file-${fileIndex}.txt`
  let fileContent = 'default value'
  let fileEncoding = 'utf8'

  fs.writeFile(filePath, fileContent, fileEncoding, (err) => {
      if (err) throw err;

      process.send({
        type: 'processAction:fileCreated',
        data: {
          success: true,
          message: 'The file was succesfully saved!'
        }
      })
  });
}
