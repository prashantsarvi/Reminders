const jwt = require('jsonwebtoken');
const request = require ('request');
const bcrypt = require('bcryptjs');
var ObjectID = require('mongodb').ObjectID;
const snsService = require('../services/sns');

const TableName = 'users';

const signin = (req, res) => {
    const email = req.body.email;
	const password = req.body.password;
	if (!email) {
		return res.send("email cant be empty");
	}
	if (!password) {
		return res.send("password cant be empty");
	}
	const db = req.context.get('db');
	const getObj = {
		TableName,
		IndexName: 'email',
		KeyConditionExpression: 'email = :email',
		ExpressionAttributeValues: {
			':email': email
		}
	}
    db.query(getObj, (err, data) => {
        if (err) return res.send(err);
        if (!data || !data.Items || !data.Items.length) {
			return res.send('User does not exist. Please signup first!!');
		}

		const userObj = data.Items[0];
		if (!bcrypt.compareSync(password, userObj.password)) {
			return res.send("Incorrect password");
		}

		var payload = {
			userId: userObj.userId
		}
		const secret = req.context.get('secret');
		snsService.isSubscriptionPending(userObj.name, userObj.userId, secret, req.context.get('SNS'))
			.then(flag => {
				if (flag === '1'){
					return res.send('Please accept SNS subscription request before logging in!');
				} else if (!flag) {
					return res.send('Oops! Something went wrong, please contact Admin!');

				} else {
					var token = jwt.sign(payload, secret.secret, { expiresIn: '1h' });
					res.cookie('auth_token',token);
					return res.send('LOGIN_SUCCESS');
				}
			})
			.catch(e => res.send(e));
		
    });
};

const signout = (req, res) => {
	res.clearCookie("auth_token");
	res.sendStatus(200);
};

const userList = (req, res) => {
	res.send("hello");
};

const signup = (req, res) => {
	const secret = req.context.get('secret');
	const email = req.body && req.body.email;
	const name = req.body && req.body.name;
	let password = req.body && req.body.password;
	// const phone = req.body && req.body.phone;
    if (!email) return res.send('email cannot be empty');
    if (!name) return res.send('user name cannot be empty');
	if (!password) return res.send('password cannot be empty');
	const saltRounds = secret.salt;
	password = bcrypt.hashSync(password, parseInt(saltRounds));
	const verifyEmailAPI = secret.email_verify_api + email;
	const id = (new ObjectID()).toString();
	request(verifyEmailAPI, (err, resp, body) => {
		const result = body && JSON.parse(body);
		if (err) return res.send(err);
		if (!result || !result.smtpCheck) return res.send("Please enter a valid email address");
		const db = req.context.get('db');
		const getObj = {
			TableName,
			IndexName: 'email',
			KeyConditionExpression: 'email = :email',
			ExpressionAttributeValues: {
				':email': email
			}
		}
		db.query(getObj, (err, data) => {
			if (err) return res.send(err);
			if (data && data.Items && data.Items.length) {
				return res.send('User already exists. Please continue to login');
			} else {
				snsService.createTopicAndSubscribe(name, id, email, req.context.get('SNS'))
					.then(data => {
						if (!data || !data.SubscriptionArn) {
							return res.send('Unable to add user to subscription list. Please contact admin');
						} else {
							const insertObj = {
								TableName,
								Item: {
									email,
									name,
									password,
									userId: id
								}
							}
							db.put(insertObj, (err) => {
								if (err) return res.send(err);
								return res.send('Signup successful. Please accept the new SNS subscription sent via email and continue to login.');
							});
						}
					})
					.catch(err => res.send(`Error during signup. ${err}`));
			}
		});
	});
}

module.exports = {
    signin,
	userList,
	signout,
	signup
};