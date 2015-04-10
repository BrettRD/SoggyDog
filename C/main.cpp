/*
 * Copyright 2002-2011 Guillaume Cottenceau and contributors.
 *
 * This software may be freely redistributed under the terms
 * of the X11 license.
 *
 */

#include <unistd.h>
#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <stdarg.h>

#define PNG_DEBUG 3
#include <png.h>
#include "utilities.h"
#include "indexer.h"


//expand the totalFlow image to 1/15 to 4
//int steps;    //the step size of the histogram (in minutes)
//int period;   //the period of image samples (in minutes)

const int steps = 1;
const int period = 10;

int main(int argc, char **argv)
{
    if (argc != 3)
    abort_("Usage: program_name <old_file> <new_file> <file_out>");
    //read the files
    //read_png_file(argv[1]);
    //read_png_file(argv[2]);

    //index the colours
    //values 0-15
    grey2D8u* newMap = index_colours(argv[1]);
    grey2D8u* oldMap = index_colours(argv[2]);
    
    //calculate the X and Y derivatives of the image
    //values 0-15 * kernel must not exceed +-127
    grey2D8s* kernel = allocate_grey2D8s(3,3);

    PrewittX(kernel);
    grey2D8s* newDx = derivative(newMap, kernel);
    grey2D8s* oldDx = derivative(oldMap, kernel);
    //4*width*height* [0-64]*[0-64] = 2^32
    grey2Dfl* flowx = correlate(newDx, oldDx);
    freeImage(newDx);
    freeImage(oldDx);

    PrewittY(kernel);
    grey2D8s* newDy = derivativeY(newMap, kernel);
    grey2D8s* oldDy = derivativeY(oldMap, kernel);
    grey2Dfl* flowy = correlate(newDy, oldDy);
    freeImage(newDy);
    freeImage(oldDy);
    freeImage(kernel);


    grey2Dfl* flow = multiplyImages(squareImage(flowy), squareImage(flowx)); //this is not an accurate probability map
    freeImage(flowy);
    freeImage(flowx);


    grey2D8u* histo = allocate_grey2D8u(steps, nColours)
    
    grey2Dfl* scaledFlow;
    float scale;
    for(int t=0; t<steps;t++){
        scale = t/((float) period);
        scaledFlow = scaleImage(flow, scale);

        histogram(scaledFlow, , histo->row)
        //histograms

        freeImage(scaledFlow)
    }

    //write_png_file(argv[2]);

    return 0;
}


