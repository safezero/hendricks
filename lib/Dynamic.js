const arguguard = require('arguguard')
const intcoder = require('intcoder')
const BytesLengthError = require('./BytesLengthError')
const integerValidator = require('./integerValidator')

function Dynamic(name, lengthEncodingLength) {
  arguguard('Dynamic', ['string', integerValidator], arguments)
  this.name = name
  this.lengthEncodingLength = lengthEncodingLength
}

Dynamic.prototype.encode = function encode(bytes) {
  arguguard('dynamic.encode', ['Uint8Array'], arguments)

  const encoding = new Uint8Array(this.lengthEncodingLength + bytes.length)
  const unpaddedLengthEncoding = intcoder.encode(bytes.length)

  if (unpaddedLengthEncoding.length > this.lengthEncodingLength) {
    throw new BytesLengthError(`Byte length of ${bytes.length} cannot be expressed within ${this.lengthEncodingLength} bytes`)
  }

  const padding = this.lengthEncodingLength - unpaddedLengthEncoding.length

  encoding.set(unpaddedLengthEncoding, padding)
  encoding.set(bytes, this.lengthEncodingLength)

  return encoding
}

Dynamic.prototype.decode = function decode(encoding) {
  arguguard('dynamic.decode', ['Uint8Array'], arguments)
  const lengthEncoding = encoding.slice(0, this.lengthEncodingLength)
  const length = intcoder.decode(lengthEncoding)
  const end = this.lengthEncodingLength + length
  return {
    value: encoding.slice(this.lengthEncodingLength, end),
    remainder: encoding.slice(end)
  }
}

module.exports = Dynamic
