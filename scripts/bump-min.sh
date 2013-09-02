#!/bin/sh

echo "minifying traits.js"

SRC_MIN=`./node_modules/.bin/uglifyjs ./traits.js -c -m`

cat ./scripts/license.txt > ./traits.min.js
echo $SRC_MIN >> ./traits.min.js

echo "gzip'ing traits.min.js"

gzip -c -n ./traits.min.js > ./traits.min.js.gz

echo ""
echo "Finished."
echo ""
