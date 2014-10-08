#!/bin/bash

if git status . | grep -q "On branch develop"
then
    if git status . | grep -q "nothing to commit"
    then
        version=`grunt bump $@ | grep "Version bumped" | head -n 1 | awk '{ print $5 }'`
        echo "*** New version $version ***"
        echo "Creating release-$version branch"
        git checkout -b release-$version
        echo "Updating version in app/index.html"
        sed -i "s/<span.*>DEVELOPMENT REVISION<\/span>/$version, RELEASE/g" app/index.html
        echo "Committing new branch"
        git commit -a -m "Release version $version"
    else
        echo '[ERROR] Must commit or stash all changes before releasing'
    fi
else
    echo '[ERROR] Can only make a release from the "develop" branch'
fi
