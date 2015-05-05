var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');

var port = 6789;
var app = express();

app.use(morgan('dev'));
app.use('/', express.static(__dirname + '/../angular'));
app.use('/api', bodyParser.json());
app.use('/api', require('./controllers'));

app.listen(port, function() {
	console.log('NUIssues server listening on port', port);
});
