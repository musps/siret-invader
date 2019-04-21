const jsonfile = require('jsonfile')

const getCurrentFile = (processId = 1, filePath, currentFile, cb) => {
  setTimeout(() => {
    let nextFileIndex = currentFile.id || null

    jsonfile.readFile(filePath)
      .then((obj) => {
        if (!nextFileIndex) {
          nextFileIndex = obj.findIndex(i => i.state === 0)
        }

        if (!nextFileIndex) {
          cb(false)
        } else {
          const nextFile = obj[nextFileIndex]
          nextFile.state = 1

          jsonfile.writeFile(filePath, obj, {
            spaces: 2
          }, (err) => {
            if (err) {
              cb(false)
            } else {
              cb({...nextFile})
            }
          })
        }
      })
      .catch(error => cb(false))
  }, (processId * 1000))
}

const saveCurrentFile = (processId = 1, filePath, currentFile, cb) => {
  setTimeout(() => {
    let nextFileIndex = currentFile.id || null

    console.log('filePath', filePath)


    jsonfile.readFile(filePath)
      .then((obj) => {
        if (!nextFileIndex) {
          cb(false)
        }

        currentFile.state = 0
        obj[nextFileIndex] = currentFile
        jsonfile.writeFile(filePath, obj, {
          spaces: 2
        }, (err) => {
          if (err) {
            cb(false)
          } else {
            cb(true)
          }
        })
      })
      .catch(error => cb(false))
  }, (processId * 1000))
}

module.exports = {
  getCurrentFile,
  saveCurrentFile
}
