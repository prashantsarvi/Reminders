const jwt    = require('jsonwebtoken');

const authenticate = (req, res, next) => {
	const secret = req.context.get('secret');
	let authToken = req.cookies.auth_token;
	if (authToken) {
		try {
			authToken = jwt.verify(authToken, secret.secret);
		} catch (e) {
			console.log(e);
			return next('Session expired. Please login again');
		}
		const db = req.context.get('db');
		var params = {
			TableName: 'users',
			Key:{
				userId: authToken.userId
			}
		};		
		db.get(params, (err, userRecord) => {
			if (err) return res.send(err);
			userRecord = userRecord.Item;
			if (userRecord && userRecord.userId === authToken.userId) {
				req.context.set('userId', authToken.userId);
				req.context.set('userName', userRecord.name);
				return next();
			} else {
				res.clearCookie("auth_token");
				return res.redirect('/');
			}
		});
	}
	else return res.redirect("/");
}


module.exports = {
    authenticate
}