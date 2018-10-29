const arguguard = require('arguguard')
const intcoder = require('intcoder')
const BytesLengthError = require('./BytesLengthError')
const integerValidator = require('./integerValidator')
const Template = require('./Template')

module.exports = class Dynamic extends Template {
  constructor(lengthEncodingLength) {
    super()
    this.lengthEncodingLength = lengthEncodingLength
  }

  encode(bytes) {
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

  decodeWithRemainder(encoding) {
    const lengthEncoding = encoding.slice(0, this.lengthEncodingLength)
    const length = intcoder.decode(lengthEncoding)
    const end = this.lengthEncodingLength + length
    return {
      value: encoding.slice(this.lengthEncodingLength, end),
      remainder: encoding.slice(end)
    }
  }
}
