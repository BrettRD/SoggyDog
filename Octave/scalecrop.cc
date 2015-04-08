/*
This code scales an image using linear interpolation

Needs much more testing.

*/


#include <octave/oct.h>




float bound(float min, float val, float max){
  if(val<min) return min;
  if(val>max) return max;
  return val;
}



DEFUN_DLD (scalecrop, args, ,
  "change scale then crop")
{
  //octave_stdout << "Hello World\n";


  Matrix inpix = args(0).matrix_value();//matrix containing the original data (grey-scale floats)
  float sfactor = args(1).matrix_value()(0); //scale factor (float)
  ColumnVector finalSize = args(2).array_value(); //column vector containing the final image size
  ColumnVector location = args(3).vector_value ();//offset from centre (float)
  float locY = location(0);
  float locX = location(1);

  int sc_rows = ceil(inpix.rows() * sfactor);  //XXX
  int sc_cols = ceil(inpix.cols() * sfactor);
  int fn_rows = finalSize(0);
  int fn_cols = finalSize(1);
  Matrix outpix (fn_rows, fn_cols);
  //octave_stdout << fn_rows<< ", "<< fn_cols<<".\n";

  //octave_stdout << "point1\n";

  //this is from octave, probably need to subtract 1 from the row/col indexes.
  //bounds of filled output data
  //int croptop =  max( 0,          ceil(fn_rows/2) - ceil(sc_rows/2) + floor(locY)    );
  int croptop =  ceil(fn_rows/2) - ceil(sc_rows/2) + floor(locY);
  if(croptop < 0){
     croptop = 0;
  }
  //int cropbot =  min( fn_rows -1, ceil(fn_rows/2) + ceil(sc_rows/2) + floor(locY) -1 );
  int cropbot =  ceil(fn_rows/2) + ceil(sc_rows/2) + floor(locY) -1;
  if(cropbot > fn_rows -1){
     cropbot = fn_rows -1;
  }
  //octave_stdout <<cropbot << "cropbot\n";

  //int croplhs =  max( 0,          ceil(fn_cols/2) - ceil(sc_cols/2) + floor(locX)    );
  int croplhs =  ceil(fn_cols/2) - ceil(sc_cols/2) + floor(locX);
  if(croplhs < 0){
     croplhs = 0;
  }
  //int croprhs =  min( fn_cols -1, ceil(fn_cols/2) + ceil(sc_cols/2) + floor(locX) -1 );
  int croprhs =  ceil(fn_cols/2) + ceil(sc_cols/2) + floor(locX) -1;
  if(croprhs > fn_cols -1){
     croprhs = fn_cols -1;
  }
  //the bounds of the data from the scaled image
  //int scaltop =  max( 0,          ceil(sc_rows/2) - ceil(fn_rows/2) - floor(locY)    );
  int scaltop = ceil(sc_rows/2) - ceil(fn_rows/2) - floor(locY)   ;
  if(scaltop < 0){
     scaltop = 0;
  }  
  //int scalbot =  min( sc_rows -1, ceil(sc_rows/2) + ceil(fn_rows/2) - floor(locY) -1 );
  int scalbot = ceil(sc_rows/2) + ceil(fn_rows/2) - floor(locY) -1;
  if(scalbot > sc_rows -1){
     scalbot = sc_rows -1;
  }  
  //int scallhs =  max( 0,          ceil(sc_cols/2) - ceil(fn_cols/2) - floor(locX)    );
  int scallhs = ceil(sc_cols/2) - ceil(fn_cols/2) - floor(locX)   ;
  if(scallhs < 0){
     scallhs = 0;
  }  
  //int scalrhs =  min( sc_cols -1, ceil(sc_cols/2) + ceil(fn_cols/2) - floor(locX) -1 );
  int scalrhs = ceil(sc_cols/2) + ceil(fn_cols/2) - floor(locX) -1;
  if(scalrhs > sc_cols -1){
     scalrhs = sc_cols -1;
  }  
  //octave_stdout << "point2\n";
  //for all pixels in the output data (outrow = croptop:cropbot, outcol = croplhs:croprhs)
  for(int outrow = croptop; outrow <= cropbot; outrow++){
    //octave_stdout << "point3\n";
    for(int outcol = croplhs; outcol <= croprhs; outcol++){
      //outrow - (fn_rows/2) is the offset from the middle
      //need to find the {row,col} value in the original image (float) this will tell us which pixels to mix into the output.
      //map the four corners of the outpix into the inpix domain
      float intop = (outrow     - (fn_rows/2) + (sc_rows/2) -locY) / sfactor;
      float inbot = (outrow + 1 - (fn_rows/2) + (sc_rows/2) -locY) / sfactor;
      float inlhs = (outcol     - (fn_cols/2) + (sc_cols/2) -locX) / sfactor;
      float inrhs = (outcol + 1 - (fn_cols/2) + (sc_cols/2) -locX) / sfactor;
      outpix(outrow,outcol) = 0;

      //octave_stdout << outrow <<", "<< outcol << " point4\n";
      //octave_stdout << floor(intop) <<", "<< floor(inbot) << " row\n";
      //octave_stdout << inlhs <<", "<< inrhs << " col\n";


      //for all pixels defined in the current selection (inrow = floor(intop):floor(inbot), incol = floor(inlhs):floor(inrhs))
      for(int inrow=floor(intop); inrow<=floor(inbot); inrow++){

        //how much vertical overlap we have
        //equal to the one subtract the lack of overlap at the top, and the lack of overlap on the bottom.
        float rowfact = 1 - bound(0, (intop - inrow), 1)  - bound(0, ((inrow+1) - inbot), 1);
        //complicated term for row factor is required because sfactor can be greater than one and the outpix can be contained in one inpix

        for(int incol=floor(inlhs); incol<=floor(inrhs); incol++){

          //octave_stdout << inrow <<", "<< incol << " point5\n";


          //how much horizontal overlap we have
          //equal to the one subtract the lack of overlap on the left, and the lack of overlap on the right.
          float colfact = 1 - bound(0, (inlhs - incol), 1) - bound(0, ((incol+1) - inrhs), 1);

          int inrow_ex = bound(0, inrow, inpix.rows()-1);
          int incol_ex = bound(0, incol, inpix.cols()-1);
          //if(outrow>=300) octave_stdout << "boom\n";
          //if(inrow<0) octave_stdout << "boom\n";
          outpix(outrow,outcol) += inpix(inrow_ex, incol_ex) * rowfact * colfact; //sum into the output
        }
      }

      outpix(outrow,outcol) = outpix(outrow,outcol) / (sfactor * sfactor); //because.
    }
  }
  //octave_stdout << "point6\n";


  return octave_value(outpix);


//  ColumnVector dx (3);
//
//  ColumnVector x = args(0).vector_value ();
//
//  dx(0) = 77.27 * (x(1) - x(0)*x(1) + x(0)
//                   - 8.375e-06*pow (x(0), 2));
//
//  dx(1) = (x(2) - x(0)*x(1) - x(1)) / 77.27;
//
//  dx(2) = 0.161*(x(0) - x(2));
//
//  return octave_value (dx);
}
