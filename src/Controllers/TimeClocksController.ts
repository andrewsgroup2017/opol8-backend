import { NextFunction, Response } from 'express';
import { Request } from '../App';
import { TimeClockHandler, TimeClockHandlerInterface, TimeClockInterface } from '../TimeClocks/TimeClockHandler';
// import { ChallengeManager } from '../Challenges/ChallengeManager';
import { InvalidTimeClockError } from '../TimeClocks/InvalidTimeClockError';
// import { Messenger } from '../Slack/Messenger';

export class TimeClocksController {
	TimeClockHandler: TimeClockHandlerInterface;

	constructor(TimeClockHandler: TimeClockHandlerInterface) {
		this.TimeClockHandler = TimeClockHandler;
	}

	public timeclocks = (req: Request, res: Response, next: NextFunction) => {
		this.TimeClockHandler
			.handle(<TimeClockInterface>req.body.TimeClock)
			.then((result: boolean) => {
				return res.status(200).json({ handled: true });
			})
			.catch((error: any) => {
				if (error instanceof InvalidTimeClockError) {
					return res.status(200).json({ handled: true });
				}

				console.log('error', error);
				return res.status(500).json(error);
			});
	};
}

export default new TimeClocksController(new TimeClockHandler());
