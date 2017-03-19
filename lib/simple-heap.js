/* eslint-env es6 */
module.exports = function(memory, offset = 2024) {
  let HEAPTOP = offset;
  const heap = new Uint8Array(memory.buffer);

  return {
    // Terrible, but okay to test for now
    new: (size) => {
      const ptr = HEAPTOP;
      HEAPTOP += size;
      return ptr;
    }
  };
}

