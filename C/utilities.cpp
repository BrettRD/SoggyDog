
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