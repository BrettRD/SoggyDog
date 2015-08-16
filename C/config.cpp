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
#include "rapidjson/document.h"
#include "rapidjson/writer.h"
#include "rapidjson/stringbuffer.h"
#include "rapidjson/filereadstream.h"
#include <iostream>
using namespace rapidjson;
void readSites(char* filename, Radar* radar){

	FILE* pFile = fopen(filename, "rb");
	char buffer[65536];
	FileReadStream is(pFile, buffer, sizeof(buffer));
	Document document;
	document.ParseStream<0, UTF8<>, FileReadStream>(is);

	assert(document.HasMember("Site"));
	const Value& site = document["Site"];
	assert(site.IsObject());

	assert(site.HasMember("range"));
	assert(site.HasMember("Lat"));
	assert(site.HasMember("Lon"));
	assert(site.HasMember("period"));

	assert(site["range"].IsNumber());
	assert(site["Lat"].IsNumber());
	assert(site["Lon"].IsNumber());
	assert(site["period"].IsNumber());

	radar->range = site["range"].GetDouble();
	radar->lat = site["Lat"].GetDouble();
	radar->lon = site["Lon"].GetDouble();
	radar->period = site["period"].GetDouble();
}

Path* readPaths(char* filename, int* nPaths){

	FILE* pFile = fopen(filename, "rb");
	char buffer[65536];
	FileReadStream is(pFile, buffer, sizeof(buffer));
	Document document;
	document.ParseStream<0, UTF8<>, FileReadStream>(is);

	assert(document.HasMember("Paths"));
	const Value& jsonPath = document["Paths"];
	assert(jsonPath.IsArray());

	*nPaths = jsonPath.Size();
	Path* paths = (Path*) malloc(sizeof(Path) * *nPaths);
	if(paths == NULL) abort_("Could not allocate Paths");
	for(int i=0; i<*nPaths; i++){
		assert(jsonPath[i].HasMember("OutFile"));
		assert(jsonPath[i].HasMember("Lat"));
		assert(jsonPath[i].HasMember("Lon"));

		assert(jsonPath[i]["OutFile"].IsString());
		assert(jsonPath[i]["Lat"].IsNumber());
		assert(jsonPath[i]["Lon"].IsNumber());

		//paths[i].name = jsonPath[i]["name"].GetString();	//REALLY DOESN'T WORK!
		const char* c = jsonPath[i]["OutFile"].GetString();		//tmp value
		paths[i].name = strcpy((char*)malloc(strlen(c)+1), c);
		
		paths[i].lat = jsonPath[i]["Lat"].GetDouble();
		paths[i].lon = jsonPath[i]["Lon"].GetDouble();

		//printf("name = %s\n", paths[i].name);
		//printf("lat = %g\n", paths[i].lat);
		//printf("lon = %g\n", paths[i].lon);
	}

	return paths;
}

void readConf(char* filename, Prediction* config){

	FILE* pFile = fopen(filename, "rb");
	char buffer[65536];
	FileReadStream is(pFile, buffer, sizeof(buffer));
	Document document;
	document.ParseStream<0, UTF8<>, FileReadStream>(is);

	assert(document.HasMember("Conf"));
	const Value& conf = document["Conf"];
	assert(conf.IsObject());
	
	assert(conf.HasMember("stepCount"));
	assert(conf.HasMember("stepPeriod"));
	assert(conf.HasMember("maxSpeed"));

	assert(conf["stepCount"].IsUint());
	assert(conf["stepPeriod"].IsUint());
	assert(conf["maxSpeed"].IsNumber());

	config->stepcount = conf["stepCount"].GetUint();	//minutes
	config->stepPeriod = conf["stepPeriod"].GetUint(); //minute
	config->maxSpeed = conf["maxSpeed"].GetDouble();	//km/h
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
