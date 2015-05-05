var router = require('express').Router();

var Issue = require('../models/issue');

router.get('/', function(req, res) {
	var status = req.query.status;
	if (!status) {
		Issue.find(function(err, issues) {
			return res.json(issues);
		});		
	} else {
		console.log('status=', status);
		Issue.find({status: status}, function(err, issues) {
			return res.json(issues);
		});
	}
});

router.post('/', function(req, res) {
	var issue = new Issue(req.body);
	issue.status = 'todo';
	issue.save(function() {
		return res.status(201).json(issue);
	});
});

router.put('/:id', function(req, res) {
	var id = req.params.id;
	Issue.findById(id, function(err, issue) {
		if (!issue) {
			return res.status(404).send('No issue found with id: ' + id);
		}
		var fields = req.body;
		if (fields.title) {
			issue.title = fields.title;
		}
		if (fields.description) {
			issue.description = fields.description;
		}
		if (fields.status) {
			issue.status = fields.status;
		}
		if (fields.minutesLogged) {
			issue.minuesLogged = fields.minutesLogged;
		}
		issue.save(function() {
			return res.json(issue);
		});
	});
});

router.delete('/:id', function(req, res) {
	var id = req.params.id;
	Issue.findById(id, function(err, issue) {
		if (!issue) {
			return res.status(404).send('No issue found with id: ' + id);
		}

		issue.remove(function() {
			return res.send();
		});
	});
});

module.exports = router;