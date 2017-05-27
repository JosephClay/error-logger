const Promise = require('bluebird');
const mailgunJs = require('mailgun-js');

module.exports = ({
	mailgunKey,
	mailgunDomain,
	from = '',
	to = '',
	subject = ''
}) => {
	const mailgun = mailgunJs({
		apiKey: mailgunKey,
		domain: mailgunDomain,
	});

	const logToEmail = function(data) {
		return Promise.resolve()
			.then(function() {
				return new Promise(function(resolve, reject) {
					mailgun.messages().send(data, function(err, body) {
						if (err) return reject(err);
						resolve(body);
					});
				});
			});
	};

	const fromLine = `error-logger ${from ? `<${from}>` : ''}`;
	const subjectLine = `error-logger:${subject ? ` ${subject}: ` : ''}`;

	return (req, res) => {
		const { body } = req;

		return logToEmail({
			to,
			from: fromLine,
			subject: `${subjectLine} ${body.level}: ${body.message}`,
			text: JSON.stringify(body, null, 2)
		})
			.then(body => res.json(body))
			.catch(err => res.status(500).json(err));
	};
};