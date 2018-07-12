'use strict';

const Pubsub = require('@google-cloud/pubsub');
const config = require('../config');
const logging = require('./logging');

const topicName = config.get('TOPIC_NAME');

const pubsub = Pubsub({
	projectId: config.get('GCLOUD_PROJECT')
});

// This configuration will automatically create the topic if
// it doesn't yet exist. Usually, you'll want to make sure
// that a least one subscription exists on the topic before
// publishing anything to it as topics without subscribers
// will essentially drop any messages.
// [START topic]
function getTopic(cb) {
	pubsub.createTopic(topicName, (err, topic) => {
		// topic already exists.
		if (err && err.code === 6) {
			cb(null, pubsub.topic(topicName));
			return;
		}
		cb(err, topic);
	});
}
// [END topic]

// Adds a book to the queue to be processed by the worker.
// [START queue]
function queueBook(bookId) {
	getTopic((err, topic) => {
		if (err) {
			logging.error('Error occurred while getting pubsub topic', err);
			return;
		}

		const data = {
			action: 'processBook',
			bookId: bookId
		};

		const publisher = topic.publisher();
		publisher.publish(Buffer.from(JSON.stringify(data)), (err) => {
			if (err) {
				logging.error('Error occurred while queuing background task', err);
			} else {
				logging.info(`Book ${bookId} queued for background processing`);
			}
		});
	});
}
// [END queue]

module.exports = {
	queueBook
};
