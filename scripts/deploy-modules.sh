#! /usr/bin/env bash

# ML_HOME=~/Library/MarkLogic

MLTAP="$ML_HOME"/Modules/mltap
mkdir -p "$MLTAP"
cp -R ./mltap.js ./test.js ./lib "$MLTAP"

MODULES="$MLTAP"/_modules

REMOTE_DIR="$MODULES"/deep-equal
LOCAL_DIR=./node_modules/deep-equal
mkdir -p "$REMOTE_DIR"; cp -R "$LOCAL_DIR"/index.js "$LOCAL_DIR"/lib "$REMOTE_DIR"

REMOTE_DIR="$MODULES"/stack-trace
LOCAL_DIR=./node_modules/stack-trace
mkdir -p "$REMOTE_DIR"; cp -R "$LOCAL_DIR"/lib "$REMOTE_DIR"


REMOTE_DIR="$MODULES"/object-inspect
LOCAL_DIR=./node_modules/object-inspect
mkdir -p "$REMOTE_DIR"; cp "$LOCAL_DIR"/index.js "$REMOTE_DIR"/
