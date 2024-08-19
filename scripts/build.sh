# Guide https://web.dev/emscripting-a-c-library/
DOCKER_IMAGE=trzeci/emscripten-fastcomp

mkdir -p lib/wasm-build
rm -rf js-lib/wasm-build/*

docker run \
  -v $(pwd):/src \
  -w="/src" \
  $DOCKER_IMAGE \
  emcc -O3 -s WASM=1 -s EXTRA_EXPORTED_RUNTIME_METHODS='["cwrap"]' -s MODULARIZE=1 \
        -s NODEJS_CATCH_EXIT=0 -s NODEJS_CATCH_REJECTION=0 \
        -I lib/x7/sha3/*.c lib/x7/*.c \
        -o lib/wasm-build/x7-hash.js

WASM_BUILD_BASE_64=$(base64 lib/wasm-build/x7-hash.wasm)

# fs.readFile/fetch of `x7-hash.wasm` isn't suitable for bundling into libraries
# Produce JS file with the wasm build base64 instead
echo 'module.exports = "'${WASM_BUILD_BASE_64}'"' > lib/wasm-build/x7-hash-wasm-base64.js

rm lib/wasm-build/x7-hash.wasm
