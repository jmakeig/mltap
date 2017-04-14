#! /usr/bin/env bash

set -e

# ML_HOME=~/Library/MarkLogic

ML_HOME="/opt/MarkLogic"
OS=$(uname)
case $OS in
  'Linux')
    OS='Linux'
    ;;
  'FreeBSD')
    OS='FreeBSD'
    ;;
  'WindowsNT')
    OS='Windows'
    ;;
  'Darwin') 
    OS='macOS'
    ML_HOME=~/Library/MarkLogic
    ;;
  'SunOS')
    OS='Solaris'
    ;;
  'AIX') ;;
  *) ;;
esac

echo "Detected $OS"
if [ -z ${ML_HOME+x} ]; then echo 'The environment variable ML_HOME is empty or missing' && exit 1; else echo $ML_HOME; fi

echo "Deploying to $ML_HOME/Modules"

mkdir -p "$ML_HOME"/Modules/mltap
# Clear the modules
rm -rf "$ML_HOME"/Modules/mltap/*
# Copy the .sjs modules
cp -R marklogic/dist/es6/* "$ML_HOME"/Modules/mltap/
# Copy the babel-ized library modules 
cp -R marklogic/dist/es5/_modules "$ML_HOME"/Modules/mltap/