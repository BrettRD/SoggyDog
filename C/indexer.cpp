/*
 * Copyright 2002-2011 Guillaume Cottenceau and contributors.
 *
 * This software may be freely redistributed under the terms
 * of the X11 license.
 *
 */

#include "readimage.h"
#include "indexer.h"
#include "imagestructs.h"


// the radar images from bom.gov.au come with a 16px banner that must be trimmed
const uint8_t cropBorder = 16;

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


grey2D8u* index_colours(char* file_name){

    // read file (lifted from libpng-short-example.c  Copyright 2002-2011 Guillaume Cottenceau and contributors, X11 license)
    int x, y;
    
    int width, height, rowbytes;
    png_byte color_type;
    png_byte bit_depth;
    
    png_structp png_ptr;
    png_infop info_ptr;
    int number_of_passes;
    png_bytep * row_pointers;

    unsigned char header[8];    // 8 is the maximum size that can be checked

    /* open file and test for it being a png */
    FILE *fp = fopen(file_name, "rb");
    if (!fp){
        abort_("[read_png_file] File %s could not be opened for reading", file_name);
    }
    fread(header, 1, 8, fp);
    if (png_sig_cmp(header, 0, 8)){
        abort_("[read_png_file] File %s is not recognized as a PNG file", file_name);
    }

    /* initialize stuff */
    png_ptr = png_create_read_struct(PNG_LIBPNG_VER_STRING, NULL, NULL, NULL);
    if (!png_ptr){
        abort_("[read_png_file] png_create_read_struct failed");
    }
    info_ptr = png_create_info_struct(png_ptr);
    if (!info_ptr){
        abort_("[read_png_file] png_create_info_struct failed");
    }
    if (setjmp(png_jmpbuf(png_ptr))){
        abort_("[read_png_file] Error during init_io");
    }

    png_init_io(png_ptr, fp);
    png_set_sig_bytes(png_ptr, 8);
    png_read_info(png_ptr, info_ptr);
    width = png_get_image_width(png_ptr, info_ptr);
    height = png_get_image_height(png_ptr, info_ptr);
    color_type = png_get_color_type(png_ptr, info_ptr);
    bit_depth = png_get_bit_depth(png_ptr, info_ptr);

    number_of_passes = png_set_interlace_handling(png_ptr);
    png_read_update_info(png_ptr, info_ptr);

    /* read file */
    if (setjmp(png_jmpbuf(png_ptr))){
        abort_("[read_png_file] Error during read_image");
    }

    row_pointers = (png_bytep*) malloc(sizeof(png_bytep) * height);

    if (bit_depth == 16){
        rowbytes = width*8;
    }
    else{
        rowbytes = width*4;
    }

    for (y=0; y<height; y++){
        row_pointers[y] = (png_byte*) malloc(rowbytes);
    }

    png_read_image(png_ptr, row_pointers);

    fclose(fp);


    /* Expand any grayscale, RGB, or palette images to RGBA */
    png_set_expand(png_ptr);

    /* Reduce any 16-bits-per-sample images to 8-bits-per-sample */
    png_set_strip_16(png_ptr);





// index colours (cropping as we go)



    //create the greyscale image
    grey2D8u* indx = allocate_grey2D8u(height-(2*cropBorder), width-(2*cropBorder));

    for (int y=0; y<height-(2*cropBorder); y++) {
        png_byte* row = row_pointers[y + cropBorder];

        for (int x=0; x<width-(2*cropBorder); x++) {
            png_byte* ptr = &( row[(x+cropBorder)*4] );
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

