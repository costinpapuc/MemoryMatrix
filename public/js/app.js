var app = angular.module('MemoryMatrixApp', ['ngRoute']);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl : 'main.html',
            controller  : 'mainController'
        })
        .when('/play', {
            templateUrl : 'play.html',
            controller  : 'mainController'
        })
		.when('/statistics', {
            templateUrl : 'statistics.html',
            controller  : 'mainController'
        })
        .otherwise({
        	redirectTo: '/'
      	});

}]);

app.controller('mainController', ['$scope', '$http', '$location', '$timeout', function($scope, $http, $location, $timeout) {
	$scope.message = 'Everyone come and see how good I look!';

    $scope.logIn = function(tip) {
		$http.post('/login', {'type': tip, 'user': $scope.user, 'password':$scope.password})
			.success(function(data, status, headers, config) {
	        	$scope.response = data;
	        	$timeout(function(){}, 1000*20);
	        	if (!data['error']) {
	        		$location.path('/play');
	        	}

	        })
	        .error(function(data, status, headers, config) {
	        	console.log('Error server');
	        });
    }

    $scope.message = 'Play with me!';

  window.sc = $scope;
}]);

app.controller('playController', ['$scope', '$http', function($scope, $http) {
	$scope.message = 'Play with me!';
	$scope.user = "Maria";
}]);


app.controller('statisticsController', ['$scope', '$http', function($scope, $http) {
	$scope.message = 'Statistics';
}]);

