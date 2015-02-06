var bower = require('./bower.json');
var pkg = require('./package.json');

module.exports = {
    bower: bower,
    buildFonts: false, // or false. Set to false if you are doing your own thing in the fonts directory
    buildTool: 'gulp', // grunt not yet available
    buildStyles: 'sass', // less not yet available
    buildHTML: 'html-concat', // moustache or assemble or jekyll not yet available
    buildScripts: 'browserify', // or requirejs not yet available
    release: 'aws', /// or 'aws',
    releaseConfig: { //add you release config here... this is for AWS
        bucket: process.env.AWS_SKYGLOBAL_BUCKET,
        accessKey: process.env.AWS_ACCESS_KEY_ID,
        secret: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION,
        directoryPrefix: 'components/' //prefix your destination directory for the cloud
    },
    test: false,
    serve: '_site', //{   script : 'src/app/server.js',
                    //    host: 'http://localhost:3000',
                    //    port: 3001,
                    //    env: { NODE_ENV: 'local'}
                    //}, // or '_site' or ['_site','bower_component']
    paths: {
        /*
         All paths also have `script`, `styles`, `fonts`, `icons` and `images` properties
         Customise these paths below i.e. add `scripts: './src/js'`
         */
        "bower": {
            root: './bower_components',
            fonts: './bower_components/*/dist/fonts'
        },
        source: { //source files to build your component / site
            root: "./src"
        },
        "demo": { // files used to demo the source code or an accompanying site.
            // not files you would want to distribute.
            root: "./demo"
        },
        dist : { // Compiled source code to be redistributed i.e. via bower
            root: "./dist"
        },
        "site": { // Compiled demo code + Compiled source code.
            // Final build code pushed to your chosen release cloud i.e. AWS
            root: './_site'
        }
    },
    pkg: pkg
};