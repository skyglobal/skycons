Gulp Sky Component Helper 
========================

> A collection of common gulp tasks used to build + deploy Sky Components

## Usage

### Install 

`npm install --save-dev gulp-sky-component-helper`

### Within gulpfile.js

To gain access to the gulp tasks include the following at the top of your `gulpfile.js`:

```
var gulp = require('gulp');
var pkg = require('./package.json');
var skyComponentHelper = require('gulp-sky-component-helper');
var gulpHelper = skyComponentHelper.gulp(gulp, pkg);
```

### Gulp Tasks

The gulp tasks provided are:

 * `gulp serve`
 * `gulp release:gh-pages`
 * `gulp release:bower`
 * `gulp release:cdn`

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

## Browser Support

 * IE8 +
 * Safari 5 +
 * Latest Firefox
 * Latest Chrome
 * Latest Mobile Safari
 * Latest Mobile Chrome