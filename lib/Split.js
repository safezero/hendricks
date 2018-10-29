const arguguard = require('arguguard')
const integerValidator = require('./integerValidator')
const intcoder = require('intcoder')
const Template = require('./Template')

//TODO: refactor
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

module.exports = class Split extends Template {
  constructor(branchKeyLength, branchKeys, branches) {
    super()
    this.branchKeyLength = branchKeyLength
    this.branchKeys = branchKeys
    this.branches = branches
  }

  getBranchIndex(branchKey) {
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

  encode(value) {
    const branchKey = value[0]
    const branchValue = value[1]
    const branchIndex = this.getBranchIndex(branchKey)
    const valueEncoded = this.branches[branchIndex].encode(branchValue)
    const encoded = new Uint8Array(this.branchKeyLength + valueEncoded.length)
    encoded.set(branchKey)
    encoded.set(valueEncoded, branchKey.length)
    return encoded
  }

  decodeWithRemainder(encoded) {
    const branchKey = encoded.slice(0, this.branchKeyLength)
    const branchIndex = this.getBranchIndex(branchKey)
    const branch = this.branches[branchIndex]
    const decodedWithRemainder = this.branches[branchIndex].decodeWithRemainder(encoded.slice(this.branchKeyLength))
    return {
      value: [branchKey, decodedWithRemainder.value],
      remainder: decodedWithRemainder.remainder
    }
  }
}
