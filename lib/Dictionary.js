const arguguard = require('arguguard')
const Split = require('./Split')

function Dictionary(name, templates) {
  arguguard('Dictionary', ['string', '[]*'], arguments)
  this.name = name
  this.templates = templates
}

Dictionary.prototype.encode = function encode(values) {
  arguguard('dictionary.encode', ['Object'], arguments)
  let dictionary = this
  const templateEncodings = this.templates.map((template) => {
    return template.encode(values[template.name])
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

Dictionary.prototype.decode = function decode(encoding) {
  arguguard('dictionary.decode', ['Uint8Array'], arguments)
  return this.decodeWithRemainder(encoding).value
}

Dictionary.prototype.decodeWithRemainder = function decodeWithRemainder(encoding) {
  arguguard('dictionary.decodeWithRemainder', ['Uint8Array'], arguments)

  const values = {}

  this.templates.forEach((template) => {
    result = template.decodeWithRemainder(encoding)
    values[template.name] = result.value
    encoding = result.remainder
  })

  return {
    value: values,
    remainder: encoding
  }
}

module.exports = Dictionary
