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
            controller  : 'statisticsController'
        })
        .otherwise({
        	redirectTo: '/'
      	});

}]);

app.controller('mainController', ['$rootScope', '$scope', '$http', '$location', '$timeout', function($rootScope, $scope, $http, $location, $timeout) {
    $scope.message = '';
    $scope.logIn = function(tip) {
		$http.post('/login', {'type': tip, 'user': $scope.user, 'password':$scope.password})
			.success(function(data, status, headers, config) {
                $scope.message = data['reply'];
                
	        	$timeout(function(){
                    if (!data['error']) {
                        $rootScope.user = $scope.user;
                        window.localStorage.setItem('user',$scope.user);
                        $location.path('/play');
                    }
                }, 1000*1);
	        	

	        })
	        .error(function(data, status, headers, config) {
	        	console.log('Error server');
	        });
    }

  window.sc = $scope;
}]);

app.controller('playController', ['$route', '$rootScope', '$scope', '$http','$location', '$timeout', function($route, $rootScope, $scope, $http, $location, $timeout) {
	$scope.user = window.localStorage.getItem('user');

    if (!$rootScope.lives) {
        $rootScope.dim = 4;
        $rootScope.lives = 3;
        $rootScope.score = 0;
    }

    $scope.list = [];
    for (var k = 0; k < $scope.dim; k++) {
        $scope.list[k] = k;
    }

    $http.post('/statistics', {'user': $scope.user})
        .success(function(data, status, headers, config) {
            $scope.highScore = Math.max.apply(Math,data['username_scores'])
        })
        .error(function(data, status, headers, config) {
            console.log('Error server');
        });

    $scope.h = $("#square").css("width").slice(0, -2);
    $scope.p = Math.floor($scope.h/$rootScope.dim - 1);
    $scope.ok = 0;
    $scope.mat = [[]];

    $http.post('/pattern', {'dimension': $rootScope.dim})
        .success(function(data, status, headers, config) {
            console.log(data['reply']);
            if (!data['error']) {
                $scope.mat = data['matrix'];
            }
        })
        .error(function(data, status, headers, config) {
            console.log('Error server');
        });

    $scope.logOut = function() {
        $rootScope.user = null;
        window.localStorage.clear();
        $location.path('/');
    }

    $timeout(function(){for (var i = 0; i < $scope.dim; i++) {
            for (var j = 0; j < $scope.dim; j++) {
                $scope.mat[i][j]--;
            }    
        }}, 700);

    $scope.check = function(i, j) {
        if ($scope.mat[i][j]) { 
            if ($scope.mat[i][j] == 1) {
                $scope.mat[i][j]++;
                $rootScope.score += $scope.dim;
                $scope.ok++;
                if ($scope.ok == $rootScope.dim) {
                    $rootScope.dim++;
                    $timeout(function(){$route.reload();}, 1000*1);
                }
            }
        }
        else {
            $scope.mat[i][j]--;
            $rootScope.lives--;
            if($rootScope.lives) {
                $scope.message = "BIG FAIL!!!";
                $timeout(function(){$route.reload();}, 1000*1);
            }
            else {
                $scope.message = "GAME OVER!!!";
                $http.post('/updatescore', {'user': $scope.user, 'score': $rootScope.score})
                    .success(function(data, status, headers, config) {
                    })
                    .error(function(data, status, headers, config) {
                        console.log('Error server');
                    });
                $rootScope.lives = 0;
                $timeout(function(){$rootScope.lives = null;$route.reload();}, 1000*1);
                
            }
        }
    }

    window.sc = $scope;

}]);


app.controller('statisticsController', ['$route', '$rootScope', '$scope', '$http','$location', '$timeout', function($route, $rootScope, $scope, $http, $location, $timeout) {
    $scope.user = window.localStorage.getItem('user');

    $scope.logOut = function() {
        $rootScope.user = null;
        window.localStorage.clear();
        $location.path('/');
    }

}]);

