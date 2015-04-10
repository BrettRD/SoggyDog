
#include "utilities.h"




//destructively sum an array of floats in a binary tree.
//adding a number less than the current resolution makes rounding errors. this should help.
//ideally, this would sum the numbers with smallest mantissaas first.
float sumfloats(float* data, int num){
    for(int d=1; d<num; d*=2){
        for(int i=0; i+d<num; i+=2*d){
            data[i] += data[i+d];
        }
    }
}

//quick and dirty prewitt, only handles 3x3 kernels
//I've used much larger kernels in the past, FIX ME.
void PrewittX(grey2D8s* kernel){
	for(int x=0; x<kernel->height; x++){
		for(int y=0; y<kernel->width; y++){
			kernel->row[x][y] = x-1;
		}
	}
}

void PrewittY(grey2D8s* kernel){
	for(int x=0; x<kernel->height; x++){
		for(int y=0; y<kernel->width; y++){
			kernel->row[x][y] = y-1;
		}
	}
}


//from the libPNG example
void abort_(const char * s, ...)
{
        va_list args;
        va_start(args, s);
        vfprintf(stderr, s, args);
        fprintf(stderr, "\n");
        va_end(args);
        abort();
}

//squares every element of an image, (in place operation)
grey2Dfl* squareImage(grey2Dfl* img){
    for(int x=0; x< img->width; x++){
        for(int y=0; y< img->height; y++){
            img->row[y][x] = img->row[y][x] * img->row[y][x];
        }
    }
}

//element by element multipication of two images
grey2Dfl* multiplyImages(grey2Dfl* imgA, grey2Dfl* imgB){
    if((imgA->height != imgB->height) || (imgA->width != imgB->width) ){
        abort_("Error: attempting to multiply elements of different sized images");
    }
    grey2Dfl* imgC = allocate_grey2Dfl(imgA->height, imgA->width);

    for(int x=0; x< imgC->width; x++){
        for(int y=0; y< imgC->height; y++){
            imgC->row[y][x] = imgA->row[y][x] * imgB->row[y][x];
        }
    }
}


//scale an image (linear interpolation)
//it may be worth adding arguments to crop the final scaled image to a given maximum size.
grey2Dfl* scaleImage(grey2Dfl* flow, float scale){
    int height = flow->height * scale;
    int width = flow->width * scale;
    grey2Dfl* scflow = allocate_grey2Dfl(height, width);
    for(int y=0; y<height; y++){
        for(int x=0; x<width; x++){
            
            int oY = y/scale;
            int oX = y/scale;
            
            int oY1 = floor(y/scale);
            int oY2 = ceil(y/scale);
            int oX1 = floor(x/scale);
            int oX2 = ceil(x/scale);
             //linear interpolation goes here
            scflow->row[y][x] = 
            flow->row[oY1][oX1] * (oX2 - oX) * (oY2 - oY) +
            flow->row[oY1][oX2] * (oX - oX1) * (oY2 - oY) +
            flow->row[oY2][oX1] * (oX2 - oX) * (oY - oY1) +
            flow->row[oY2][oX2] * (oX - oX1) * (oY - oY1)
            ;
        }
    }
    return scflow;
}