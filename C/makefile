

all: SoggyDog

SoggyDog: imagestructs.o dotproduct.o correlate.o utilities.o main.o
	g++ main.o imagestructs.o dotproduct.o correlate.o utilities.o -o SoggyDog

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

clean:
	rm *o SoggyDog