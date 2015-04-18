// Lifted from:
// LibPNG example
// A.Greensted
// http://www.labbookpages.co.uk

// Version 2.0
// With some minor corrections to Mandlebrot code (thanks to Jan-Oliver)

// Version 1.0 - Initial release



#include "utilities.h"

#include <png.h>


int writeImage(const char* filename, grey2D8u* img)
{
	int code = 0;
	FILE *fp;
	png_structp png_ptr;
	png_infop info_ptr;
	png_bytep row;
	
	// Open file for writing (binary mode)
	fp = fopen(filename, "wb");
	if (fp == NULL) {
		fprintf(stderr, "Could not open file %s for writing\n", filename);
		code = 1;
		goto finalise;
	}

	// Initialize write structure
	png_ptr = png_create_write_struct(PNG_LIBPNG_VER_STRING, NULL, NULL, NULL);
	if (png_ptr == NULL) {
		fprintf(stderr, "Could not allocate write struct\n");
		code = 1;
		goto finalise;
	}

	// Initialize info structure
	info_ptr = png_create_info_struct(png_ptr);
	if (info_ptr == NULL) {
		fprintf(stderr, "Could not allocate info struct\n");
		code = 1;
		goto finalise;
	}

	// Setup Exception handling
	if (setjmp(png_jmpbuf(png_ptr))) {
		fprintf(stderr, "Error during png creation\n");
		code = 1;
		goto finalise;
	}

	png_init_io(png_ptr, fp);

	// Write header (8 bit colour depth)
	png_set_IHDR(png_ptr, info_ptr, img->width, img->height,
			8, PNG_COLOR_TYPE_RGB, PNG_INTERLACE_NONE,
			PNG_COMPRESSION_TYPE_BASE, PNG_FILTER_TYPE_BASE);

	//// Set title
	//if (title != NULL) {
	//	png_text title_text;
	//	title_text.compression = PNG_TEXT_COMPRESSION_NONE;
	//	title_text.key = "Title";
	//	title_text.text = title;
	//	png_set_text(png_ptr, info_ptr, &title_text, 1);
	//}

	png_write_info(png_ptr, info_ptr);

	// Allocate memory for one row (3 bytes per pixel - RGB)
	row = (png_bytep) malloc(3 * img->width * sizeof(png_byte));

	// Write image data
	int x, y;
	//int pixcol[3] = {0};
	for (y=0 ; y<img->height ; y++) {
		for (x=0 ; x<img->width ; x++) {
			row[x*3 + 0] = img->row[y][x];   //red
			row[x*3 + 1] = img->row[y][x];   //green
			row[x*3 + 2] = img->row[y][x];   //blue
		}
		png_write_row(png_ptr, row);
	}
	
	// End write
	png_write_end(png_ptr, NULL);

	finalise:
	if (fp != NULL) fclose(fp);
	if (info_ptr != NULL) png_free_data(png_ptr, info_ptr, PNG_FREE_ALL, -1);
	if (png_ptr != NULL) png_destroy_write_struct(&png_ptr, (png_infopp)NULL);
	if (row != NULL) free(row);

	return code;
}
int printHistogram(const char* name, grey2D8u* img){
	grey2D8u* flatmap;
    grey2D8u* printable;
    //flatmap = flatten(img);    //convert to 8bit
    printable = rescale(img, 16, -128);     //enhance the contrast
    freeImage(flatmap);
    int retval = writeImage(name, printable);
    freeImage(printable);
    return retval;
}



int printIndexed(const char* name, grey2D8s* img){
	grey2D8u* flatmap;
    grey2D8u* printable;
    flatmap = flatten(img);    //convert to 8bit
    printable = rescale(flatmap, 16, -128);     //enhance the contrast
    freeImage(flatmap);
    int retval = writeImage(name, printable);
    freeImage(printable);
    return retval;
}

int printDerivative(const char* name, grey2D8s* img){
	grey2D8u* flatmap;
    grey2D8u* printable;

    flatmap = flatten(img);    //convert to 8bit
    printable = rescale(flatmap, 1.5, -64);     //enhance the contrast
    freeImage(flatmap);
    int retval = writeImage(name, printable);
    freeImage(printable);
    return retval;
}

int printFlow(const char* name, grey2D32s* img){
	grey2D8u* flatmap;
    grey2D8u* printable;
    grey2D32s* enhanced;
    int32_t top = max(img);
    int32_t tail = min(img);
    printf("Flow extrema are: %d, %d\n", top, tail);
    float mult = (float)0xffffffff / (float)(top - tail);
    float offset = - ((top + tail)/2);
    printf("begin image rescale\n");
    
    enhanced = rescale(img, mult, offset);     //enhance the contrast
    //printf("Flow extrema are: %d, %d\n", max(enhanced), min(enhanced));
    
    printable = flatten(enhanced);    //convert to 8bit
    freeImage(enhanced);
    int retval = writeImage(name, printable);
    freeImage(printable);
    return retval;
}

int printFlow(const char* name, grey2Dfl* img){
	grey2D8u* flatmap;
    grey2D8u* printable;
    grey2Dfl* enhanced;
    float top = max(img);
    float tail = min(img);
    printf("Flow extrema are: %f, %f\n", top, tail);
    //get the range between 0-1
    float mult = 1.0 / (float)(top - tail);
    float offset = -tail;
    printf("begin image rescale\n");
    
    enhanced = rescale(img, mult, offset);     //enhance the contrast
    //printf("Flow extrema are: %d, %d\n", max(enhanced), min(enhanced));
    
    printable = flatten(enhanced);    //convert to 8bit
    freeImage(enhanced);
    int retval = writeImage(name, printable);
    freeImage(printable);
    return retval;
}