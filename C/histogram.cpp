

#include "utilities.h"

void histogram(grey2Dfl* greyimg, grey2D8s* binimg, int offx, int offy, uint8_t* outBins){
	//similar to the dot product, but binning instead

    //calculate the size of the block that actually overlaps
    int width;
    int Aoffx;
    int Boffx;
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
    //if(width<=0) return 0;

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
    //if(height<=0) return 0;

    int Ay;  // y offset into imageA
    int By;  // y offset into imageB
    int Ax;  // x offset into imageA
    int Bx;  // x offset into imageB



	/*
    float* tmpRow[nColours];
    for(int i=0;i<nColours;i++){
    	tmpRow[i] = (float*) malloc(sizeof(float) * width);
    }
	*/

    float* tmpCol[nColours];
    for(int i=0;i<nColours;i++){
    	tmpCol[i] = (float*) malloc(sizeof(float) * height);
    }

    float tmpRow[width];
    float* bins[nColours+1] = {tmpRow};
    int binsize[nColours+1] = {0};
    int colbinsize[nColours] = {0};

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

            /*
            //seperate into bins
            int bin = binimg->row[By][Bx];	//the colour we're looking at.
            if((bin<0) || (bin>=nColours)) abort_("histogram encountered a colour not associated with a bin.");
            tmpRow[bin][binsize[bin]++] = greyimg->row[Ay][Ax];
        	*/

        	//this could actually be performed into a single array of size width, kind of like an insertion sort.
        	///*
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

       	    binsize[bin]++;	//so we can tell how many to sum later

            //print the contents of the bins
            for (int tcols = 0; tcols < nColours; ++tcols)
            {
                printf("x=%d, y=%d, bin %d has:", x, y, tcols);
                for (int binele = 0; binele < binsize[tcols]; ++binele)
                {
                    printf(" %f,", bins[tcols][binele]);
                }
                printf("\n");
            }

        }
        /*
	    for(int bin=0;bin<nColours;bin++){
    	    tmpCol[bin][y] = sumfloats(tmpRow[bin], binsize[bin]);
    	}
    	*/
    	for(int bin=0;bin<nColours;bin++){
    		if(binsize[bin]>0){
        		tmpCol[bin][colbinsize[bin]++] = sumfloats(bins[bin], binsize[bin]);
    		}
    	}


    }
	for(int bin=0;bin<nColours;bin++){
    	outBins[bin] = 255*sumfloats(tmpCol[bin], colbinsize[bin]);
    	//free(tmpRow[bin]);
    	free(tmpCol[bin]);
    }


}