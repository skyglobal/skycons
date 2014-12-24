var findup = require('findup-sync');
var bowerPath = findup('bower.json');
var bower = (bowerPath) ? require(bowerPath) : {};
bower.release = true;

module.exports = {
    bower: bower,
    aws:{
        release: true,
        bucket: process.env.AWS_SKYGLOBAL_BUCKET,
        key:    process.env.AWS_ACCESS_KEY_ID,
        secret: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION
    }
};