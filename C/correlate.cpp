#include "utilities.h"

grey2Dfl* correlate(grey2D8s* imgA, grey2D8s* imgB,){
    //needs to produce floats, but will need to fork out the additions in a tree to maintain comparable sizes.
    //make an image of the correct size (width*2 -2, height*2-2)
    grey2Dfl* imgC = allocate_grey2Dfl(imgA->height + imgB->height -2, imgA->width + imgB->width -2);
    imgC->height = imgA->height + imgB->height -2;
    imgC->width = imgA->width + imgB->width -2;

    for(int offx=0; offx<(imgC->width); offx++){
        for(int offy=0; offy<(imgC->height); offy++){
            imgC->row[offy][offx] = dotProd(imgA, imgB, offx-(imgA->width-1), offy-(imgA->height-1) );
        }
    }
    return imgC;
}



// equivalent to octave's filter2 with 'valid'
grey2D8s* derivative(grey2D8u* img, grey2D8s* kernel){

    grey2D8s* imgC = allocate_grey2D8s(img->height - kernel->height +1, img->width - kernel->width +1);
    imgC->height = img->height - kernel->height +1;
    imgC->width = img->width - kernel->width +1;

    for(int offx=0; offx<(imgC->width); offx++){
        for(int offy=0; offy<(imgC->height); offy++){
            imgC->row[offy][offx] = dotProd(img, kernel, offx-(img->width-1), offy-(img->height-1) );
        }
    }
    return imgC;
}