#!/bin/sh
sudo pip install virtualenv
mkvirtualenv spelling
pip install -r requirements 
nodeenv spelling
source ./spelling/bin/activate
npm install 
