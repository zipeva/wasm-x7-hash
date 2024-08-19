#ifndef X7_H
#define X7_H

#ifdef __cplusplus
extern "C" {
#endif

#include <stdint.h>
#include <stdlib.h>
#include <string.h>
#include <stdio.h>

void x7_hash(const char* input, char* output, uint32_t len, uint64_t timestamp);

#ifdef __cplusplus
}
#endif

#endif
