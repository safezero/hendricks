const Dictionary = require('../lib/Dictionary')
const Fixed = require('../lib/Fixed')
const Dynamic = require('../lib/Dynamic')
const chai = require('chai')

chai.should()

const infoDynamic = new Dynamic(2)
const nameDynamic = new Dynamic(2)
const publicKeyDynamic = new Fixed(3)
const dictionary = new Dictionary(
  ['info', 'name', 'publicKey'],
  [infoDynamic, nameDynamic, publicKeyDynamic]
)

const params = [
  [
    new Uint8Array([0, 1, 1, 0, 2, 2, 2, 3, 3, 3]),
    {
      info: new Uint8Array([1]),
      name: new Uint8Array([2, 2]),
      publicKey: new Uint8Array([3, 3, 3])
    }
  ],
  [
    new Uint8Array([0, 1, 1, 0, 2, 2, 2, 3, 3, 3]),
    {
      publicKey: new Uint8Array([3, 3, 3]),
      info: new Uint8Array([1]),
      name: new Uint8Array([2, 2])
    },
  ]
]

describe('dictionary', () => {
  params.forEach((param) => {
    const encoded = param[0]
    const values = param[1]
    it(`should encode ${values} to ${encoded}`, () => {
      dictionary.encode(values).should.deep.equal(encoded)
    })
    it(`should decode ${encoded} to ${values}`, () => {
      dictionary.decode(encoded).should.deep.equal(values)
    })
  })
})
