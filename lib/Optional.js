const arguguard = require('arguguard')
const BytesLengthError = require('./BytesLengthError')
const InvalidOptionalByteError = require('./InvalidOptionalByteError')
const integerValidator = require('./integerValidator')

function Optional(template) {
  arguguard('Optional', ['*'] , arguments)
  this.template = template
}

Optional.prototype.encode = function encode(bytesOrNull) {
  arguguard('optional.encode', ['*'], arguments)
  if (!bytesOrNull) {
    return new Uint8Array([0])
  }
  const templateEncoding = this.template.encode(bytesOrNull)
  const encoding = new Uint8Array(templateEncoding.length + 1)
  encoding[0] = 1
  encoding.set(templateEncoding, 1)
  return encoding
}

Optional.prototype.decode = function decode(encoding) {
  arguguard('optional.decode', ['*'], arguments)
  return this.decodeWithRemainder(encoding).value
}

Optional.prototype.decodeWithRemainder = function decodeWithRemainder(encoding) {
  arguguard('optional.decodeWithRemainder', ['*'], arguments)
  if (encoding[0] === 0) {
    return {
      value: null,
      remainder: encoding.slice(1)
    }
  }
  if (encoding[0] === 1) {
    return this.template.decodeWithRemainder(encoding.slice(1))
  }
  throw new InvalidOptionalByte(`bytes[0] should be 0 or 1, received ${bytes[0]}`)
}

module.exports = Optional
