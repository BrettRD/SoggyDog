/*
 *Indexes the imported image against a given colour map
 *The indexer should deal with all image nuances and formatting issues
 *
 *
 *
 */


 // the radar images from bom.gov.au come with a 16px banner that must be trimmed
const uint8_t cropBorder = 16;

//a colour map for the intensity colour chart
const uint8_t colour_map[] = {
      0,   0,   0,
    245, 245, 255,
    180, 180, 255,
    120, 120, 255,
     20,  20, 255,
      0, 216, 195,
      0, 150, 144,
      0, 102, 102,
    255, 255,   0,
    255, 200,   0,
    255, 150,   0,
    255, 100,   0,
    255,   0,   0,
    200,   0,   0,
    120,   0,   0,
     40,   0,   0
};

const uint8_t nColours = 16;




//index_colours uses colour_map to convert the 16 colours in the BOM pngs to 4-bit colour images
//uint8_t** index_colours(int height, int width, png_bytep* row_pointers);
grey2D8s* index_colours(char* file_name);

