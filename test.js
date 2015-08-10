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

const asyncValidateStringType = validate()
  .use((value, next) => {
    setTimeout(() => {
      next(typeof value === 'string');
    }, 100);
  }, 'type');

const asyncValidateStringStart = validate()
  .use((value, next) => {
    setTimeout(() => {
      next(value.charAt(0) === 'a');
    }, 100);
  }, 'start');

const asyncValidateStringEnd = (value, next) => {
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

const mixValidateString = validate()
  .use(syncValidateStringType, 'type')
  .use(asyncValidateStringStart, 'start')
  .use(syncValidateStringEnd, 'end');

const mixNotBlockingValidateString = validate()
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

it('should pass mix validation using function as middleware', (done) => {
  mixValidateString('awesome', err => {
    equal(err, null);
    done();
  });
});

it('should fail mix validation using function as middleware', (done) => {
  mixValidateString('awesomeness', err => {
    deepEqual(err, ['end']);
    done();
  });
});

it('should pass mix validation using not blocking middleware', (done) => {
  mixNotBlockingValidateString('awesome', err => {
    equal(err, null);
    done();
  });
});

it('should fail mix validation using not blocking middleware', (done) => {
  mixNotBlockingValidateString('superb', err => {
    deepEqual(err, ['start', 'end']);
    done();
  });
});
