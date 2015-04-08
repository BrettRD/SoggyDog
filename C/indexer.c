/*
 * Copyright 2002-2011 Guillaume Cottenceau and contributors.
 *
 * This software may be freely redistributed under the terms
 * of the X11 license.
 *
 */

#include "readimage.h"




const uint8_t *colour_map = {
      0,   0,   0,
    245, 245, 255,
    180, 180, 255,
    120, 120, 255,
     20,  20, 255,
      0, 216, 195,
      0, 150, 144,
      0, 102, 102,
    255, 255,   0,
    255, 200,   0,
    255, 150,   0,
    255, 100,   0,
    255,   0,   0,
    200,   0,   0,
    120,   0,   0,
     40,   0,   0,
};
const uint8_t nColours = 16;


grey2D8u* index_colours(int height, int width, png_bytep* row_pointers)
{
    /* Expand any grayscale, RGB, or palette images to RGBA */
    png_set_expand(png_ptr);

    /* Reduce any 16-bits-per-sample images to 8-bits-per-sample */
    png_set_strip_16(png_ptr);

    //create the greyscale image
    grey2D8u* indx = allocate_grey2D8u(height, width);

    for (int y=0; y<height; y++) {
        png_byte* row = row_pointers[y];

        for (int x=0; x<width; x++) {
            png_byte* ptr = &(row[x*4]);
            //printf("Pixel at position [ %d - %d ] has RGBA values: %d - %d - %d - %d\n", x, y, ptr[0], ptr[1], ptr[2], ptr[3]);

            //if the pixel is fully transparent, set it to black
            if(ptr[3] == 0) {
                ptr[0] = 0;
                ptr[1] = 0;
                ptr[2] = 0;
            }

            //loop through the colours in the map, compare them to the colour map
            for (int colour=0; colour<nColours; colour++){
                uint8_t* map_pix = &colour_map[3 * colour];
                //XXX use a typecast from uint8_t* to uint64_t and do the comparison in a single op
                if( (ptr[0]== map_pix[0]) &&
                    (ptr[1]== map_pix[1]) &&
                    (ptr[2]== map_pix[2]) ){
                    indx->row[y][x] = colour;
                    break;  //end on the first colour match, most pixels will be transparent.
                }
            }
        }
    }
    return indx;
}

