export default (defaults = {}) => {
  const rules = [];
  const contexts = [];
  exec.exec = exec;
  exec.use = use;
  return exec;

  function exec(value, fn, opts) {
    let i = 0;

    function next(res) {
      const ctx = contexts[i - 1];
      const mw = rules[i++];
      if (ctx && isResultInvalid(res)) return pushResult(ctx, fn);
      if (!mw) return pushResult(null, fn);
      res = mw(value, fn ? next : fn, opts);
      if (res !== undefined) return next(res);
    }

    return next();
  }

  function use(mw, ctx) {
    contexts.push(ctx);
    rules.push(mw);
    return exec;
  }
};

function isResultInvalid(res) {
  return res === false || typeof res === 'string';
}

function pushResult(res, fn) {
  return fn ? fn(res) : res;
}
