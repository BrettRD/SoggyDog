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
//#define SAVE_INTERMEDIATE

const int steps = 30;//the number of steps in the histogram (in minutes)
const int period = 10;//the period of the source image samples (in minutes)

int userX = 0;
int userY = 0;

const float kmPerPixel = 1.0; //256km images (eg. IDR703)

/*
Cut compute time by limiting the size of the flow image to something reasonable.
Simple application of the functions permits wind speeds up to (512Km/10mins on the IDR703) 3072km/hr which is ridiculous.
Limiting to 300Km/hr reduces the compute size by a factor of 100.
*/
const float maxWindSpeed = 150;  //km per hour
const int flowSize = 2 * ceil((maxWindSpeed / kmPerPixel) * (period/60.0));// the number of pixels something can move at the max speed.


//float userLat = -31.9579;
//float userLon = 115.8628;
float userLat = -32.2;
float userLon = 116.4;

//serpentine
float mapLat = -32.3917;
float mapLon = 115.8669;
const float kmPerDeg = 111.2;
/*Finding your image offset from your latitude and longitude
//js from the BOM page
function getMapY(lat, yKm) {
    var mapy = (100 * lat)+(yKm / 1.1111);
    return mapy;
}

function getMapX(lon, xKm, yKm, mapy) {
    var mapx = (100 * lon)+(xKm / (1.1111 * Math.cos(mapy / 5729)));
    return mapx;
}
*/

int main(int argc, char **argv)
{
    if (argc != 3){
        abort_("Usage: program_name <old_file> <new_file> <file_out>");
    }

    //pixel location from lat/long
    userY = (kmPerDeg * (userLat-mapLat)) / kmPerPixel;
    userX = (kmPerDeg * (userLon-mapLon)* cos(userLat*0.0174532)) / kmPerPixel;



    //float testblock[10];
    //for(int i=0;i<10; i++) testblock[i] = 0.1;
    //printf("testsum = %f\n", sumfloats(testblock, 10));

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
    
#ifdef SAVE_INTERMEDIATE
    printIndexed("newColours.png", newMap);    //convert to 8bit
    printIndexed("oldColours.png", oldMap);    //convert to 8bit
#endif


    printf("Preparing a derivative kernel\n");
    //calculate the X and Y derivatives of the image
    //values 0-15 * kernel must not exceed +-127
    grey2D8s* kernel = allocate_grey2D8s(3,3);

    printf("Calculating X derivatives\n");
    PrewittX(kernel);
    grey2D8s* newDx = derivative(newMap, kernel);
    grey2D8s* oldDx = derivative(oldMap, kernel);
#ifdef SAVE_INTERMEDIATE
    printDerivative("newdx.png", newDx);
    printDerivative("olddx.png", oldDx);
#endif
    //4*width*height* [0-64]*[0-64] = 2^32
    printf("Correlating X derivatives\n");
    grey2D32s* flowx = correlate(newDx, oldDx, flowSize);
    printf("Dropping X derivatives\n");
    freeImage(newDx);
    freeImage(oldDx);

    printf("Flow size is: %d, %d\n", flowx->height, flowx->width);
#ifdef SAVE_INTERMEDIATE
    printFlow("Xflow.png", flowx);
#endif
    printf("Calculating Y derivatives\n");
    PrewittY(kernel);
    grey2D8s* newDy = derivative(newMap, kernel);
    grey2D8s* oldDy = derivative(oldMap, kernel);

    printf("Correlating Y derivatives\n");
    grey2D32s* flowy = correlate(newDy, oldDy, flowSize);
    freeImage(newDy);
    freeImage(oldDy);
    freeImage(kernel);
#ifdef SAVE_INTERMEDIATE
    printFlow("Yflow.png", flowy);
#endif

    printf("Combining derivatives\n");
    //this is not an accurate probability map:
    grey2Dfl* flow = multiplyImages(squareImage(flowy), squareImage(flowx));
    printf("Dropping Correlations\n");
    freeImage(flowy);
    freeImage(flowx);
    printFlow("Fullflow.png", flow);

    printf("Preparing a histogram\n");
    grey2D8u* histo = allocate_grey2D8u(steps, nColours);
    
    grey2Dfl* scaledFlow;
    grey2Dfl* normalizedflow;
    float scale;
    for(int t=0; t<steps;t++){
        scale = (t+1)/((float) period);

        printf("Scaling flow map by %f\n", scale);
        grey2Dfl* scaledFlow = scaleImage(flow, scale);

        //the flow map is a stand-in for a probablility distribution
        float scaleFactor = sumImage(scaledFlow);
        printf("normalizing flow map by 1/%f\n", scaleFactor);
        normalizedflow = rescale(scaledFlow, 1.0/scaleFactor, 0);
#ifdef SAVE_INTERMEDIATE
        printFlow("normflow.png", normalizedflow);
#endif
        freeImage(scaledFlow);
        printf("normalized map integrates to %f\n", sumImage(normalizedflow));

        printf("Calculating histogram\n");
        uint8_t* histoRow = histo->row[t];
        histogram(normalizedflow, newMap, userX, userY, histoRow);
        freeImage(normalizedflow);
        //histograms
        for (int i = 0; i < nColours; ++i)
        {
            printf(" %d,", histoRow[i]);
        }
        printf("\n");


    }

    //write_png_file(argv[2]);
    printHistogram("histogram.png", histo);

    return 0;
}


