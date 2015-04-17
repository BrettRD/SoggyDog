
#include "imagestructs.h"


grey2D8u * allocate_grey2D8u(int height, int width){
    
    grey2D8u* img = (grey2D8u*) malloc(sizeof(grey2D8u));
    img->width = width;
    img->height = height;

    img->row = (uint8_t**) malloc(sizeof(uint8_t*) * (img->height));
    if(img->row == NULL){
        return NULL;    //nothing more to do
    }
    for (int y=0; y<img->height; y++) {
        img->row[y] = (uint8_t*) malloc(sizeof(uint8_t) * (img->width));
        if(img->row[y] == NULL){ //clean up and return NULL
            img->height = y;
            freeImage(img);
            return NULL;
        }
    }
    return img;
}

grey2D8s * allocate_grey2D8s(int height, int width){
    
    grey2D8s* img = (grey2D8s*) malloc(sizeof(grey2D8s));
    img->width = width;
    img->height = height;

    img->row = (int8_t**) malloc(sizeof(int8_t*) * (img->height));
    if(img->row == NULL){
        return NULL;    //nothing more to do
    }
    for (int y=0; y<img->height; y++) {
        img->row[y] = (int8_t*) malloc(sizeof(int8_t) * (img->width));
        if(img->row[y] == NULL){ //clean up and return NULL
            img->height = y;
            freeImage(img);
            return NULL;
        }
    }
    return img;
}

grey2D32s * allocate_grey2D32s(int height, int width){
    
    grey2D32s* img = (grey2D32s*) malloc(sizeof(grey2D32s));
    img->width = width;
    img->height = height;

    img->row = (int32_t**) malloc(sizeof(int32_t*) * (img->height));
    if(img->row == NULL){
        return NULL;    //nothing more to do
    }
    for (int y=0; y<img->height; y++) {
        img->row[y] = (int32_t*) malloc(sizeof(int32_t) * (img->width));
        if(img->row[y] == NULL){ //clean up and return NULL
            img->height = y;
            freeImage(img);
            return NULL;
        }
    }
    return img;
}

grey2Dfl * allocate_grey2Dfl(int height, int width){
    
    grey2Dfl* img = (grey2Dfl*) malloc(sizeof(grey2Dfl));
    img->width = width;
    img->height = height;

    img->row = (float**) malloc(sizeof(float*) * (img->height));
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
        free(img->row[y]);
    }
    free(img->row);
    free(img);
}

void freeImage(grey2D8s* img){
    
    for(int y=0; y<img->height; y++){
        free(img->row[y]);
    }
    free(img->row);
    free(img);
}

void freeImage(grey2D32s* img){
    
    for(int y=0; y<img->height; y++){
        free(img->row[y]);
    }
    free(img->row);
    free(img);
}

void freeImage(grey2Dfl* img){
    
    for(int y=0; y<img->height; y++){
        free(img->row[y]);
    }
    free(img->row);
    free(img);
}