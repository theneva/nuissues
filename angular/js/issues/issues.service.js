angular.module('nuissues').service('IssuesService', function($http) {
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
