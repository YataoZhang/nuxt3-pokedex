#!/bin/bash
set -e

OUT_DIR="output"
WORK_DIR="opera"
TAR="source.tar.gz"
DIR_NAME=`basename \`pwd\``

# export TMP_DIR=***

echo "node: $(node -v)"
echo "npm: v$(npm -v)"

npm run build

mkdir $OUT_DIR

# 将.output/public移动到output/app/public/my-nuxt3-app下
mkdir -p $OUT_DIR/app/public/$DIR_NAME}
cp -r ./.output/public/* $OUT_DIR/app/public/$DIR_NAME

# 将.output/server移动到output/apps/my-nuxt3-app下
mkdir -p $OUT_DIR/apps/$DIR_NAME
cp -r ./.output/server/* $OUT_DIR/apps/$DIR_NAME

mkdir -p $WORK_DIR

mv $OUT_DIR/* $WORK_DIR
pushd $WORK_DIR > /dev/null
tar zcf $TAR ./*
mv $TAR ../$OUT_DIR
popd  > /dev/null

rm -rf $WORK_DIR

echo "[BUILD INFO] Build complete!"
