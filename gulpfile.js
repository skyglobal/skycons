'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');
var deploy = require("gulp-gh-pages");
var bower = require('gulp-bower');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var run = require("gulp-run");
var runSequence = require('run-sequence');
var pkg = require('./package.json');

var rename = require("gulp-rename");
var del = require('del');
var flatten = require('gulp-flatten');

var paths= {
    "demo": [
        "./demo/**/*.html"
    ],
    sass: './src/scss',
    demoSass: './demo/scss',
    css: './_site/css',
    assets: './src/assets',
    siteAssets: './_site/assets'
};

paths.sass = paths.siteAssets; //fonts are special!

gulp.task('sass', function() {
    browserSync.notify('<span style="color: grey">Running:</span> Sass compiling');
    return gulp.src([paths['sass'] + '/**/*.scss', paths['demoSass'] + '/**/*.scss'])
        .pipe(sass({
            includePaths: ['bower_components','_site'],
            outputStyle: 'nested'
        }))
        .pipe(autoprefixer())
        .pipe(gulp.dest(paths.css))
        .pipe(browserSync.reload({stream:true}));
});

gulp.task('bower', function() {
    return bower()
});

gulp.task('gh-pages', function () {
    gulp.src("./_site/**/*")
        .pipe(deploy({
            cacheDir: '.tmp'
        })).pipe(gulp.dest('/tmp/gh-pages'));
});



gulp.task('run-release-bower', function(cb) {
    run('git tag -a v'+ pkg.version +' -m "release v' + pkg.version +' for bower"; git push origin master v'+ pkg.version).exec();
});

gulp.task('browserSync', function() {
    browserSync({
        port: 3456,
        server: {
            baseDir: "_site"
        }
    });
});

gulp.task('create-site', function() {
    gulp.src(['demo/index.html','demo/_includes/*.html'])
        .pipe(concat('index.html'))
        .pipe(gulp.dest('_site'))
});

gulp.task('create-site', function(cb) {
    return run('grunt webfont').exec('', function(){
        return runSequence(['rename-font-files']);
    });
});

gulp.task('create-bower-dist', function() {
    gulp.src([paths.css + '/skycons.css'])
        .pipe(gulp.dest(paths.siteAssets));

    gulp.src([paths.siteAssets + '/**/*'])
        .pipe(flatten())
        .pipe(gulp.dest('./dist'));

});

gulp.task('clean', function() {
    return del([paths.siteAssets + '/_skycons.scss','./_site/skycons.html', paths.css + '/skycons.css']);
});

gulp.task('copy-svg', function() {
    return gulp.src(['./src/svg/*.svg'])
        .pipe(gulp.dest('./_site/svg/'));
});

gulp.task('rename-font-files', function() {
    gulp.src([paths.siteAssets + '/_skycons.scss'])
        .pipe(rename("skycons.scss"))
        .pipe(gulp.dest(paths.siteAssets));

    return gulp.src(['./_site/skycons.html'])
        .pipe(rename("index.html"))
        .pipe(gulp.dest('./_site'));
});


gulp.task('build', function(cb) {
    return runSequence(['copy-svg','create-site','bower'],['sass'],'clean','create-bower-dist',
        cb
    );
});

gulp.task('serve', function(callback) {
    return runSequence(
        'build',
        ['browserSync', 'watch'],
        callback
    );
});

gulp.task('release:bower', function(cb) {
    return runSequence(
        'build',
        'run-release-bower',
        cb
    );
});

gulp.task('release:gh-pages', function(cb) {
    return runSequence(
        'build',
        'gh-pages',
        cb
    );
});