const PubNub = require('pubnub');

class PubNubServer {
	// private pubnub: any;
	private pubnub = new PubNub({
		publishKey: 'pub-c-74b5b283-b890-42c5-96ad-5013b1c7c906',
		subscribeKey: 'sub-c-6c0fa8d2-850d-11e8-ac0f-0e4b9865ddaa'
	});

	constructor() {
		console.log('Subscribing..');
		this.pubnub.subscribe({
			channels: [ 'general' ]
		});
	}
	public publish(channel, message) {
		// console.log(
		// 	"Since we're publishing on subscribe connectEvent, we're sure we'll receive the following publish."
		// );
		var publishConfig = {
			channel: channel,
			message: message
		};
		this.pubnub.publish(publishConfig, function(status, response) {
			// console.log(status, response);
		});
	}

	// public setup = function() {
	// 	try {
	// 		this.pubNubServer = new PubNub({
	// 			publishKey: 'pub-c-74b5b283-b890-42c5-96ad-5013b1c7c906',
	// 			subscribeKey: 'sub-c-6c0fa8d2-850d-11e8-ac0f-0e4b9865ddaa'
	// 		});
	// 	} catch (error) {
	// 		console.log(error);
	// 	}
	// };
	//   public  addListener({
	//       status: function(statusEvent: any) {
	//         if (statusEvent.category === 'PNConnectedCategory') {
	//           // publishSampleMessage();

	//         }
	//       },
	//         message: function(msg) {
	//           console.log(msg.message.title)
	//           console.log(msg.message.description)
	//         },
	//   presence: function(presenceEvent) {
	//     // handle presence
	//   }
	// })
}
export default new PubNubServer();
