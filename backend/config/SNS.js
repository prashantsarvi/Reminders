const AWS = require('aws-sdk');
const BlueBirdPromise = require('bluebird');

let SNS;

const configureSNS = (secret) => new BlueBirdPromise((res) => {
    AWS.config.update({
        region: process.env.region_ps,
        accessKeyId: process.env.access_key_id_ps,
        secretAccessKey: process.env.access_secret_token_ps,
        sessionToken: process.env.session_token_ps
    });
    SNS = new AWS.SNS({apiVersion: process.env.apiVersion_ps});
    return res(secret);
});

const getSNS = () => {
    return SNS;
};

module.exports = {
    getSNS,
    configureSNS
};