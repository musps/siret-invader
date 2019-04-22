const Bulk = require('./pm2-entry-bulk')

const processId = process.env.pm_id || 0

const logFile = './task/output-log.json'

const bulk = new Bulk(processId)

bulk.connectDatabase(() => {
  bulk.setLogFile(logFile)

  bulk.onFileDone(() => {
    console.log('on file done')
    bulk.initializeFile(() => bulk.start())
  })

  bulk.onPauseReady(() => {
    console.log('on pause ready')
    process.exit(0)
  })

  bulk.initializeFile(() => bulk.start())
})
