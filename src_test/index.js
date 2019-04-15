const csv = require('csv-parser')
const Lazy = require('lazy')
const fs = require('fs')
const mongoose = require('mongoose')
const modelObject = require('./modelObject')

const uri = 'mongodb://localhost:27017/StockEtablissement'
const targetFile = '../task/output-0.csv'

mongoose.connect(uri, { useNewUrlParser: true })

const takeSize = 10000

const myDataSchema = new mongoose.Schema({}, {
 strict: false,
 collection: 'mydata'
})
const MyDataModel = mongoose.model('mydata', myDataSchema)

let hrendTotal = null;
mongoose.connection.on('open', (err, conn) => {
  if (err) {
    process.exit(1)
  } else {
    hrendTotal = process.hrtime()
    onConnected(0, takeSize, (execTime) => {
      console.log('end')
      process.exit(1)
    })
  }
})

function parseExecutionTime(hrstart) {
  const hrend = process.hrtime(hrstart)
  console.info('Execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000)
}

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
