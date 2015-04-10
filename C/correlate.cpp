#include "utilities.h"

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




