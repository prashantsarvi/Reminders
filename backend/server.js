const express    = require('express');
const bodyParser = require('body-parser');
const context = require('express-context-store');
const dotenv = require('dotenv');
const jwt    = require('jsonwebtoken');
const cp = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const BlueBirdPromise = require('bluebird');
const authRouter = require('./app/routes/authRouter');
const { configureDynamoDB } = require('./config/dynamoDB');
const { configureSNS } = require('./config/SNS');
const { startQueues } = require('./config/kue');
const { configureSecret, getSecret } = require('./config/secretsManager');
const { authenticate } = require('./app/middleware/authentication');
const { setContext } = require('./app/middleware/setContext');
const app	= express();
app.use(context());
dotenv.config();

const PORT = process.env.PORT || 8000;

app.use(cors({credentials: true, origin: "http://localhost:3000"}));
app.use(cp());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({}));

app.use(express.static(path.join(__dirname, '../client/build/')));

app.get(['/', '/dashboard', '/login'], (req, res) => {
	res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

app.use((req, res, next) => setContext(req, res, next));

app.use(authRouter); // login

app.use((req, res, next) => authenticate(req, res, next)); // authentication middleware

app.use(require('./app/routes')); // app routes

app.use('/*', (req, res) => {
	res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

const appStart = () => new BlueBirdPromise((res) => {
	app.listen(PORT, () => {
		return res();
	});
});

configureSecret()
	.then(console.log('Secrets fetch successful'))
	.then(getSecret)
	.then(configureDynamoDB)
	.then(console.log('DynamoDB connection successful'))
	.then(configureSNS)
	.then(console.log('SNS connection successful'))
	.then(startQueues)
	.then(console.log('kue initiation successful'))
	.then(appStart)
	.then(console.log('Server started successfully'))
	.catch(e => console.log(e));