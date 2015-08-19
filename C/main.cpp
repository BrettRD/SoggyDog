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

#include <thread>
//#define SAVE_INTERMEDIATE


/*
Cut compute time by limiting the size of the flow image to something reasonable.
Simple application of the functions permits wind speeds up to (512Km/10mins on the IDR703) 3072km/hr which is ridiculous.
Limiting to 300Km/hr reduces the compute size by a factor of 100.
*/
//const float maxWindSpeed = 150;  //km per hour
//const int flowSize = 2 * ceil((maxWindSpeed / kmPerPixel) * (period/60.0));// the number of pixels something can move at the max speed.



void flowThread(grey2D8s* newMap, grey2D8s* oldMap, grey2D32s** flow, Radar* radar, Prediction* config, bool axis){
    grey2D8s* kernel = allocate_grey2D8s(3,3);
    //printf("Calculating X derivatives\n");
    if(axis){
        PrewittX(kernel);
    }else{
        PrewittY(kernel);
    }

    grey2D8s* newDx = derivative(newMap, kernel);
    grey2D8s* oldDx = derivative(oldMap, kernel);
#ifdef SAVE_INTERMEDIATE
    if(axis){
        printDerivative("newdx.png", newDx);
        printDerivative("olddx.png", oldDx);
    }else{
        printDerivative("newdy.png", newDx);
        printDerivative("olddy.png", oldDx);
    }
#endif
    //4*width*height* [0-64]*[0-64] = 2^32
    //printf("Correlating X derivatives\n");
    *flow = correlate(newDx, oldDx, flowSize(radar, config));
    //printf("Dropping X derivatives\n");
    freeImage(newDx);
    freeImage(oldDx);
    freeImage(kernel);
    //printf("Flow size is: %d, %d\n", (*flowx)->height, (*flowx)->width);
}


int main(int argc, char **argv)
{
    if (argc != 4){
        abort_("Usage: program_name <old_file> <new_file> <paths_file>");
    }

    Radar radar;
    int nPaths;
    Prediction config;

    char* filename = argv[3];

    readSites(filename, &radar);
    Path* paths = readPaths(filename, &nPaths);


    readConf(filename, &config);

/* 
    for(int i=0; i<nPaths; i++){
        printf("name = %s\n", paths[i].name);
        printf("lat = %g\n", paths[i].lat);
        printf("lon = %g\n", paths[i].lon);
    }
*/


    //index the colours
    //values 0-15
    printf("Indexing colours\n");
    grey2D8s* oldMap = index_colours(argv[1]);
    grey2D8s* newMap = index_colours(argv[2]);

#ifdef SAVE_INTERMEDIATE
    printIndexed("newColours.png", newMap);    //convert to 8bit
    printIndexed("oldColours.png", oldMap);    //convert to 8bit
#endif

    grey2D32s* flowx;
    grey2D32s* flowy;

    printf("Openning Flow X calcs as a seperate thread\n");
    std::thread tFlowX (flowThread, oldMap, newMap, &flowx, &radar, &config, true);
//    std::thread tFlowY (flowYThread, newMap, oldMap, &flowy, &radar, &config);
    printf("Starting Flow Y calcs\n");
    flowThread(oldMap, newMap, &flowy, &radar, &config, false);

    tFlowX.join();
    //tFlowY.join();
#ifdef SAVE_INTERMEDIATE
    printFlow("Yflow.png", flowy);
    printFlow("Xflow.png", flowx);
#endif


    //printf("Combining derivatives\n");
    //this is not an accurate probability map:
    grey2Dfl* flflowy = floatImage(flowy);
    grey2Dfl* flflowx = floatImage(flowx);
    grey2Dfl* flow = multiplyImages(squareImage(flflowy), squareImage(flflowx));
    //printf("Dropping Correlations\n");
    freeImage(flowy);
    freeImage(flowx);
    freeImage(flflowy);
    freeImage(flflowx);

//#ifdef SAVE_INTERMEDIATE
    //The full flow image is the hardest to compute, and we can use it later to re-compute histograms
//    printFlow("/var/www/predictions/Fullflow.png", flow);
    printFlow(radar.flowfile, flow);
//#endif

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

        //printf("Calculating histograms\n");
        
        for(int i = 0; i<nPaths; i++){
            
            //printf("select a row of histogram %d\n", i);
            histoRow = histo[i]->row[t];
            //printf("histogram %d is %d by %d\n", i, histo[i]->width, histo[i]->height);
            
            
            //printf("calculate map offset\n");
            int userX = mapXpx(paths[i].lat, paths[i].lon, &radar);
            int userY = mapYpx(paths[i].lat, paths[i].lon, &radar);
            printf("using map offset %d, %d\n", userX, userY);

            //printf("Compute histogram\n");
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
        printf("printing histogram %d, %s\n", i, paths[i].name);
        printHistogram(paths[i].name, histo[i]);
    }

    return 0;
}


