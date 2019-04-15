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
    loopRows(1, 0, 10, true)
  }
})

const loopRows = (curStart, curStop, maxRow, isFirstLoop = false) => {
  let start = isFirstLoop ? curStart : (curStart + maxRow)
  let stop = isFirstLoop ? (curStart + maxRow) : (curStop + maxRow)

  console.log({ start, stop })

  return new Promise((resolve, reject) => {
    getFileRows(csvPath, start, stop).then((data) => {
      createBulk(data).then((onSuccess) => {
        console.log('success')
        loopRows(start, stop, maxRow)
      }).catch((onError) => {
        console.log('error')
        resolve(Date.now())
      })
    })
  })
}

const getFileRows =  (file, start, stop) => {
  return new Promise(async (resolve, reject) => {
    const output = []
    const stream = await fs.createReadStream(file)
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

const createBulk = async (data) => {
  return new Promise((resolve, reject) => {
    StockEtablissement
      .bulkWrite(data.map(item => ({
        insertOne: {
          document: buildObj(data)
        }
      })))
      .then(onSuccess => resolve(onSuccess))
      .catch(onError =>  reject(onError))
  })
}
