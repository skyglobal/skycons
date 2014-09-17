'use strict';

var gulp = require('gulp');
var deploy = require("gulp-gh-pages");

gulp.task('gh-pages', function () {
    gulp.src("./_site/**/*")
        .pipe(deploy({
            cacheDir: '.tmp'
        })).pipe(gulp.dest('/tmp/gh-pages'));
});