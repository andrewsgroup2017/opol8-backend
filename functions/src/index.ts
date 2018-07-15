import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { TimeClockHandler, TimeClockHandlerInterface, TimeClockInterface } from './TimeClockHandler';
import TimeClocksController from './TimeClocksController';
// import { FirebaseConnection } from './FirebaseConnection';
admin.initializeApp();
export const db = admin.firestore();

//onTimeClockCreate.post({TimeClock: {foo: 'foo'}})
//onTimeClockCreate.post('').json({data: {TimeClock: {userId: 123123}}})
//onTimeClockCreate.post('').json({data: {TimeClock: {action: 'checkStatus', employeeId: 1444044, databaseKey: 666, currentDevice: 'yomamma' }}})
exports.onTimeClockCreate = functions.https.onCall((data, context) => {
	const newData = data.TimeClock;

	return new Promise((res, rej) => {
		// 		const newData = snap.data();
		res(TimeClocksController.timeclocks(newData));
		// res(TimeClocksController.timeclocks(newData));
		// TimeClocksController.timeclocks(newData);
	});
});

// export const onTimeClockCreateb = functions.firestore.document('timeclocks/{id}').onCreate((snap, context) => {
// 	return new Promise((res, rej) => {
// 		console.log('adsfadsfadsfsadf');
// 		const newData = snap.data();
// 		TimeClocksController.timeclocks(snap.data());
// 		// .handle(<TimeClockInterface>newData)
// 		// .then((result: boolean) => {
// 		// 	// return res.status(200).json({ handled: true });
// 		// 	res();
// 		// })
// 		// .catch((error: any) => {
// 		// 	// if (error instanceof InvalidTimeClockError) {
// 		// 	//   // return res.status(200).json({ handled: true });
// 		// 	// res()
// 		// 	// }
// 		// 	// console.log('error', error);
// 		// 	// return res.status(500).json(error);
// 		// 	rej();
// 		// });
// 		// newData.weather = newData.weather.toUpperCase();
// 		// this.db
// 		// 	.collection('weather-data')
// 		// 	.doc(context.params.location)
// 		// 	.set(newData)
// 		// 	.then((docRef) => {
// 		// 		console.log('Document updated');
// 		// 		res();
// 		// 	})
// 		// 	.catch((err) => {
// 		// 		console.log('Error updating new document.');
// 		// 		console.log(err);
// 		// 		rej();
// 		// 	});
// 	});
// });

// export const onWeatherUpdate = functions.firestore.document('weather-data/{location}').onCreate((snap, context) => {
// 	return new Promise((res, rej) => {
// 		const newData = snap.data();
// 		newData.weather = newData.weather.toUpperCase();
// 		admin
// 			.firestore()
// 			.collection('weather-data')
// 			.doc(context.params.location)
// 			.set(newData)
// 			.then((docRef) => {
// 				console.log('Document updated');
// 				res();
// 			})
// 			.catch((err) => {
// 				console.log('Error updating new document.');
// 				console.log(err);
// 				rej();
// 			});
// 	});
// });

// export const addWeatherData = functions.https.onRequest((req, res) => {
// 	const data = req.body;
// 	if (data.location && data.temp && data.weather) {
// 		const location = data.location;
// 		delete data.location;
// 		admin
// 			.firestore()
// 			.collection('weather-data')
// 			.doc(location)
// 			.set(data)
// 			.then((docRef) => {
// 				res.send('Document created!');
// 			})
// 			.catch((error) => {
// 				console.log(error);
// 				res.status(500).send(error);
// 			});
// 	} else {
// 		res.status(500).send('Invalid params provided to the API.');
// 	}
// });

// export const countryWeather = functions.https.onRequest((req, res) => {
// 	admin
// 		.firestore()
// 		.doc('countries/usa')
// 		.get()
// 		.then((countrySnapshot) => {
// 			const cities = countrySnapshot.data().cities;
// 			const p = [];
// 			for (const city in cities) {
// 				const cityData = admin.firestore().doc(`weather-data/${cities[city]}`).get();
// 				p.push(cityData);
// 			}
// 			console.log(p);
// 			return Promise.all(p);
// 		})
// 		.then((weather) => {
// 			const results = [];
// 			weather.forEach((cityWeather) => {
// 				const data = cityWeather.data();
// 				results.push(data);
// 			});
// 			res.send(results);
// 		})
// 		.catch((error) => {
// 			console.log(error);
// 			res.status(500).send(error);
// 		});
// });

// //Get boston weather
// export const getWeather = functions.https.onRequest((request, response) => {
// 	admin
// 		.firestore()
// 		.doc('weather-data/boston')
// 		.get()
// 		.then((resData) => {
// 			const data = resData.data();
// 			response.send(data);
// 		})
// 		.catch((error) => {
// 			response.status(500).send({
// 				error: 'There was an error getting the requested data.'
// 			});
// 		});
// });

// export const getUser = functions.https.onRequest((request, response) => {
// 	response.send({
// 		username: request.body,
// 		password: 'helloWorld'
// 	});
// });
