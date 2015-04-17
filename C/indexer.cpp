/*
 * A simple libpng example program
 * http://zarb.org/~gc/html/libpng.html
 *
 * Modified by Yoshimasa Niwa to make it much simpler
 * and support all defined color_type.
 *
 * To build, use the next instruction on OS X.
 * $ brew install libpng
 * $ clang -lz -lpng15 libpng_test.c
 *
 * Copyright 2002-2010 Guillaume Cottenceau.
 *
 * This software may be freely redistributed under the terms
 * of the X11 license.
 *
 */

/*
*further modified, shoehorned in as an indexer.
*/

#include "utilities.h"
#include <png.h>
// the radar images from bom.gov.au come with a 16px banner that must be trimmed
//a colour map for the intensity colour chart


grey2D8s* index_colours(char* file_name){

    // read file (lifted from libpng-short-example.c  Copyright 2002-2011 Guillaume Cottenceau and contributors, X11 license)
    printf("Reading File %s\n", file_name);
    
    int width, height;
    png_byte color_type;
    png_byte bit_depth;
    png_bytep *row_pointers;

    FILE *fp = fopen(file_name, "rb");
  
    png_structp png = png_create_read_struct(PNG_LIBPNG_VER_STRING, NULL, NULL, NULL);
    if(!png) abort();
  
    png_infop info = png_create_info_struct(png);
    if(!info) abort();
  
    if(setjmp(png_jmpbuf(png))) abort();
  
    png_init_io(png, fp);
  
    png_read_info(png, info);
  
    width      = png_get_image_width(png, info);
    height     = png_get_image_height(png, info);
    color_type = png_get_color_type(png, info);
    bit_depth  = png_get_bit_depth(png, info);
  
    // Read any color_type into 8bit depth, RGBA format.
    // See http://www.libpng.org/pub/png/libpng-manual.txt
  
    if(bit_depth == 16)
      png_set_strip_16(png);
  
    if(color_type == PNG_COLOR_TYPE_PALETTE)
      png_set_palette_to_rgb(png);
  
    // PNG_COLOR_TYPE_GRAY_ALPHA is always 8 or 16bit depth.
    if(color_type == PNG_COLOR_TYPE_GRAY && bit_depth < 8)
      png_set_expand_gray_1_2_4_to_8(png);
  
    if(png_get_valid(png, info, PNG_INFO_tRNS))
      png_set_tRNS_to_alpha(png);
  
    // These color_type don't have an alpha channel then fill it with 0xff.
    if(color_type == PNG_COLOR_TYPE_RGB ||
       color_type == PNG_COLOR_TYPE_GRAY ||
       color_type == PNG_COLOR_TYPE_PALETTE)
      png_set_filler(png, 0xFF, PNG_FILLER_AFTER);
  
    if(color_type == PNG_COLOR_TYPE_GRAY ||
       color_type == PNG_COLOR_TYPE_GRAY_ALPHA)
      png_set_gray_to_rgb(png);
  
    png_read_update_info(png, info);
  
    row_pointers = (png_bytep*)malloc(sizeof(png_bytep) * height);
    for(int y = 0; y < height; y++) {
      row_pointers[y] = (png_byte*)malloc(png_get_rowbytes(png,info));
    }
  
    png_read_image(png, row_pointers);
  
    fclose(fp);


// index colours (cropping as we go)



    //create the greyscale image
    grey2D8s* indx = allocate_grey2D8s(height-(2*cropBorder), width-(2*cropBorder));
    if(indx == NULL) abort_("Indexer could not image");

    for (int y=0; y<(height-(2*cropBorder)); y++) {
        png_bytep row = row_pointers[y + cropBorder];

        for (int x=0; x<width-(2*cropBorder); x++) {
            png_bytep px = &( row[(x+cropBorder)*4] );
            //printf("Pixel at position [ %d - %d ] has RGBA values: %d, %d, %d, %d\n", x, y, px[0], px[1], px[2], px[3]);

            //if the pixel is fully transparent, set it to black
            if(px[3] == 0) {
                px[0] = 0;
                px[1] = 0;
                px[2] = 0;
            }

            //loop through the colours in the map, compare them to the colour map
            for (int colour=0; colour<nColours; colour++){
                indx->row[y][x] = nColours; //out of bounds
                const uint8_t* map_pix = &(colour_map[3 * colour]);
                //XXX use a typecast from uint8_t* to uint64_t and do the comparison in a single op
                if( (px[0]== map_pix[0]) &&
                    (px[1]== map_pix[1]) &&
                    (px[2]== map_pix[2]) ){
                    indx->row[y][x] = colour;
                    break;  //end on the first colour match, most pixels will be transparent.
                }

            }
            if(indx->row[y][x] == nColours){
                printf("Unknown colour: rgb= %d, %d, %d at %d, %d\n", px[0], px[1], px[2], x, y);
                abort_("Indexer could not match a colour");
            }
        }
    }
    for(int y = 0; y < height; y++) {
        free(row_pointers[y]);
    }
    free(row_pointers);

  

    return indx;
}

/*
void write_png_file(char *filename) {
  int y;

  FILE *fp = fopen(filename, "wb");
  if(!fp) abort();

  png_structp png = png_create_write_struct(PNG_LIBPNG_VER_STRING, NULL, NULL, NULL);
  if (!png) abort();

  png_infop info = png_create_info_struct(png);
  if (!info) abort();

  if (setjmp(png_jmpbuf(png))) abort();

  png_init_io(png, fp);

  // Output is 8bit depth, RGBA format.
  png_set_IHDR(
    png,
    info,
    width, height,
    8,
    PNG_COLOR_TYPE_RGBA,
    PNG_INTERLACE_NONE,
    PNG_COMPRESSION_TYPE_DEFAULT,
    PNG_FILTER_TYPE_DEFAULT
  );
  png_write_info(png, info);

  // To remove the alpha channel for PNG_COLOR_TYPE_RGB format,
  // Use png_set_filler().
  //png_set_filler(png, 0, PNG_FILLER_AFTER);

  png_write_image(png, row_pointers);
  png_write_end(png, NULL);

  for(int y = 0; y < height; y++) {
    free(row_pointers[y]);
  }
  free(row_pointers);

  fclose(fp);
}*/