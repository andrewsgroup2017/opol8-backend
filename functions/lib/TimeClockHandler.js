"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// // import { FirestoreFailure } from '../Challenges/FirestoreFailure';
// import * as functions from 'firebase-functions';
// import * as admin from 'firebase-admin';
const index_1 = require("./index");
const firebaseHelper = require("firebase-functions-helper");
// import { FirebaseConnection } from './FirebaseConnection';
const requestPromise = require("request-promise");
class TimeClockHandler {
    // constructor() {
    // 	this.db = db;
    // 	// FirebaseConnection.getConnection((connection) => {
    // 	// 	this.db = connection;
    // 	// });
    // }
    handle(TimeClock) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.verifyTimeClock(TimeClock);
                console.log('checking clock status ... ');
                var clockStatus = yield this.checkClockStatus(TimeClock);
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
                        }
                        else {
                            let attempt = yield this.handleCreate(TimeClock);
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
                            let attempt = yield this.handleUpdate(TimeClock);
                            return attempt;
                            // let message = { key: 'CLOCKED_OUT', value: attempt };
                            // console.log(message);
                            // await 4Server.publish('ServerMessage', message);
                        }
                        else {
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
            }
            catch (e) {
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
        });
    }
    checkClockStatus(TimeClock) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(TimeClock.databaseKey);
            var docRef = index_1.db.collection('employees').doc(TimeClock.databaseKey.toString());
            return docRef
                .get()
                .then(function (doc) {
                if (doc.exists) {
                    if (doc.data().currentTimeClock !== 'undefined' && doc.data().currentTimeClockStatus < 1) {
                        console.log('logged in');
                        return true;
                    }
                    else {
                        console.log('Not logged in');
                        return false;
                    }
                }
                else {
                    console.log('No such employee!');
                    return false;
                }
            })
                .catch(function (error) {
                console.log('Error getting document:', error);
                return false;
            });
        });
    }
    handleUpdate(TimeClock) {
        return __awaiter(this, void 0, void 0, function* () {
            firebaseHelper.firestore.updateDocument(index_1.db, 'timeclocks', TimeClock.currentTimeClock, { status: 1 });
            firebaseHelper.firestore.updateDocument(index_1.db, 'employees', TimeClock.databaseKey, {
                currentTimeClockStatus: 1
            });
            return true;
        });
    }
    handleCreate(TimeClock) {
        return __awaiter(this, void 0, void 0, function* () {
            const timeclocksCollection = 'timeclocks';
            var id = null;
            const ref = index_1.db.collection('timeclocks').doc();
            id = ref.id;
            TimeClock.myKey = ref.id;
            var r = yield ref.set(TimeClock); // sets the contents of the doc using the id
            return firebaseHelper.firestore.updateDocument(index_1.db, 'employees', TimeClock.databaseKey, {
                currentTimeClock: id.toString(),
                currentTimeClockStatus: 0,
                currentDevice: TimeClock.currentDevice
            });
        });
    }
    createClockHumanity(TimeClock) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = {
                method: 'GET',
                //  uri: TimeClock.humanityToken,
                uri: 'adsf',
                headers: {
                // Authorization: `Bearer ${env.SLACK_BOT_TOKEN}`
                }
            };
            return yield requestPromise(options);
        });
    }
    verifyTimeClock(TimeClock) {
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
exports.TimeClockHandler = TimeClockHandler;
//# sourceMappingURL=TimeClockHandler.js.map