import {equal, deepEqual} from 'assert';
import validate from './index';

const syncValidateStringType = validate()
  .use(value => typeof value === 'string', 'type');

const syncValidateStringStart = validate()
  .use(value => value.charAt(0) === 'a', 'start');

const syncValidateStringEnd = value => value.charAt(value.length - 1) === 'e';

const syncValidateString = validate()
  .use(syncValidateStringType, 'type')
  .use(syncValidateStringStart, 'start')
  .use(syncValidateStringEnd, 'end');

const syncNotBlockingValidateString = validate()
  .use(syncValidateStringType, 'type')
  .notBlocking()
  .use(syncValidateStringStart, 'start')
  .use(syncValidateStringEnd, 'end');

const syncNestedValidateString = validate()
  .nestedErrors()
  .use(syncValidateStringType, 'type')
  .notBlocking()
  .use(syncValidateStringStart, 'start')
  .use(syncValidateStringEnd, 'end');

const syncValidateWithOptions = validate({locale: 'en-us'})
  .use((value, options) => value === options.locale, 'locale');

const syncValidateWithOverridenOptions = validate({locale: 'ru-ru'})
  .use(syncValidateWithOptions, 'locale');

const asyncValidateStringType = validate()
  .use((value, options, next) => {
    setTimeout(() => {
      next(typeof value === 'string');
    }, 100);
  }, 'type');

const asyncValidateStringStart = validate()
  .use((value, options, next) => {
    setTimeout(() => {
      next(value.charAt(0) === 'a');
    }, 100);
  }, 'start');

const asyncValidateStringEnd = (value, options, next) => {
  setTimeout(() => {
    next(value.charAt(value.length - 1) === 'e');
  }, 100);
}

const asyncValidateString = validate()
  .use(asyncValidateStringType, 'type')
  .use(asyncValidateStringStart, 'start')
  .use(asyncValidateStringEnd, 'end');

const asyncNotBlockingValidateString = validate()
  .use(asyncValidateStringType, 'type')
  .notBlocking()
  .use(asyncValidateStringStart, 'start')
  .use(asyncValidateStringEnd, 'end');

const asyncNestedValidateString = validate()
  .nestedErrors()
  .use(asyncValidateStringType, 'type')
  .notBlocking()
  .use(asyncValidateStringStart, 'start')
  .use(asyncValidateStringEnd, 'end');

const asyncValidateWithOptions = validate({locale: 'en-us'})
  .use((value, options, next) => {
    setTimeout(() => {
      next(value === options.locale);
    }, 100);
  }, 'locale');

const asyncValidateWithOverridenOptions = validate({locale: 'ru-ru'})
  .use(asyncValidateWithOptions, 'locale');

const mixedValidateString = validate()
  .use(syncValidateStringType, 'type')
  .use(asyncValidateStringStart, 'start')
  .use(syncValidateStringEnd, 'end');

const mixedNotBlockingValidateString = validate()
  .use(syncValidateStringType, 'type')
  .notBlocking()
  .use(asyncValidateStringStart, 'start')
  .use(syncValidateStringEnd, 'end');

const mixedNestedValidateString = validate()
  .nestedErrors()
  .use(syncValidateStringType, 'type')
  .notBlocking()
  .use(asyncValidateStringStart, 'start')
  .use(syncValidateStringEnd, 'end');

it('should pass sync validation', () => {
  equal(syncValidateStringType('awesome'), null);
});

it('should fail sync validation', () => {
  deepEqual(syncValidateStringType(12), ['type']);
});

it('should pass sync validation using function as middleware', () => {
  equal(syncValidateString('awesome'), null);
});

it('should fail sync validation using function as middleware', () => {
  deepEqual(syncValidateString(12), ['type']);
  deepEqual(syncValidateString('superb'), ['start']);
});

it('should pass sync validation using not blocking middleware', () => {
  equal(syncNotBlockingValidateString('awesome'), null);
});

it('should fail sync validation using not blocking middleware', () => {
  deepEqual(syncNotBlockingValidateString(12), ['type']);
  deepEqual(syncNotBlockingValidateString('superb'), ['start', 'end']);
});

it('should pass sync validation with nested errors', () => {
  equal(syncNestedValidateString('awesome'), null);
});

it('should fail sync validation with nested errors', () => {
  deepEqual(syncNestedValidateString(12), ['type', 'type.type']);
  deepEqual(syncNestedValidateString('superb'), ['start', 'start.start', 'end']);
});

it('should pass sync validation with options', () => {
  equal(syncValidateWithOptions('en-us'), null);
});

it('should fail sync validation with options', () => {
  deepEqual(syncValidateWithOptions('en'), ['locale']);
});

it('should pass sync validation with overriden options', () => {
  equal(syncValidateWithOverridenOptions('ru-ru'), null);
});

it('should fail sync validation with overriden options', () => {
  deepEqual(syncValidateWithOverridenOptions('ru'), ['locale']);
});

it('should pass async validation', (done) => {
  asyncValidateStringType('awesome', err => {
    equal(err, null);
    done();
  });
});

it('should fail async validation', (done) => {
  asyncValidateStringType(12, err => {
    deepEqual(err, ['type']);
    done();
  });
});

it('should pass async validation using function as middleware', (done) => {
  asyncValidateString('awesome', err => {
    equal(err, null);
    done();
  });
});

it('should fail async validation using function as middleware', (done) => {
  asyncValidateString('superb', err => {
    deepEqual(err, ['start']);
    done();
  });
});

it('should pass async validation using not blocking middleware', (done) => {
  asyncNotBlockingValidateString('awesome', err => {
    equal(err, null);
    done();
  });
});

it('should fail async validation using not blocking middleware', (done) => {
  asyncNotBlockingValidateString('superb', err => {
    deepEqual(err, ['start', 'end']);
    done();
  });
});

it('should pass async validation with nested errors', (done) => {
  asyncNestedValidateString('awesome', err => {
    equal(err, null);
    done();
  });
});

it('should fail async validation with nested errors', (done) => {
  asyncNestedValidateString('superb', err => {
    deepEqual(err, ['start', 'start.start', 'end']);
    done();
  });
});

it('should pass async validation with options', (done) => {
  asyncValidateWithOptions('en-us', err => {
    equal(err, null);
    done();
  });
});

it('should fail async validation with options', (done) => {
  asyncValidateWithOptions('en', err => {
    deepEqual(err, ['locale']);
    done();
  });
});

it('should pass async validation with overriden options', (done) => {
  syncValidateWithOverridenOptions('ru-ru', err => {
    equal(err, null);
    done();
  });
});

it('should fail async validation with overriden options', (done) => {
  syncValidateWithOverridenOptions('ru', err => {
    deepEqual(err, ['locale']);
    done();
  });
});

it('should pass mixed validation using function as middleware', (done) => {
  mixedValidateString('awesome', err => {
    equal(err, null);
    done();
  });
});

it('should fail mixed validation using function as middleware', (done) => {
  mixedValidateString('awesomeness', err => {
    deepEqual(err, ['end']);
    done();
  });
});

it('should pass mixed validation using not blocking middleware', (done) => {
  mixedNotBlockingValidateString('awesome', err => {
    equal(err, null);
    done();
  });
});

it('should fail mixed validation using not blocking middleware', (done) => {
  mixedNotBlockingValidateString('superb', err => {
    deepEqual(err, ['start', 'end']);
    done();
  });
});

it('should pass mixed validation with nested errors', (done) => {
  mixedNestedValidateString('awesome', err => {
    equal(err, null);
    done();
  });
});

it('should fail mixed validation with nested errors', (done) => {
  mixedNestedValidateString('superb', err => {
    deepEqual(err, ['start', 'start.start', 'end']);
    done();
  });
});
