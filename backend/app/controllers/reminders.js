const moment = require('moment');
const kue = require('kue');
const ObjectID = require('mongodb').ObjectID;
const _ = require('lodash');

const TableName = 'reminders';

const addReminders = (req, res) => {
    const db = req.context.get('db');
    const userId = req.context.get('userId');
    const userName = req.context.get('userName');
    const title = req.body && req.body.title;
    const message = req.body && req.body.message;
    let date = req.body && req.body.date;
    let userDate = date;
    const reminderId = (new ObjectID()).toString();
    if (!userId) return res.send('unauthorized user');
    if (!title) return res.send('title is a required field');
    if (!message) return res.send('message is a required field');
    if (!date) return res.send('date is a required field');
    try {
        date = moment(new Date(date)).toISOString();
    } catch(e) {
        return res.send(e);
    }
    const insertObj = {
        TableName,
        Item: {
            title,
            message,
            reminderId,
            reminderDate: date,
            userId
        }
    }
    const queue = req.context.get('queue');
    const job = queue.create('reminder', {
        message: `${title} -> ${message}`,
        id: userId,
        name: userName
    }).delay(moment.utc(new Date(userDate)).diff(moment.utc()))
      .save((e) => {
          if (e) return res.send(e);
          insertObj.Item.jobId = job && job.id;
          db.put(insertObj, (err) => {
              if (err) return res.send(err);
                return res.send('Reminder created successfully!!');
          });
      });
};

const getRemindersByUser = (req, res) => {
    const db = req.context.get('db');
    const userId = req.context.get('userId');
    if (!userId) return res.send('unauthorized user');
    const getObj = {
        TableName,
        IndexName: 'userId',
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
            ':userId': userId
        }
    }
    db.query(getObj, (err, data) => {
        if (err) return res.send(err);
        const list = _.orderBy(data && data.Items, ['reminderId'], ['desc']);
        return res.send(list);
    });
};

const updateReminders = (req, res) => {
    const db = req.context.get('db');
    const userId = req.context.get('userId');
    const userName = req.context.get('userName');
    const title = req.body && req.body.title;
    const message = req.body && req.body.message;
    const reminderId = req.body && req.body.reminderId;
    let date = req.body && req.body.date;
    let userDate = date;
    if (!userId) return res.send('unauthorized user');
    if (!title) return res.send('title is a required field');
    if (!message) return res.send('message is a required field');
    if (!reminderId) return res.send('reminderId is a required field');
    if (!date) return res.send('date is a required field');
    try {
        date = moment(new Date(date)).toISOString();
    } catch(e) {
        console.log(date, 'date', e)
        return res.send(e);
    }

    const readObj = {
        TableName,
        Key:{
            reminderId
        }
    };
    db.get(readObj, function(err, data) {
        if (err) console.log(err);
        const reminderObj = data.Item;
        const updateObj = {
            TableName,
            Key: { reminderId },
            UpdateExpression: 'set title = :title, message = :message, reminderDate = :date',
            ExpressionAttributeValues: {
                ':title': title,
                ':message': message,
                ':date': date
            }
        }
        if (reminderObj && reminderObj.jobId) {
            const queue = req.context.get('queue');
            kue.Job.get(reminderObj.jobId, function(err, job1){
                if (job1 && !err) {
                    job1.remove(function(err){
                      if (err) console.log(err);
                      console.log('removed completed job #%d', job1.id);
                      const job = queue.create('reminder', {
                          message: `${title} -> ${message}`,
                          id: userId,
                          name: userName
                      }).delay(moment.utc(new Date(userDate)).diff(moment.utc()))
                        .save((e) => {
                            if (e) return res.send(e);
                            updateObj.UpdateExpression = updateObj.UpdateExpression.concat(', jobId = :jobId');
                            updateObj.ExpressionAttributeValues[':jobId'] = job && job.id;
                            db.update(updateObj, (err, data) => {
                                if (err) return res.send(err);
                                return res.send('Reminder updated successfully!!');
                            });
                        });
                    });
                } else {
                    const job = queue.create('reminder', {
                        message: `${title} -> ${message}`,
                        id: userId,
                        name: userName
                    }).delay(moment.utc(new Date(userDate)).diff(moment.utc()))
                      .save((e) => {
                          if (e) return res.send(e);
                          updateObj.UpdateExpression = updateObj.UpdateExpression.concat(', jobId = :jobId');
                          updateObj.ExpressionAttributeValues[':jobId'] = job && job.id;
                          db.update(updateObj, (err, data) => {
                              if (err) return res.send(err);
                              return res.send('Reminder updated successfully!!');
                          });
                      });
                }
              });
        } else {
            db.update(updateObj, (err, data) => {
                if (err) return res.send(err);
                return res.send('Reminder updated successfully!!');
            });
        }
    });
};

const deleteReminders = (req, res) => {
    const db = req.context.get('db');
    const userId = req.context.get('userId');
    const reminderId = req.body && req.params.reminderId;
    if (!userId) return res.send('unauthorized user');
    if (!reminderId) return res.send('reminderId is a required field');
    const readObj = {
        TableName,
        Key:{
            reminderId
        }
    };
    
    db.get(readObj, function(err, data) {
        if (err) console.log(err);
        const reminderObj = data.Item;
        const deleteObj = {
            TableName,
            Key: { reminderId }
        }
        if (reminderObj && reminderObj.jobId) {
            const queue = req.context.get('queue');
            kue.Job.get(reminderObj.jobId, function(err, job){
                if (job && !err) {
                    job.remove(function(err){
                      if (err) console.log(err);
                      console.log('removed completed job #%d', job.id);
                      db.delete(deleteObj, (err) => {
                          if (err) return res.send(err);
                          return res.send('Reminder deleted successfully!!');
                      });
                    });
                } else {
                    db.delete(deleteObj, (err) => {
                        if (err) return res.send(err);
                        return res.send('Reminder deleted successfully!!');
                    });
                }
              });
        } else {
            db.delete(deleteObj, (err) => {
                if (err) return res.send(err);
                return res.send('Reminder deleted successfully!!');
            });
        }
    });
};

module.exports = {
    addReminders, 
    getRemindersByUser, 
    updateReminders, 
    deleteReminders
};