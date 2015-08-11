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

var validateString = validate()
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

  Create new validate function

### .use(fn, context)

  Add validation function as validation middleware with specified error context

  Can be used validate functions as middleware

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

## Middlewares

  Sync function

```js
function mw(value) {
  return typeof value === 'string';
}
```

  Async function

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
