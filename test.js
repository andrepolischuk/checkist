import {equal, deepEqual} from 'assert';
import validate from './index';

const syncValidateStringType = validate()
  .use(value => typeof value === 'string', 'type');

const syncValidateStringStart = validate()
  .use(value => value.indexOf('h') === 0, 'start');

const syncValidateString = validate()
  .use(syncValidateStringType, 'type')
  .use(syncValidateStringStart, 'start');

it('should success sync validate', () => {
  equal(syncValidateStringType('hello'), null);
});

it('should fail sync validate', () => {
  deepEqual(syncValidateStringType(12), ['type']);
});

it('should success sync validate using function as middleware', () => {
  equal(syncValidateString('hello'), null);
});

it('should fail sync validate using function as middleware', () => {
  deepEqual(syncValidateString(12), ['type']);
  deepEqual(syncValidateString('bye'), ['start']);
});

const asyncValidateStringType = validate()
  .use((value, next) => {
    setTimeout(() => {
      next(typeof value === 'string');
    }, 500);
  }, 'type');

const asyncValidateStringStart = validate()
  .use((value, next) => {
    setTimeout(() => {
      next(value.indexOf('h') === 0);
    }, 500);
  }, 'start');

const asyncValidateString = validate()
  .use(asyncValidateStringType, 'type')
  .use(asyncValidateStringStart, 'start');

it('should success async validate', (done) => {
  asyncValidateStringType('hello', err => {
    equal(err, null);
    done();
  });
});

it('should fail async validate', (done) => {
  asyncValidateStringType(12, err => {
    deepEqual(err, ['type']);
    done();
  });
});

it('should success async validate using function as middleware', (done) => {
  asyncValidateString('hello', err => {
    equal(err, null);
    done();
  });
});

it('should fail async validate using function as middleware', (done) => {
  asyncValidateString('bye', err => {
    deepEqual(err, ['start']);
    done();
  });
});

const mixValidateString = validate()
  .use(syncValidateStringType, 'type')
  .use(asyncValidateStringStart, 'start')
  .use(value => value.indexOf('o') === 4, 'end');

it('should success mix validate using function as middleware', (done) => {
  mixValidateString('hello', err => {
    equal(err, null);
    done();
  });
});

it('should fail mix validate using function as middleware', (done) => {
  mixValidateString('health', err => {
    deepEqual(err, ['end']);
    done();
  });
});
