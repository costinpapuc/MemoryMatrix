var app = angular.module('MemoryMatrixApp', ['ngRoute']);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl : 'main.html',
            controller  : 'mainController'
        })
        .when('/play', {
            templateUrl : 'play.html',
            controller  : 'playController'
        })
		.when('/statistics', {
            templateUrl : 'statistics.html',
            controller  : 'mainController'
        })
        .otherwise({
        	redirectTo: '/'
      	});

}]);

app.controller('mainController', ['$rootScope', '$scope', '$http', '$location', '$timeout', function($rootScope, $scope, $http, $location, $timeout) {
	$scope.message = 'Everyone come and see how good I look!';
    $scope.numbers = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15'];

    $scope.logIn = function(tip) {
        console.log("Apelez functia.");
		$http.post('/login', {'type': tip, 'user': $scope.user, 'password':$scope.password})
			.success(function(data, status, headers, config) {
	        	$scope.response = data;
	        	$timeout(function(){}, 1000*20);
	        	if (!data['error']) {
                    $rootScope.user = $scope.user;
                    window.localStorage.setItem('user',$scope.user);
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

app.controller('playController', ['$rootScope', '$scope', '$http','$location', function($rootScope, $scope, $http, $location) {
	$scope.user = window.localStorage.getItem('user');

    $scope.logOut = function(){
        $rootScope.user = null;
        window.localStorage.clear();
        $location.path('/');
    }   
}]);


app.controller('statisticsController', ['$scope', '$http', function($scope, $http) {
	$scope.message = 'Statistics';
}]);

