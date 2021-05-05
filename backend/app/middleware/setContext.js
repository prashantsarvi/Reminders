const dbConfig = require('../../config/dynamoDB');
const snsConfig = require('../../config/SNS');
const queueConfig = require('../../config/kue');
const secretsConfig = require('../../config/secretsManager');

const setContext = (req, res, next) => {
    req.context.set('db', dbConfig.getDB());
    req.context.set('SNS', snsConfig.getSNS());
    req.context.set('queue', queueConfig.getQueue());
    req.context.set('secret', secretsConfig.getSecret());
	return next();
}


module.exports = {
    setContext
}