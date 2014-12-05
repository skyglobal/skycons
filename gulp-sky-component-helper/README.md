Gulp Sky Component Helper 
========================

> A collection of common gulp tasks used to build + deploy Sky Components

## Usage

### Setup
 
#### Install the helper

`npm install --save-dev gulp-sky-component-helper`

#### Create a gulpfile.js

To gain access to the default gulp tasks, include the following at the top of your `gulpfile.js`:

```
var gulp = require('gulp');
var pkg = require('./package.json');
var plugins = require('gulp-load-plugins')();
var skyComponentHelper = require('./gulp-sky-component-helper')(gulp, pkg);
var paths = skyComponentHelper.paths;
```

#### Initialise your component

`gulp component:init`

### Gulp Tasks

The gulp tasks provided (and available on the command line) are:

 * `gulp serve` | Serves your demo page locally with compiled assets
 * `gulp release:gh-pages` | Pushes compiled assets to gh-pages branch
 * `gulp release:bower` | Tags github release to make assets  (compiled and source) available to bower 
 * `gulp release:cdn` | Pushes assets to AWS S3 and available via akamai

### Pre-build Hook

To enable you to build a custom step into the build process, you can use the `pre-build` within your gulp file:

```
gulp.task('pre-build', function(cb){
    ...
});

```

## Contribution

BSkyB components depends on collaboration between developers across Sky. Contributions of any size are actively encouraged.

[Read More >](CONTRIBUTING.md)