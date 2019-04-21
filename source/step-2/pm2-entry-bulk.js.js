const mongoose = require('mongoose')
const csv = require('csv-parser')
const Lazy = require('lazy')
const fs = require('fs')

const SiretModel = require('../utils/siret-model')
const siretModelObject = require('../utils/siret-model-object')

const uri = 'mongodb://localhost:27017/StockEtablissement'
const parseExecutionTime = function parseExecutionTime(hrstart) {
  const hrend = process.hrtime(hrstart)
  console.info('Execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000)
}

class Bulk {
  constructor() {
    this.state = {
      isPause: false,
      hrstart: null,
      filePath: null,
      skip: 0,
      take: null,
    }
  }

  initialize({ filePath, skip, take }, callback) {
    this.state.filePath = filePath
    this.state.skip = skip
    this.state.take = take

    this.connectDatabase(() => callback())
  }

  setHrtime() {
    this.state.hrstart = process.hrtime()
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

  start(callback) {
    const { filePath, skip, take } = this.state

    this.readFile(filePath, skip, take)
      .then(({ data, hrstart }) => {
        if (data.length === 0) {
          parseExecutionTime(hrendTotal)
          callback({ state: 3 })
        } else {
          this.storeItems(data, (loop) => {
            callback(loop)
            this.start(callback)
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
        this.setSkip(items.length)
        callback({ insertedCount, state: 2 })
      })
      .catch(e => console.error(e))
  }

  closeDatabase() {
    mongoose.connection.close()
  }

  connectDatabase(callback) {
    mongoose.connect(uri, { useNewUrlParser: true })
    mongoose.connection.on('open', (err, conn) => {
      if (err) {
        process.exit(1)
      } else {
        this.setHrtime()
        callback(true)
      }
    })
  }

  readFile(filePath, skip, take) {
    return new Promise(async (resolve, reject) => {
      try {
        const hrstart = process.hrtime()
        const stream = await fs.createReadStream(filePath)
        const v = await (new Lazy(stream))
          .lines
          .skip(skip)
          .take(take)
          .map(x => x.toString().split(','))
          .join(data => resolve({
            data,
            hrstart,
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

















