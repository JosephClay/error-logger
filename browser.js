const request = require('superagent');
const isError = require('lodash/isError');
const stacktraceJs = require('stacktrace-js');

const stacktrace = error => {
	return isError(error) ? 
		stacktraceJs.fromError(error) : 
		stacktraceJs.get();
};

const logToServer = url => (
	log => request.post(url).send(log)
);

const logToConsole = log => console.error('js error:', JSON.parse(JSON.stringify(log)));

const unhandledError = err => {
	console.error('js error: unhandled:', err);
};

const handle = log => (
	function handle(message, file, line, col, error) {
		stacktrace(error)
			.then(stack => ({
				stack,
				error,
				message,
				file,
				line,
				col,
				level: 'severe',
				type: 'unhandled error'
			}))
			.then(log)
			.catch(unhandledError);
	}
);

module.exports = ({ debug = true, url = '' }) => {
	const log = debug || !url ? logToConsole : logToServer(url);

	return {
		listen() {
			global.onerror = handle(log);
			global.error = handle(log);
		},
		log(error, level = 'debug') {
			return stacktrace(error)
				.then(stack => ({
					stack,
					error,
					level,
					type: 'handled error'
				}))
				.then(log)
				.catch(unhandledError);
		}
	};
};