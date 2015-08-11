# validate-smth [![Build Status][travis-image]][travis-url]

  > Tool for compose modular and reusable validation functions

  Sync, async, mixed, nested, not blocking

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

### validateSmth(defaults)

  Create new validation function (`vf`) with default options

### .use(fn, context)

  Add function as validation middleware with specified error context

  Can be used validation functions (`vf`) as middleware

```js
var validateStringType = validateSmth()
  .use(isString, 'type');

var validateStringLength = validateSmth()
  .use(hasLength, 'length');

var validateString = validateSmth()
  .use(validateStringType, 'type')
  .use(validateStringLength, 'length');
```

### .exec(value[, options, fn])

  Validate something via validation middlewares

  For sync function:

```js
validateSmth()
  .use(isObject, 'type')
  .exec({}); // null
```

  For async function:

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

### .nestedErrors()

  Push all nested errors in result

```js
var validateEmail = validateSmth()
  .use(function (value) {
    return 'email' in value;
  }, 'require')
  .use(isEmail, 'format');

var validateUser = validateSmth()
  .nestedErrors()
  .notBlocking()
  .use(function (value) {
    return 'name' in value;
  }, 'name')
  .use(validateEmail, 'email');

validateUser({}); // ['email', 'email.require', 'name']
```

### vf(value[, next])

  Alias for `vf.exec`

## Middlewares

  Can be used sync:

```js
function mw(value, options) {
  return typeof value === 'string';
}
```

  and async function:

```js
function mw(value, options, next) {
  setTimeout(function () {
    next(typeof value === 'string');
  }, 1000);
}
```

## Example

```js
var validateSmth = require('validate-smth');
var isEmail = require('is-email');
var isObject = require('is-object');

var validateName = validateSmth()
  .use(function (value) {
    return 'name' in value;
  }, 'require')
  .use(function (value) {
    return value.name.length > 0;
  }, 'length');

var validateEmail = validateSmth()
  .use(function (value) {
    return 'email' in value;
  }, 'require')
  .use(isEmail, 'format');

var validateUser = validateSmth()
  .nestedErrors()
  .use(isObject, 'type')
  .notBlocking()
  .use(validateName, 'name')
  .use(validateEmail, 'email');

validateUser(undefined); // ['type']
validateUser({}); // ['name', 'name.require', 'email', 'email.require']
validateUser({name: 'awesome', email: 'awesome'}); // ['email', 'email.format']
validateUser({name: 'awesome', email: 'awesome@gmail.com'}); // null
```

## License

  MIT

[travis-url]: https://travis-ci.org/andrepolischuk/validate-smth
[travis-image]: https://travis-ci.org/andrepolischuk/validate-smth.svg?branch=master
