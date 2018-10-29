const arguguard = require('arguguard')
const integerValidator = require('./integerValidator')
const intcoder = require('intcoder')

function List(lengthEncodingLength, template) {
  arguguard('Fixed', [integerValidator, '*'], arguments)
  this.lengthEncodingLength = lengthEncodingLength
  this.template = template
}

List.prototype.encode = function encode(values) {
  arguguard('list.encode', ['[]*'], arguments)

  const unpaddedLengthEncoding = intcoder.encode(values.length)

  if (unpaddedLengthEncoding.length > this.lengthEncodingLength) {
    throw new BytesLengthError(`Items length of ${values.length} cannot be expressed within ${this.lengthEncodingLength} bytes`)
  }

  const padding = this.lengthEncodingLength - unpaddedLengthEncoding.length

  const valueEncodings = values.map((value) => {
    return this.template.encode(value)
  })

  const valuesEncodingLength = valueEncodings.reduce((total, valueEncoding) => {
    return total + valueEncoding.length;
  }, 0)

  const encoding = new Uint8Array(this.lengthEncodingLength + valuesEncodingLength)

  encoding.set(unpaddedLengthEncoding, padding)

  let valueEncodingOffset = this.lengthEncodingLength
  valueEncodings.forEach((valueEncoding) => {
    encoding.set(valueEncoding, valueEncodingOffset)
    valueEncodingOffset += valueEncoding.length
  })

  return encoding
}

List.prototype.decode = function decode(encoding) {
  arguguard('list.decode', ['Uint8Array'], arguments)
  return this.decodeWithRemainder(encoding).value
}

List.prototype.decodeWithRemainder = function decodeWithRemainder(encoding) {
  arguguard('list.decodeWithRemainder', ['Uint8Array'], arguments)

  const valuesLengthEncoding = encoding.slice(0, this.lengthEncodingLength)
  const valuesLength = intcoder.decode(valuesLengthEncoding)
  const values = []

  encoding = encoding.slice(this.lengthEncodingLength)

  while (values.length < valuesLength) {
    const result = this.template.decodeWithRemainder(encoding)
    values.push(result.value)
    encoding = result.remainder
  }

  return { value: values, remainder: encoding }

}

module.exports = List
