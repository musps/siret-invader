const mongoose = require('mongoose')
const StockEtablissement = require('./../Models/StockEtablissement.js')

const uri = 'mongodb://localhost:27017/StockEtablissement'

mongoose.connect(uri, {
  useNewUrlParser: true
})

const fetchItems = StockEtablissement.find().limit(10)
fetchItems.exec((err, posts) => {
  if (err) {
    console.log('err', err)
    process.exit()
  } else {
    console.log('posts', posts)
  }
})
