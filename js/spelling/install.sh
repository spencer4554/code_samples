#!/bin/sh
if !hash mkvirtualenv 2>/dev/null; then
    sudo pip install virtualenv
fi

mkvirtualenv spelling
pip install -r requirements 
nodeenv spelling
source ./spelling/bin/activate
npm install 
