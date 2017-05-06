const Dictionary = require('../lib/dictionary')
const Dynamic = require('../lib/Dynamic')
const Fixed = require('../lib/Fixed')
const Split = require('../lib/Split')
const List = require('../lib/List')
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
const typeSplit = new Split('type', 1, ['store', 'message'], [storeDictionary, ciphertextDynamic])
const versionSplit = new Split('version', 1, ['v0'], [typeSplit])

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
    const encoded = versionSplit.encode(storeData)
    const result = versionSplit.decode(encoded)
    result.value.should.deep.equal(storeData)
  })
  it ('should encode and decode message', () => {
    const encoded = versionSplit.encode(messageData)
    const result = versionSplit.decode(encoded)
    result.value.should.deep.equal(messageData)
  })
})
