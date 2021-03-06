

#include "utilities.h"

void histogram(grey2Dfl* greyimg, grey2D8s* binimg, int offx, int offy, uint8_t* outBins){
	//similar to the dot product, but binning instead

    //calculate the size of the block that actually overlaps
    int width;
    int Aoffx;
    int Boffx;
    offy += (binimg->height -greyimg->height)/2;
    offx += (binimg->width -greyimg->width)/2;

    if(offx<0){
        Aoffx = -offx;
        Boffx = 0;
        width = greyimg->width - Aoffx;
        if(binimg->width < width) width = binimg->width;
    }else{
        Aoffx = 0;
        Boffx = offx;
        width= binimg->width - Boffx;
        if(greyimg->width < width) width = greyimg->width;
    }
    if(width<=0){
        printf("Oops! Computing histogram way out of bounds");
        for(int bin=0;bin<nColours;bin++){
            outBins[bin] = 0;
        }
        return;
    }

    int height;
    int Aoffy;
    int Boffy;
    if(offy<0){
        Aoffy = -offy;
        Boffy = 0;
        height = greyimg->height - Aoffy;
        if(binimg->height < height) height = binimg->height;
    }else{
        Aoffy = 0;
        Boffy = offy;
        height= binimg->height - Boffy;
        if(greyimg->height < height) height = greyimg->height;
    }
    if(height<=0) {
        printf("Oops! Computing histogram way out of bounds\n");
        for(int bin=0;bin<nColours;bin++){
            outBins[bin] = 0;
        }
        return;
    }

    int Ay;  // y offset into imageA
    int By;  // y offset into imageB
    int Ax;  // x offset into imageA
    int Bx;  // x offset into imageB


    float* tmpCol[nColours];
    int colbinsize[nColours];
    
    float tmpRow[width];
    int binsize[nColours+1];    //initialised every loop
    float* bins[nColours+1];
    //initialise the above
    for(int i=0;i<nColours;i++){
        tmpCol[i] = (float*) malloc(sizeof(float) * height);
        colbinsize[i] = 0;
    }



    for(int y=0;y<height; y++){
        Ay = y+Aoffy;
        By = y+Boffy;
        //reset the bins
        for(int i=0; i<(nColours+1);i++){
            binsize[i] = 0;
            bins[i] = tmpRow;
        }

        for(int x=0; x<width; x++){
            Ax = x+Aoffx;
            Bx = x+Boffx;

        	//collect the row into bins, kind of like an insertion sort.
			int bin = binimg->row[By][Bx];	//the colour we're looking at.
        	if((bin<0) || (bin>=nColours)){
                printf("WTF is colour %d?\n", bin);
                abort_("histogram encountered a colour not associated with a bin.");
            }
            //printf("insert, rotate %d\n", bin);
            for(int i=nColours; i>=bin+1; i--){
                bins[i][0] = bins[i-1][0];   //rotate the data forward
                bins[i] = &bins[i][1];
            }
            bins[bin][0] = greyimg->row[Ay][Ax];	//the end of the correct bin = start of the next
            //printf("added %f to bin %d\n", greyimg->row[Ay][Ax], bin);
       	    binsize[bin]++;	//so we can tell how many to sum later

        }

    	for(int bin=0;bin<nColours;bin++){
    		if(binsize[bin]>0){
                float binsum = sumfloats(bins[bin], binsize[bin]);
                //printf("added %f to bin %d\n", binsum, bin);
                tmpCol[bin][colbinsize[bin]++] = binsum;
    		}
    	}

    }
    int histogramTotal = -255;
    for(int bin=0;bin<nColours;bin++){
        outBins[bin] = 255*sumfloats(tmpCol[bin], colbinsize[bin]);
        free(tmpCol[bin]);
        histogramTotal += outBins[bin];
        //free(tmpRow[bin]);
    }
    //distribute the uncertainty among the bins
//    for(int bin=0;bin<nColours;bin++){
//        outBins[bin] -= histogramTotal/nColours;
//    }



}
