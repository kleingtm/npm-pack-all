#!/bin/sh

setup_git() {
  git config --global user.email "kleingtm@gmail.com"
  git config --global user.name "Tom Kleingers"
}

npm_publish() {
  git checkout -b master
  npm version patch -m "Travis build: $TRAVIS_BUILD_NUMBER, Bumped to version %s"
}

commit() {
  git remote add origin https://${GITHUB_TOKEN}@github.com/kleingtm/npm-pack-all.git > /dev/null 2>&1
  git push --quiet --set-upstream origin master
}

setup_git
npm_publish
commit