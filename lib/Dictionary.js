const Template = require('./Template')
const Split = require('./Split')

module.exports = class Dictionary extends Template {
  constructor(keys, templates) {
    super()
    this.keys = keys
    this.templates = templates
  }

  encode(values) {
    const templateEncodings = this.templates.map((template, index) => {
      const key = this.keys[index]
      return template.encode(values[key])
    })
    const templateEncodingsLength = templateEncodings.reduce((total, templateEncoding) => {
      return total += templateEncoding.length
    }, 0)
    const encoding = new Uint8Array(templateEncodingsLength)

    let offset = 0
    templateEncodings.forEach((templateEncoding) => {
      encoding.set(templateEncoding, offset)
      offset += templateEncoding.length
    })
    return encoding
  }

  decodeWithRemainder(_encoding) {
    let encoding = _encoding
    const values = {}

    this.keys.forEach((key, index) => {
      const template = this.templates[index]
      const result = template.decodeWithRemainder(encoding)
      values[key] = result.value
      encoding = result.remainder
    })

    return {
      value: values,
      remainder: encoding
    }
  }
}
