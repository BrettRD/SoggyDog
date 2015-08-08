

all: SoggyDog

SoggyDog: config.o indexer.o converters.o writeImage.o histogram.o imagestructs.o dotproduct.o correlate.o utilities.o main.o
	g++ -g -lpng main.o config.o indexer.o converters.o writeImage.o histogram.o imagestructs.o dotproduct.o correlate.o utilities.o -o SoggyDog -pthread -std=c++0x

main.o: main.cpp
	g++ -g -c main.cpp -pthread -std=c++0x

imagestructs.o: imagestructs.cpp
	g++ -g -c imagestructs.cpp

dotproduct.o: dotproduct.cpp
	g++ -g -c dotproduct.cpp

correlate.o: correlate.cpp
	g++ -g -c correlate.cpp

utilities.o: utilities.cpp
	g++ -g -c utilities.cpp

indexer.o: indexer.cpp
	g++ -g -c indexer.cpp

histogram.o: histogram.cpp
	g++ -g -c histogram.cpp	

converters.o: converters.cpp
	g++ -g -c converters.cpp	

writeImage.o: writeImage.cpp
	g++ -g -c writeImage.cpp	

config.o: config.cpp
	g++ -g -c config.cpp	


clean:
	rm *o SoggyDog