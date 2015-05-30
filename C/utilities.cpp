
#include "utilities.h"

//sum an array of floats in a binary tree.
//adding a number less than the current resolution makes rounding errors. this should help.
//ideally, this would sum the numbers with smallest mantissaas first.
float sumfloats(float* data, int num){
    if(num==0) return 0;
    float tmpCopy[num];
    memcpy(tmpCopy, data, sizeof(float)*num);
    for(int d=1; d<num; d*=2){
        for(int i=0; i+d<num; i+=2*d){
            tmpCopy[i] += tmpCopy[i+d];
        }
    }
    return tmpCopy[0];
}

//This should beat the precision of Kahan Summation, but take nlog(n) to do it.
float heapsum(float* data, int num){
    //generate a heap (smallest at the top),
    //Sum the root into the smaller of the first children
    //move the last element to the root and heapify.
    //rinse and repeat

}

//Sum all the elements in an image (used to normalize a probablitity map)
float sumImage(grey2Dfl* img){
    float tmpcolumn[img->height];
    for(int y=0; y < img->height; y++){
        tmpcolumn[y] = sumfloats(img->row[y], img->width);
    }
    return sumfloats(tmpcolumn, img->height);
}



//quick and dirty prewitt, only handles 3x3 kernels
//I've used much larger kernels in the past, FIX ME.
void PrewittX(grey2D8s* kernel){
	for(int y=0; y<kernel->height; y++){
		for(int x=0; x<kernel->width; x++){
			kernel->row[x][y] = x-1;
		}
	}
}

void PrewittY(grey2D8s* kernel){
	for(int y=0; y<kernel->height; y++){
		for(int x=0; x<kernel->width; x++){
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
grey2D32s* squareImage(grey2D32s* img){
    //printf("Square an image\n");
    for(int x=0; x< img->width; x++){
        for(int y=0; y< img->height; y++){
            //this needs to become floats, or I need a 128 bit processor
            img->row[y][x] = img->row[y][x] * img->row[y][x];
        }
    }
    return img;
}

//element by element multipication of two images
grey2Dfl* multiplyImages(grey2D32s* imgA, grey2D32s* imgB){
    //printf("Multiply some images\n");
    if((imgA->height != imgB->height) || (imgA->width != imgB->width) ){
        abort_("Error: attempting to multiply elements of different sized images");
    }
    grey2Dfl* imgC = allocate_grey2Dfl(imgA->height, imgA->width);

    for(int y=0; y< imgC->height; y++){
        for(int x=0; x< imgC->width; x++){
            imgC->row[y][x] = (float)imgA->row[y][x] * (float)imgB->row[y][x];
        }
    }
    return imgC;
}


//scale an image (linear interpolation)
//it may be worth adding arguments to crop the final scaled image to a given maximum size.
//I may also apply a shift to centre the image to improve symmetry
grey2Dfl* scaleImage(grey2Dfl* flow, float scale){
    int height = floor((flow->height-1) * scale);
    int width = floor((flow->width-1) * scale);

    //printf("Allocating scaled image %dx%d\n", height, width);
    grey2Dfl* scflow = allocate_grey2Dfl(height, width);

    for(int y=0; y<height; y++){
        for(int x=0; x<width; x++){
            
            float oY = y/scale;
            float oX = x/scale;
            
            int oY1 = floor(oY);
            int oY2 = ceil(oY);
            int oX1 = floor(oX);
            int oX2 = ceil(oX);
            //if(oY1 >= flow->height) abort_("Error: Y1 out of interpolation bounds Y");
            //if(oX1 >= flow->width) abort_("Error: X1 out of interpolation bounds x");
            //if(oY2 >= flow->height) abort_("Error: Y2 out of interpolation bounds Y");
            //if(oX2 >= flow->width) abort_("Error: X2 out of interpolation bounds x");

            //linear interpolation goes here
            if((oX1==oX2)&&(oY1==oY2)) {
                scflow->row[y][x]  = flow->row[oY1][oX1];
            }else if(oX1==oX2){
                scflow->row[y][x]  = flow->row[oY1][oX1] * (oY2 - oY);
                scflow->row[y][x] += flow->row[oY2][oX1] * (oY - oY1);
            }else if(oY1==oY2){
                scflow->row[y][x]  = flow->row[oY1][oX1] * (oX2 - oX);
                scflow->row[y][x] += flow->row[oY1][oX2] * (oX - oX1);
            }else{            
                scflow->row[y][x]  = flow->row[oY1][oX1] * (oX2 - oX) * (oY2 - oY);
                scflow->row[y][x] += flow->row[oY1][oX2] * (oX - oX1) * (oY2 - oY);
                scflow->row[y][x] += flow->row[oY2][oX1] * (oX2 - oX) * (oY - oY1);
                scflow->row[y][x] += flow->row[oY2][oX2] * (oX - oX1) * (oY - oY1);
            }
        }
    }
    return scflow;
}

