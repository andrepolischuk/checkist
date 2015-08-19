import {equal, deepEqual} from 'assert';
import validate from './index';

const syncStringType = validate()
  .use(value => typeof value === 'string', 'type');

const syncStringStart = validate()
  .use(value => value.charAt(0) === 'a', 'start');

const syncStringEnd = value => value.charAt(value.length - 1) === 'e';

const syncString = validate()
  .use(syncStringType, 'type')
  .use(syncStringStart, 'start')
  .use(syncStringEnd, 'end');

const syncNotBlockingString = validate()
  .use(syncStringType, 'type')
  .notBlocking()
  .use(syncStringStart, 'start')
  .use(syncStringEnd, 'end');

const syncNestedString = validate()
  .nestedErrors()
  .use(syncStringType, 'type')
  .notBlocking()
  .use(syncStringStart, 'start')
  .use(syncStringEnd, 'end');

const syncWithOptions = validate({locale: 'en-us'})
  .use((value, options) => value === options.locale, 'locale');

const syncWithOverridenOptions = validate({locale: 'ru-ru'})
  .use(syncWithOptions, 'locale');

const asyncStringType = validate()
  .use((value, options, next) => {
    setTimeout(() => {
      next(typeof value === 'string');
    }, 100);
  }, 'type');

const asyncStringStart = validate()
  .use((value, options, next) => {
    setTimeout(() => {
      next(value.charAt(0) === 'a');
    }, 100);
  }, 'start');

const asyncStringEnd = (value, options, next) => {
  setTimeout(() => {
    next(value.charAt(value.length - 1) === 'e');
  }, 100);
}

const asyncString = validate()
  .use(asyncStringType, 'type')
  .use(asyncStringStart, 'start')
  .use(asyncStringEnd, 'end');

const asyncNotBlockingString = validate()
  .use(asyncStringType, 'type')
  .notBlocking()
  .use(asyncStringStart, 'start')
  .use(asyncStringEnd, 'end');

const asyncNestedString = validate()
  .nestedErrors()
  .use(asyncStringType, 'type')
  .notBlocking()
  .use(asyncStringStart, 'start')
  .use(asyncStringEnd, 'end');

const asyncWithOptions = validate({locale: 'en-us'})
  .use((value, options, next) => {
    setTimeout(() => {
      next(value === options.locale);
    }, 100);
  }, 'locale');

const asyncWithOverridenOptions = validate({locale: 'ru-ru'})
  .use(asyncWithOptions, 'locale');

const mixedString = validate()
  .use(syncStringType, 'type')
  .use(asyncStringStart, 'start')
  .use(syncStringEnd, 'end');

const mixedNotBlockingString = validate()
  .use(syncStringType, 'type')
  .notBlocking()
  .use(asyncStringStart, 'start')
  .use(syncStringEnd, 'end');

const mixedNestedString = validate()
  .nestedErrors()
  .use(syncStringType, 'type')
  .notBlocking()
  .use(asyncStringStart, 'start')
  .use(syncStringEnd, 'end');

const mixedWithOptions = validate()
  .use(syncStringType, 'type')
  .use(asyncWithOptions, 'locale');

const mixedWithOverridenOptions = validate({locale: 'ru-ru'})
  .use(syncStringType, 'type')
  .use(asyncWithOptions, 'locale');

describe('Sync validation', () => {
  it('should pass simple', () => {
    equal(syncStringType('awesome'), null);
  });

  it('should fail simple', () => {
    deepEqual(syncStringType(12), ['type']);
  });

  it('should pass using function as middleware', () => {
    equal(syncString('awesome'), null);
  });

  it('should fail using function as middleware', () => {
    deepEqual(syncString(12), ['type']);
    deepEqual(syncString('superb'), ['start']);
  });

  it('should pass using not blocking middleware', () => {
    equal(syncNotBlockingString('awesome'), null);
  });

  it('should fail using not blocking middleware', () => {
    deepEqual(syncNotBlockingString(12), ['type']);
    deepEqual(syncNotBlockingString('superb'), ['start', 'end']);
  });

  it('should pass with nested errors', () => {
    equal(syncNestedString('awesome'), null);
  });

  it('should fail with nested errors', () => {
    deepEqual(syncNestedString(12), ['type', 'type.type']);
    deepEqual(syncNestedString('superb'), ['start', 'start.start', 'end']);
  });

  it('should pass with options', () => {
    equal(syncWithOptions('en-us'), null);
  });

  it('should fail with options', () => {
    deepEqual(syncWithOptions('en'), ['locale']);
  });

  it('should pass with overriden options', () => {
    equal(syncWithOverridenOptions('ru-ru'), null);
  });

  it('should fail with overriden options', () => {
    deepEqual(syncWithOverridenOptions('ru'), ['locale']);
  });
});

describe('Async validation', () => {
  it('should pass simple', (done) => {
    asyncStringType('awesome', err => {
      equal(err, null);
      done();
    });
  });

  it('should fail simple', (done) => {
    asyncStringType(12, err => {
      deepEqual(err, ['type']);
      done();
    });
  });

  it('should pass using function as middleware', (done) => {
    asyncString('awesome', err => {
      equal(err, null);
      done();
    });
  });

  it('should fail using function as middleware', (done) => {
    asyncString('superb', err => {
      deepEqual(err, ['start']);
      done();
    });
  });

  it('should pass using not blocking middleware', (done) => {
    asyncNotBlockingString('awesome', err => {
      equal(err, null);
      done();
    });
  });

  it('should fail using not blocking middleware', (done) => {
    asyncNotBlockingString('superb', err => {
      deepEqual(err, ['start', 'end']);
      done();
    });
  });

  it('should pass with nested errors', (done) => {
    asyncNestedString('awesome', err => {
      equal(err, null);
      done();
    });
  });

  it('should fail with nested errors', (done) => {
    asyncNestedString('superb', err => {
      deepEqual(err, ['start', 'start.start', 'end']);
      done();
    });
  });

  it('should pass with options', (done) => {
    asyncWithOptions('en-us', err => {
      equal(err, null);
      done();
    });
  });

  it('should fail with options', (done) => {
    asyncWithOptions('en', err => {
      deepEqual(err, ['locale']);
      done();
    });
  });

  it('should pass with overriden options', (done) => {
    asyncWithOverridenOptions('ru-ru', err => {
      equal(err, null);
      done();
    });
  });

  it('should fail with overriden options', (done) => {
    asyncWithOverridenOptions('ru', err => {
      deepEqual(err, ['locale']);
      done();
    });
  });
});

describe('Mixed validation', () => {
  it('should pass using function as middleware', (done) => {
    mixedString('awesome', err => {
      equal(err, null);
      done();
    });
  });

  it('should fail using function as middleware', (done) => {
    mixedString('awesomeness', err => {
      deepEqual(err, ['end']);
      done();
    });
  });

  it('should pass using not blocking middleware', (done) => {
    mixedNotBlockingString('awesome', err => {
      equal(err, null);
      done();
    });
  });

  it('should fail using not blocking middleware', (done) => {
    mixedNotBlockingString('superb', err => {
      deepEqual(err, ['start', 'end']);
      done();
    });
  });

  it('should pass with nested errors', (done) => {
    mixedNestedString('awesome', err => {
      equal(err, null);
      done();
    });
  });

  it('should fail with nested errors', (done) => {
    mixedNestedString('superb', err => {
      deepEqual(err, ['start', 'start.start', 'end']);
      done();
    });
  });

  it('should pass with options', (done) => {
    mixedWithOptions('en-us', err => {
      equal(err, null);
      done();
    });
  });

  it('should fail with options', (done) => {
    mixedWithOptions('en', err => {
      deepEqual(err, ['locale']);
      done();
    });
  });

  it('should pass with overriden options', (done) => {
    mixedWithOverridenOptions('ru-ru', err => {
      equal(err, null);
      done();
    });
  });

  it('should fail with overriden options', (done) => {
    mixedWithOverridenOptions('ru', err => {
      deepEqual(err, ['locale']);
      done();
    });
  });
});
