#!/bin/bash

if git status . | grep -q "On branch develop"
then
    if git status . | grep -q "nothing to commit"
    then
        version=`grunt bump $@ | grep "Version bumped" | head -n 1 | awk '{ print $5 }'`
        echo ">>> New version $version"
        branch=release-$version
        echo ">>> Creating release-$version branch"
        git checkout -b $branch develop
        echo ">>> Updating version in app/index.html"
        sed -i "s/<span.*>DEVELOPMENT REVISION<\/span>/v$version, release/g" app/index.html
        echo ">>> Committing new branch"
        git commit -a -m "Release version $version"
        git checkout master
        git merge --no-ff $branch
        git tag -a v$version -m "Tagging release $version"
        git push origin v$version
    else
        echo '[ERROR] Must commit or stash all changes before releasing'
    fi
else
    echo '[ERROR] Can only make a release from the "develop" branch'
fi
