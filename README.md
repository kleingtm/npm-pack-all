# npm-pack-all
[![NPM version](https://img.shields.io/npm/v/npm-pack-all.svg?style=flat-square)](https://www.npmjs.com/package/npm-pack-all)
[![Build Status](https://travis-ci.org/kleingtm/npm-pack-all.svg?branch=master)](https://travis-ci.org/kleingtm/npm-pack-all)
[![Coverage Status](https://coveralls.io/repos/github/kleingtm/npm-pack-all/badge.svg?branch=master)](https://coveralls.io/github/kleingtm/npm-pack-all?branch=master)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

A simple utility to package all node_modules dependencies when running `npm pack` (not devDependencies)

This can be useful when wanting to ship dependencies as part of the artifact -- side stepping the case

npm-pack-all utility does the following:  

1. Removes devDependencies from the local node_modules folder (only packs production dependencies)  

    + npm: `npm prune --production`
    + yarn: `yarn install --production` (yarn install prunes automatically)
    
2. Makes copies of the untouched package.json and lock files
3. Adds all dependencies as `bundledDependencies` in the active package.json
4. Calls `npm pack` (`yarn pack` does not work with bundledDependenies as of 6/21/19)

    + The following will be packed into a .tgz archive:
    
        + Any files (via glob) called out in the package.json `files` field
        + All node_modules that are production dependencies (not devDependencies)
    
5. Restores the untouched package.json and lock files



## Install
```bash
npm install npm-pack-all

```
OR

```bash
yarn add npm-pack-all

```

## Use
```bash
node_modules/npm-pack-all

```

If you want to output your .tgz artifact to a different spot (or with a different name)
```bash

```



