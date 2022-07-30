const express = require('express')
const router = express.Router()
const UserController = require('../controllers/UserController')

router.get('/getUser/:address', UserController.getUser)
router.post('/signUp', UserController.signUp)
// NFT
router.post('/createNft', UserController.createNft)
router.get('/getNft/:asset_id', UserController.getNft)
router.get('/getNfts', UserController.getNfts)
router.get('/getUserNfts/:user_address', UserController.getUserNfts)
router.patch('/updateNft', UserController.updateNft)
router.patch('/updateNftMintedStatus', UserController.updateNftMintedStatus)
router.get('/getNftLastId', UserController.getNftLastId)
// Collections
router.get('/getNewCollections', UserController.getNewCollections)
router.get('/getUserCollection/:user_address', UserController.getUserCollection)
router.get('/getCollection/:url_name', UserController.getCollection)
router.post('/createColl', UserController.createColl)
// Offer
router.post('/createOffer', UserController.createOffer)
router.get('/getOffers/:asset_id', UserController.getOffers)
// Activity
router.post('/newActivity', UserController.newActivity)
router.get('/getActivity/:asset_id', UserController.getActivity)

// Test
router.get('/test', UserController.test)
router.get('/delete/:coll/:id', UserController.del)

module.exports = router
