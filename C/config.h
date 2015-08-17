/*
 *Read config files
 * -Radar installation parameters (GPS location, Km/pix, measurement period)
 * -users' position(s)
 * Will try to use rapidJSON for web compatibility, may end up with another script sanitising the inputs. (string parsing in C. Bleh.)
 * 
 *
 *
 */
#ifndef CONFIG_H
#define CONFIG_H
#include <stdlib.h>
#include <stdint.h>
#include "utilities.h"
//store settings about how to run the prediction.
struct Prediction
{
	int stepcount;
	int stepPeriod;
	float maxSpeed;
	//int period = 10;  //the period of the source image samples (in minutes)
	
};


//store the location of interest (change this to a moving target)
struct Path
{
	const char* name;
	float lat;	//these can be turned into arrays.
	float lon;	// not quite sure how best to treat them.
};



//Relevant parameters about the radar installation.
struct Radar
{
	float range;
	float lat;
	float lon;
	float period;
	const char* flowfile;
//serpentine
//float range = 128;  //the range of the image 
//float mapLat = -32.3917;	//latitude of the map centre
//float mapLon = 115.8669;	//longitude of the map centre
//float kmPerPixel = range / 256; //see IDR.loop.v12.0.js line 1168

};





const float kmPerDeg = 111.2;
/*Finding your image offset from your latitude and longitude
//js from the BOM page
function getMapY(lat, yKm) {
    var mapy = (100 * lat)+(yKm / 1.1111);
    return mapy;
}

function getMapX(lon, xKm, yKm, mapy) {
    var mapx = (100 * lon)+(xKm / (1.1111 * Math.cos(mapy / 5729)));
    return mapx;
}
*/




//int steps = 30;//the number of steps in the histogram (in minutes)

const float maxWindSpeed = 300;  //km per hour

int flowSize(Radar* radar, Prediction* config);

void readSites(char* filename, Radar* radar);
Path* readPaths(char* filename, int* nPaths);
void readConf(char* filename, Prediction* config);

int mapYpx(float lat, float lon, Radar* radar);
int mapXpx(float lat, float lon, Radar* radar);
float kmPerPixel(float range);



#endif
