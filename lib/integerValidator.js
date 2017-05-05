const Validator = require('arguguard/lib/Validator')

module.exports = new Validator('Integer', (int) => {
  if (typeof int !== 'number' || !Number.isInteger(int) || int < 0) {
    throw new Error(`Expects a non-negative integer, received ${int}`)
  }
})
