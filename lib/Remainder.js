const arguguard = require('arguguard')
const BytesLengthError = require('./BytesLengthError')
const integerValidator = require('./integerValidator')

function Remainder(name) {
  arguguard('Fixed', ['string'], arguments)
  this.name = name
}

Remainder.prototype.encode = function encode(bytes) {
  arguguard('fixed.encode', ['Uint8Array'], arguments)
  return bytes
}

Remainder.prototype.decode = function decode(encoding) {
  arguguard('fixed.decode', ['Uint8Array'], arguments)
  return encoding
}

Remainder.prototype.decodeWithRemainder = function decodeWithRemainder(encoding) {
  arguguard('fixed.decodeWithRemainder', ['Uint8Array'], arguments)
  return {
    value: encoding,
    remainder: new Uint8Array(0)
  }
}

module.exports = Remainder
