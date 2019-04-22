const jsonfile = require('jsonfile')

const getCurrentFile = (processId = 1, filePath, currentFile, cb) => {
  setTimeout(() => {
    jsonfile.readFile(filePath)
      .then((obj) => {
        const nextFileIndex = obj.findIndex(i => i.state === 0)

        if (nextFileIndex === -1) {
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
              cb({ ...nextFile })
            }
          })
        }
      })
      .catch(() => cb(false))
  }, (processId * 1000))
}

const saveCurrentFile = (processId = 1, filePath, currentFile, cb) => {
  setTimeout(() => {
    const nextFileIndex = currentFile.id === null ? null : currentFile.id

    jsonfile.readFile(filePath)
      .then((obj) => {
        const nextObj = obj

        if (nextFileIndex === null) {
          cb(false)
        }

        nextObj[nextFileIndex] = currentFile
        jsonfile.writeFile(filePath, nextObj, {
          spaces: 2
        }, (err) => {
          if (err) {
            cb(false)
          } else {
            cb(true)
          }
        })
      })
      .catch(() => cb(false))
  }, (processId * 1000))
}

module.exports = {
  getCurrentFile,
  saveCurrentFile
}
