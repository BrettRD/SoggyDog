/*
 *Indexes the imported image against a given colour map
 *The indexer should deal with all image nuances and formatting issues
 *
 *
 *
 */




#include "indexer.h"

//a colour map for the intensity colour chart
uint8_t *colour_map;
//index_colours uses colour_map to convert the 16 colours in the BOM pngs to 4-bit colour images
uint8_t** index_colours(int height, int width, png_bytep* row_pointers);

