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

struct grey2D8u
{
    int height,
    int width,
    uint8_t** row
    //row[y] is the beginning of a row,
    //row[y][x] is a pixel
};
struct grey2Dfl
{
    int height,
    int width,
    float** row
    //row[y] is the beginning of a row,
    //row[y][x] is a pixel
};

grey2D8u * allocate_grey2D8u(height, width){
    
    grey2D8u* img = (grey2D8u*) malloc(sizeof(grey2D8u));
    img->width = width;
    img->height = height;

    uint8_t** img->row = malloc(sizeof(uint8_t*) * img->height);
    if(img->row == NULL){
        return NULL;    //nothing more to do
    }
    for (int y=0; y<img->height; y++) {
        img->row[y] = (uint8_t*) malloc(sizeof(uint8_t) * img->width);
        if(img->row[y] == NULL){ //clean up and return NULL
            img->height = y;
            freeImage(img);
            return NULL;
        }
    }
    return img;
}
grey2Dfl * allocate_grey2Dfl(height, width){
    
    grey2Dfl* img = (grey2Dfl*) malloc(sizeof(grey2Dfl));
    img->width = width;
    img->height = height;

    float** img->row = malloc(sizeof(float*) * img->height);
    if(img->row == NULL){
        return NULL;    //nothing more to do
    }
    for (int y=0; y<img->height; y++) {
        img->row[y] = (float*) malloc(sizeof(float) * img->width);
        if(img->row[y] == NULL){ //clean up and return NULL
            img->height = y;
            freeImage(img);
            return NULL;
        }
    }
    return img;
}

void freeImage(grey2D8u* img){
    
    for(int y=0; y<img->height; y++){
        free(img.row[y])
    }
    free(img.row)
    free(img)
}
void freeImage(grey2Dfl* img){
    
    for(int y=0; y<img->height; y++){
        free(img.row[y])
    }
    free(img.row)
    free(img)
}


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

grey2Dfl* correlate(grey2D8s* imgA, grey2D8s* imgB){
    //needs to produce floats, but will need to fork out the additions in a tree to maintain comparable sizes.
    //make an image of the correct size (width*2 -2, height*2-2)
    grey2Dfl* imgC = allocate_grey2Dfl(imgA->height + imgB->height -2, imgA->width + imgB->width -2)
    imgC->height = imgA->height + imgB->height -2;
    imgC->width = imgA->width + imgB->width -2;

    for(int offx=0; offx<(imgC->width); offx++){
        for(int offy=0; offy<(imgC->height); offy++){
            imgC->row[offy][offx] = dotProd(imgA, imgB, offx-(imgA->width-1), offy-(imgA->height-1) );
        }
    }
    return imgC;
}

float dotProd(grey2D8s* imgA, grey2D8s* imgB, int offx, int offy){
    //calculate the size of the block that actually overlaps
    int width;
    int Aoffx;
    int Boffx;
    if(offx<0){
        Aoffx = -offx;
        Boffx = 0;
        width = imgA->width - Aoffx;
        if(imgB->width < width) width = imgB->width;
    }else{
        Aoffx = 0;
        Boffx = offx;
        width= imgB->width - Boffx;
        if(imgA->width < width) width = imgA->width;
    }
    if(width<=0) return 0;

    int height;
    int Aoffy;
    int Boffy;
    if(offy<0){
        Aoffy = -offy;
        Boffy = 0;
        height = imgA->height - Aoffy;
        if(imgB->height < height) height = imgB->height;
    }else{
        Aoffy = 0;
        Boffy = offy;
        height= imgB->height - Boffy;
        if(imgA->height < height) height = imgA->height;
    }
    if(height<=0) return 0;

    float tmpRow[width];
    float tmpCol[height];
    int Ay;  // y offset into imageA
    int By;  // y offset into imageB
    int Ax;  // x offset into imageA
    int Bx;  // x offset into imageB
    for(int y=0;y<height; y++){
        Ay = y+Aoffy;
        By = y+Boffy;
        for(int x=0; x<width; x++){
            Ax = x+Aoffx;
            Bx = x+Boffx;
            tmpRow[x] = imgA[Ay][Ax] * imgB[By][Bx];
        }
        tmpCol[y] = sumfloats(tmpRow, width);
    }
    return sumfloats(tmpCol, height);
}




//destructively sum an array of floats in a binary tree.
//adding a number less than the current resolution makes rounding errors. this should help.
float sumfloats(float* data, num){
    for(int d=1; d<num; d*=2){
        for(int i=0; i+d<num; i+=2*d){
            data[i] += data[i+d];
        }
    }
}
