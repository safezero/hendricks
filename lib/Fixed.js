const arguguard = require('arguguard')
const BytesLengthError = require('./BytesLengthError')
const integerValidator = require('./integerValidator')

function Fixed(length) {
  arguguard('Fixed', [integerValidator], arguments)
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
  return this.decodeWithRemainder(encoding).value
}

Fixed.prototype.decodeWithRemainder = function decodeWithRemainder(encoding) {
  arguguard('fixed.decodeWithRemainder', ['Uint8Array'], arguments)
  return {
    value: encoding.slice(0, this.length),
    remainder: encoding.slice(this.length)
  }
}

module.exports = Fixed
