const csv = require('csv-parser')
const Lazy = require('lazy')
const fs = require('fs')
const mongoose = require('mongoose')

const MyDataModel = require('./MyDataModel')
const { parseExecutionTime, modelObject } = require('./tools')

const uri = 'mongodb://localhost:27017/StockEtablissement'
let targetIndex = null
const targetFile = `./task/output-${targetIndex}.csv`
const takeSize = 10000
let hrendTotal = null

mongoose.connect(uri, { useNewUrlParser: true })
mongoose.connection.on('open', (err, conn) => {
  if (err) {
    process.exit(1)
  } else {
    hrendTotal = process.hrtime()
    onConnected(1, takeSize, (execTime) => {
      console.log('end')
      process.exit(1)
    })
  }
})

const readFile = (skip = 0, take = 0) => {
  return new Promise(async (resolve, reject) => {
    try {
      const hrstart = process.hrtime()
      const stream = await fs.createReadStream(targetFile)
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

const onConnected = (skip = 0, take = 0, callback) => {
  readFile(skip, take)
    .then(({ data, hrstart }) => {
      if (data.length === 0) {
        parseExecutionTime(hrendTotal)
        callback(true)
      } else {
        const opts = {
          ordered: false,
          bypassDocumentValidation: true
        }

        MyDataModel
          .bulkWrite(data.map(item => ({
            insertOne: {
              document: modelObject(item)
            }
          })), opts)
          .then(({ insertedCount }) => {
            console.log(`insertedCount : ${insertedCount}`)
            parseExecutionTime(hrstart)
            //onConnected((skip + take), take, callback)
            onConnected(1000000, take, callback)
          })
          .catch(e => console.error(e))
      }
    })
    .catch(error => console.error(error))
}
