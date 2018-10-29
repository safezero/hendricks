const arguguard = require('arguguard')
const Split = require('./Split')

function Dictionary(templates) {
  arguguard('Dictionary', ['[]*'], arguments)
  this.templates = templates
}

Dictionary.prototype.encode = function encode(values) {
  arguguard('dictionary.encode', ['[]*'], arguments)
  let dictionary = this
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

Dictionary.prototype.decode = function decode(encoding) {
  arguguard('dictionary.decode', ['Uint8Array'], arguments)
  return this.decodeWithRemainder(encoding).value
}

Dictionary.prototype.decodeWithRemainder = function decodeWithRemainder(encoding) {
  arguguard('dictionary.decodeWithRemainder', ['Uint8Array'], arguments)

  const values = []

  this.templates.forEach((template) => {
    result = template.decodeWithRemainder(encoding)
    values.push(result.value)
    encoding = result.remainder
  })

  return {
    value: values,
    remainder: encoding
  }
}

module.exports = Dictionary
