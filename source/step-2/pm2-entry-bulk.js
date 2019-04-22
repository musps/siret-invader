const EventEmitter = require('events')
const mongoose = require('mongoose')
const Lazy = require('lazy')
const fs = require('fs')

const SiretModel = require('../utils/siret-model')
const siretModelObject = require('../utils/siret-model-object')
const fileHandler = require('./pm2-entry-fn')

const uri = 'mongodb://localhost:27017/StockEtablissement'

class Bulk {
  constructor(processId) {
    this.myEmitter = new EventEmitter()
    this.state = {
      currentFile: { },
      isPause: false,
      filePath: null,
      skip: 0,
      take: null,
      logFile: null,
      processId
    }

    process.on('SIGINT', () => this.setPause(true))
    setInterval(() => { }, 5000)
  }

  initialize({
    filePath, skip, take, logFile
  }) {
    this.state.filePath = filePath || this.state.filePath
    this.state.skip = skip || this.state.skip
    this.state.take = take || this.state.take
    this.state.logFile = logFile || this.state.logFile
  }

  initializeFile(callback) {
    fileHandler.getCurrentFile(
      this.getProcessId(),
      this.getLogFile(),
      this.getCurrentFile(),
      (nextFile) => {
        if (!nextFile) {
          console.log('Close process', this.getProcessId())
          process.exit(0)
        } else {
          console.log('done => ', nextFile)
          this.state.currentFile = nextFile

          this.initialize({
            filePath: nextFile.file,
            skip: ((nextFile.cursor === 0) ? 1 : nextFile.cursor),
            take: 10000
          })
          callback(true)
        }
      }
    )
  }

  start() {
    this.privateStart(({ insertedCount = null, state }) => {
      if (state === 3) {
        this.emitFileDone()
      } else {
        console.log('new insert', insertedCount)
      }
    })
  }

  saveCurrentFile(state, callback = null) {
    this.state.currentFile.cursor = this.getSkip()
    this.state.currentFile.state = state

    fileHandler.saveCurrentFile(
      this.getProcessId(),
      this.getLogFile(),
      this.getCurrentFile(),
      () => callback(true)
    )
  }

  getProcessId() {
    return this.state.processId
  }

  getCurrentFile() {
    return this.state.currentFile
  }

  setLogFile(logFile) {
    this.state.logFile = logFile
  }

  getLogFile() {
    return this.state.logFile
  }

  setPause(isPause = true) {
    this.state.isPause = isPause
  }

  getSkip() {
    return this.state.skip
  }

  setSkip(skip) {
    this.state.skip += skip
  }

  isPause() {
    return this.state.isPause
  }

  emitPauseReady() {
    this.myEmitter.emit('onPauseReady')
  }

  onPauseReady(callback) {
    this.myEmitter.on('onPauseReady', () => {
      this.closeDatabase()
      this.saveCurrentFile(0, () => {
        callback(true)
      })
    })
  }

  emitFileDone() {
    this.myEmitter.emit('onFileDone')
  }

  onFileDone(callback) {
    this.myEmitter.on('onFileDone', () => {
      this.saveCurrentFile(2, () => {
        callback(true)
      })
    })
  }

  privateStart(callback) {
    const { filePath, skip, take } = this.state

    this.readFile(filePath, skip, take)
      .then(({ data }) => {
        if (data.length === 0) {
          callback({ state: 3 })
        } else {
          this.storeItems(data, (insertedCount) => {
            if (!this.isPause()) {
              callback({ insertedCount, state: 2 })
              this.privateStart(callback)
            } else {
              callback({ insertedCount, state: 2 })
              this.emitPauseReady()
            }
          })
        }
      })
  }

  storeItems(items, callback) {
    const opts = {
      ordered: false,
      bypassDocumentValidation: true
    }
    SiretModel
      .bulkWrite(items.map(i => ({
        insertOne: {
          document: siretModelObject(i)
        }
      })), opts)
      .then(({ insertedCount }) => {
        // this.setSkip(items.length)
        this.state.skip = 280001
        callback(insertedCount)
      })
      .catch(e => console.error(e))
  }

  closeDatabase() {
    mongoose.connection.close()
  }

  connectDatabase(callback) {
    mongoose.connect(uri, { useNewUrlParser: true })
    mongoose.connection.on('open', (err) => {
      if (err) {
        process.exit(1)
      } else {
        callback(true)
      }
    })
  }

  readFile(filePath, skip, take) {
    return new Promise(async (resolve, reject) => {
      try {
        const stream = await fs.createReadStream(filePath)
        await (new Lazy(stream))
          .lines
          .skip(skip)
          .take(take)
          .map(x => x.toString().split(','))
          .join(data => resolve({
            data,
            skip,
            take
          }))
      } catch (e) {
        reject(e)
      }
    })
  }
}

module.exports = Bulk
