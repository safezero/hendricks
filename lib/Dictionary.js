const Template = require('./Template')
const Split = require('./Split')

module.exports = class Dictionary extends Template {
  constructor(templates) {
    super()
    this.templates = templates
  }

  encode(values) {
    const templateEncodings = this.templates.map((template, index) => {
      return template.encode(values[index])
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
    const values = []

    this.templates.forEach((template) => {
      const result = template.decodeWithRemainder(encoding)
      values.push(result.value)
      encoding = result.remainder
    })

    return {
      value: values,
      remainder: encoding
    }
  }
}
