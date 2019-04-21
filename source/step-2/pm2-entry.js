const jsonfile = require('jsonfile')

const Bulk = require('./pm2-entry-bulk')
const printLog = require('../utils/print-log')
const { getCurrentFile, saveCurrentFile } = require('./pm2-entry-fn')

const processId = process.env.pm_id || 0
const file = './task/output-log.json'
const bulk = new Bulk()

// { id: number, file: string, cursor: number, state: number }
let currentFile = { }

getCurrentFile(processId, file, currentFile, (nextFile) => {
  if (!nextFile) {
    console.log('something went wrong for process id ', processId)
  } else {
    console.log('done => ', nextFile)
    currentFile = nextFile

    // Init bulk.
    bulk.initialize({
      filePath: currentFile.file,
      skip: 1,
      take: 10000
    }, () => {
      bulk.start(loop => console.log('loop', bulk.getSkip(), loop))
    })
    // Init bulk.
  }
})

/**
 * Hnadle on PM2 stop|kill signal.
 */
process.on('SIGINT', () => {
  saveCurrentFile(processId, file, currentFile, (state) => {
    printLog(`SIGINT ${processId} done`)
    // Close database connection.
    bulk.setPause(true)
    process.exit(1)
  })
})

/**
 * Keep the process alive.
 */
setInterval(() => { }, 1000)
