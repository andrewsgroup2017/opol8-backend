"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import { Request } from '../App';
const TimeClockHandler_1 = require("./TimeClockHandler");
// import { ChallengeManager } from '../Challenges/ChallengeManager';
// import { InvalidTimeClockError } from '../TimeClocks/InvalidTimeClockError';
// import { Messenger } from '../Slack/Messenger';
class TimeClocksController {
    constructor(TimeClockHandler) {
        this.timeclocks = (tc) => {
            return this.TimeClockHandler
                .handle(tc)
                .then((result) => {
                console.log('in contorller: ', result);
                return result;
                // return res.status(200).json({ handled: true });
            })
                .catch((error) => {
                console.log('error', error);
                // return res.status(500).json(error);
                return false;
            });
        };
        this.TimeClockHandler = TimeClockHandler;
    }
}
exports.TimeClocksController = TimeClocksController;
exports.default = new TimeClocksController(new TimeClockHandler_1.TimeClockHandler());
//# sourceMappingURL=TimeClocksController.js.map