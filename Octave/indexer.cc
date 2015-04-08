#include <octave/oct.h>

DEFUN_DLD (indexer, args, ,
  "index a colour coded image")
{
  //ColumnVector dx (3);
  octave_stdout << "Hello World\n";


  uint8NDArray Colour = args(0).array_value ();
  uint8NDArray ColMap = args(1).array_value ();

  int numDims = Colour.ndims();
  dim_vector matSize = Colour.dims();

  for(int i=0; i<numDims; i++){
    octave_stdout << matSize(i) << "mat\n";
  }

  int numColDims = ColMap.ndims();
  dim_vector numCols = ColMap.dims();

  for(int i=0; i<numColDims; i++){
   octave_stdout << numCols(i) << "cols\n";
  } 

  if(matSize(2) != numCols(1)){
    print_usage();
  }


  Matrix Grey (matSize(0), matSize(1));

  for(int row = 0; row<matSize(0); row++){
    for(int col = 0; col<matSize(1); col++){
      int testCol = 0;
      while(testCol < numCols(0)){
        int cha = 0;
        while((cha < matSize(2)) && (Colour(row,col,cha) == ColMap(testCol,cha))){
          cha++;
        }

        testCol++;  //increment before writing to suit octave "1" index

        if(cha == matSize(2)){
          Grey(row, col) = testCol;
        }
      }
    }
  }


  //dx(0) = matSize(0);
  //dx(1) = matSize(1);
  //dx(2) = matSize(2);

  return octave_value (Grey);
}