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

  function use(mw, ctx) {
    rules.push({mw, ctx, blocking});
    return exec;
  }

  function exec(value, fn, opts) {
    const errors = [];
    let i = 0;

    function next(res) {
      const {ctx, blocking} = rules[i - 1] || {};
      const {mw} = rules[i++] || {};
      const isArray = Array.isArray(res);
      const isInvalid = res === false || isArray;
      const contexts = [ctx];
      if (isArray && nested) contexts.push(...res.map(val => `${ctx}.${val}`));
      if (isInvalid) errors.push(...contexts);
      if (isInvalid && blocking || !mw) return pushResult(errors, fn);
      res = mw(value, fn ? next : fn, opts);
      if (res !== undefined) return next(res);
    }

    return next();
  }
};

function pushResult(res, fn) {
  res = res.length ? res : null;
  return fn ? fn(res) : res;
}
