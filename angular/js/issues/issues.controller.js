angular.module('nuissues').controller('IssuesController', function($scope, IssuesService) {
	$scope.items = [
		'hi',
		'there',
		'sup'
	];

	$scope.issues = {};

	IssuesService.readByStatus('todo').success(function(issues) {
		$scope.issues.todo = issues || [];
	});

	IssuesService.readByStatus('doing').success(function(issues) {
		$scope.issues.doing = issues || [];
	});

	IssuesService.readByStatus('done').success(function(issues) {
		$scope.issues.done = issues || [];
	});

	IssuesService.readByStatus('archived').success(function(issues) {
		$scope.issues.archived = issues || [];
	});

	$scope.newIssue = {};

	$scope.createIssue = function() {
		if (!$scope.newIssue.title) {
			alert('Please enter a title');
			return;
		}

		IssuesService.create($scope.newIssue).success(function(createdIssue) {
			$scope.issues.todo.push(createdIssue);
			$scope.newIssue = {};
		});
	};

	$scope.updateIssue = function(issue) {
		if (!issue.title || !issue.status) {
			alert('Please fill out all fields');
			return;
		}

		var legalStatuses = ['todo', 'doing'];

		if (!_.includes(legalStatuses, issue.status)) {
			alert('Please use of of the valid statuses: ' + legalStatuses);
			return;
		}

		IssuesService.update(issue._id, issue).success(function(oldIssue) {
			if (issue.status !== oldIssue.status) {
				_.remove($scope.issues[oldIssue.status], {_id: oldIssue._id});
				$scope.issues[issue.status].push(issue);
			}

			issue.changed = false;
		});
	};

	$scope.deleteIssue = function(issueToDelete) {
		IssuesService.delete(issueToDelete._id).success(function() {
			_.remove($scope.issues[issueToDelete.status], {_id: issueToDelete._id});
		});
	};

	$scope.restoreIssue = function(issueToRestore) {
		IssuesService.create(issueToRestore).success(function(createdIssue) {
			for (var category in $scope.issues) {
				$scope.issues[category].forEach(function(issue, issueIndex) {
					if (issue._id === issueToRestore._id) {	
						$scope.issues[category][issueIndex] = createdIssue;
						return;
					}
				});
			}
		});
	};
});