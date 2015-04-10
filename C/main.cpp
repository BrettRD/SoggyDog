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
 



int main(int argc, char **argv)
{
        if (argc != 3)
        abort_("Usage: program_name <old_file> <new_file> <file_out>");
        //read the files
        read_png_file(argv[1]);
        read_png_file(argv[2]);

        //index the colours
        //values 0-15
        grey2D8u* newMap = index_colours();
        grey2D8u* oldMap = index_colours();
        
        //calculate the X and Y derivatives of the image
        //values 0-15 * kernel must not exceed +-127
        grey2D8s* newDx = derivativeX(newMap);
        grey2D8s* oldDx = derivativeX(oldMap);
        //4*width*height* [0-64]*[0-64] = 2^32
        grey2Dfl* flowx = correlate(newDx, oldDx);
        freeImage(newDx);
        freeImage(oldDx);

        grey2D8s* newDy = derivativeY(newMap);
        grey2D8s* oldDy = derivativeY(oldMap);
        grey2Dfl* flowy = correlate(newDy, oldDy);
        freeImage(newDy);
        freeImage(oldDy);

        grey2Dfl* flow = multiplyImages(squareImage(flowy), squareImage(flowx)); //this is not an accurate probability map
        freeImage(flowy);
        freeImage(flowx);

        //expand the totalFlow image to 1/15 to 4
        //int steps;    //the step size of the histogram (in minutes)
        //int period;   //the period of image samples (in minutes)

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


