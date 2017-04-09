/* eslint-env es6 */

module.exports = function(options = {}) {
	if (!('memory' in options)) {
		options.memory = new WebAssembly.Memory({initial: 1, maximum: 256});
	}

	if (!('table' in options)) {
		options.table = new WebAssembly.Table({initial: 0, element: 'anyfunc', maximum: 0});
	}

	const { memory, table } = options;
	const { malloc, free } = heap(memory);
	const simpleStack = stack();

	return Object.assign({
		STACKTOP: simpleStack.STACKTOP,
		STACK_MAX: simpleStack.STACK_MAX,
		abortStackOverflow: simpleStack.abortStackOverflow,
		memoryBase: 0,
		tableBase: 0,
		__Znwj: malloc,
		__ZdlPv: free,
		malloc,
		free
	}, options);
};
