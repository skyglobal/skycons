'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');
var runSequence = require('run-sequence');
var pkg = require('./package.json');
var plugins = require('gulp-load-plugins')();

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
            paths.demo['sass'] + '/**/*.scss',
            paths.site['sass'] + '/**/*.scss'])
        .pipe(plugins.sass({
            includePaths: ['bower_components'],
            outputStyle: 'nested'
        }))
        .pipe(plugins.autoprefixer())
        .pipe(gulp.dest(paths.site['css']))
        .pipe(browserSync.reload({stream:true}));
});

gulp.task('bower', function() {
    return plugins.bower()
});

gulp.task('gh-pages', function () {
    gulp.src(paths.site['root'] + "/**/*")
        .pipe(plugins.deploy({
            cacheDir: '.tmp'
        })).pipe(gulp.dest('/tmp/gh-pages'));
});



gulp.task('run-release-bower', function(cb) {
    plugins.run('git tag -a v'+ pkg.version +' -m "release v' + pkg.version +' for bower"; git push origin master v'+ pkg.version).exec();
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

function awsUpload(fileType, awsS3){
    var path = 'components/' + pkg.name.replace('bskyb-','') + '/' + pkg.version + '/' + fileType + '/';
    return gulp.src(paths.dist[fileType] + '/**/*')
        .pipe(awsS3.upload({ path: path } ));

}
gulp.task('aws', function() {
    var awsS3 = plugins.awsS3.setup({bucket: process.env.AWS_SKYGLOBAL_BUCKET});
    awsUpload('css',awsS3);
    awsUpload('js', awsS3);
    awsUpload('fonts', awsS3);
    awsUpload('icons', awsS3);
});

gulp.task('watch', function() {
    gulp.watch(paths.site['root'], ['create-site']);
    gulp.watch([paths.source['sass'] + '/**/*',paths.demo['sass']], ['sass']);
});

gulp.task('create-site', function() {
    gulp.src([paths.demo['root'] + '/index.html',
            paths.demo['root'] +'/_includes/*.html'])
        .pipe(plugins.concat('index.html'))
        .pipe(gulp.dest(paths.site['root']));
});


gulp.task('build', function(cb) {
    return runSequence('clean', 'pre-build', ['create-site','bower'], ['update-docs-version', 'sass'],
        cb
    );
});

//remove temporary directors
gulp.task('clean', function(cb) {
    return gulp.src([
            './.tmp',
            paths.site['root'],
            paths.dist['root']
        ])
        .pipe(plugins.clean());
});

//update the version number used within all documentation and html
gulp.task('update-docs-version-within-md', function(){
    var now = Date().split(' ').splice(0,5).join(' ');
    return gulp.src(['README.md'], { base : './' })
        .pipe(plugins.replace(/[0-9]+\.[0-9]+\.[0-9]/g, pkg.version))
        .pipe(plugins.replace(/{{ site.version }}/g, pkg.version))
        .pipe(plugins.replace(/{{ site.time }}/g, now))
        .pipe(gulp.dest('./'));
});
gulp.task('update-docs-version-within-site', function(){
    var now = Date().split(' ').splice(0,5).join(' ');
    return gulp.src([paths.site['root'] + '/**/*.html'], { base : './'})
        .pipe(plugins.replace(/[0-9]+\.[0-9]+\.[0-9]/g, pkg.version))
        .pipe(plugins.replace(/{{ site.version }}/g, pkg.version))
        .pipe(plugins.replace(/{{ site.time }}/g, now))
        .pipe(gulp.dest('./'));
});
gulp.task('update-docs-version', function(cb){
    return runSequence(['update-docs-version-within-site', 'update-docs-version-within-md'],cb);
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
        'create-bower-dist',
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

gulp.task('release:cdn', function(cb) {
    return runSequence(
        'build',
        'create-bower-dist',
        'aws',
        cb
    );
});














gulp.task('copy-icons', function() {
    return gulp.src([paths.source['icons'] + '/*.svg'])
        .pipe(gulp.dest(paths.site['icons']));
});


gulp.task("skycons", function(){
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
            // Create CSS
            gulp.src(paths.source.fontSassTemplate)
                .pipe(consolidate('lodash',  options))
                .pipe(gulp.dest(paths.site['sass']));

            // Create HTML preview
            gulp.src(paths.source.fontHtmlTemplate)
                .pipe(consolidate('lodash', options))
                .pipe(gulp.dest(paths.site['root']));
        })
        .pipe(gulp.dest(paths.site['fonts']));
});


gulp.task('pre-build', function(cb){
    return runSequence('copy-icons','skycons', cb);
});



var iconfont = require("gulp-iconfont")
    , consolidate = require('gulp-consolidate');

paths.source.fontSassTemplate = paths.source.root + '/main.scss';
paths.source.fontHtmlTemplate = paths.source.root + '/index.html';

