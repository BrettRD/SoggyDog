#ifndef CONVERTERS_H
#define CONVERTERS_H

grey2D8u* rescale(grey2D8u* img, float mult, float offset);
grey2D8s* rescale(grey2D8s* img, float mult, float offset);
grey2D32s* rescale(grey2D32s* img, float mult, float offset);
grey2Dfl* rescale(grey2Dfl* img, float mult, float offset);

//flatten the image into 8bit
//grey2D8u* flatten(grey2D8u* img);
grey2D8u* flatten(grey2D8s* img);
grey2D8u* flatten(grey2D32s* img);
grey2D8u* flatten(grey2Dfl* img);

//return the min and max of the images
uint8_t min(grey2D8u* img);
int8_t min(grey2D8s* img);
int32_t min(grey2D32s* img);
float min(grey2Dfl* img);

uint8_t max(grey2D8u* img);
int8_t max(grey2D8s* img);
int32_t max(grey2D32s* img);
float max(grey2Dfl* img);
#endif