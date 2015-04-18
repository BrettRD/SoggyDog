

grey2D8u* rescale(grey2D8u* img, float mult, float offset);
grey2D8s* rescale(grey2D8s* img, float mult, float offset);
grey2D32s* rescale(grey2D32s* img, int32_t mult, int32_t offset);
grey2Dfl* rescale(grey2Dfl* img, float mult, float offset);

//flatten the image into 8bit
//grey2D8u* flatten(grey2D8u* img);
grey2D8u* flatten(grey2D8s* img);
grey2D8u* flatten(grey2D32s* img);
grey2D8u* flatten(grey2Dfl* img);

//return the min and max of the images
uint8_t* minmax(grey2D8u* img);
int8_t* minmax(grey2D8s* img);
int32_t* minmax(grey2D32s* img);
float* minmax(grey2Dfl* img);