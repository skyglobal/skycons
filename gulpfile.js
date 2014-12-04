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
var flatten = require('gulp-flatten');
var clean = require('gulp-clean');

var paths = {
    "site": {
        root: './_site',
        js: "./_site/js",
        css: './_site/css',
        sass: './_site/scss',
        fonts: './_site/fonts',
        icons: './_site/icons',
        images: './_site/images'
    },
    "demo": {
        root: "./demo",
        js: "./demo/js",
        sass: './demo/scss',
        fonts: './demo/fonts',
        icons: './demo/icons',
        images: './demo/images'
    },
    source: {
        root: "./src",
        js: "./src/js",
        sass: './src/scss',
        fonts: './src/fonts',
        icons: './src/icons',
        images: './src/images'
    },
    dist : {
        root: "./dist",
        js: "./dist/js",
        css: "./dist/css",
        sass: "./dist/scss",
        fonts: './dist/fonts'
    }
};

gulp.task('pre-build', function(cb){
    //
});

gulp.task('sass', function() {
    browserSync.notify('<span style="color: grey">Running:</span> Sass compiling');
    return gulp.src([
            paths.source['sass'] + '/**/*.scss',
            paths.demo['sass'] + '/**/*.scss'])
        .pipe(sass({
            includePaths: ['bower_components'],
            outputStyle: 'nested'
        }))
        .pipe(autoprefixer())
        .pipe(gulp.dest(paths.site['css']))
        .pipe(browserSync.reload({stream:true}));
});

gulp.task('bower', function() {
    return bower()
});

gulp.task('gh-pages', function () {
    gulp.src(paths.site['root'] + "/**/*")
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
            baseDir: paths.site['root']
        }
    });
});

function copyDir(location, fileType){
    var files = (fileType === 'css') ? '/main.css' : '/**/*';
    return gulp.src([paths[location][fileType] + files])
        .pipe(gulp.dest(paths.dist[fileType]));
}
gulp.task('create-bower-dist', function() {
    copyDir('site', 'css');
    copyDir('site','sass');
    copyDir('site','fonts');
    return copyDir('source','sass');

});

gulp.task('watch', function() {
    gulp.watch(paths.site['root'], ['create-site']);
    gulp.watch([paths.source['sass'] + '/**/*',paths.demo['sass']], ['sass']);
});

gulp.task('create-site', function() {
    gulp.src([paths.demo['root'] + '/index.html',
            paths.demo['root'] +'/_includes/*.html'])
        .pipe(concat('index.html'))
        .pipe(gulp.dest(paths.site['root']));
});


gulp.task('build', function(cb) {
    return runSequence('pre-build', ['create-site','bower'],['sass'], 'create-bower-dist',
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














gulp.task('copy-icons', function() {
    return gulp.src([paths.source['icons'] + '/*.svg'])
        .pipe(gulp.dest(paths.site['icons']));
});


gulp.task("icons-fonts", function(){
    return gulp.src(paths.source.icons + '/**/*.svg')
        .pipe(iconfont({
            fontName : "skycons",
            fixedWidth : false,
            normalize: true,
            centerHorizontally: true
        }))
        .pipe(gulp.dest(paths.site['fonts']));
});

gulp.task("icons-css", function(){
    return gulp.src(paths.source.icons + '/**/*.svg')
        .pipe(iconfontCSS({
            fontName : "skycons",
            path : paths.source.fontSassTemplate,
            targetPath : paths.site.fontSassTemplate,
            fontPath : "../fonts/"
        }))
        .pipe(iconfont({
            fontName : "skycons",
            fixedWidth : false,
            normalize: true,
            centerHorizontally: true
        }))
        .pipe(gulp.dest(paths.site['root']));
});

gulp.task("icons-html", function(){
    return gulp.src(paths.source.icons + '/**/*.svg')
        .pipe(iconfontCSS({
            fontName : "skycons",
            path : paths.source.fontHtmlTemplate,
            targetPath : paths.site.fontHtmlTemplate,
            fontPath : "../fonts/"
        }))
        .pipe(iconfont({
            fontName : "skycons",
            fixedWidth : false,
            normalize: true,
            centerHorizontally: true
        }))
        .pipe(gulp.dest(paths.site['root']));
});

gulp.task("icons-clean", function(){
    return gulp.src([
            paths.site['root'] + '/*.eot',
            paths.site['root'] + '/*.svg',
            paths.site['root'] + '/*.ttf',
            paths.site['root'] + '/*.woff'
    ], {read: false})
        .pipe(clean());
});

gulp.task('icons-sass', function(){

    return gulp.src([
        paths.site['icons'] + '/**/*.scss',
        paths.site['sass'] + '/**/*.scss',
        paths.demo['sass'] + '/**/*.scss'
        ])
        .pipe(sass({
            includePaths: ['bower_components','_site'],
            outputStyle: 'nested'
        }))
        .pipe(autoprefixer())
        .pipe(gulp.dest(paths.site['css']))
        .pipe(browserSync.reload({stream:true}));

});

gulp.task("skycons", function(callback){
    return runSequence(
        'icons-fonts',
        'icons-css',
        'icons-html',
        'icons-sass',
        'icons-clean',
        callback
    );
});

gulp.task('sass', function() {
    //
});

gulp.task('pre-build', function(cb){
    return runSequence('copy-icons','skycons', cb);
});



var iconfontCSS = require("./node_forks/gulp-iconfont-css")
    , iconfont = require("gulp-iconfont")
    , path = require("path");

paths.source.fontSassTemplate = paths.source.root + '/sass-template.scss';
paths.source.fontHtmlTemplate = paths.source.root + '/html-template.html';
paths.site.fontSassTemplate = 'scss/main.scss';
paths.site.fontHtmlTemplate = 'index.html';

