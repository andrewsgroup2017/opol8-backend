import * as requestPromise from 'request-promise';
import { TimeClockAttemptInterface } from '../Challenges/ChallengeManager';
import { InvalidTimeClockError } from './InvalidTimeClockError';
import * as pubnub from '../../pubnub';
import { FirestoreFailure } from '../Challenges/FirestoreFailure';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as firebaseHelper from 'firebase-functions-helper';
import { db } from '../App';
export interface TimeClockHandlerInterface {
	handle(TimeClock: TimeClockInterface): Promise<boolean>;
}

// interface FireStoreInterface {
// 	id: string;
// 	name: string;
// 	title: string;
// 	filetype: string;
// 	pretty_type: string;
// 	user: string;
// 	url_private_download: string;
// 	url_private: string;
// 	permalink_public: string;
// }

// employeeId: _id,
// currentDevice: deviceId,
// location: loc,
// print: print,
// createdAt: d.toString(),
// startTime: d.toString(),

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
	// challengeManager: ChallengeManagerInterface;
	// messenger: MessengerInterface;

	// constructor(challengeManager: ChallengeManagerInterface, messenger: MessengerInterface) {
	// 	this.challengeManager = challengeManager;
	// 	this.messenger = messenger;
	// }
	//   public async handle(event: EventInterface) {
	//     try {
	//         this.verifyEvent(event);
	//         let attempt = await this.handleAttempt(event);
	//         let score = await this.challengeManager.calcScore(attempt);
	//         await this.sendMessage(event, `Your score for ${attempt.challengeType} is ${score}`);

	//         return true;
	//     } catch (e) {
	//         if (e instanceof ChallengeFailure) {
	//             await this.sendMessage(event, e.message);
	//             return false;
	//         } else {
	//             throw e;
	//         }
	//     }
	// }
	// public async createTimeclock(TimeClock: TimeClockInterface) {
	// 	console.log(TimeClock);

	// 	try {
	// 		this.verifyTimeClock(TimeClock);
	// 		let attempt = await this.handleSave(TimeClock);
	// 		// let score = await this.challengeManager.calcScore(attempt);
	// 		// await this.sendMessage(TimeClock, `Your score for ${attempt.challengeType} is ${score}`);

	// 		return true;
	// 	} catch (e) {
	// 		console.log(e);
	// 		return false;
	// 		// if (e instanceof FirestoreFailure) {
	// 		// 	// await this.sendMessage(TimeClock, e.message);
	// 		// 	return false;
	// 		// } else {
	// 		// 	throw e;
	// 		// }
	// 	}
	// }

	// private async sendMessage(TimeClock: TimeClockInterface, message: string) {
	// 	// return this.messenger.sendMessage(TimeClock.channel, message);
	// }
	public async handle(TimeClock: TimeClockInterface) {
		try {
			this.verifyTimeClock(TimeClock);
			console.log('checking clock status ... ');
			var clockStatus = await this.checkClockStatus(TimeClock);

			console.log(clockStatus);
			switch (TimeClock.action) {
				case 'checkStatus': {
					let message = { key: 'CLOCKED_STATUS', value: clockStatus };
					await pubnub.publish('ServerMessage', message);
					return true;
					break;
				}

				case 'clockIn': {
					console.log('clockStatus ', clockStatus);
					TimeClock.status = 0;
					let loggedIn = await this.checkClockStatus(TimeClock);
					console.log('logged in ', loggedIn);
					if (!loggedIn) {
						let attempt = await this.handleCreate(TimeClock);
						let message = { key: 'CLOCKED_IN', value: attempt };
						console.log(message);
						await pubnub.publish('ServerMessage', message);
						return true;
					}
					return false;
					break;
				}
				case 'clockOut': {
					console.log('clockStatus ', clockStatus);
					if (clockStatus) {
						let attempt = await this.handleUpdate(TimeClock);
						let message = { key: 'CLOCKED_OUT', value: attempt };
						console.log(message);
						await pubnub.publish('ServerMessage', message);
					} else {
						let message = { key: 'CLOCKED_OUT', value: false };
						console.log(message);
						await pubnub.publish('ServerMessage', message);
					}
					return true;
					break;
				}
				default: {
					await pubnub.publish('error', `You need to select an action`);
					return false;

					break;
				}
			}
			// let score = await this.challengeManager.calcScore(attempt);

			return false;
		} catch (e) {
			console.log(e);
			await pubnub.publish('error', `Error bub`);
			return false;
			// if (e instanceof FirestoreFailure) {
			// 	// await this.sendMessage(TimeClock, e.message);
			// 	return false;
			// } else {
			// 	throw e;
			// }
		}
	}
	// 	let message = { key: 'CLOCKED_STATUS', value: attempt };
	// 					console.log(message);
	// await pubnub.publish('ServerMessage', message);
	// private async onlyCheckClockStatus(TimeClock: TimeClockInterface): Promise<boolean> {
	// 	var docRef = db.collection('employees').doc(TimeClock.databaseKey);
	// 	var message = { key: 'CLOCKED_STATUS', value: 'bad' };
	// 	docRef
	// 		.get()
	// 		.then(function(doc) {
	// 			if (doc.exists) {
	// 				// console.log('Document data:', doc.data());
	// 				if (doc.data().currentTimeClock !== 'undefined') {
	// 					console.log('logged in');
	// 					message = { key: 'CLOCKED_STATUS', value: 'true' };
	// 					pubnub.publish('ServerMessage', message);
	// 					return true;
	// 				} else {
	// 					console.log('Not logged in');
	// 					message = { key: 'CLOCKED_STATUS', value: 'false' };
	// 					pubnub.publish('ServerMessage', message);
	// 					return false;
	// 				}
	// 			} else {
	// 				// doc.data() will be undefined in this case
	// 				console.log('No such employee!');
	// 				message = { key: 'CLOCKED_STATUS', value: 'false' };
	// 				pubnub.publish('ServerMessage', message);
	// 				return false;
	// 			}
	// 		})
	// 		.catch(function(error) {
	// 			console.log('Error getting document:', error);
	// 			return false;
	// 		});
	// 	console.log('end');
	// 	return pubnub.publish('ServerMessage', message);
	// }

	private async checkClockStatus(TimeClock: TimeClockInterface) {
		var docRef = db.collection('employees').doc(TimeClock.databaseKey);
		let b = 'bad';
		var message = { key: 'CLOCKED_STATUS', value: 'bad' };
		return docRef
			.get()
			.then(function(doc) {
				if (doc.exists) {
					// console.log('Document data:', doc.data());
					if (doc.data().currentTimeClock !== 'undefined' && doc.data().currentTimeClockStatus < 1) {
						console.log('logged in');
						b = 'true';
						// if (TimeClock.action === 'checkStatus') {
						// 	message = { key: 'CLOCKED_STATUS', value: 'true' };
						// 	pubnub.publish('ServerMessage', message);
						// }
						return true;
					} else {
						console.log('Not logged in');
						b = 'false';
						// if (TimeClock.action === 'checkStatus') {
						// 	message = { key: 'CLOCKED_STATUS', value: 'false' };
						// 	pubnub.publish('ServerMessage', message);
						// }
						return false;
					}
				} else {
					// doc.data() will be undefined in this case
					console.log('No such employee!');
					b = 'false';
					// if (TimeClock.action === 'checkStatus') {
					// 	message = { key: 'CLOCKED_STATUS', value: 'false' };
					// 	pubnub.publish('ServerMessage', message);
					// }
					return false;
				}
			})
			.catch(function(error) {
				console.log('Error getting document:', error);
				return false;
			});
		// console.log('end');
		//  return await b;
	}

	private async handleUpdate(TimeClock: TimeClockInterface): Promise<any> {
		firebaseHelper.firestore.updateDocument(db, 'timeclocks', TimeClock.currentTimeClock, { status: 1 });
		// .then((result) => {
		// 	console.log('asdf ', result);
		// });

		firebaseHelper.firestore.updateDocument(db, 'employees', TimeClock.databaseKey, {
			currentTimeClockStatus: 1
		});
		// .then((result) => {
		// 	console.log('asdf ', result);
		// });

		return true;
	}

	private async handleCreate(TimeClock: TimeClockInterface): Promise<TimeClockAttemptInterface> {
		const timeclocksCollection = 'timeclocks';
		var id = null;
		const ref = db.collection('timeclocks').doc();
		id = ref.id;
		TimeClock.myKey = ref.id;
		var r = await ref.set(TimeClock); // sets the contents of the doc using the id
		// .then(() => {
		// 	// fetch the doc again and show its data
		// 	ref.get().then((doc) => {
		// 		console.log('finished making doc ', doc.id);
		// 	});
		// });
		return firebaseHelper.firestore.updateDocument(db, 'employees', TimeClock.databaseKey, {
			currentTimeClock: id.toString(),
			currentTimeClockStatus: 0
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
			throw new InvalidTimeClockError('TimeClock does not have employeeId');
		}
		if (!TimeClock.databaseKey) {
			throw new InvalidTimeClockError('TimeClock does not have databaseKey');
		}
		if (!TimeClock.currentDevice) {
			throw new InvalidTimeClockError('TimeClock does not have currentDevice');
		}
	}
}
