const printLog = require('../utils/print-log')
const jsonfile = require('jsonfile')
const { getCurrentFile, saveCurrentFile } = require('./pm2-entry-fn')

const processId = process.env.pm_id || null
const file = './task/output-log.json'
let currentFile = { }

getCurrentFile(processId, file, currentFile, (nextFile) => {
  if (!nextFile) {
    console.log('something went wrong for process id ', processId)
  } else {
    console.log('done => ', nextFile)

    currentFile = nextFile
  }
})

process.on('SIGINT', () => {
  saveCurrentFile(processId, file, currentFile, (state) => {
    printLog(`SIGINT ${processId} done`)
    process.exit(0)
  })
})

/**
 * Keep the process alive.
 */
setInterval(() => { }, 1000)
