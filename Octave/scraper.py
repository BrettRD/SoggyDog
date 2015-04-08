#!/usr/bin/python
import os
import json
import requests
from datetime import datetime, date, time
from pprint import pprint

#information about the radar sites:
sitesFile = "Sites.json"

with open(sitesFile) as sitesJson:
    sites = json.loads(sitesJson.read())
#pprint(sites)


for location in sites['sites']:
    print(location['name'])
    print("lat: " , location['lat'])
    print("lon: " , location['lon'])
    for loops in location['loops']:
        print(loops['prefix'])
        print(loops['URL'])

        #break it up into folders
        saveDir=location['name'] + "/" + loops['prefix'] + "/"
        if not os.path.exists(saveDir):
            os.makedirs(saveDir)

        #fetch the BOM live web-page
        RadarHTML = requests.get(loops['URL'])
        
        #scrape the image URLs from the formatting
        imageUrls = []
        for item in RadarHTML.text.split("\n"):
            if "theImageNames[" in item:
                imageUrls.append(item.split("\"")[1])

        #download the images
        for imageUrl in imageUrls:
            print(imageUrl)
            path = saveDir + imageUrl.split(".")[5] + ".png"
            print(path)

            #only download each one once
            if not os.path.exists(path):
                print("downloading")
                #file(filename, 'w').close()
                r = requests.get(imageUrl, stream=True)
                if r.status_code == 200:
                    with open(path, 'wb') as f:
                        for chunk in r.iter_content():
                            f.write(chunk)
            else:
                print("skipping")
        
        
exit(0)