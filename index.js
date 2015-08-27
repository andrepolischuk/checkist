import {get} from 'dot-prop';

export default (defaults = {}) => {
  const rules = [];
  let blocking = true;
  let nested = false;
  exec.blocking = setBlocking;
  exec.notBlocking = notBlocking;
  exec.nestedErrors = nestedErrors;
  exec.use = use;
  exec.exec = exec;
  return exec;

  function setBlocking() {
    blocking = true;
    return exec;
  }

  function notBlocking() {
    blocking = false;
    return exec;
  }

  function nestedErrors() {
    nested = true;
    return exec;
  }

  function use(mw, path, ctx) {
    if (typeof ctx !== 'string') [ctx, path] = [path, null];
    rules.push({mw, ctx, blocking, path});
    return exec;
  }

  function exec(value, options, fn) {
    const errors = [];
    let i = 0;
    if (typeof options === 'function') [fn, options] = [options, {}];
    options = Object.assign({}, defaults, options);

    function next(res) {
      const {ctx, blocking} = rules[i - 1] || {};
      const {mw, path} = rules[i++] || {};
      const isArray = Array.isArray(res);
      const isInvalid = res === false || isArray;
      const contexts = [ctx];
      if (isArray && nested) contexts.push(...res.map(val => `${ctx}.${val}`));
      if (isInvalid) errors.push(...contexts);
      if (isInvalid && blocking || !mw) return pushResult(errors, fn);
      res = mw(path ? get(value, path) : value, options, fn ? next : fn);
      if (res !== undefined) return next(res);
    }

    return next();
  }
};

function pushResult(res, fn) {
  res = res.length ? res : null;
  return fn ? fn(res) : res;
}
