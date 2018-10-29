const arguguard = require('arguguard')
const BytesLengthError = require('./BytesLengthError')
const InvalidOptionalByteError = require('./InvalidOptionalByteError')
const integerValidator = require('./integerValidator')
const Template = require('./Template')

module.exports = class Optional extends Template {
  constructor(template) {
    super()
    this.template = template
  }

  encode(bytesOrNull) {
    if (!bytesOrNull) {
      return new Uint8Array([0])
    }
    const templateEncoding = this.template.encode(bytesOrNull)
    const encoding = new Uint8Array(templateEncoding.length + 1)
    encoding[0] = 1
    encoding.set(templateEncoding, 1)
    return encoding
  }

  decodeWithRemainder(encoding) {
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
}
