const express = require('express')
const router = express.Router()
const TestController = require('../controllers/TestController')



router.get('/getData', TestController.getData)
router.get('/insertData/:title', TestController.insertData)


module.exports = router;
