const arguguard = require('arguguard')

function Branch(name, leaf) {
  arguguard('Branch', ['string', '*'], arguments)
  this.name = name
  this.leaf = leaf
}

Branch.prototype.encode = function encode(value) {
  arguguard('branch.encode', ['*'], arguments)
  return this.leaf.encode(value)
}

Branch.prototype.decode = function decode(encoding) {
  arguguard('branch.decode', ['Uint8Array'], arguments)
  return this.leaf.decode(encoding)
}

module.exports = Branch
