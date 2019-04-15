const csvSplitStream = require('csv-split-stream')
const fs = require('fs')
const jsonfile = require('jsonfile')

const taskDir = './task'
const csvPath = './StockEtablissement_utf8.csv'

const createDir = async (path) => {
  return new Promise((resolve) => {
    if (! fs.existsSync(path)) {
      fs.mkdirSync(path)
      resolve('DIR_CREATED')
    } else {
      resolve('DIR_EXIST')
    }
  })
}

const buildLog = (filePath, nbFile, filePrefix, ext) => {
  const log = []

  for (let i = 0; i < nbFile; i++) {
    log.push({
      file: `${filePath}/${filePrefix}${i}${ext}`,
      cursor: 0,
      done: false
    })
  }
  return log
}

const saveLog = async (filePath, nbFile, filePrefix, ext) => {
  const log = await buildLog(filePath, nbFile, filePrefix, ext)

  const logFile = `${filePath}/${filePrefix}log.json`
  jsonfile.writeFile(logFile, log, {
    spaces: 2
  }, (err) => {
    if (err) console.error(err)
  })
}

const splitCSV = async ({ entryFile, maxRowsPerFile = 100, outputPath = './' , outputPrefix = 'output-' }) => {
  const ext = '.csv'
  return new Promise((resolve, reject) => {
    csvSplitStream.split(
      fs.createReadStream(entryFile),
      {
        lineLimit: maxRowsPerFile
      },
      (index) => fs.createWriteStream(`${outputPath}/${outputPrefix}${index}${ext}`)
    )
    .then(resp => resolve({
      nbFile: resp.totalChunks,
      outputPrefix,
      outputPath,
      ext
    }))
    .catch(csvSplitError => resject(csvSplitError))
  })
}

// Execution :
createDir(taskDir).then((action) => {
  splitCSV({
    entryFile: csvPath,
    maxRowsPerFile: 280000,
    outputPath: taskDir,
    outputPrefix: 'output-'
  }).then(({ outputPath, nbFile, outputPrefix, ext }) => {
    saveLog(outputPath, nbFile, outputPrefix, ext)
  }).catch((onError) => {
    console.log('onError', onError)
  })
})
