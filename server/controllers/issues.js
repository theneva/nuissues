var router = require('express').Router();

var Issue = require('../models/issue');

router.get('/', function(req, res) {
	var status = req.query.status;
	if (!status) {
		Issue.find(function(err, issues) {
			return res.json(issues);
		});		
	} else {
		Issue.find()
			.where({status: status})
			.sort('index')
			.exec(function(err, issues) {
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

		var oldIssue = {
			_id: issue._id,
			title: issue.title,
			description: issue.description,
			status: issue.status,
			index: issue.index,
			minutesLogged: issue.minutesLogged,
			created: issue.created,
			__v: issue.__v
		};

		var fields = req.body;

		if (fields.title !== undefined) {
			issue.title = fields.title;
		}
		if (fields.description !== undefined) {
			issue.description = fields.description;
		}
		if (fields.status !== undefined) {
			issue.status = fields.status;
		}
		if (fields.index !== undefined) {
			issue.index = fields.index;
		}
		if (fields.minutesLogged !== undefined) {
			issue.minuesLogged = fields.minutesLogged;
		}
		issue.save(function() {
			return res.json(oldIssue);
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