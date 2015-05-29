#ifndef UTILITIES_H
#define UTILITIES_H
#include <unistd.h>
#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <stdarg.h>
#include <math.h>


#include "imagestructs.h"
#include "indexer.h"
#include "converters.h"
#include "writeImage.h"

grey2D32s* correlate(grey2D8s* imgA, grey2D8s* imgB, int size);
int32_t dotProd(grey2D8s* imgA, grey2D8s* imgB, int offx, int offy);

float sumImage(grey2Dfl* img);

float sumfloats(float* data, int num);

void PrewittX(grey2D8s* kernel);
void PrewittY(grey2D8s* kernel);
grey2D8s* derivative(grey2D8s* img, grey2D8s* kernel);

//not yet implemented
//generate a histogram of the flow image into bins of the indexed colours, with an offset for the user's location.
void histogram(grey2Dfl* scaledFlow, grey2D8s* newMap, int x, int y, uint8_t* bins);

//squares every element of an image, (in place operation)
grey2D32s* squareImage(grey2D32s* img);

//element by element multipication of two images
grey2Dfl* multiplyImages(grey2D32s* imgA, grey2D32s* imgB);

//scale an image (linear interpolation)
grey2Dfl* scaleImage(grey2Dfl* flow, float scale);




//from the libPNG example
void abort_(const char * s, ...);
#endif
