require('dotenv').config()
const MongoClient = require('mongodb').MongoClient

// const uri = 'mongodb://192.168.11.19:27017'
const uri =
  'mongodb+srv://rd2:ioss@cluster0.xlbfpwk.mongodb.net/?retryWrites=true&w=majority'
var client = new MongoClient(uri)

const con = async (name) => {
  var con = await client.connect()
  var db = con.db('nft')
  return db.collection(name)
}

module.exports = con
