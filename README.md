# error-logger

js browser-to-server error logger 

`npm install @immutabl3/error-logger`

# about

Uses [stacktrace-js](https://github.com/stacktracejs/stacktrace.js/) and [mailgun-js](https://www.npmjs.com/package/mailgun-js) to catch and email errors from client-side applications.

# Browser

```js
const errorLogger = require('@immutable/error-logger/browser');

const logger = errorLogger({
	// if true, errors won't be reported to the server
	// they will instead be logged to the console
	debug: false,
	// url to POST the log
	url: '/error'
});

// listen for any uncaught errors on the window
logger.listen();

// log an error manually by passing an Error object
logger.log(error, [level = 'debug']);
```

# Express

```js
const errorLogger = require('@immutable/error-logger/express');

const logger = errorLogger({
	// mailgun configuration
	mailgunKey: '',
	mailgunDomain: '',
	// from email address
	from: ''
	// to email address
	to: ''
	// [optional] string to place in the subject line
	subject: ''
});

app.post('/error', logger);
```

# License

MIT