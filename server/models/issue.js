var db = require('../db');

var Issue = db.model('Issue', {
	title: String,
	description: String,
	status: String,
	index: Number,
	minutesLogged: Number,
	created: {type: Date, default: Date.now}
});

module.exports = Issue;
