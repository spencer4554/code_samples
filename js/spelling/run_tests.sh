#!/bin/bash
if [ -x /usr/libexec/path_helper ]; then
	eval `/usr/libexec/path_helper -s`
fi

source `which virtualenvwrapper.sh`
workon spelling
source ./spelling/bin/activate 

cd tests; ../node_modules/.bin/mocha --debug; cd ..
