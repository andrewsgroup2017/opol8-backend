"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PubNub = require('pubnub');
class PubNubServer {
    constructor() {
        // private pubnub: any;
        this.pubnub = new PubNub({
            publishKey: 'pub-c-74b5b283-b890-42c5-96ad-5013b1c7c906',
            subscribeKey: 'sub-c-6c0fa8d2-850d-11e8-ac0f-0e4b9865ddaa'
        });
        console.log('Subscribing..');
        this.pubnub.subscribe({
            channels: ['general']
        });
    }
    publish(channel, message) {
        // console.log(
        // 	"Since we're publishing on subscribe connectEvent, we're sure we'll receive the following publish."
        // );
        var publishConfig = {
            channel: channel,
            message: message
        };
        this.pubnub.publish(publishConfig, function (status, response) {
            // console.log(status, response);
        });
    }
}
exports.default = new PubNubServer();
//# sourceMappingURL=PubNubServer.js.map