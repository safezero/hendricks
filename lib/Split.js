const arguguard = require('arguguard')
const integerValidator = require('./integerValidator')
const intcoder = require('intcoder')
const Template = require('./Template')

module.exports = class Split extends Template {
  constructor(branchKeys, branchTemplates) {
    super()
    this.branchKeys = branchKeys
    this.branchTemplates = branchTemplates
  }

  getBranchIndex(branchKey) {
    const index = this.branchKeys.indexOf(branchKey)
    if (index === -1) {
      throw new Error(`Invalid Branch Key "${branchKey}"`)
    }
    return index
  }

  encode(value) {
    const branchKey = value.key
    const branchValue = value.value
    const branchIndex = this.getBranchIndex(branchKey)
    const valueEncoded = this.branchTemplates[branchIndex].encode(branchValue)
    const encoded = new Uint8Array(1 + valueEncoded.length)
    encoded[0] = branchIndex
    encoded.set(valueEncoded, 1)
    return encoded
  }

  decodeWithRemainder(encoded) {
    const branchIndex = encoded[0]
    const branchKey = this.branchKeys[branchIndex]
    const branchTemplate = this.branchTemplates[branchIndex]
    const decodedWithRemainder = branchTemplate.decodeWithRemainder(encoded.slice(1))
    return {
      value: {
        key: branchKey,
        value: decodedWithRemainder.value
      },
      remainder: decodedWithRemainder.remainder
    }
  }
}
