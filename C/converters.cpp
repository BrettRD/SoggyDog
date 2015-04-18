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
            outimg->row[y][x] = ((float)(img->row[y][x])+offset)*(mult);
        }
    }
    return outimg;
}

grey2D32s* rescale(grey2D32s* img, float mult, float offset){
    grey2D32s* outimg = allocate_grey2D32s(img->height, img->width);
    for(int y = 0; y<img->height; y++){
        for(int x=0;x<img->width; x++){
            outimg->row[y][x] = ((float)(img->row[y][x])+offset)*(mult);
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
            outimg->row[y][x] = 128 +((int32_t)(img->row[y][x])>>24);
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





uint8_t min(grey2D8u* img){
    uint8_t extrema;
    extrema = img->row[0][0];
    for(int y = 0; y<img->height; y++){
        for(int x = 0; x < img->width; x++){
            if(img->row[y][x] < extrema) extrema = img->row[y][x];
        }
    }
    return extrema;
}
int8_t min(grey2D8s* img){
    int8_t extrema;
    extrema = img->row[0][0];
    for(int y = 0; y<img->height; y++){
        for(int x = 0; x < img->width; x++){
            if(img->row[y][x] < extrema) extrema = img->row[y][x];
        }
    }
    return extrema;
}
int32_t min(grey2D32s* img){
    int32_t extrema;
    extrema = img->row[0][0];
    for(int y = 0; y < img->height; y++){
        for(int x = 0; x < img->width; x++){
            if(img->row[y][x] < extrema) extrema = img->row[y][x];
        }
    }
    return extrema;
}
float min(grey2Dfl* img){
    float extrema;
    extrema = img->row[0][0];
    for(int y = 0; y<img->height; y++){
        for(int x = 0; x < img->width; x++){
            if(img->row[y][x] < extrema) extrema = img->row[y][x];
        }
    }
    return extrema;
}

uint8_t max(grey2D8u* img){
    uint8_t extrema;
    extrema = img->row[0][0];
    for(int y = 0; y<img->height; y++){
        for(int x = 0; x < img->width; x++){
            if(img->row[y][x] > extrema) extrema = img->row[y][x];
        }
    }
    return extrema;
}
int8_t max(grey2D8s* img){
    int8_t extrema;
    extrema = img->row[0][0];
    for(int y = 0; y<img->height; y++){
        for(int x = 0; x < img->width; x++){
            if(img->row[y][x] > extrema) extrema = img->row[y][x];
        }
    }
    return extrema;
}
int32_t max(grey2D32s* img){
    int32_t extrema;
    extrema = img->row[0][0];
    for(int y = 0; y < img->height; y++){
        for(int x = 0; x < img->width; x++){
            if(img->row[y][x] > extrema) extrema = img->row[y][x];
        }
    }
    return extrema;
}
float max(grey2Dfl* img){
    float extrema;
    extrema = img->row[0][0];
    for(int y = 0; y<img->height; y++){
        for(int x = 0; x < img->width; x++){
            if(img->row[y][x] > extrema) extrema = img->row[y][x];
        }
    }
    return extrema;
}


