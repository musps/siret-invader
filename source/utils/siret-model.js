const mongoose = require('mongoose')

const myDataSchema = new mongoose.Schema({}, {
 strict: false,
 collection: 'siret-invader'
})
const MyDataModel = mongoose.model('siret-invader', myDataSchema)

module.exports = MyDataModel
