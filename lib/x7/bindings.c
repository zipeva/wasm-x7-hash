#include "emscripten.h"
#include "x7.h"  // Ensure this header file contains the declaration for x7_hash

// Function to create a buffer of a given size
EMSCRIPTEN_KEEPALIVE
uint8_t* create_buffer(uint32_t size) {
  return (uint8_t*) malloc(size * sizeof(char));
}

// Function to free a previously allocated buffer
EMSCRIPTEN_KEEPALIVE
void destroy_buffer(uint8_t* p) {
  free(p);
}

// Function to calculate the x7 hash and store the result in the output buffer
EMSCRIPTEN_KEEPALIVE
void digest(uint8_t* p_in, uint8_t* p_out, uint32_t input_size, uint64_t timestamp) {
    x7_hash((char *) p_in, (char *) p_out, input_size, timestamp);
}
