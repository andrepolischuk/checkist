export default (defaults = {}) => {
  const rules = [];
  let blocking = true;
  exec.blocking = useBlocking;
  exec.notBlocking = useNotBlocking;
  exec.exec = exec;
  exec.use = use;
  return exec;

  function useBlocking() {
    blocking = true;
    return exec;
  }

  function useNotBlocking() {
    blocking = false;
    return exec;
  }

  function exec(value, fn, opts) {
    const errors = [];
    let i = 0;

    function next(res) {
      const {ctx, blocking} = rules[i - 1] || {};
      const {mw} = rules[i++] || {};
      const err = ctx && isInvalid(res);
      if (err) errors.push(ctx);
      if (err && blocking) return pushResult(errors, fn);
      if (!mw) return pushResult(errors, fn);
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

function isInvalid(res) {
  return res === false || Array.isArray(res);
}

function pushResult(res, fn) {
  res = res.length ? res : null;
  return fn ? fn(res) : res;
}
