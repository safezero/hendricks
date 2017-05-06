# hendricks

> Protocol encoding for a new internet.

![Richard Hendricks](https://vignette4.wikia.nocookie.net/silicon-valley/images/3/33/Richard_Hendricks.jpg/revision/latest/scale-to-width-down/310?cb=20150526104602)

## Install

Install with [npm](https://www.npmjs.com/)

```sh
$ npm i hendricks --save-dev
```

### Why

Web3 seeks to "decentralize" the internet. What this means in practice is turning centrally operated services into peer-to-peer protocols.

Encoding data for protocols is not like encoding data for services. Protocols are difficult to upgrade and must be precisely specified. They often operate in environments where minimizing storage costs is extremely important (such as the Ethereum Virtual Machine).

Protocols also need the ability to "split" to a different schema based on a version/type byte. For example in the dev p2p protocol, the first byte instructs the consumer how to interpret rest of the message (if the first byte is `0x00`, interpret the remaining bytes as a `hello`, if the first byte is `0x01`, interpret the remaining bytes as a `disconnect`).

Hendricks lets any protocol developer create easily upgradable, and splitable, protocols while being extremely conservative with bytes.

### Binary only

Hendricks has no support for strings, integers, etc. Everything must be converted into binary before being encoded. For the javascript implementation, that means `Uint8Array`s.

### Templates

The primary concept in hendricks is the template. You can think of a template like a container that data can be placed in. Each template has their own encoding scheme, and templates can be nested into other templates. Every schema has a single root template.

There are 4 kinds of templates: fixed templates (1), dynamic tempates (2), list templates (3), dictionary templates (4), split templates templates (5).

#### 1. Fixed Templates

Fixed templates are designed for fixed-length data. They are useful when you know the size of the data never changes, for example elliptic curve keypairs and IP addresses. When defining a fixed template, the size of the data must be specified.

Since the size of the data is fixed and needs no length-encoding, an encoding of a fixed template is simply the data itself.

```js

const Fixed = require('hendricks/lib/Fixed')

publicKeyTemplate = new Fixed('publicKey', 33)
privateKeyKeyTemplate = new Fixed('privateKey', 32)

myPublicKey = new Uint8Array([1, 2, ..., 33])
myPrivateKey = new Uint8Array([1, 2, ..., 32])

publicKeyTemplate.encode(myPublicKey)
// > Uint8Array([1, 2, ..., 33])
privateKeyKeyTemplate.encode(myPrivateKey)
// > Uint8Array([1, 2, ..., 32])
```

#### 2. Dynamic Templates

Dynamic templates allow for encoding variable-length data. When defining a dynamic template, the number of bytes needed to encode the length, referred to as the *length encoding length*, is specified. For example, if a dynamic field must contain data between 0 and 255 bytes, a *length encoding length* of 1 is needed. If a dynamic field contains between 0 and (256**2 - 1) bytes, a *length encoding length* of 2 is needed.

Length Encoding Length | Min | Max |
--- | --- | --- |
1 | 0 | 255 |
2 | 0 | (256 ** 2) - 1
3 | 0 | (256 ** 3) - 1
4 | 0 | (256 ** 4) - 1

```js

const Dynamic = require('hendricks/lib/Dynamic')

nameTemplate = new Dynamic('name', 1) // name between 0 and 255 bytes
infoTemplate = new Dynamic('info', 2) // name between 0 and 255 ** 2 bytes

name.encode(new Uint8Array([1, 2, 3, 4]))
// > Uint8Array([4, 1, 2, 3, 4])

info.encode(new Uint8Array([1, 2, ..., 256]))
// > Uint8Array([1, 0, 1, 2, ..., 256])
```

Length encodings are big-endian and left-padded.

#### 3. List Templates

List templates allow for encoding arrays of data, where each element in the array is of the same template. When defining a list template, a *length encoding length* child template is needed.

```js
const List = require('hendricks/lib/List')

publicKeysTemplate = new List('publicKeys', 1, publicKey) // between 0 and 255 publicKeys
```

#### 4. Dictionary Templates

Dictionary templates allow for encoding structs of data. When defining a dictionary template, an array of templates is specified.

```js
const Dictionary = require('hendricks/lib/Dictionary')

storeTemplate = new Dictionary('store', [
  nameTemplate,
  publicKeysTemplate
])
```

#### 5. Split Templates

Imagine you create a protocol that includes transmitting a public key. Later on, you decide you want to change your protocol so that users can transmitting multiple public keys. A split template allows you to upgrade your protocol. When encoding, pass in a **branch index encoding length**, an array of strings for the branch names, and an array of templates.

The **branches index encoding length** tells the template how many bytes to allocate to branch index. For example if you expect between 0 and 255 branches, use a **branches index encoding length** of 1. If you expect between 0 and 256**2 - 1 branches, use a **branches index encoding length** of 2.

Branch indexes are big-endian and left-padded.

Branch Index Encoding Length | Min | Max |
--- | --- | --- |
1 | 0 | 255 |
2 | 0 | (256 ** 2) - 1
3 | 0 | (256 ** 3) - 1
4 | 0 | (256 ** 4) - 1


```js
const Split = require('hendricks/lib/Split')

versionTemplate = new Split('version', 1, ['v0', 'v1'], [
  publicKeyTemplate,
  publicKeyTemplates
])

versionTemplate.encode({
  branch: 'v0',
  value: publicKey
})
// > new Uint8Array([0, 1, 2, ..., 33])
versionTemplate.encode({
  branch: 'v1',
  value: publicKeys
})
// > new Uint8Array([0, 2, 1, 2, ..., 33, 1, 2, ..., 33])
```

Split templates are also useful when your protocol changes based on a type byte. For example in SafeMarket a `0x00` byte tells the consumer to interpret the rest of the bytes as a store declaration, while a `0x01`  tells the consumer to interpret the bytes as a message. Here's how a split template could be used to encode this.

```js
const Split = require('hendricks/lib/Split')

typeTemplate = new Split('version', 1, ['store', 'message'], [
  storeTemplate,
  messageTemplate
])

versionTemplate.encode({
  branch: 'store',
  value: storeData
})
// > new Uint8Array([0, 1, 2, ..., 33])
versionTemplate.encode({
  branch: 'message',
  value: publicKeys
})
// > new Uint8Array([0, 2, 1, 2, ..., 33, 1, 2, ..., 33])
```

## Usage

```js
const Split = require('hendricks/lib/Split')
const Dictionary = require('hendricks/lib/Dictionary')
const Dynamic = require('hendricks/lib/Dynamic')
const Fixed = require('hendricks/lib/Fixed')
const List = require('hendricks/lib/List')
```

## Running tests

Install dev dependencies:

```sh
$ npm i -d && npm test
```

## Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/safezero/hendricks/issues)

## Author

***

* [github/---](https://github.com/---)
* [twitter/---](http://twitter.com/---)

## License

Copyright © 2017 []()
Licensed under the ISC license.

***

_This file was generated by [readme-generator](https://github.com/jonschlinkert/readme-generator) on May 04, 2017._
