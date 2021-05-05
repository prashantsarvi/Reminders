const jwt = require('jsonwebtoken');
const AWS = require("aws-sdk");
var ObjectID = require('mongodb').ObjectID;

const TableName = 'notes';

const addNotes = (req, res) => {
    const db = req.context.get('db');
    const userId = req.context.get('userId');
    const title = req.body && req.body.title;
    const message = req.body && req.body.message;
    const noteId = (new ObjectID()).toString();
    if (!userId) return res.send('unauthorized user');
    if (!title) return res.send('title is a required field');
    if (!message) return res.send('message is a required field');
    const insertObj = {
        TableName,
        Item: {
            title,
            message,
            noteId,
            userId
        }
    }
    db.put(insertObj, (err) => {
        if (err) return res.send(err);
        return res.send('Note created successfully!!');
    });
};

const getNotesByUser = (req, res) => {
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
        return res.send(data && data.Items);
    });
};

const updateNotes = (req, res) => {
    const db = req.context.get('db');
    const userId = req.context.get('userId');
    const title = req.body && req.body.title;
    const message = req.body && req.body.message;
    const noteId = req.body && req.body.noteId;
    if (!userId) return res.send('unauthorized user');
    if (!title) return res.send('title is a required field');
    if (!message) return res.send('message is a required field');
    if (!noteId) return res.send('noteId is a required field');
    const updateObj = {
        TableName,
        Key: { noteId },
        UpdateExpression: 'set title = :title, message = :message',
        ExpressionAttributeValues: {
            ':title': title,
            ':message': message
        }
    }
    db.update(updateObj, (err, data) => {
        if (err) return res.send(err);
        return res.send('Note updated successfully!!');
    });
};

const deleteNotes = (req, res) => {
    const db = req.context.get('db');
    const userId = req.context.get('userId');
    const noteId = req.body && req.params.noteId;
    if (!userId) return res.send('unauthorized user');
    if (!noteId) return res.send('noteId is a required field');
    const deleteObj = {
        TableName,
        Key: { noteId }
    }
    db.delete(deleteObj, (err, data) => {
        if (err) return res.send(err);
        return res.send('Note deleted successfully!!');
    });
};

module.exports = {
    addNotes,
    getNotesByUser,
    updateNotes,
    deleteNotes
};