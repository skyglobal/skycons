var pkg = require('../package.json');
var bower = require('../bower.json');
bower.release = true;

module.exports = {
    pkg: pkg,
    bower: bower,
    aws:{
        release: true,
        bucket: process.env.AWS_SKYGLOBAL_BUCKET,
        key:    process.env.AWS_ACCESS_KEY_ID,
        secret: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION
    }
};