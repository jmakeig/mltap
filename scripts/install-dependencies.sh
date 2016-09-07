#!/bin/bash

if [ "${TRAVIS_SECURE_ENV_VARS}" = "true" ] ; then
  ./shared/dev-tasks/travis-install-ml.sh nightly
  ./shared/dev-tasks/setup-marklogic.sh
fi
