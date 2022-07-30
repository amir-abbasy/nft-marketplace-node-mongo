const con = require('../models/Config')
const apiResponce = require('../helpers/apiResponce')

const TestController = {
  getData: async (req, res) => {
    try {
      const coll = await con('names')
      const query = { title: 'Item 1' }
      const item = await coll.findOne(query, {})
      apiResponce.successResponseWithData(res, 'sucess', item)
    } catch (error) {
      apiResponce.ErrorResponse(res, error.message)
    }
  },
  insertData: async (req, res) => {
    try {
      const coll = await con('names')
      const doc = {
        _id: new Date().getTime(),
        title: req.params.title,
        content: {
          name: req.params.title + this.id,
          id: this.id + this.title,
        },
      }
      const result = await coll.insertOne(doc)
      apiResponce.successResponseWithData(res, 'sucess', result)
    } catch (error) {
      apiResponce.ErrorResponse(res, error.message)
    }
  },
}

module.exports = TestController
