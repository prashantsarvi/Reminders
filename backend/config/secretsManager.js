const AWS = require('aws-sdk');
const BlueBirdPromise = require('bluebird');

    let secret;

const configureSecret = () => new BlueBirdPromise((res) => {
    AWS.config.update({
        region: process.env.region_ps,
        accessKeyId: process.env.access_key_id_ps,
        secretAccessKey: process.env.access_secret_token_ps,
        sessionToken: process.env.session_token_ps
    });

 client = new AWS.SecretsManager({
    region: process.env.region_ps
});

client.getSecretValue({SecretId: process.env.secretName}, function(err, data) {
    if (err) {
       throw err;
    }
    else if ('SecretString' in data) {
            secret = data.SecretString;
        } 
    return res();
});
    
});

const getSecret = () => {
return JSON.parse(secret); 
};

module.exports = {
    getSecret,
    configureSecret
};