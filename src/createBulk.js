const csv = require('csv-parser')
const fs = require('fs')
const mongoose = require("mongoose")
const Lazy = require('lazy')
const buildObj = require('./buildObj.js')
const uri = 'mongodb://localhost:27017/StockEtablissement'
const StockEtablissement = require('./Models/StockEtablissement.js')
const csvPath = '/Users/ysercanz/Documents/stock-etablissement/project/task/output-0.csv'

mongoose.connect(uri, {
  useNewUrlParser: true
})

mongoose.connection.on('open', (err,conn) => {
  if (err) {
    process.exit(1)
  } else {
   (async () => {
      await StockEtablissement.collection.drop()
      await StockEtablissement.createCollection()

      const stream = await fs.createReadStream(csvPath)
      loopRows(1, 0, 1000, stream, true)
    })()
  }
})

const loopRows = (curStart, curStop, maxRow, stream, isFirstLoop = false) => {
  let start = isFirstLoop ? curStart : (curStart + maxRow)
  let stop = isFirstLoop ? (curStart + maxRow) : (curStop + maxRow)
  console.time("dbsave")
  console.log('loopRows')
  return new Promise((resolve, reject) => {
    getFileRows(start, maxRow, stream).then((data) => {
      createBulk(data).then((onSuccess) => {
        console.log('success')
        if (start > 10000) {
          console.timeEnd("dbsave")
          process.exit()
        } else {
          loopRows(start, stop, maxRow, stream, false)
        }
      }).catch((onError) => {
        console.log('error', onError)
        resolve(Date.now())
      })
    })
  })
}

const getFileRows =  (start, stop, stream) => {
  return new Promise(async (resolve, reject) => {
    const output = []
    const data = (new Lazy(stream)
      .lines
      .skip(start)
      .take(stop)
      .map((line) => {
        output.push(line.toString().split(','))

        if (output.length === stop) {
          resolve(output)
        }
      })
    )
  })
}

const createBulk = (data) => {
  return new Promise(async (resolve, reject) => {
    console.log('data', data.length)
    const bulk = StockEtablissement.collection.initializeOrderedBulkOp()

    await data.map(item => {
      item = new StockEtablissement(buildObj(item))
      bulk.insert(item)
    })

    bulk.execute((err, res) => {
      if (err) {
        console.log('err', err.errmsg)
        process.exit()
      } else {
        resolve(true)
      }
    })
  })
}






