const arguguard = require('arguguard')
const integerValidator = require('./integerValidator')
const intcoder = require('intcoder')

function List(name, lengthEncodingLength, mold) {
  arguguard('Fixed', ['string', integerValidator, '*'], arguments)
  this.name = name
  this.lengthEncodingLength = lengthEncodingLength
  this.mold = mold
}

List.prototype.encode = function encode(values) {
  arguguard('list.encode', ['[]*'], arguments)

  const unpaddedLengthEncoding = intcoder.encode(values.length)

  if (unpaddedLengthEncoding.length > this.lengthEncodingLength) {
    throw new BytesLengthError(`Items length of ${values.length} cannot be expressed within ${this.lengthEncodingLength} bytes`)
  }

  const padding = this.lengthEncodingLength - unpaddedLengthEncoding.length

  const valueEncodings = values.map((value) => {
    return this.mold.encode(value)
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

  const valuesLengthEncoding = encoding.slice(0, this.lengthEncodingLength)
  const valuesLength = intcoder.decode(valuesLengthEncoding)
  const values = []

  encoding = encoding.slice(this.lengthEncodingLength)

  while (values.length < valuesLength) {
    const result = this.mold.decode(encoding)
    values.push(result.value)
    encoding = result.remainder
  }

  return { value: values, remainder: encoding }

}

module.exports = List
