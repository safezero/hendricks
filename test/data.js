const Dictionary = require('../lib/dictionary')
const Dynamic = require('../lib/Dynamic')
const Fixed = require('../lib/Fixed')
const Split = require('../lib/Split')
const List = require('../lib/List')
const util = require('util')
const chai = require('chai')

const publicKeyFixed = new Fixed(12)
const nameDynamic = new Dynamic(1)
const infoDynamic = new Dynamic(2)
const productDictionary = new Dictionary(['name', 'info'], [nameDynamic, infoDynamic])
const productList = new List(1, productDictionary)
const transportDictionary = new Dictionary(['name', 'info'], [nameDynamic, infoDynamic])
const transportList = new List(1, transportDictionary)
const storeDictionary = new Dictionary([
  'publicKey',
  'name',
  'info',
  'products',
  'transports'
],[
  publicKeyFixed,
  nameDynamic,
  infoDynamic,
  productList,
  transportList
])
const ciphertextDynamic = new Dynamic(2)
const storeKey = new Uint8Array([0])
const ciphertextKey = new Uint8Array([1])
const versionKey = new Uint8Array([0])
const typeSplit = new Split(['store', 'ciphertext'], [storeDictionary, ciphertextDynamic])
const versionSplit = new Split(['v0'], [typeSplit])

chai.should()

const storeData = {
  key: 'v0',
  value: {
    key: 'store',
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

const ciphertextData = {
  key: 'v0',
  value: {
    key: 'ciphertext',
    value: new Uint8Array([1, 2, 3, 4, 5])
  }
}

describe('store/ciphertext', () => {
  it ('should encode and decode store', () => {
    const encoded = versionSplit.encode(storeData)
    const result = versionSplit.decode(encoded)
    result.should.deep.equal(storeData)
  })
  it ('should encode and decode ciphertext', () => {
    const encoded = versionSplit.encode(ciphertextData)
    const result = versionSplit.decode(encoded)
    result.should.deep.equal(ciphertextData)
  })
})
