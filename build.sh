#!/bin/bash -x

OUTPUT_DIR="build"

rm -rf go-blender
git clone https://github.com/awalvie/go-blender
cd go-blender && make build && cd ..
mv go-blender/go-blender ./blender

if [[ -e ./build ]];
	then rm -r ./build
fi

mkdir build
cp home.html "$OUTPUT_DIR"
echo "home.html has been added to $OUTPUT_DIR."
./blender build ./
