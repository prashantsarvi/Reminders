const AWS = require('aws-sdk');
const BlueBirdPromise = require('bluebird');

let dynamoDB;

const configureDynamoDB = (secret) => new BlueBirdPromise((res) => {
    AWS.config.update({
        region: process.env.region_bs,
        accessKeyId: process.env.access_key_id_bs,
        secretAccessKey: process.env.access_secret_token_bs,
        sessionToken: process.env.session_token_bs
    });
    dynamoDB = new AWS.DynamoDB.DocumentClient();
    return res(secret);
});

const getDB = () => {
    return dynamoDB;
};

module.exports = {
    getDB,
    configureDynamoDB
};