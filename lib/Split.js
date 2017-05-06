const arguguard = require('arguguard')
const integerValidator = require('./integerValidator')
const intcoder = require('intcoder')

function Split(name, branchIndexEncodingLength, branchNames, branches) {
  arguguard('Split', ['string', integerValidator, '[]string', '[]*'], arguments)
  this.name = name
  this.branchIndexEncodingLength = branchIndexEncodingLength
  this.branchNames = branchNames
  this.branches = branches
}

Split.prototype.encode = function encode(value) {
  arguguard('split.encode', ['Object'], arguments)
  const branchName = value.branch
  const branchIndex = this.branchNames.indexOf(branchName)
  const branchIndexEncoding = intcoder.encode(branchIndex)
  const branch = this.branches[branchIndex]
  const valueEncoded = branch.encode(value.value)
  const encoded = new Uint8Array(valueEncoded.length + 1)
  const padding = branchIndexEncoding.length - this.branchIndexEncodingLength
  encoded.set(branchIndexEncoding, padding)
  encoded.set(valueEncoded, this.branchIndexEncodingLength)
  return encoded
}

Split.prototype.decode = function decode(encoding) {
  arguguard('split.decode', ['Uint8Array'], arguments)
  return this.decodeWithRemainder(encoding).value
}


Split.prototype.decodeWithRemainder = function decodeWithRemainder(encoded) {
  arguguard('split.decodeWithRemainder', ['Uint8Array'], arguments)
  const branchIndexEncoding = encoded.slice(0, this.branchIndexEncodingLength)
  const branchIndex = intcoder.decode(branchIndexEncoding)
  const branchName = this.branchNames[branchIndex]
  const branch = this.branches[branchIndex]
  const valueEncoded = this.branches[branchIndex].decodeWithRemainder(encoded.slice(this.branchIndexEncodingLength)).value
  return {
    value: {
      branch: branchName,
      value: valueEncoded
    },
    remainder: encoded.slice(valueEncoded + 1)
  }
}

module.exports = Split
