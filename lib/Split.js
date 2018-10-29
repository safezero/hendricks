const arguguard = require('arguguard')
const integerValidator = require('./integerValidator')
const intcoder = require('intcoder')

function compareUint8Arrays(a, b) {
  if (a.length != b.length) { return false}
  let isEqual = true
  a.forEach((byte, index) => {
    if (byte != b[index]) {
      isEqual = false
    }
  })
  return isEqual
}

function Split(branchKeyLength, branchKeys, branches) {
  arguguard('Split', [integerValidator, '[]Uint8Array', '[]*'], arguments)
  this.branchKeyLength = branchKeyLength
  this.branchKeys = branchKeys
  this.branches = branches
}

Split.prototype.getBranchIndex = function getBranchIndex(branchKey) {
  let index = null
  this.branchKeys.find((_branchKey, _index) => {
    if(compareUint8Arrays(branchKey, _branchKey)) {
      index = _index
      return true
    }
    return false
  })
  if (index === null) {
    // TODO: test
    throw new Error(`Invalid Branch Key [${branchKey.join(',')}]`)
  }
  return index
}

Split.prototype.encode = function encode(value) {
  arguguard('split.encode', ['Object'], arguments)
  const branchIndex = this.getBranchIndex(value.key)
  const valueEncoded = this.branches[branchIndex].encode(value.value)
  const encoded = new Uint8Array(this.branchKeyLength + valueEncoded.length)
  encoded.set(value.key)
  encoded.set(valueEncoded, value.key.length)
  return encoded
}

Split.prototype.decode = function decode(encoding) {
  arguguard('split.decode', ['Uint8Array'], arguments)
  return this.decodeWithRemainder(encoding).value
}


Split.prototype.decodeWithRemainder = function decodeWithRemainder(encoded) {
  arguguard('split.decodeWithRemainder', ['Uint8Array'], arguments)
  const branchKey = encoded.slice(0, this.branchKeyLength)
  const branchIndex = this.getBranchIndex(branchKey)
  const branch = this.branches[branchIndex]
  const decodedWithRemainder = this.branches[branchIndex].decodeWithRemainder(encoded.slice(this.branchKeyLength))
  return {
    value: {
      key: branchKey,
      value: decodedWithRemainder.value
    },
    remainder: decodedWithRemainder.remainder
  }
}

module.exports = Split
