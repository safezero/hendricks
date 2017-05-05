const arguguard = require('arguguard')
const Fork = require('./Fork')

function Dictionary(name, molds) {
  arguguard('Dictionary', ['string', '[]*'], arguments)
  this.name = name
  this.molds = molds
}

Dictionary.prototype.encode = function encode(values) {
  arguguard('dictionary.encode', ['Object'], arguments)
  let dictionary = this
  const moldEncodings = this.molds.map((mold) => {
    return mold.encode(values[mold.name])
  })
  const moldEncodingsLength = moldEncodings.reduce((total, moldEncoding) => {
    return total += moldEncoding.length
  }, 0)
  const encoding = new Uint8Array(moldEncodingsLength)

  let offset = 0
  moldEncodings.forEach((moldEncoding) => {
    encoding.set(moldEncoding, offset)
    offset += moldEncoding.length
  })
  return encoding

}

Dictionary.prototype.decode = function decode(encoding) {
  arguguard('dictionary.decode', ['Uint8Array'], arguments)

  const values = {}

  this.molds.forEach((mold) => {
    result = mold.decode(encoding)
    values[mold.name] = result.value
    encoding = result.remainder
  })

  return {
    value: values,
    remainder: encoding
  }
}

module.exports = Dictionary
