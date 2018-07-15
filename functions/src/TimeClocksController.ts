import { NextFunction, Response } from 'express';
// import { Request } from '../App';
import { TimeClockHandler, TimeClockHandlerInterface, TimeClockInterface } from './TimeClockHandler';
// import { ChallengeManager } from '../Challenges/ChallengeManager';
// import { InvalidTimeClockError } from '../TimeClocks/InvalidTimeClockError';
// import { Messenger } from '../Slack/Messenger';
export class TimeClocksController {
	TimeClockHandler: TimeClockHandlerInterface;

	constructor(TimeClockHandler: TimeClockHandlerInterface) {
		this.TimeClockHandler = TimeClockHandler;
	}

	public timeclocks = (tc): Promise<any> => {
		return this.TimeClockHandler
			.handle(<TimeClockInterface>tc)
			.then((result: any) => {
				console.log('in contorller: ', result);
				return result;
				// return res.status(200).json({ handled: true });
			})
			.catch((error: any) => {
				console.log('error', error);
				// return res.status(500).json(error);
				return false;
			});
	};
}

export default new TimeClocksController(new TimeClockHandler());
