const Fixed = require('../lib/Fixed')
const chai = require('chai')
const BytesLengthError = require('../lib/BytesLengthError')

chai.should()

const bigArray = (new Array(256)).fill(1)

const params = [
  [1, new Uint8Array([1])],
  [3, new Uint8Array([1, 2, 3])]
]

describe('fixed', () => {
  params.forEach((param) => {
    const length = param[0]
    const value = param[1]
    const fixed = new Fixed(length)
    it(`Fixed(${length}) should encode [${value}] to [${value}]`, () => {
      fixed.encode(value).should.deep.equal(value)
    })
    it(`Fixed(${length}) should decode [${value}] to [${value}]`, () => {
      fixed.decode(value).should.deep.equal(value)
    })
  })
  it('should throw BytesLengthError with not enough bytes', () => {
    (() => {
      const fixed = new Fixed(2)
      fixed.encode(new Uint8Array([1]))
    }).should.throw(BytesLengthError)
  })
  it('should throw BytesLengthError with too many bytes', () => {
    (() => {
      const fixed = new Fixed(2)
      fixed.encode(new Uint8Array([1, 2, 3]))
    }).should.throw(BytesLengthError)
  })
})
