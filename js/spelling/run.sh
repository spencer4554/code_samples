#!/bin/bash
if [ -x /usr/libexec/path_helper ]; then
	eval `/usr/libexec/path_helper -s`
fi

echo `which node`

source `which virtualenvwrapper.sh`
workon spelling
source ./spelling/bin/activate 
node ./app.js
