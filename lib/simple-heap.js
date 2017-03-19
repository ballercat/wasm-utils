/* eslint-env es6 */
module.exports = function(memory) {
  let heap = new Uint32Array(memory.buffer);

  const PAGE_SIZE = (64 * 1024) >> 2;

  const brk = () => heap.length;

  const blocks = [];

  const findBlock = (size) => {
    for(let i = 0; i < blocks.length; i++) {
      let blockSize = heap[blocks[i]];
      if (blockSize >= size) {
        return blocks[i];
      }
    }

    return 0;
  };

  const expand = () => {
    const oldBreak = brk();
    memory.grow(1);
    heap = new Uint32Array(memory.buffer);
    heap[oldBreak] = PAGE_SIZE;
    blocks.push(oldBreak);
    return oldBreak;
  }

  /**
   *
   * @param {Number} size Word aligned address
   */
  const malloc = size => {
    const freeBlock = findBlock(size) || expand();
    const blockSize = heap[freeBlock];
    if (blockSize > size) {
      // pad with a 32bit word for block size
      const split = freeBlock + 1 + size;
      heap[split] = blockSize - size;
      blocks.push(split);
    }

    // Remove freeBlock address from freeBlocks
    blocks.splice(blocks.indexOf(freeBlock), 1);

    // offset with one 32bit word for block header
    return (freeBlock + 1) << 2;
  };

  const free = address => {
    blocks.unshift((address >> 2) - 1);
  }

  return {
    malloc,
    free
  };
}

