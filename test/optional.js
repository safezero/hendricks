const OptionalTemplate = require('../lib/Optional')
const DynamicTemplate = require('../lib/Dynamic')
const DictionaryTemplate = require('../lib/Dictionary')
const chai = require('chai')
const InvalidOptionalByteError = require('../lib/InvalidOptionalByteError')


chai.should()


const fromTemplate = new OptionalTemplate(new DynamicTemplate(1))
const messageTemplate = new DictionaryTemplate([fromTemplate, new DynamicTemplate(1)])

const params = [
  [fromTemplate, null, new Uint8Array([0])],
  [fromTemplate, new Uint8Array([1, 2, 3]), new Uint8Array([1, 3, 1, 2, 3])],
  [
    messageTemplate, [
      null,
      new Uint8Array([4, 5, 6])
    ],
    new Uint8Array([0, 3, 4, 5, 6])
  ],
  [
    messageTemplate, [
      new Uint8Array([1, 2, 3]),
      new Uint8Array([4, 5, 6])
    ],
    new Uint8Array([1, 3, 1, 2, 3, 3, 4, 5, 6])
  ]
]

describe('optional', () => {
  params.forEach((param) => {
    const template = param[0]
    const from = param[1]
    const to = param[2]
    it(`Optional should encode [${from}] to [${to}]`, () => {
      chai.expect(template.encode(from)).to.deep.equal(to)
    })
    it(`Optional should decode [${to}] to [${from}]`, () => {
      chai.expect(template.decode(to)).to.deep.equal(from)
    })
  })
  // it('should throw BytesLengthError with not enough bytes', () => {
  //   (() => {
  //     const fixed = new Fixed('myFixed', 2)
  //     fixed.encode(new Uint8Array([]))
  //   }).should.throw(BytesLengthError)
  // })
  // it('should throw BytesLengthError with too many bytes', () => {
  //   (() => {
  //     const fixed = new Fixed('myFixed', 2)
  //     fixed.encode(new Uint8Array([1, 2, 3]))
  //   }).should.throw(BytesLengthError)
  // })
})
