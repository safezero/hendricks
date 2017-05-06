const Dictionary = require('../lib/Dictionary')
const Fixed = require('../lib/Fixed')
const Dynamic = require('../lib/Dynamic')
const chai = require('chai')
const Branch = require('../lib/Branch')

chai.should()

const infoDynamic = new Dynamic('info', 2)
const nameDynamic = new Dynamic('name', 2)
const publicKeyDynamic = new Fixed('publicKey', 3)
const dictionary = new Dictionary('mydictionary', [infoDynamic, nameDynamic, publicKeyDynamic])

const params = [
  [[infoDynamic, nameDynamic, publicKeyDynamic], new Uint8Array([0, 1, 1, 0, 2, 2, 2, 3, 3, 3]), {
    info: new Uint8Array([1]),
    name: new Uint8Array([2, 2]),
    publicKey: new Uint8Array([3, 3, 3])
  }],
  [[nameDynamic, publicKeyDynamic, infoDynamic], new Uint8Array([0, 1, 1, 0, 2, 2, 2, 3, 3, 3]), {
    info: new Uint8Array([1]),
    name: new Uint8Array([2, 2]),
    publicKey: new Uint8Array([3, 3, 3])
  }]
]

describe('dictionary', () => {
  params.forEach((param) => {
    const templates = param[0]
    const encoded = param[1]
    const pojo = param[2]
    it(`should encode ${pojo} to ${encoded}`, () => {
      const stream = new Uint8Array()
      dictionary.encode(pojo).should.deep.equal(encoded)
    })
    it(`should decode ${encoded} to ${pojo}`, () => {
      const stream = new Uint8Array()
      dictionary.decode(encoded).value.should.deep.equal(pojo)
    })
  })
})