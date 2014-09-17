module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        webfont: {
            all: {
                src: 'src/svg/*.svg',
                dest: 'dist',
                destCss: 'dist',
                options: {
                    ie7 : true,
                    font : 'skycons',
                    template : 'src/template.css',
                    htmlDemoTemplate : 'src/template.html',
                    htmlDemo : true,
                    ligatures : false,
                    engine : 'node',
                    destHtml : '_site',
                    hashes : false,
                    embed : true
                }
            }
        },

        //Grunt-webfont outputs skycons.html so this needs to be renamed to be served by broccoli
        exec:{
            createSite: 'rm -rf _site; mkdir -p -- _site;mkdir -p -- _site/assets',
            renameIndexHtml: 'mv _site/skycons.html _site/index.html',
            copySVGsToSite: 'cp -R src/svg _site',
            copyDistToSite: 'cp -R dist/* _site/assets',
            copyCssToSite: 'cp -R demo/css _site',
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
                    '_site/css/colour.css': 'src/colour.scss'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-webfont');
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-sass');

    grunt.registerTask('build', [
        'exec:createSite',
        'exec:bower-install',
        'webfont',
        'exec:renameIndexHtml',
        'exec:copySVGsToSite',
        'exec:copyDistToSite',
        'exec:copyCssToSite',
        'sass'
    ]);

    grunt.registerTask('release:gh-pages', [
        'build',
        'exec:gh-pages'
    ]);


    //before you can release bower you must:
    //bower register example git://github.com/user/example.git
    grunt.registerTask('release:bower', [
        'build',
        'exec:release-bower'
    ]);

    grunt.registerTask('serve', [
        'build',
        'connect'
    ]);

    grunt.registerTask('default', [
        'serve'
    ]);
};
