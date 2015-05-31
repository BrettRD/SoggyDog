/*
 *Read config files
 * -Radar installation parameters (GPS location, Km/pix, measurement period)
 * -users' position(s)
 * Will try to use rapidJSON for web compatibility, may end up with another script sanitising the inputs. (string parsing in C. Bleh.)
 * 
 *
 *
 */

//The radar web pages have the parameters for each site encoded on the individual web pages, and they don't contain update rate data.
//For the sake of my own sanity, I'm going to encode the same information in a JSON doc, including period info.
//It might be worth using the time-stamp on the images for the period.

#include "config.h"

void readSites(char* filename, Radar* radar){
	radar->range = 128;
	radar->lat = -32.3917;	
	radar->lon = 115.8669;	
	radar->period = 10;
}

Path* readPaths(char* filename, int* nPaths){
	*nPaths = 2;
	Path* paths = (Path*) malloc(sizeof(Path) * *nPaths);
	if(paths == NULL) abort_("Could not allocate Paths");
	paths[0].name = "histogram.png";
	paths[0].lat = -32.3;	
	paths[0].lon = 116.1;	
	paths[1].name = "histo2.png";
	paths[1].lat = -32.3;	
	paths[1].lon = 116.1;	
	return paths;
}

void readConf(char* filename, Prediction* config){
	config->stepcount = 30;	//minutes
	config->stepPeriod = 1; //minute
	config->maxSpeed = 150;	//km/h
}

    //pixel location from lat/long

int mapXpx(float lat, float lon, Radar* radar){
	return (kmPerDeg * (lon-radar->lon)* cos(lat*0.0174532)) / kmPerPixel(radar->range);
    //return (kmPerDeg * (lon-mapLon)* cos(lat*0.0174532)) / kmPerPixel;
}
int mapYpx(float lat, float lon, Radar* radar){
    return (kmPerDeg * (lat-radar->lat)) / kmPerPixel(radar->range);
}
float kmPerPixel(float range){
	return range / 256;	//see IDR.loop.v12.0.js line 1168
}

int flowSize(Radar* radar, Prediction* config){
	return 2 * ceil((config->maxSpeed / kmPerPixel(radar->range)) * (radar->period/60.0));// the number of pixels something can move at the max speed.
}