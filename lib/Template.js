module.exports = class Template {
  decode(encoding) {
    const decodedWithRemainder = this.decodeWithRemainder(encoding)
    if (decodedWithRemainder.remainder.length > 0) {
      //TODO: test
      throw new Error('Remainder where there should be none')
    }
    return decodedWithRemainder.value
  }
}
