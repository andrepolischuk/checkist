export default (defaults = {}) => {
  const middlewares = [];
  const contexts = [];

  function validate(...args) {
    return exec(...args);
  }

  validate.exec = exec;
  validate.use = use;
  return validate;

  function exec(value, fn, opts) {
    let i = 0;

    function next(res) {
      const ctx = contexts[i - 1];
      const mw = middlewares[i++];
      if (ctx && isResultInvalid(res)) return pushResult(ctx, fn);
      if (!mw) return pushResult(null, fn);
      res = mw(value, fn ? next : fn, opts);
      if (res !== undefined) return next(res);
    }

    return next();
  }

  function use(mw, ctx) {
    contexts.push(ctx);
    middlewares.push(mw);
    return validate;
  }
};

function isResultInvalid(res) {
  return res === false || typeof res === 'string';
}

function pushResult(res, fn) {
  return fn ? fn(res) : res;
}
