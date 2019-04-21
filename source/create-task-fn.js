const csvSplitStream = require('csv-split-stream')
const fs = require('fs')
const jsonfile = require('jsonfile')

const printLog = (text = '', state = false) => {
  const y = '✅'
  const n = '☑️'

  console.log((state ? y : n), ' ', text)
}

const createDir = async path => (
  new Promise((resolve) => {
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path)
      resolve('DIR_CREATED')
    } else {
      resolve('DIR_EXIST')
    }
  })
)

const buildLog = (filePath, nbFile, filePrefix, ext) => {
  const log = []

  for (let i = 0; i < nbFile; i += 1) {
    log.push({
      file: `${filePath}/${filePrefix}${i}${ext}`,
      cursor: 0,
      done: false
    })
  }
  return log
}

const saveLog = async (filePath, nbFile, filePrefix, ext, callback) => {
  const log = await buildLog(filePath, nbFile, filePrefix, ext)

  const logFile = `${filePath}/${filePrefix}log.json`
  jsonfile.writeFile(logFile, log, {
    spaces: 2
  }, (err) => {
    if (err) callback(false)
    callback(true)
  })
}

const splitCSV = async ({
  entryFile,
  maxRowsPerFile = 100,
  outputPath = './',
  outputPrefix = 'output-'
}) => {
  const ext = '.csv'
  return new Promise((resolve, reject) => {
    csvSplitStream
      .split(fs.createReadStream(entryFile), {
        lineLimit: maxRowsPerFile
      },
      index => fs.createWriteStream(`${outputPath}/${outputPrefix}${index}${ext}`))
      .then(resp => resolve({
        nbFile: resp.totalChunks,
        outputPrefix,
        outputPath,
        ext
      }))
      .catch(csvSplitError => reject(csvSplitError))
  })
}

module.exports = {
  createDir,
  saveLog,
  splitCSV,
  printLog
}
