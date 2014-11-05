module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        webfont: {
            all: {
                src: [
                  'src/svg/mail.svg',
                  'src/svg/profile.svg',
                  'src/svg/menu.svg',
                  'src/svg/chevron.svg',
                  'src/svg/chevron-down.svg',
                  'src/svg/chevron-up.svg',
                  'src/svg/search.svg',
                  'src/svg/facebook.svg',
                  'src/svg/twitter.svg'
                ],
                dest: 'dist',
                destCss: 'dist',
                options: {
                    ie7 : false,
                    font : 'skycons-masthead',
                    template : 'src/template.css',
                    htmlDemoTemplate : 'src/template.html',
                    htmlDemo : true,
                    ligatures : false,
                    engine : 'node',
                    stylesheet: 'scss',
                    destHtml : '_site',
                    hashes : false,
                    embed : true
                }
            }
        },

        //Grunt-webfont outputs skycons.html so this needs to be renamed to be served by broccoli
        exec:{
            createSite: 'rm -rf _site; mkdir -p -- _site;mkdir -p -- _site/assets',
            renameIndexHtml: 'mv _site/skycons-masthead.html _site/index.html',
            copySVGsToSite: 'cp -R src/svg _site',
            copyDistToSite: 'cp -R dist/* _site/assets',
            copyCssToSite: 'cp -R demo/css _site',
            removeUnusedScss: 'rm dist/_*.scss',
            'bower-install': 'bower install',
            'release-bower': 'git tag -a v<%= pkg.version %> -m "release v<%= pkg.version %> for bower"; git push origin master v<%= pkg.version %>',
            'gh-pages': 'gulp gh-pages'
        },

        connect: {
            server: {
                options: {
                    port: 3456,
                    base: ['_site'],
                    keepalive:true,
                    hostname: '*'
                }
            }
        },

        sass: {
            options: {
                includePaths: ['bower_components']
            },
            dist: {
                files: {
                    'dist/skycons-masthead.scss': 'src/skycons.scss',
                    'dist/skycons-masthead.css': 'src/skycons.scss'
                }
            }
        },
        aws_s3: {
            options: {
                bucket: process.env.AWS_SKYGLOBAL_BUCKET,
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                region: 'eu-west-1',
                uploadConcurrency: 5, // 5 simultaneous uploads
                downloadConcurrency: 5 // 5 simultaneous downloads
            },
            release: {
                options: {
                    differential: true, // Only uploads the files that have changed,
                    params: {
                        CacheControl: 'public, max-age=2592000'
                    }
                },
                files: [
                    {dest: 'components/<%= pkg.name %>/<%= pkg.version %>/', src: ['**'], cwd: 'dist', expand:true }
                ]
            }
        },
        version_sync: {
            app: {
                source: './package.json',
                targets: ['./bower.json']
            }
        },
        replace: {
            html: {
                src: ['_site/*.html'],
                overwrite: true,                 // overwrite matched source files
                replacements: [{
                    from: "{{ site.time }}",
                    to: "<%= grunt.template.today('dd/mm/yyyy') %>"
                },
                {
                    from: "{{ site.version }}",
                    to: "<%= pkg.version %>"
                }]
            },
            markdown: {
                src: ['*.md'],
                overwrite: true,                 // overwrite matched source files
                replacements: [{
                    from:  /\/[0-9]{1,2}\.[0-9]{1,2}\.[0-9]{1,2}\//g,
                    to: "/<%= pkg.version %>/"
                }]
            }
        }
    });

    grunt.loadNpmTasks('grunt-webfont');
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-aws-s3');
    grunt.loadNpmTasks('grunt-version-sync');
    grunt.loadNpmTasks('grunt-text-replace');

    grunt.registerTask('build', [
        'version_sync',
        'exec:createSite',
        'exec:bower-install',
        'webfont',
        'sass',
        'exec:removeUnusedScss',
        'exec:renameIndexHtml',
        'exec:copySVGsToSite',
        'exec:copyDistToSite',
        'exec:copyCssToSite',
        'replace'
    ]);

    //before you can release gh-pages you must:
    //read here to init gh-pages properly https://www.npmjs.org/package/gulp-gh-pages
    grunt.registerTask('release:gh-pages', [
        'build',
        'exec:gh-pages'
    ]);


    //before you can release bower you must:
    //bower register bskyb-component-name git://github.com/skyglobal/component-name.git
    grunt.registerTask('release:bower', [
        'build',
        'exec:release-bower'
    ]);

    grunt.registerTask('release:cdn', [
        'build',
        'aws_s3'
    ]);

    grunt.registerTask('serve', [
        'build',
        'connect'
    ]);

    grunt.registerTask('default', [
        'serve'
    ]);
};
