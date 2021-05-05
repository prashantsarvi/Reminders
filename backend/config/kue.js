const redis = require('redis');
const kue = require('kue');
const BlueBirdPromise = require('bluebird');
const snsService = require('../app/services/sns');
const snsConfig = require('./SNS');

let queue;
let sns_arn;

const startQueues = (secret) => new BlueBirdPromise((res) => {
    queue = kue.createQueue({
        redis: {
            createClientFactory: () => {
                return redis.createClient(secret.redis,
                {
                    tls: {
                        rejectUnauthorized: false
                    }
                });
            }
        }
    });
    sns_arn = secret.arn_ps;
    queue.process('reminder', (job, done) => {
        const sns = snsConfig.getSNS();
        snsService.publishMessage(job.data, sns_arn, sns)
            .then(() => {
                job.remove(function(err){
                    if (err) throw err;
                    console.log('removed completed job #%d', job.id);
                    done();
                  });
            }).catch(e => done(e));
    });
    return res(secret);
});

const getQueue = () => {
    return queue;
};

module.exports = {
    startQueues,
    getQueue
};