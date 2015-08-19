import test from 'tape';
import checkist from './index';

const syncStringType = checkist()
  .use(value => typeof value === 'string', 'type');

const syncStringStart = checkist()
  .use(value => value.charAt(0) === 'a', 'start');

const syncStringEnd = value => value.charAt(value.length - 1) === 'e';

const syncString = checkist()
  .use(syncStringType, 'type')
  .use(syncStringStart, 'start')
  .use(syncStringEnd, 'end');

const syncNotBlockingString = checkist()
  .use(syncStringType, 'type')
  .notBlocking()
  .use(syncStringStart, 'start')
  .use(syncStringEnd, 'end');

const syncNestedString = checkist()
  .nestedErrors()
  .use(syncStringType, 'type')
  .notBlocking()
  .use(syncStringStart, 'start')
  .use(syncStringEnd, 'end');

const syncWithOptions = checkist({locale: 'en-us'})
  .use((value, options) => value === options.locale, 'locale');

const syncWithOverridenOptions = checkist({locale: 'ru-ru'})
  .use(syncWithOptions, 'locale');

const asyncStringType = checkist()
  .use((value, options, next) => {
    setTimeout(() => {
      next(typeof value === 'string');
    }, 100);
  }, 'type');

const asyncStringStart = checkist()
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

const asyncString = checkist()
  .use(asyncStringType, 'type')
  .use(asyncStringStart, 'start')
  .use(asyncStringEnd, 'end');

const asyncNotBlockingString = checkist()
  .use(asyncStringType, 'type')
  .notBlocking()
  .use(asyncStringStart, 'start')
  .use(asyncStringEnd, 'end');

const asyncNestedString = checkist()
  .nestedErrors()
  .use(asyncStringType, 'type')
  .notBlocking()
  .use(asyncStringStart, 'start')
  .use(asyncStringEnd, 'end');

const asyncWithOptions = checkist({locale: 'en-us'})
  .use((value, options, next) => {
    setTimeout(() => {
      next(value === options.locale);
    }, 100);
  }, 'locale');

const asyncWithOverridenOptions = checkist({locale: 'ru-ru'})
  .use(asyncWithOptions, 'locale');

const mixedString = checkist()
  .use(syncStringType, 'type')
  .use(asyncStringStart, 'start')
  .use(syncStringEnd, 'end');

const mixedNotBlockingString = checkist()
  .use(syncStringType, 'type')
  .notBlocking()
  .use(asyncStringStart, 'start')
  .use(syncStringEnd, 'end');

const mixedNestedString = checkist()
  .nestedErrors()
  .use(syncStringType, 'type')
  .notBlocking()
  .use(asyncStringStart, 'start')
  .use(syncStringEnd, 'end');

const mixedWithOptions = checkist()
  .use(syncStringType, 'type')
  .use(asyncWithOptions, 'locale');

const mixedWithOverridenOptions = checkist({locale: 'ru-ru'})
  .use(syncStringType, 'type')
  .use(asyncWithOptions, 'locale');

test('should pass simple', t => {
  t.plan(1);
  t.equal(syncStringType('awesome'), null);
});

test('should fail simple', t => {
  t.plan(1);
  t.deepEqual(syncStringType(12), ['type']);
});

test('should pass using function as middleware', t => {
  t.plan(1);
  t.equal(syncString('awesome'), null);
});

test('should fail using function as middleware', t => {
  t.plan(2);
  t.deepEqual(syncString(12), ['type']);
  t.deepEqual(syncString('superb'), ['start']);
});

test('should pass using not blocking middleware', t => {
  t.plan(1);
  t.equal(syncNotBlockingString('awesome'), null);
});

test('should fail using not blocking middleware', t => {
  t.plan(2);
  t.deepEqual(syncNotBlockingString(12), ['type']);
  t.deepEqual(syncNotBlockingString('superb'), ['start', 'end']);
});

test('should pass with nested errors', t => {
  t.plan(1);
  t.equal(syncNestedString('awesome'), null);
});

test('should fail with nested errors', t => {
  t.plan(2);
  t.deepEqual(syncNestedString(12), ['type', 'type.type']);
  t.deepEqual(syncNestedString('superb'), ['start', 'start.start', 'end']);
});

test('should pass with options', t => {
  t.plan(1);
  t.equal(syncWithOptions('en-us'), null);
});

test('should fail with options', t => {
  t.plan(1);
  t.deepEqual(syncWithOptions('en'), ['locale']);
});

test('should pass with overriden options', t => {
  t.plan(1);
  t.equal(syncWithOverridenOptions('ru-ru'), null);
});

test('should fail with overriden options', t => {
  t.plan(1);
  t.deepEqual(syncWithOverridenOptions('ru'), ['locale']);
});

test('should pass simple', t => {
  t.plan(1);

  asyncStringType('awesome', err => {
    t.equal(err, null);
  });
});

test('should fail simple', t => {
  t.plan(1);

  asyncStringType(12, err => {
    t.deepEqual(err, ['type']);
  });
});

test('should pass using function as middleware', t => {
  t.plan(1);

  asyncString('awesome', err => {
    t.equal(err, null);
  });
});

test('should fail using function as middleware', t => {
  t.plan(2);

  asyncString(12, err => {
    t.deepEqual(err, ['type']);
  });

  asyncString('superb', err => {
    t.deepEqual(err, ['start']);
  });
});

test('should pass using not blocking middleware', t => {
  t.plan(1);

  asyncNotBlockingString('awesome', err => {
    t.equal(err, null);
  });
});

test('should fail using not blocking middleware', t => {
  t.plan(2);

  asyncNotBlockingString(12, err => {
    t.deepEqual(err, ['type']);
  });

  asyncNotBlockingString('superb', err => {
    t.deepEqual(err, ['start', 'end']);
  });
});

test('should pass with nested errors', t => {
  t.plan(1);

  asyncNestedString('awesome', err => {
    t.equal(err, null);
  });
});

test('should fail with nested errors', t => {
  t.plan(2);

  asyncNestedString(12, err => {
    t.deepEqual(err, ['type', 'type.type']);
  });

  asyncNestedString('superb', err => {
    t.deepEqual(err, ['start', 'start.start', 'end']);
  });
});

test('should pass with options', t => {
  t.plan(1);

  asyncWithOptions('en-us', err => {
    t.equal(err, null);
  });
});

test('should fail with options', t => {
  t.plan(1);

  asyncWithOptions('en', err => {
    t.deepEqual(err, ['locale']);
  });
});

test('should pass with overriden options', t => {
  t.plan(1);

  asyncWithOverridenOptions('ru-ru', err => {
    t.equal(err, null);
  });
});

test('should fail with overriden options', t => {
  t.plan(1);

  asyncWithOverridenOptions('ru', err => {
    t.deepEqual(err, ['locale']);
  });
});

test('should pass using function as middleware', t => {
  t.plan(1);

  mixedString('awesome', err => {
    t.equal(err, null);
  });
});

test('should fail using function as middleware', t => {
  t.plan(1);

  mixedString('awesomeness', err => {
    t.deepEqual(err, ['end']);
  });
});

test('should pass using not blocking middleware', t => {
  t.plan(1);

  mixedNotBlockingString('awesome', err => {
    t.equal(err, null);
  });
});

test('should fail using not blocking middleware', t => {
  t.plan(1);

  mixedNotBlockingString('superb', err => {
    t.deepEqual(err, ['start', 'end']);
  });
});

test('should pass with nested errors', t => {
  t.plan(1);

  mixedNestedString('awesome', err => {
    t.equal(err, null);
  });
});

test('should fail with nested errors', t => {
  t.plan(1);

  mixedNestedString('superb', err => {
    t.deepEqual(err, ['start', 'start.start', 'end']);
  });
});

test('should pass with options', t => {
  t.plan(1);

  mixedWithOptions('en-us', err => {
    t.equal(err, null);
  });
});

test('should fail with options', t => {
  t.plan(1);

  mixedWithOptions('en', err => {
    t.deepEqual(err, ['locale']);
  });
});

test('should pass with overriden options', t => {
  t.plan(1);

  mixedWithOverridenOptions('ru-ru', err => {
    t.equal(err, null);
  });
});

test('should fail with overriden options', t => {
  t.plan(1);

  mixedWithOverridenOptions('ru', err => {
    t.deepEqual(err, ['locale']);
  });
});
