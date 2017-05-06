const Dynamic = require('../lib/Dynamic')
const chai = require('chai')
const BytesLengthError = require('../lib/BytesLengthError')

chai.should()

const bigArray = (new Array(256)).fill(1)

const params = [
  [1, new Uint8Array([1]), new Uint8Array([1, 1])],
  [1, new Uint8Array([1, 2, 3]), new Uint8Array([3, 1, 2, 3])],
  [2, new Uint8Array([1]), new Uint8Array([0, 1, 1])],
  [2, new Uint8Array([1, 2, 3]), new Uint8Array([0, 3, 1, 2, 3])],
  [2, new Uint8Array(bigArray), new Uint8Array([1, 0].concat(bigArray))]
]

describe('dynamic', () => {
  params.forEach((param) => {
    const lengthEncodingLength = param[0]
    const value = param[1]
    const encoded = param[2]
    const dynamic = new Dynamic('myDynamic', lengthEncodingLength)

    it(`Dynamic(${lengthEncodingLength}) should encode [${value}] to [${encoded}]`, () => {
      dynamic.encode(value).should.deep.equal(encoded)
    })
    it(`Dynamic(${lengthEncodingLength}) should decode [${encoded}] to [${value}]`, () => {
      dynamic.decode(encoded).should.deep.equal(value)
    })
  })
  it('should throw BytesLengthError', () => {
    (() => {
      const dynamic = new Dynamic('big', 1)
      dynamic.encode(new Uint8Array(bigArray))
    }).should.throw(BytesLengthError)
  })
})
