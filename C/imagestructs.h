#ifndef IMAGESTRUCTS_H
#define IMAGESTRUCTS_H
#include <stdlib.h>
#include <stdint.h>

struct grey2D8u
{
    int height;
    int width;
    uint8_t** row;
    //row[y] is the beginning of a row,
    //row[y][x] is a pixel
};

struct grey2D8s
{
    int height;
    int width;
    int8_t** row;
    //row[y] is the beginning of a row,
    //row[y][x] is a pixel
};

struct grey2D32s
{
    int height;
    int width;
    int32_t** row;
    //row[y] is the beginning of a row,
    //row[y][x] is a pixel
};

struct grey2Dfl
{
    int height;
    int width;
    float** row;
    //row[y] is the beginning of a row,
    //row[y][x] is a pixel
};

grey2D8u* allocate_grey2D8u(int height, int width);
grey2D8s* allocate_grey2D8s(int height, int width);
grey2D32s* allocate_grey2D32s(int height, int width);
grey2Dfl* allocate_grey2Dfl(int height, int width);

void freeImage(grey2D8u* img);
void freeImage(grey2D8s* img);
void freeImage(grey2D32s* img);
void freeImage(grey2Dfl* img);

#endif