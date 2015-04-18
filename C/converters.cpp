#include "utilities.h"

grey2D8u* rescale(grey2D8u* img, float mult, float offset){
    grey2D8u* outimg = allocate_grey2D8u(img->height, img->width);
    for(int y = 0; y<img->height; y++){
        for(int x=0;x<img->width; x++){
            outimg->row[y][x] = (img->row[y][x]+offset)*(mult);
        }
    }
    return outimg;
}

grey2D8s* rescale(grey2D8s* img, float mult, float offset){
    grey2D8s* outimg = allocate_grey2D8s(img->height, img->width);
    for(int y = 0; y<img->height; y++){
        for(int x=0;x<img->width; x++){
            outimg->row[y][x] = (img->row[y][x]+offset)*(mult);
        }
    }
    return outimg;
}

grey2D32s* rescale(grey2D32s* img, float mult, float offset){
    grey2D32s* outimg = allocate_grey2D32s(img->height, img->width);
    for(int y = 0; y<img->height; y++){
        for(int x=0;x<img->width; x++){
            outimg->row[y][x] = (img->row[y][x]+offset)*(mult);
        }
    }
    return outimg;
}

grey2Dfl* rescale(grey2Dfl* img, float mult, float offset){
    grey2Dfl* outimg = allocate_grey2Dfl(img->height, img->width);
    for(int y = 0; y<img->height; y++){
        for(int x=0;x<img->width; x++){
            outimg->row[y][x] = (img->row[y][x]+offset)*(mult);
        }
    }
    return outimg;
}


//flatten the image to 8bits rescaling 
//grey2D8u* flatten(grey2D8u* img){
//    grey2D8u* outimg = allocate_grey2D8u(img->height, img->width);
//    for(int y = 0; y<img->height; y++){
//        for(int x=0;x<img->width; x++){
//            outimg->row[y][x] = img->row[y][x];
//        }
//    }
//    return outimg;
//}

grey2D8u* flatten(grey2D8s* img){
    grey2D8u* outimg = allocate_grey2D8u(img->height, img->width);
    for(int y = 0; y<img->height; y++){
        for(int x=0;x<img->width; x++){
            outimg->row[y][x] = (int)img->row[y][x]+128;
        }
    }
    return outimg;
}

grey2D8u* flatten(grey2D32s* img){
    grey2D8u* outimg = allocate_grey2D8u(img->height, img->width);
    for(int y = 0; y<img->height; y++){
        for(int x=0;x<img->width; x++){
            outimg->row[y][x] = img->row[y][x]>>24;
        }
    }
    return outimg;
}

grey2D8u* flatten(grey2Dfl* img){
    grey2D8u* outimg = allocate_grey2D8u(img->height, img->width);
    for(int y = 0; y<img->height; y++){
        for(int x=0;x<img->width; x++){
            outimg->row[y][x] = img->row[y][x]*255;
        }
    }
    return outimg;
}





uint8_t* minmax(grey2D8u* img){
    static uint8_t extrema[2];
    extrema[0] = img->row[0][0];
    extrema[1] = img->row[0][0];
    for(int y = 0; y<img->height; y++){
        for(int x = 0; x < img->width; x++){
            if(img->row[y][x] < extrema[0]) extrema[0] = img->row[y][x];
            if(img->row[y][x] > extrema[1]) extrema[1] = img->row[y][x];
        }
    }
}
int8_t* minmax(grey2D8s* img){
    static int8_t extrema[2];
    extrema[0] = img->row[0][0];
    extrema[1] = img->row[0][0];
    for(int y = 0; y<img->height; y++){
        for(int x = 0; x < img->width; x++){
            if(img->row[y][x] < extrema[0]) extrema[0] = img->row[y][x];
            if(img->row[y][x] > extrema[1]) extrema[1] = img->row[y][x];
        }
    }
}
int32_t* minmax(grey2D32s* img){
    static int32_t extrema[2];
    extrema[0] = img->row[0][0];
    extrema[1] = img->row[0][0];
    for(int y = 0; y<img->height; y++){
        for(int x = 0; x < img->width; x++){
            if(img->row[y][x] < extrema[0]) extrema[0] = img->row[y][x];
            if(img->row[y][x] > extrema[1]) extrema[1] = img->row[y][x];
        }
    }
}
float* minmax(grey2Dfl* img){
    static float extrema[2];
    extrema[0] = img->row[0][0];
    extrema[1] = img->row[0][0];
    for(int y = 0; y<img->height; y++){
        for(int x = 0; x < img->width; x++){
            if(img->row[y][x] < extrema[0]) extrema[0] = img->row[y][x];
            if(img->row[y][x] > extrema[1]) extrema[1] = img->row[y][x];
        }
    }
}
