// https://www.dappuniversity.com/articles/web3-js-intro

const Web3 = require('web3')
const rpcURL = 'https://rpc-mumbai.maticvigil.com/' // Your RPC URL goes here
const web3 = new Web3(rpcURL)
const address = '0x4B04b0bD233E5cf6EBf7E293124143eaf1077f23' // Your account address goes here

// web3.eth.getBalance(address, (err, wei) => {
//   balance = web3.utils.fromWei(wei, 'ether')
//   console.log("---->", balance);
// })
async function createVoucher_(assignedAddress, tokenId, uri, minPrice = 0) {
  // const assignedAddress =  accounts[0];

  const voucher = {
    assignedAddress,
    tokenId,
    minPrice,
    uri,
  }
  const domain = {
    name: 'LazyNFT-Voucher',
    version: '1',
    verifyingContract: '0xBE2FC973AF47066f73e2d11149B5547dA8fb0701',
    chainId: '80001',
  }
  const types = {
    NFTVoucher: [
      {
        name: 'assignedAddress',
        type: 'address',
      },
      {
        name: 'tokenId',
        type: 'uint256',
      },
      {
        name: 'minPrice',
        type: 'uint256',
      },
      {
        name: 'uri',
        type: 'string',
      },
    ],
  }
  // const signature = await signer._signTypedData(domain, types, voucher)

  var privateKey =
    '83945d516a3871cd36b573796e6dafb8469e493a24b5da481dbd46e01f5f8bb1'
  // let signer = new web3.ethers.Wallet(privateKey)
  let signer = web3.eth.accounts.privateKeyToAccount(privateKey, [false])

  const signature = await signer._signTypedData(domain, types, voucher)
  return {
    ...voucher,
    signature,
  }
}

;async () => {
  // console.log(
  //   '--->',
  //   await createVoucher_(
  //     '0x4B04b0bD233E5cf6EBf7E293124143eaf1077f23',
  //     '25',
  //     'https://www.img.test.co/file.png',
  //     2,
  //   ),
  // )
}

function sign(from, tokenId, minPrice, uri) {
  const msgParams = {
    domain: {
      name: 'LazyNFT-Voucher',
      version: '1',
      verifyingContract: '0xBE2FC973AF47066f73e2d11149B5547dA8fb0701',
      chainId: '80001', // 1
    },
    message: {
      assignedAddress: from,
      tokenId,
      minPrice,
      uri,
    },
    primaryType: 'NFTVoucher',
    types: {
      NFTVoucher: [
        {
          name: 'assignedAddress',
          type: 'address',
        },
        {
          name: 'tokenId',
          type: 'uint256',
        },
        {
          name: 'minPrice',
          type: 'uint256',
        },
        {
          name: 'uri',
          type: 'string',
        },
      ],
    },
  }
  const msgParamsString = JSON.stringify(msgParams)

  var acc = web3.eth.accounts.privateKeyToAccount(
    '83945d516a3871cd36b573796e6dafb8469e493a24b5da481dbd46e01f5f8bb1',
  )
  const signature = acc.sign(msgParamsString, acc['privateKey'])

  // const signingAddress = web3.eth.accounts.recover("Hello world", signature);
  // account === signingAddress
  console.log(signature)
}

// sign(
//   '0x4B04b0bD233E5cf6EBf7E293124143eaf1077f23',
//   '25',
//   'https://www.img.test.co/file.png',
//   2,
// )

function getTransactionDetails(id) {
  web3.eth.getTransaction(id)
  // web3.eth.getPendingTransactions().then(console.log);
  .then(console.log);
}

// getTransactionDetails("0x5b8b8f954c4fd0b379065bc2e346e1378237c1b61af83843e9dbee4612e83a03")

