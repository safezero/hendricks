const Dynamic = require('../lib/Dynamic')
const Fixed = require('../lib/Fixed')
const Dictionary = require('../lib/dictionary')
const List = require('../lib/List')
const chai = require('chai')
const BytesLengthError = require('../lib/BytesLengthError')
const util = require('util')

chai.should()

const dynamic = new Dynamic('myDynamic', 2)
const fixed = new Fixed('myFixed', 2)
const dictionary = new Dictionary('myDictionary', [dynamic, fixed])

const params = [
  [
    2,
    dynamic,
    [
      new Uint8Array([1]),
      new Uint8Array([2])
    ],
    new Uint8Array([0, 2, 0, 1, 1, 0, 1, 2])
  ],
  [
    2,
    fixed,
    [
      new Uint8Array([1, 1]),
      new Uint8Array([2, 2])
    ],
    new Uint8Array([0, 2, 1, 1, 2, 2])
  ],
  [
    2,
    dictionary,
    [
      {
        myDynamic: new Uint8Array([1]),
        myFixed: new Uint8Array([1, 1])
      },
      {
        myDynamic: new Uint8Array([2]),
        myFixed: new Uint8Array([2, 2])
      }
    ],
    new Uint8Array([0, 2, 0, 1, 1, 1, 1, 0, 1, 2, 2, 2])
  ]
]

describe('list', () => {
  params.forEach((param) => {
    const lengthEncodingLength = param[0]
    const mold = param[1]
    const list = new List('myList', lengthEncodingLength, mold)
    const values = param[2]
    const encoded = param[3]
    it(`List(${lengthEncodingLength}) should encode [${values}] to [${encoded}]`, () => {
      list.encode(values).should.deep.equal(encoded)
    })
    it(`List(${lengthEncodingLength}) should decode [${encoded}] to [${values}]`, () => {
      list.decode(encoded).value.should.deep.equal(values)
    })
  })
  // it('should throw BytesLengthError', () => {
  //   (() => {
  //     const dynamic = new Dynamic(1)
  //     const stream = new Uint8Array(0)
  //     dynamic.encode(stream, new Uint8Array(bigArray))
  //   }).should.throw(BytesLengthError)
  // })
})
