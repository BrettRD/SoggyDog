SoggyDog
=============

In Perth, if you don't like the weather, wait five minutes.

This is a piece of software to predict what the local weather is about to do in the very near future (15-30mins) using optical flow and statistics.

Essentially, it uses the two latest radar images to estimate the cloud velocity then uses that velocity to march the latest image forward by however much time to see if you're about to get rained on.
    See Rainparrot (govhack2014) for that exact implementation.


This software attempts to make sense of noisy data, and present something that carries the uncertainty of the prediction.
The outputs have arbitrarily fine temporal resolution, and spatial resolution matching the resolution of the original radar scans.

### The Octave Folder
The octave folder contains the old code base, this software can be made to work, but it's certainly not production ready.

    ./CliLink IDR703.T.201407151240.png IDR703.T.201407151230.png users


### The C folder

The C folder contains the port to C, along with improved flexibility and probably broken memory management.
It uses rapidjson, copy include/rapidjson into the C folder to compile (as per instructions from https://github.com/miloyip/rapidjson)

Performance was interesing, a simple (naive) image convolution takes O(n^4), octave uses fourier methods now so it runs at O(n^3 log(n)).  Cropping the convolution to physically plausible ranges, it runs much faster than the octave script. There is still plenty of room for improvement.

The location of the radar installation, the users (and their names), and the prediction settings are stored in Paths.json
This is all going alongside a small python script to pull down the latest images.

I might one day port to OpenCL, but I'm running this on a Raspberry Pi 2 so there's no point yet. (273 seconds execution time on one core)

Patches Welcome.
