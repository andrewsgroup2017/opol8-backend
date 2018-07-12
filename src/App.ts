import * as express from 'express';
import { NextFunction, Request as Req, Response } from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import EventsController from './Controllers/EventsController';
import TimeClocksController from './Controllers/TimeClocksController';
import Middleware from './Middleware';
import SlashController from './Controllers/SlashController';
import InteractivesController from './Controllers/InteractivesController';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as firebaseHelper from 'firebase-functions-helper';
import * as pubnub from './Notifications/PubNubServer';
var cors = require('cors');

admin.initializeApp(functions.config().firebase);

// const pn = pubnub.getServer();

export const db = admin.firestore();

export interface Request extends Req {
	webtaskContext: WebtaskContext;
}

export interface WebtaskContext {
	secrets: {
		SLACK_VERIFICATION_TOKEN: string;
		SLACK_BOT_TOKEN: string;
		SLACK_OAUTH_TOKEN: string;
	};
}

class App {
	// ref to Express instance
	public express: express.Application;

	//Run configuration methods on the Express instance.
	constructor() {
		this.express = express();
		this.middleware();
		this.routes();
	}

	// Configure Express middleware.
	private middleware(): void {
		this.express.use(logger('dev'));
		this.express.use(bodyParser.json());
		this.express.use(bodyParser.urlencoded({ extended: false }));

		// catch 404 and forward to error handler
		this.express.use(function(req, res, next) {
			res.header('Access-Control-Allow-Origin', '*');
			res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
			next();
		});

		this.express.use((err: any, req: Request, res: Response, next: NextFunction) => {
			// error handlers

			// development error handler
			// will print stacktrace
			if (this.express.get('env') === 'development') {
				console.log('hi');
				console.log(req.baseUrl);
				res.status(err.status || 500);
				return res.json({
					type: 'Error',
					message: err.message,
					error: err
				});
			}

			// production error handler
			res.status(err.status || 500);
			res.json({
				type: 'Error',
				message: err.message,
				error: {}
			});
		});
	}

	// Configure API endpoints.
	private routes(): void {
		let router = express.Router();
		this.express.use('/', router);
		router.post('/timeclocks', TimeClocksController.timeclocks);
		router.post('/events', Middleware.urlVerification, EventsController.events);
		router.post('/slash', Middleware.checkBodyToken, SlashController.slash);
		router.post(
			'/interactive',
			Middleware.decodePayload,
			Middleware.checkBodyToken,
			InteractivesController.interaction
		);
		const contactsCollection = 'contacts';

		// Add new contact
		router.post('/contacts', (req, res) => {
			firebaseHelper.firestore.creatNewDocument(db, contactsCollection, req.body);
			res.send('Create a new contact');
		});
		// Update new contact
		router.patch('/contacts/:contactId', (req, res) => {
			firebaseHelper.firestore.updateDocument(db, contactsCollection, req.params.contactId, req.body);
			res.send('Update a new contact');
		});
		// View a contact
		router.get('/contacts/:contactId', (req, res) => {
			firebaseHelper.firestore
				.getDocument(db, contactsCollection, req.params.contactId)
				.then((doc) => res.status(200).send(doc));
		});
		// View all contacts
		router.get('/contacts', (req, res) => {
			firebaseHelper.firestore.backup(db, contactsCollection).then((data) => res.status(200).send(data));
		});
		// Delete a contact
		router.delete('/contacts/:contactId', (req, res) => {
			firebaseHelper.firestore.deleteDocument(db, contactsCollection, req.params.contactId);
			res.send('Document deleted');
		});

		this.express.use((req, res, next) => {
			console.log(req.baseUrl);
			console.log('hi');
			let err: any = new Error('Not Found');
			err.status = 404;
			next(err);
		});
	}
}

export default new App().express;
