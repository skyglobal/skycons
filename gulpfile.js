'use strict';

var gulp = require('gulp');
var helper = require('component-helper');
var paths = require('./component.config.js').paths;
var argv = process.argv.slice(3).toString();
var iconfont = require("gulp-iconfont")
    , consolidate = require('gulp-consolidate')
    , lodash = require('lodash');

function onError(err) {
    console.log(err.message || err);
    process.exit(1);
}

gulp.task('build', ['build-skycons'], function() {
    return helper.build.all().catch(onError)
});

gulp.task('serve', ['build'], function() {
    return helper.serve.quick().catch(onError);
});

gulp.task('release', ['build'], function(){
    var version = argv.split('--version=')[1];
    return helper.release.quick(null, version).catch(onError);
});

gulp.task('copy-icons',  function() {
    return gulp.src([paths.source['icons'] + '/*.svg'])
        .pipe(gulp.dest(paths.site['icons']));
});

gulp.task('copy-skycons', ['skycons'], function() {
    return gulp.src([paths.site.root + '/fonts/skycons.*'])
        .pipe(gulp.dest(paths.dist['fonts']));
});

gulp.task("skycons",  function(){
    var fontName = 'skycons';
    return gulp.src(paths.source.icons + '/**/*.svg')
        .pipe(iconfont({
            fontName : fontName,
            fixedWidth : false,
            normalize: true,
            centerHorizontally: true
        }))
        .on('codepoints', function(codepoints) {
            var options = {
                glyphs: codepoints,
                fontName: fontName,
                fontPath: '../fonts/'
            };
            // Prepare core SCSS partial
            gulp.src(paths.source.root + '/skycons-core.scss')
                .pipe(consolidate('lodash',  options))
                .pipe(gulp.dest(paths.source.styles));

            // Create CSS
            gulp.src(paths.source.root + '/skycons.scss')
                .pipe(consolidate('lodash',  options))
                .pipe(gulp.dest(paths.source.styles));

            // Create HTML preview
            gulp.src(paths.source.root + '/index.html')
                .pipe(consolidate('lodash', options))
                .pipe(gulp.dest(paths.demo.root));
        })
        .pipe(gulp.dest(paths.site.root + '/fonts'));
});


gulp.task('build-skycons', ['copy-icons','skycons','copy-skycons']);