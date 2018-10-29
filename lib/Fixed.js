const arguguard = require('arguguard')
const BytesLengthError = require('./BytesLengthError')
const integerValidator = require('./integerValidator')
const Template = require('./Template')

module.exports = class Fixed extends Template {
  constructor(length) {
    super()
    this.length = length
  }

  encode(bytes) {
    if (bytes.length !== this.length) {
      throw new BytesLengthError(`Expected ${this.length}, received ${bytes.length}`)
    }
    return bytes
  }

  decodeWithRemainder(encoding) {
    return {
      value: encoding.slice(0, this.length),
      remainder: encoding.slice(this.length)
    }
  }
}
