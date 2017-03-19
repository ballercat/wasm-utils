/* eslint-env es6 */
module.exports = function(limit = 1024) {
  const STACKTOP = 0;
  const STACK_MAX = limit;
  const abortStackOverflow = function() { throw `WASM Stack Overflow, MAX: ${STACK_MAX}`; };
  return {
    STACKTOP,
    STACK_MAX,
    abortStackOverflow
  };
}
