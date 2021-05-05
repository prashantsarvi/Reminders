const BlueBirdPromise = require('bluebird');

const publishMessage = ({ name, id, message }, arn, sns) => new BlueBirdPromise((res, rej) => {
    var publishTextPromise = sns.publish({
        Message: message,
        TopicArn: `${arn}${name}_${id}`
      });

publishTextPromise.promise()
.then(data => res(data))
.catch(err => rej(err));
});

const createTopic = (topicName, sns) => new BlueBirdPromise((res, rej) => {
    const createTopicPromise = sns.createTopic({Name: topicName});
    createTopicPromise.promise()
        .then(data => res(data && data.TopicArn))
        .catch(err => rej(err));
});

const isSubscriptionPending = (name, id, secret, sns) => new BlueBirdPromise((res, rej) => {
    var getTopicAttribsPromise = sns.getTopicAttributes({TopicArn: `${secret.arn_ps}${name}_${id}`});

getTopicAttribsPromise.promise()
    .then(data => res(data && data.Attributes && data.Attributes.SubscriptionsPending))
    .catch(err => rej(err));

});

const sendSubscription = (TopicArn, email, sns) => new BlueBirdPromise((res, rej) => {
    const subscribePromise = sns.subscribe({
        Protocol: 'EMAIL',
        TopicArn,
        Endpoint: email
        });
    subscribePromise.promise()
        .then(data => res(data))
        .catch(err => rej(err));
});

const createTopicAndSubscribe = (name, id, email, sns) => new BlueBirdPromise((res, rej) => {
    createTopic(`${name}_${id}`, sns)
        .then((topicArn) => sendSubscription(topicArn, email, sns))
        .then(data => res(data))
        .catch(err => rej(err));
});

module.exports = {
    publishMessage,
    createTopic,
    isSubscriptionPending,
    sendSubscription,
    createTopicAndSubscribe
}