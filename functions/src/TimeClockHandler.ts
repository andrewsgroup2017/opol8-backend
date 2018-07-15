// import * as requestPromise from 'request-promise';
// // import { TimeClockAttemptInterface } from '../Challenges/ChallengeManager';
// import { InvalidTimeClockError } from './InvalidTimeClockError';
import PubNubServer from './PubNubServer';
// // import { FirestoreFailure } from '../Challenges/FirestoreFailure';
// import * as functions from 'firebase-functions';
// import * as admin from 'firebase-admin';
import { db } from './index';
import * as firebaseHelper from 'firebase-functions-helper';
// import { FirebaseConnection } from './FirebaseConnection';
import * as requestPromise from 'request-promise';
export interface TimeClockHandlerInterface {
	handle(TimeClock: TimeClockInterface): Promise<any>;
}
export interface TimeClockInterface {
	employeeId: string;
	action: string;
	currentDevice: string;
	databaseKey: string;
	myKey: string;
	currentTimeClock: string;
	status: number;
	location?: string;
	print?: string;
	createdAt: string;
	startTime: string;
	// file: FireStoreInterface;
}

export class TimeClockHandler implements TimeClockHandlerInterface {
	// private db: any;

	private col: any;
	// constructor() {
	// 	this.db = db;
	// 	// FirebaseConnection.getConnection((connection) => {
	// 	// 	this.db = connection;
	// 	// });
	// }

	public async handle(TimeClock: TimeClockInterface) {
		try {
			this.verifyTimeClock(TimeClock);
			console.log('checking clock status ... ');
			var clockStatus = await this.checkClockStatus(TimeClock);

			console.log(clockStatus);
			switch (TimeClock.action) {
				case 'checkStatus': {
					// let message = { key: 'CLOCKED_STATUS', value: clockStatus };
					// // await PubNubServer.publish('ServerMessage', message);
					// console.log('m ', message);
					return clockStatus;
					break;
				}

				case 'clockIn': {
					console.log('clockStatus ', clockStatus);
					TimeClock.status = 0;
					// let loggedIn = await this.checkClockStatus(TimeClock);
					// console.log('logged in ', loggedIn);
					if (clockStatus) {
						return 'error';
						break;
					} else {
						let attempt = await this.handleCreate(TimeClock);
						// let message = { key: 'CLOCKED_IN', value: attempt };
						// console.log(message);
						// await PubNubServer.publish('ServerMessage', message);
						return attempt;
						break;
					}
					break;
				}
				case 'clockOut': {
					console.log('clockStatus ', clockStatus);
					if (clockStatus) {
						let attempt = await this.handleUpdate(TimeClock);
						return attempt;
						// let message = { key: 'CLOCKED_OUT', value: attempt };
						// console.log(message);
						// await 4Server.publish('ServerMessage', message);
					} else {
						// let message = { key: 'CLOCKED_OUT', value: false };
						// console.log(message);
						return 'error';
						break;
						// await PubNubServer.publish('ServerMessage', message);
					}
				}
				default: {
					// await PubNubServer.publish('error', `You need to select an action`);
					return false;

					break;
				}
			}
			// let score = await this.challengeManager.calcScore(attempt);

			return false;
		} catch (e) {
			console.log(e);
			// await PubNubServer.publish('error', `Error bub`);
			return false;
			// if (e instanceof FirestoreFailure) {
			// 	// await this.sendMessage(TimeClock, e.message);
			// 	return false;
			// } else {
			// 	throw e;
			// }
		}
	}
	private async checkClockStatus(TimeClock: TimeClockInterface) {
		console.log(TimeClock.databaseKey);
		var docRef = db.collection('employees').doc(TimeClock.databaseKey.toString());
		return docRef
			.get()
			.then(function(doc) {
				if (doc.exists) {
					if (doc.data().currentTimeClock !== 'undefined' && doc.data().currentTimeClockStatus < 1) {
						console.log('logged in');
						return true;
					} else {
						console.log('Not logged in');
						return false;
					}
				} else {
					console.log('No such employee!');
					return false;
				}
			})
			.catch(function(error) {
				console.log('Error getting document:', error);
				return false;
			});
	}

	private async handleUpdate(TimeClock: TimeClockInterface): Promise<any> {
		firebaseHelper.firestore.updateDocument(db, 'timeclocks', TimeClock.currentTimeClock, { status: 1 });

		firebaseHelper.firestore.updateDocument(db, 'employees', TimeClock.databaseKey, {
			currentTimeClockStatus: 1
		});

		return true;
	}

	private async handleCreate(TimeClock: TimeClockInterface): Promise<any> {
		const timeclocksCollection = 'timeclocks';
		var id = null;
		const ref = db.collection('timeclocks').doc();
		id = ref.id;
		TimeClock.myKey = ref.id;
		var r = await ref.set(TimeClock); // sets the contents of the doc using the id

		return firebaseHelper.firestore.updateDocument(db, 'employees', TimeClock.databaseKey, {
			currentTimeClock: id.toString(),
			currentTimeClockStatus: 0,
			currentDevice: TimeClock.currentDevice
		});
	}

	private async createClockHumanity(TimeClock: TimeClockInterface) {
		const options = {
			method: 'GET',
			//  uri: TimeClock.humanityToken,
			uri: 'adsf',
			headers: {
				// Authorization: `Bearer ${env.SLACK_BOT_TOKEN}`
			}
		};

		return await requestPromise(options);
	}

	private verifyTimeClock(TimeClock: TimeClockInterface) {
		console.log(TimeClock);
		if (!TimeClock.employeeId) {
			throw new Error('TimeClock does not have employeeId');
		}
		if (!TimeClock.action) {
			throw new Error('TimeClock does not have employeeId');
		}
		if (!TimeClock.databaseKey) {
			throw new Error('TimeClock does not have databaseKey');
		}
		if (!TimeClock.currentDevice) {
			throw new Error('TimeClock does not have currentDevice');
		}
	}
}
