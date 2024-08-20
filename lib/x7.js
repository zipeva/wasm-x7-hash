'use strict';

const loadX7WasmModule = require('./wasm-build/x7-hash'); // Update this to your x7 wasm module path
const wasmBuildBase64 = require('./wasm-build/x7-hash-wasm-base64'); // Update this to your x7 wasm base64 path

const OUTPUT_HASH_SIZE = 32;

/**
 * @param {Object} bindings - The bindings object that contains the WASM functions.
 * @return {Function} - The digest function to hash the input.
 */
const createDigest = (bindings) => {
  /**
   * @typedef {Function} digest
   * @param {string|Buffer|Uint8Array} input - The input data to be hashed.
   * @param {string} [encoding=utf8] - The encoding of the input string.
   * @param {number} [timestamp=0] - A timestamp to include in the hash.
   * @return {Buffer} - The resulting hash as a Buffer.
   */
  const digest = (input, encoding = 'utf8', timestamp = 0) => {
    let inputBuffer;

    // Convert input to a Buffer based on the type
    if (typeof input === 'string') {
      inputBuffer = Buffer.from(input, encoding);
    } else if (input instanceof Buffer) {
      inputBuffer = input;
    } else if (input instanceof Uint8Array) {
      inputBuffer = Buffer.from(input);
    } else {
      throw new TypeError('Invalid input type');
    }

    // Allocate memory in WASM for input and output buffers
    const pIn = bindings.create_buffer(inputBuffer.length);
    const pOut = bindings.create_buffer(OUTPUT_HASH_SIZE);

    if (pIn === 0 || pOut === 0) {
      throw new Error('Failed to allocate WASM memory.');
    }

    try {
      // Copy input to WebAssembly memory
      const inputView = new Uint8Array(bindings.wasmModule.HEAPU8.buffer, pIn, inputBuffer.length);
      inputView.set(inputBuffer);

      // Call the WASM digest function with input buffer, output buffer, input length, and timestamp
      bindings.digest(pIn, pOut, inputBuffer.length, timestamp);

      // Extract the result from the WebAssembly memory
      const result = new Uint8Array(bindings.wasmModule.HEAPU8.buffer, pOut, OUTPUT_HASH_SIZE);

      // Return the result as a Buffer
      return Buffer.from(result);
    } finally {
      // Ensure memory is freed in all cases
      bindings.destroy_buffer(pIn);
      bindings.destroy_buffer(pOut);
    }
  };

  return digest;
};

/**
 * Load and initialize the x7 WASM module, returning a digest function.
 * @return {Promise<{ digest: Function }>}
 */
module.exports = () => loadX7WasmModule({
  wasmBinary: Buffer.from(wasmBuildBase64, 'base64'), // Load WASM binary from base64 string
}).then((wasmModule) => {
  const bindings = {
    digest: wasmModule.cwrap('digest', null, ['number', 'number', 'number', 'number']),
    create_buffer: wasmModule.cwrap('create_buffer', 'number', ['number']),
    destroy_buffer: wasmModule.cwrap('destroy_buffer', null, ['number']),
    wasmModule,
  };

  return {
    digest: createDigest(bindings),
  };
});
