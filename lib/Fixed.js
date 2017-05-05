const arguguard = require('arguguard')
const BytesLengthError = require('./BytesLengthError')
const integerValidator = require('./integerValidator')

function Fixed(name, length) {
  arguguard('Fixed', ['string', integerValidator], arguments)
  this.name = name
  this.length = length
}

Fixed.prototype.encode = function encode(bytes) {
  arguguard('fixed.encode', ['Uint8Array'], arguments)
  if (bytes.length !== this.length) {
    throw new BytesLengthError(`Expected ${this.length}, received ${bytes.length}`)
  }
  return bytes
}

Fixed.prototype.decode = function decode(encoding) {
  arguguard('fixed.decode', ['Uint8Array'], arguments)
  return {
    value: encoding.slice(0, this.length),
    remainder: encoding.slice(this.length)
  }
}

module.exports = Fixed
