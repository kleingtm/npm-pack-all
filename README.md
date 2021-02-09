# npm-pack-all
[![Version](https://img.shields.io/github/package-json/v/kleingtm/npm-pack-all.svg)](https://www.npmjs.com/package/npm-pack-all)
[![Build Status](https://travis-ci.org/kleingtm/npm-pack-all.svg?branch=master)](https://travis-ci.org/kleingtm/npm-pack-all)
[![Coverage Status](https://coveralls.io/repos/github/kleingtm/npm-pack-all/badge.svg?branch=master)](https://coveralls.io/github/kleingtm/npm-pack-all?branch=master)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

A simple utility to package all node_modules dependencies when running `npm pack` (not devDependencies)

This can be useful when wanting to ship dependencies as part of the artifact.
While one can install dependencies on a deployed target using package-lock.json and yarn.lock,
there can be downsides to that approach, as well.

npm-pack-all utility does the following:  

1. Backs up the following files

    + package.json
    + package-lock.json
    + yarn.lock
    + .npmignore
    
2. Adds all dependencies as `bundledDependencies` in the active package.json

    + Pass the `--dev-deps` flag to add devDependencies along with production dependencies

3. Generates an empty .npmignore file in the project root

    + If no .npmignore exists, `npm pack` will use .gitignore to exclude modules
    
        (node_modules by default in many cases) 

4. Calls `npm -dd pack`

    + The following will be packed into a .tgz archive:
    
        + Any files (via glob) called out in the package.json `files` field
        + All production dependencies (and their dependencies)
        + If `--dev-deps`, all devDependencies (and their dependencies)
    
5. Restores the files that were backed up



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
node node_modules/.bin/npm-pack-all <optional options>
```

### Basic
```bash
node node_modules/.bin/npm-pack-all
```

### Options
#### --output
Output your .tgz artifact to a different directory (or with a different name)
```bash
node node_modules/.bin/npm-pack-all --output build/
```

OR

```bash
node node_modules/.bin/npm-pack-all --output build/artifact.tgz
```

#### --dev-deps
Bundle all production dependencies AND devDependencies in the artifact
(use with care -- your artifact will balloon)
```bash
node node_modules/.bin/npm-pack-all --dev-deps --output build/artifact.tgz
```
