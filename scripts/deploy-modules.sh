#! /usr/bin/env bash

set -e

# ML_HOME=~/Library/MarkLogic

rm -rf ./dist

MLTAP=./marklogic/dist/es6
mkdir -p "$MLTAP"
cp -R ./marklogic/harness.sjs ./marklogic/test.sjs ./marklogic/bootstrap.sjs ./marklogic/lib "$MLTAP"

MODULES="$MLTAP"/_modules


REMOTE_DIR="$MODULES"/deep-equal
LOCAL_DIR=./node_modules/deep-equal
mkdir -p "$REMOTE_DIR" 
cp -R "$LOCAL_DIR"/index.js "$LOCAL_DIR"/lib "$REMOTE_DIR"

REMOTE_DIR="$MODULES"/stack-trace
LOCAL_DIR=./node_modules/stack-trace
mkdir -p "$REMOTE_DIR"
cp -R "$LOCAL_DIR"/lib "$REMOTE_DIR"

REMOTE_DIR="$MODULES"/pretty-format
LOCAL_DIR=./node_modules/pretty-format/build
mkdir -p "$REMOTE_DIR"
cp "$LOCAL_DIR"/index.js "$LOCAL_DIR"/printString.js "$REMOTE_DIR"/

# <https://github.com/creationix/nvm/issues/43#issuecomment-1486359>
echo "$NVM_BIN"
# Travis doesn’t have npm on its PATH
echo 'Transpiling to dist/es5 with babel'
"$NVM_BIN/node" node_modules/babel-cli/bin/babel.js "$MLTAP" -d ./marklogic/dist/es5

echo 'Commenting out ansi-styles dependency from pretty-format'
# Comments out ths ansi-styles dependency
# This is only used when the `highlight` option is employed

# <http://stackoverflow.com/a/25486705/563324>
# Unfortunately Linux doesn’t accept and empty string as a parameter to -i, but macOS requires it
# <http://stackoverflow.com/a/91176/563324>
sed \
  -i.BAK \
  -e 's/var style = require('\''ansi-styles'\'');/\/\/ style = require('\''ansi-styles'\'');/' \
  ./marklogic/dist/es5/_modules/pretty-format/index.js
# Needed to support MarkLogic 8, not necessary for 9
sed \
  -i.BAK \
  -e 's/var symbolToString = Symbol.prototype.toString;/var symbolToString = function() { throw new TypeError("Symbol is not defined."); };/' \
  ./marklogic/dist/es5/_modules/pretty-format/index.js
rm ./marklogic/dist/es5/_modules/pretty-format/index.js.BAK

echo 'Deploying to Modules directory'

mkdir -p "$ML_HOME"/Modules/mltap
# Clear the modules
rm -rf "$ML_HOME"/Modules/mltap/*
# Copy the .sjs modules
cp -R marklogic/dist/es6/* "$ML_HOME"/Modules/mltap/
# Copy the babel-ized library modules 
cp -R marklogic/dist/es5/_modules "$ML_HOME"/Modules/mltap/
