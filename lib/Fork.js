const arguguard = require('arguguard')
const integerValidator = require('./integerValidator')

function Fork(name, branches) {
  arguguard('Fork', ['string', '[]Branch'], arguments)
  this.name = name
  this.branches = branches
}

Fork.prototype.encode = function encode(value) {
  arguguard('fork.encode', ['Object'], arguments)
  const branchName = value.branch
  const branchIndex = this.branches.findIndex((_branch) => {
    return _branch.name === branchName
  })
  if (branchIndex === -1) {
    throw new InvalidForkError(`No mold for branch ${branchIndex}`)
  }
  const branch = this.branches[branchIndex]
  const valueEncoded = branch.encode(value.value)
  const encoded = new Uint8Array(valueEncoded.length + 1)
  encoded.set(new Uint8Array([branchIndex]))
  encoded.set(valueEncoded, 1)
  return encoded
}

Fork.prototype.decode = function decode(encoded) {
  arguguard('fork.decode', ['Uint8Array'], arguments)
  const branchIndex = encoded.slice(0, 1)
  const branch = this.branches[branchIndex]
  const valueEncoded = this.branches[branchIndex].decode(encoded.slice(1)).value
  return {
    value: {
      branch: branch.name,
      value: valueEncoded
    },
    remainder: encoded.slice(valueEncoded + 1)
  }
}

module.exports = Fork
