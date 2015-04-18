#include "utilities.h"

grey2D32s* correlate(grey2D8s* imgA, grey2D8s* imgB){
    //needs to produce floats, but will need to fork out the additions in a tree to maintain comparable sizes.
    //make an image of the correct size (width*2 -2, height*2-2)

    grey2D32s* imgC = allocate_grey2D32s(imgA->height + imgB->height -2, imgA->width + imgB->width -2);

    for(int offx=0; offx<(imgC->width); offx++){
        //printf("Starting col %d of %d\n", offx, imgC->width);
        for(int offy=0; offy<(imgC->height); offy++){
            //printf("Starting row %d\n", offy);

            imgC->row[offy][offx] = dotProd(imgA, imgB, offx-(imgA->width-1), offy-(imgA->height-1) );
            //printf("Flow values at %d, %d is:%d\n", offy, offx, imgC->row[offy][offx]);
        }
    }
    return imgC;
}



// equivalent to octave's filter2 with 'valid'
grey2D8s* derivative(grey2D8s* img, grey2D8s* kernel){

    grey2D8s* imgC = allocate_grey2D8s(img->height - kernel->height +1, img->width - kernel->width +1);
    imgC->height = img->height - kernel->height +1;
    imgC->width = img->width - kernel->width +1;

    for(int offx=0; offx<(imgC->width); offx++){
        for(int offy=0; offy<(imgC->height); offy++){\
            //do the 32b->8b down conversion quietly
            imgC->row[offy][offx] = dotProd(img, kernel, offx-(img->width-1), offy-(img->height-1) );
        }
    }
    return imgC;
}