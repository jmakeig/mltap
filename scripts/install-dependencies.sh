#!/bin/bash

if [ "${TRAVIS_SECURE_ENV_VARS}" = "true" ] ; then
  ./scripts/travis-install-ml.sh nightly
  ./scripts/setup-marklogic.sh
fi
