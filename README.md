# checkist [![Build Status][travis-image]][travis-url]

  > Tool for compose modular and reusable validation functions

  Sync, async, mixed, nested, not blocking

## Install

```sh
npm install --save checkist
```

## Usage

```js
var checkist = require('checkist');
var isString = require('is-string');

var checkString = checkist()
  .use(isString, 'type')
  .use(function (value) {
    return value === 'awesome';
  }, 'content');

checkString(100); // ['type']
checkString('superb'); // ['content']
checkString('awesome'); // null
```

## API

### checkist(defaults)

  Create new validation function (`vf`) with default options

### .use(fn[, path], context)

  Add function as validation middleware with specified nested object prop and error context

  Can be used validation functions (`vf`) as middleware

```js
var checkStringType = checkist()
  .use(isString, 'type');

var checkStringLength = checkist()
  .use(hasLength, 'length');

var checkString = checkist()
  .use(checkStringType, 'type')
  .use(checkStringLength, 'length');

var checkObject = checkist()
  .use(checkStringType, 'name', 'nameType');
```

### .exec(value[, options, fn])

  Validate something via validation middlewares

  For sync function:

```js
checkist()
  .use(isObject, 'type')
  .exec({}); // null
```

  For async function:

```js
checkist()
  .use(isObject, 'type')
  .exec({}, function (err) {
    err; // null
  });
```

### .notBlocking()

  Start using not blocking middlewares

```js
checkist()
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
var checkEmail = checkist()
  .use(function (value) {
    return 'email' in value;
  }, 'require')
  .use(isEmail, 'format');

var checkUser = checkist()
  .nestedErrors()
  .notBlocking()
  .use(function (value) {
    return 'name' in value;
  }, 'name')
  .use(checkEmail, 'email');

checkUser({}); // ['email', 'email.require', 'name']
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

  check-name.js

```js
var checkist = require('checkist');
var isString = require('is-string');

module.exports = checkist()
  .use(isString, 'require')
  .use(function (value) {
    return value.length > 0;
  }, 'length');
```

  check-email.js

```js
var checkist = require('checkist');
var isEmail = require('is-email');
var isString = require('is-string');

module.exports = checkist()
  .use(isString, 'require')
  .use(isEmail, 'format');
```

  check-user.js

```js
var checkist = require('checkist');
var checkEmail = require('check-email');
var checkName = require('check-name');
var isObject = require('is-object');

module.exports = checkist()
  .nestedErrors()
  .use(isObject, 'type')
  .notBlocking()
  .use(checkName, 'name', 'name')
  .use(checkEmail, 'email', 'email');
```

  app.js

```js
var checkUser = require('check-user');
checkUser(undefined); // ['type']
checkUser({}); // ['name', 'name.require', 'email', 'email.require']
checkUser({name: 'awesome', email: 'awesome'}); // ['email', 'email.format']
checkUser({name: 'awesome', email: 'awesome@gmail.com'}); // null
```

## License

  MIT

[travis-url]: https://travis-ci.org/andrepolischuk/checkist
[travis-image]: https://travis-ci.org/andrepolischuk/checkist.svg?branch=master
