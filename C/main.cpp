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


//expand the totalFlow image to 1/15 to 4
//int steps;    //the step size of the histogram (in minutes)
//int period;   //the period of image samples (in minutes)

const int steps = 30;
const int period = 10;

int userX = 0;
int userY = 0;

int main(int argc, char **argv)
{
    if (argc != 3){
        abort_("Usage: program_name <old_file> <new_file> <file_out>");
    }

    //read the files
    //read_png_file(argv[1]);
    //read_png_file(argv[2]);

    //used for writing images
    grey2D8u* flatmap;
    grey2D8u* printable;
    grey2D32s* enhanced;
    const char *outname;

    //index the colours
    //values 0-15
    printf("Indexing colours\n");
    grey2D8s* newMap = index_colours(argv[1]);
    grey2D8s* oldMap = index_colours(argv[2]);
    

    printIndexed("newColours.png", newMap);    //convert to 8bit
    printIndexed("oldColours.png", oldMap);    //convert to 8bit



    printf("Preparing a derivative kernel\n");
    //calculate the X and Y derivatives of the image
    //values 0-15 * kernel must not exceed +-127
    grey2D8s* kernel = allocate_grey2D8s(3,3);

    printf("Calculating X derivatives\n");
    PrewittX(kernel);
    grey2D8s* newDx = derivative(newMap, kernel);
    grey2D8s* oldDx = derivative(oldMap, kernel);

    printDerivative("newdx.png", newDx);
    printDerivative("olddx.png", oldDx);

    //4*width*height* [0-64]*[0-64] = 2^32
    printf("Correlating X derivatives\n");
    grey2D32s* flowx = correlate(newDx, oldDx);
    printf("Dropping X derivatives\n");
    freeImage(newDx);
    freeImage(oldDx);

    printf("Flow size is: %d, %d\n", flowx->height, flowx->width);

    printFlow("Xflow.png", flowx);

    printf("Calculating Y derivatives\n");
    PrewittY(kernel);
    grey2D8s* newDy = derivative(newMap, kernel);
    grey2D8s* oldDy = derivative(oldMap, kernel);

    printf("Correlating Y derivatives\n");
    grey2D32s* flowy = correlate(newDy, oldDy);
    freeImage(newDy);
    freeImage(oldDy);
    freeImage(kernel);

    printFlow("Yflow.png", flowy);


    printf("Combining derivatives\n");
    //this is not an accurate probability map:
    grey2D32s* flow = multiplyImages(squareImage(flowy), squareImage(flowx));
    printf("Dropping Correlations\n");
    freeImage(flowy);
    freeImage(flowx);
    printFlow("Fullflow.png", flow);

    printf("Preparing a histogram\n");
    grey2D8u* histo = allocate_grey2D8u(steps, nColours);
    
    grey2Dfl* scaledFlow;
    float scale;
    for(int t=1; t<steps;t++){
        scale = t/((float) period);

        printf("Scaling flow map by %f\n", scale);
        grey2Dfl* scaledFlow = scaleImage(flow, scale);

        printf("Calculating histogram\n");
        uint8_t* histoRow = histo->row[t];
        histogram(scaledFlow, newMap, userX, userY, histoRow);
        //histograms
        for (int i = 0; i < nColours; ++i)
        {
            printf(" %f,", histoRow[i]);
        }
        printf("\n");


        freeImage(scaledFlow);
    }

    //write_png_file(argv[2]);

    return 0;
}


