const mongoose = require('mongoose')

const myDataSchema = new mongoose.Schema({}, {
 strict: false,
 collection: 'mydata'
})
const MyDataModel = mongoose.model('mydata', myDataSchema)

module.exports = MyDataModel
