# validate-smth [![Build Status][travis-image]][travis-url]

  > Tool for compose validation functions

  Sync, async, mixed, not blocking

## Install

```sh
npm install --save validate-smth
```

## Usage

```js
var validateSmth = require('validate-smth');
var isString = require('is-string');

var validateString = validateSmth()
  .use(isString, 'type')
  .use(function (value) {
    return value === 'awesome';
  }, 'content');

validateString(100); // ['type']
validateString('superb'); // ['content']
validateString('awesome'); // null
```

## API

### validateSmth()

  Create new validate function (`vf`)

### .use(fn, context)

  Add function as validation middleware with specified error context

  Can be used validate functions (`vf`) as middleware

```js
var validateStringType = validateSmth().use(isString, 'type');
var validateStringLength = validateSmth().use(hasLength, 'length');

var validateString = validateSmth()
  .use(validateStringType, 'type')
  .use(validateStringLength, 'length');
```

### .exec(value[, fn])

  Validate something via validation middlewares

  For sync function

```js
validateSmth()
  .use(isObject, 'type')
  .exec({}); // null
```

  For async function

```js
validateSmth()
  .use(isObject, 'type')
  .exec({}, function (err) {
    err; // null
  });
```

### .notBlocking()

  Start using not blocking middlewares

```js
validateSmth()
  .use(isObject, 'type')
  .notBlocking()
  .use(hasName, 'name')
  .use(hasEmail, 'email')
  .exec({}, function (err) {
    err; // ['name', 'email']
  });
```

### vf(value[, next])

  Alias for `vf.exec`

## Middlewares

  Can be used sync function

```js
function mw(value) {
  return typeof value === 'string';
}
```

  And async function

```js
function mw(value, next) {
  setTimeout(function () {
    next(typeof value === 'string');
  }, 1000);
}
```

## License

  MIT

[travis-url]: https://travis-ci.org/andrepolischuk/validate-smth
[travis-image]: https://travis-ci.org/andrepolischuk/validate-smth.svg?branch=master
