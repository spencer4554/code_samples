#!/bin/bash
source ./spelling/bin/activate 
source ./spelling_node/bin/activate 

cd tests; ../node_modules/.bin/mocha --debug; cd ..
