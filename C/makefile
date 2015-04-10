

all: SoggyDog

SoggyDog: indexer.o histogram.o imagestructs.o dotproduct.o correlate.o utilities.o main.o
	g++ -lpng main.o indexer.o histogram.o imagestructs.o dotproduct.o correlate.o utilities.o -o SoggyDog

main.o: main.cpp
	g++ -c main.cpp

imagestructs.o: imagestructs.cpp
	g++ -c imagestructs.cpp

dotproduct.o: dotproduct.cpp
	g++ -c dotproduct.cpp

correlate.o: correlate.cpp
	g++ -c correlate.cpp

utilities.o: utilities.cpp
	g++ -c utilities.cpp

indexer.o: indexer.cpp
	g++ -c indexer.cpp

histogram.o: histogram.cpp
	g++ -c histogram.cpp	

clean:
	rm *o SoggyDog