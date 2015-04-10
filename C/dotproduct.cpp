#include "utilities.h"

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
            tmpRow[x] = imgA->row[Ay][Ax] * imgB->row[By][Bx];
        }
        tmpCol[y] = sumfloats(tmpRow, width);
    }
    return sumfloats(tmpCol, height);
}
