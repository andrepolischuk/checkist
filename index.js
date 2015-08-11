export default (defaults = {}) => {
  const rules = [];
  let blocking = true;
  exec.blocking = setBlocking;
  exec.notBlocking = notBlocking;
  exec.exec = exec;
  exec.use = use;
  return exec;

  function setBlocking() {
    blocking = true;
    return exec;
  }

  function notBlocking() {
    blocking = false;
    return exec;
  }

  function exec(value, fn, opts) {
    const errors = [];
    let i = 0;

    function next(res) {
      const {ctx, blocking} = rules[i - 1] || {};
      const {mw} = rules[i++] || {};
      const isInvalid = res === false || Array.isArray(res);
      if (isInvalid) errors.push(ctx);
      if (isInvalid && blocking || !mw) return pushResult(errors, fn);
      res = mw(value, fn ? next : fn, opts);
      if (res !== undefined) return next(res);
    }

    return next();
  }

  function use(mw, ctx) {
    rules.push({mw, ctx, blocking});
    return exec;
  }
};

function pushResult(res, fn) {
  res = res.length ? res : null;
  return fn ? fn(res) : res;
}
