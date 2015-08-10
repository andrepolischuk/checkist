import {equal, deepEqual} from 'assert';
import validate from './index';

const syncValidateStringType = validate()
  .use(value => typeof value === 'string', 'type');

const syncValidateStringStart = validate()
  .use(value => value.charAt(0) === 'a', 'start');

const syncValidateString = validate()
  .use(syncValidateStringType, 'type')
  .use(syncValidateStringStart, 'start');

it('should pass sync validate', () => {
  equal(syncValidateStringType('awesome'), null);
});

it('should fail sync validate', () => {
  deepEqual(syncValidateStringType(12), ['type']);
});

it('should pass sync validate using function as middleware', () => {
  equal(syncValidateString('awesome'), null);
});

it('should fail sync validate using function as middleware', () => {
  deepEqual(syncValidateString(12), ['type']);
  deepEqual(syncValidateString('superb'), ['start']);
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
      next(value.charAt(0) === 'a');
    }, 500);
  }, 'start');

const asyncValidateString = validate()
  .use(asyncValidateStringType, 'type')
  .use(asyncValidateStringStart, 'start');

it('should pass async validate', (done) => {
  asyncValidateStringType('awesome', err => {
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

it('should pass async validate using function as middleware', (done) => {
  asyncValidateString('awesome', err => {
    equal(err, null);
    done();
  });
});

it('should fail async validate using function as middleware', (done) => {
  asyncValidateString('superb', err => {
    deepEqual(err, ['start']);
    done();
  });
});

const mixValidateString = validate()
  .use(syncValidateStringType, 'type')
  .use(asyncValidateStringStart, 'start')
  .use(value => value.charAt(value.length - 1) === 'e' , 'end');

it('should pass mix validate using function as middleware', (done) => {
  mixValidateString('awesome', err => {
    equal(err, null);
    done();
  });
});

it('should fail mix validate using function as middleware', (done) => {
  mixValidateString('awesomeness', err => {
    deepEqual(err, ['end']);
    done();
  });
});
