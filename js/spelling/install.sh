#!/bin/sh
if ! hash virtualenv 2>/dev/null; then
    sudo pip install virtualenv
fi

virtualenv spelling
source ./spelling/bin/activate

pip install -r requirements 
nodeenv spelling_node
source ./spelling_node/bin/activate
npm install 
