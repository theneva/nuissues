var app = angular.module('nuissues', [
]);

app.controller('IssuesController', function($scope, IssuesService) {
	$scope.issues = {};

	IssuesService.readByStatus('todo').success(function(issues) {
		$scope.issues.todo = issues;
	});

	IssuesService.readByStatus('doing').success(function(issues) {
		$scope.issues.doing = issues;
	});

	IssuesService.readByStatus('done').success(function(issues) {
		$scope.issues.done = issues;
	});

	IssuesService.readByStatus('archived').success(function(issues) {
		$scope.issues.archived = issues;
	});

	var recentlyDeletedIssues = [];

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

	$scope.updateIssue = function(id, issue) {
		if (!issue.title || !issue.status) {
			alert('Please fill out all fields');
			return;
		}

		IssuesService.update(id, issue);
	};

	$scope.deleteIssue = function(issueToDelete) {
		IssuesService.delete(issueToDelete._id).success(function() {
			console.log('$scope.issues', $scope.issues);
			
			for (var category in $scope.issues) {
				$scope.issues[category].forEach(function(issue, issueIndex) {
					console.log('issue', issue);
					if (issue._id === issueToDelete._id) {
						console.log('found issue');
						issue.deleted = true;
						return;
					}
				});
			}
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

app.service('IssuesService', function($http) {
	var service = this;

	service.create = function(issue) {
		return $http.post('/api/issues', issue);
	};

	service.read = function() {
		return $http.get('/api/issues');
	};

	service.readByStatus = function(status) {
		return $http.get('/api/issues?status=' + status);
	};

	service.update = function(id, changedFields) {
		return $http.put('/api/issues/' + id, changedFields);
	};

	service.delete = function(id) {
		return $http.delete('/api/issues/' + id);
	};
});