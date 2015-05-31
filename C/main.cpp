/*
 *SoggyDog
 *A radar prediction engine
 *Copyright Brett Downing 2014-2015
 *
 *With Thanks to Guillaume Cottenceau and contributors for libpng examples
 *
 * Released under GPL v3
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
#include "config.h"
//#define SAVE_INTERMEDIATE


/*
Cut compute time by limiting the size of the flow image to something reasonable.
Simple application of the functions permits wind speeds up to (512Km/10mins on the IDR703) 3072km/hr which is ridiculous.
Limiting to 300Km/hr reduces the compute size by a factor of 100.
*/
//const float maxWindSpeed = 150;  //km per hour
//const int flowSize = 2 * ceil((maxWindSpeed / kmPerPixel) * (period/60.0));// the number of pixels something can move at the max speed.




int main(int argc, char **argv)
{
    if (argc != 3){
        abort_("Usage: program_name <old_file> <new_file> <file_out>");
    }

    Radar radar;
    int nPaths;
    Prediction config;

    char* filename = "";

    readSites(filename, &radar);
    Path* paths = readPaths(filename, &nPaths);
    readConf(filename, &config);


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
    grey2D32s* flowx = correlate(newDx, oldDx, flowSize(&radar, &config));
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
    grey2D32s* flowy = correlate(newDy, oldDy, flowSize(&radar, &config));
    printf("Dropping Y derivatives\n");
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

    //The full flow image the hard to compute, and we can use it later to re-compute histograms
    printFlow("Fullflow.png", flow);

    printf("Preparing %d histograms\n", nPaths);

    grey2D8u* histo[nPaths];
    for(int i = 0; i<nPaths; i++){
        histo[i] = allocate_grey2D8u(config.stepcount, nColours);
        if(histo[i] == NULL)  abort_("could not allocate a histogram");
    }
    

    uint8_t* histoRow;
    grey2Dfl* scaledFlow;
    grey2Dfl* normalizedflow;
    float scale;
    for(int t=0; t<config.stepcount;t++){
        scale = (t+1)/((float) radar.period);  //needs to change to respect config->stepPeriod

        printf("Scaling flow map by %f\n", scale);
        grey2Dfl* scaledFlow = scaleImage(flow, scale);

        //the flow map is a stand-in for a probablility distribution
        float scaleFactor = sumImage(scaledFlow);
        //printf("normalizing flow map by 1/%f\n", scaleFactor);
        normalizedflow = rescale(scaledFlow, 1.0/scaleFactor, 0);
#ifdef SAVE_INTERMEDIATE
        printFlow("normflow.png", normalizedflow);
#endif
        freeImage(scaledFlow);
        //printf("normalized map integrates to %f\n", sumImage(normalizedflow));

        printf("Calculating histograms\n");
        
        for(int i = 0; i<nPaths; i++){
            
            printf("select a row of histogram %d\n", i);
            histoRow = histo[i]->row[t];
            printf("histogram %d is %d by %d\n", i, histo[i]->width, histo[i]->height);
            
            
            printf("calculate map offset\n");
            int userX = mapXpx(paths[i].lat, paths[i].lon, &radar);
            int userY = mapYpx(paths[i].lat, paths[i].lon, &radar);
            printf("Compute histogram\n");
            histogram(normalizedflow, newMap, userX, userY, histoRow);
            //histograms
            //uint16_t accumulator = 0;
            //for (int i = 0; i < nColours; ++i)
            //{
            //    accumulator+=histoRow[i];
            //    printf(" %d,", histoRow[i]);
            //}
            //printf("%d\n", accumulator);

        }
        freeImage(normalizedflow);

    }

    //write_png_file(argv[2]);
    for(int i = 0; i<nPaths; i++){
        printHistogram(paths[i].name, histo[i]);
    }

    return 0;
}


