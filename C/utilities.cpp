
#include "utilities.h"

//destructively sum an array of floats in a binary tree.
//adding a number less than the current resolution makes rounding errors. this should help.
//ideally, this would sum the numbers with smallest mantissaas first.
float sumfloats(float* data, int num){
    for(int d=1; d<num; d*=2){
        for(int i=0; i+d<num; i+=2*d){
            data[i] += data[i+d];
        }
    }
}
