// was getting a "ReferenceError: regeneratorRuntime is not defined" error
// requiring 'babel-polyfill' was the quick fix
require('babel-polyfill');

import * as Webtask from 'webtask-tools';
import App from './src/App';
import * as pubnub from './pubnub';

pubnub.setup();

setTimeout(function() {
	pubnub.publish('Server Started', 'Server has been started');
}, 2000);

module.exports = Webtask.fromExpress(App);
// var server = App.listen(process.env.PORT || 8091);
// server.close();

// App.listen(8091, () => {
// 	console.log(`Listening at http://localhost:8091`);
// });
// module.exports = App;
// const server = App.listen(3000, function() {
// 	var port = server.address().port;
// 	console.log('Example app listening at port %s', port);
// });
// module.exports = server;
