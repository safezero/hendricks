const Dictionary = require('../lib/dictionary')
const Dynamic = require('../lib/Dynamic')
const Fixed = require('../lib/Fixed')
const Fork = require('../lib/Fork')
const List = require('../lib/List')
const Branch = require('../lib/Branch')
const util = require('util')
const chai = require('chai')

const publicKeyFixed = new Fixed('publicKey', 12)
const nameDynamic = new Dynamic('name', 1)
const infoDynamic = new Dynamic('info', 2)
const productDictionary = new Dictionary('product', [nameDynamic, infoDynamic])
const productList = new List('products', 1, productDictionary)
const transportDictionary = new Dictionary('transport', [nameDynamic, infoDynamic])
const transportList = new List('transports', 1, transportDictionary)
const storeDictionary = new Dictionary('store', [
  publicKeyFixed,
  nameDynamic,
  infoDynamic,
  productList,
  transportList
])
const ciphertextDynamic = new Dynamic('ciphertext', 2)
const storeBranch = new Branch('store', storeDictionary)
const messageBranch = new Branch('message', ciphertextDynamic)
const typeFork = new Fork('type', [storeBranch, messageBranch])
const v0Branch = new Branch('v0', typeFork)
const versionFork = new Fork('version', [v0Branch])

chai.should()

const storeData = {
  branch: 'v0',
  value: {
    branch: 'store',
    value: {
      publicKey: new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]),
      name: new Uint8Array([1, 2, 3, 4]),
      info: new Uint8Array([1, 2, 3, 4, 5, 6]),
      products: [
        {
          name: new Uint8Array([1, 2, 3, 4]),
          info: new Uint8Array([1, 2, 3, 4, 5, 6])
        },
        {
          name: new Uint8Array([1, 2, 3, 4]),
          info: new Uint8Array([1, 2, 3, 4, 5, 6])
        }
      ],
      transports: [
        {
          name: new Uint8Array([1, 2, 3, 4]),
          info: new Uint8Array([1, 2, 3, 4, 5, 6])
        },
        {
          name: new Uint8Array([1, 2, 3, 4]),
          info: new Uint8Array([1, 2, 3, 4, 5, 6])
        }
      ]
    }
  }
}
const messageData = {
  branch: 'v0',
  value: {
    branch: 'message',
    value: new Uint8Array([1, 2, 3, 4, 5])
  }
}

describe('encoding/decoding', () => {
  it ('should encode and decode store', () => {
    const encoded = versionFork.encode(storeData)
    const result = versionFork.decode(encoded)
    result.value.should.deep.equal(storeData)
  })
  it ('should encode and decode message', () => {
    const encoded = versionFork.encode(messageData)
    const result = versionFork.decode(encoded)
    result.value.should.deep.equal(messageData)
  })
})
