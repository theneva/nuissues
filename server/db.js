var mongoose = require('mongoose');

var uri = process.env.MONGO_URI || 'mongodb://localhost/nuissues';

mongoose.connect(uri, function() {
	console.log('Connected to MongoDB on URI', uri);
});

module.exports = mongoose;
