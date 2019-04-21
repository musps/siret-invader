const {
  createDir,
  printLog,
  splitCSV,
  saveLog
} = require('./create-task-fn')

const csvPath = './StockEtablissement_utf8.csv'
const taskDir = './task-in-progress'

createDir(taskDir).then(() => {
  printLog('Init')

  const optionsSplitCSV = {
    entryFile: csvPath,
    maxRowsPerFile: 280000,
    outputPath: taskDir,
    outputPrefix: 'output-'
  }

  splitCSV(optionsSplitCSV)
    .then(({
      outputPath, nbFile, outputPrefix, ext
    }) => {
      printLog('Save log')

      saveLog(outputPath, nbFile, outputPrefix, ext, (state) => {
        if (state) {
          printLog('Step 1 done')
        }
      })
    })
    .catch((onError) => {
      console.log('onError', onError)
    })
})
