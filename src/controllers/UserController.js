const con = require('../models/Config')
const apiResponce = require('../helpers/apiResponce')
var ObjectId = require('mongodb').ObjectId

const UserController = {
  getUser: async (req, res) => {
    try {
      const users = await con('users')
      const query = { address: req.params.address }
      const item = await users.findOne(query, {})
      apiResponce.successResponseWithData(res, 'success', item)
    } catch (error) {
      apiResponce.ErrorResponse(res, error.message)
    }
  },
  signUp: async (req, res) => {
    try {
      const users = await con('users')
      const body = req.body
      const doc = {
        // _id: new Date().getTime(),
        address: body.address,
        username: body.username,
        profPic: null,
        nfts: [],
        nftCollections: [],
      }
      const isUserExists = await users.findOne({ address: body.address })
      if (isUserExists) {
        apiResponce.successResponseWithData(res, 'Checking user address', {
          errorMessage: 'address already exists!, use existing address',
        })
      } else {
        const result = await users.insertOne(doc)
        apiResponce.successResponseWithData(res, 'success', result)
      }
    } catch (error) {
      apiResponce.ErrorResponse(res, error.message)
    }
  },
  createNft: async (req, res) => {
    try {
      const users = await con('asset')
      const body = req.body

      // apiResponce.successResponseWithData(res, 'Registration error!', {
      //   errorMessage: 'address already exists!',
      // })

      const result = await users.insertOne({
        ...body,
        createdDate: new Date().toString(),
        listed: false,
      })
      console.log(result)
      apiResponce.successResponseWithData(res, 'success', result)
    } catch (error) {
      apiResponce.ErrorResponse(res, error.message)
    }
  },
  getUserNfts: async (req, res) => {
    try {
      const coll = await con('asset')
      const query = { owner: req.params.user_address }
      const items = await coll.find(query, {}).toArray()
      apiResponce.successResponseWithData(res, 'success', items)
    } catch (error) {
      apiResponce.ErrorResponse(res, error.message)
    }
  },
  getNft: async (req, res) => {
    try {
      const coll = await con('asset')
      const query = { _id: ObjectId(req.params.asset_id) }
      const item = await coll.findOne(query, {})
      apiResponce.successResponseWithData(res, 'success', item)
    } catch (error) {
      apiResponce.ErrorResponse(res, error.message)
    }
  },
  updateNftMintedStatus: async (req, res) => {
    try {
      const asset = await con('asset')
      const body = req.body

      await asset
        .updateOne(
          { _id: ObjectId(body.assetId) }, // Filter
          {
            $set: {
              owner: body.newOwner,
              minted: true,
              listed: false,
            },
          },
        )
        .then((result) => {
          console.log('Updated - ' + result)
          apiResponce.successResponseWithData(res, 'success', result)
        })
        .catch((err) => {
          console.log('Error: ' + err)
        })
    } catch (error) {
      apiResponce.ErrorResponse(res, error.message)
    }
  },
  updateNft: async (req, res) => {
    try {
      const asset = await con('asset')
      const body = req.body

      await asset
        .updateOne(
          { _id: ObjectId(body.assetId) }, // Filter
          {
            $set: {
              'ipfs_meta.price': body.price,
              signature: body.signature,
              listed: true,
            },
          },
        )
        .then((result) => {
          console.log('Updated - ' + result)
          apiResponce.successResponseWithData(res, 'success', result)
        })
        .catch((err) => {
          console.log('Error: ' + err)
        })
    } catch (error) {
      apiResponce.ErrorResponse(res, error.message)
    }
  },
  getNftLastId: async (req, res) => {
    try {
      const asset = await con('asset')
      const item = await asset.find({}, {}).sort({ _id: -1 }).limit(1).toArray()
      apiResponce.successResponseWithData(
        res,
        'success',
        item[0]['ipfs_meta']['tokenID'],
      )
    } catch (error) {
      apiResponce.ErrorResponse(res, error.message)
    }
  },
  createColl: async (req, res) => {
    try {
      const users = await con('collection')
      const body = req.body

      // apiResponce.successResponseWithData(res, 'Registration error!', {
      //   errorMessage: 'address already exists!',
      // })

      const result = await users.insertOne(body)
      console.log(result)
      apiResponce.successResponseWithData(res, 'success', result)
    } catch (error) {
      apiResponce.ErrorResponse(res, error.message)
    }
  },
  getNewCollections: async (req, res) => {
    try {
      const coll = await con('collection')
      const query = {}
      const item = await coll.find(query, {}).limit(3).toArray()
      apiResponce.successResponseWithData(res, 'success', item)
    } catch (error) {
      apiResponce.ErrorResponse(res, error.message)
    }
  },
  getUserCollection: async (req, res) => {
    try {
      const coll = await con('collection')
      const query = { owner: req.params.user_address }
      const item = await coll.find(query, {}).toArray()
      apiResponce.successResponseWithData(res, 'success', item)
    } catch (error) {
      apiResponce.ErrorResponse(res, error.message)
    }
  },
  getCollection: async (req, res) => {
    try {
      const coll = await con('asset')
      const query = { collection: req.params.url_name }
      const items = await coll.find(query, {}).toArray()

      const coll_collections = await con('collection')
      const query_coll = { url: req.params.url_name }
      const collectionDetails = await coll_collections.findOne(query_coll, {})

      // console.log(collectionDetails);
      apiResponce.successResponseWithData(res, 'success', {
        items,
        collectionDetails,
      })
    } catch (error) {
      apiResponce.ErrorResponse(res, error.message)
    }
  },
  getNfts: async (req, res) => {
    try {
      const coll = await con('collection')
      coll
        .aggregate([
          {
            $lookup: {
              from: 'asset',
              localField: 'url',
              foreignField: 'collection',
              as: 'nfts',
              pipeline: [
                {
                  $match: { listed: { $ne: false } },
                },
              ],
            },
          },
        ])
        .toArray(function (err, result) {
          if (err) throw err
          // console.log(JSON.stringify(result))
          apiResponce.successResponseWithData(res, 'success', result)
          //   db.close()
        })
    } catch (error) {
      apiResponce.ErrorResponse(res, error.message)
    }
  },
  createOffer: async (req, res) => {
    try {
      const users = await con('offers')
      const body = req.body

      // apiResponce.successResponseWithData(res, 'Registration error!', {
      //   errorMessage: 'address already exists!',
      // })

      const result = await users.insertOne(body)
      console.log(result)
      apiResponce.successResponseWithData(res, 'success', result)
    } catch (error) {
      apiResponce.ErrorResponse(res, error.message)
    }
  },
  getOffers: async (req, res) => {
    try {
      const coll = await con('offers')
      const query = { asset: req.params.asset_id }
      const items = await coll.find(query, {}).toArray()
      apiResponce.successResponseWithData(res, 'success', items)
    } catch (error) {
      apiResponce.ErrorResponse(res, error.message)
    }
  },
  newActivity: async (req, res) => {
    try {
      const users = await con('activity')
      const body = req.body
      const result = await users.insertOne(body)
      console.log(result)
      apiResponce.successResponseWithData(res, 'success', result)
    } catch (error) {
      apiResponce.ErrorResponse(res, error.message)
    }
  },
  getActivity: async (req, res) => {
    try {
      const coll = await con('activity')
      const query = { token: req.params.asset_id }
      const items = await coll.find(query, {}).toArray()
      apiResponce.successResponseWithData(res, 'success', items)
    } catch (error) {
      apiResponce.ErrorResponse(res, error.message)
    }
  },

  test: async (req, res) => {
    try {
      const coll = await con('collection')
      coll
        .aggregate([
          {
            $lookup: {
              from: 'asset',
              localField: 'url',
              foreignField: 'collection',
              as: 'nfts',
            },
          },
        ])
        .toArray(function (err, result) {
          if (err) throw err
          // console.log(JSON.stringify(result))
          apiResponce.successResponseWithData(res, 'success', result)
          //   db.close()
        })
    } catch (error) {
      apiResponce.ErrorResponse(res, error.message)
    }
  },
  del: async (req, res) => {
    console.log('deleting...')
    try {
      const coll = await con(req.params.coll)
      const query = { _id: ObjectId(req.params.id) }
      const item = await coll.deleteOne(query, {})
      apiResponce.successResponseWithData(res, 'success', item)
      console.log('deleted')
    } catch (error) {
      apiResponce.ErrorResponse(res, error.message)
    }
  },
}

module.exports = UserController
