
module.exports = function(memory) {
  if (!WebAssembly || !WebAssembly.Memory) {
    throw 'Logger cannot be crated, window.WebAssembly is missing or not supported (Must contain Memory)';
  }
  if (!(memory instanceof WebAssembly.Memory)) {
    throw 'Logger must be initialized with a Memory instance';
  }

  return function(pointer) {
    var buffer = new Uint8Array(memory.buffer);
    var str = new TextDecoder('utf8').buffer(buffer.slice(pointer, buffer.indexOf(0, pointer)));
    console.log(str);
  };
}

