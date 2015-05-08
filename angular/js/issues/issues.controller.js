angular.module('nuissues').controller('IssuesController', function($scope, IssuesService) {
	$scope.validStatuses = ['todo', 'doing', 'done'];

	$scope.swimlaneSortOptions = {
		itemMoved: function(event) {
			var sourceIndex = event.source.index;
			var sourceStatus = event.source.sortableScope.$parent.status;
			var destIndex = event.dest.index;
			var destStatus = event.dest.sortableScope.$parent.status;

			var issue = $scope.issues[destStatus][destIndex];
			issue.status = destStatus;
			issue.index = destIndex;

			IssuesService.update(issue._id, {
				status: issue.status,
				index: issue.index
			}).success(function() {
				for (var issueBelowSourceIndex = sourceIndex; issueBelowSourceIndex < $scope.issues[sourceStatus].length; issueBelowSourceIndex++) {
					var issueBelowSource = $scope.issues[sourceStatus][issueBelowSourceIndex];
					issueBelowSource.index--;
					IssuesService.update(issueBelowSource._id, {index: issueBelowSource.index});
				}

				for (var issueBelowDestIndex = destIndex + 1; issueBelowDestIndex < $scope.issues[destStatus].length; issueBelowDestIndex++) {
					var issueBelowDest = $scope.issues[destStatus][issueBelowDestIndex];
					issueBelowDest.index++;
					IssuesService.update(issueBelowDest._id, {index: issueBelowDest.index});
				}
			});
		},
		orderChanged: function(event) {
			var sourceIndex = event.source.index;
			var destIndex = event.dest.index;
			var destStatus = event.dest.sortableScope.$parent.status;
			
			var issue = $scope.issues[destStatus][destIndex];
			
			IssuesService.update(issue._id, {index: destIndex}).success(function() {
				issue.index = destIndex;
				issue.status = destStatus;

				var start;
				var end;

				if (sourceIndex < destIndex) {
					start = sourceIndex;
					end = destIndex - 1;
				} else {
					start = destIndex + 1;
					end = sourceIndex;
				}

				for (var i = start; i <= end; i++) {
					var issueToUpdate = $scope.issues[destStatus][i];
					
					if (sourceIndex < destIndex) {
						issueToUpdate.index--;
					} else {
						issueToUpdate.index++;
					}

					IssuesService.update(issueToUpdate._id, {index: issueToUpdate.index});
				}
			});
		}
	};

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

	$scope.newIssue = {};

	$scope.createIssue = function() {
		if (!$scope.newIssue.title) {
			alert('Please enter a title');
			return;
		}

		$scope.newIssue.index = $scope.issues.todo.length;

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

		if (!_.includes($scope.validStatuses, issue.status)) {
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
			for (var issueBelowDeletedIndex = issueToDelete.index; issueBelowDeletedIndex < $scope.issues[issueToDelete.status].length; issueBelowDeletedIndex++) {
				var issueBelowDeleted = $scope.issues[issueToDelete.status][issueBelowDeletedIndex];
				issueBelowDeleted.index--;
				IssuesService.update(issueBelowDeleted._id, {index: issueBelowDeleted.index});
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
