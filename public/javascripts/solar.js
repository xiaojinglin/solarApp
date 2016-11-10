// Declaration of app module
var app = angular.module('Solar',['ngResource', 'ngRoute']);

//Using the config method of the app module to provide configuration for our application
app.config(['$routeProvider', function($routeProvider){
    //Using the when method of $routeProvider to configure a route
    $routeProvider
        .when('/', {
            templateUrl: 'partials/home.html',
            controller: 'HomeCtrl'
        })
        .when('/add-product', {
            templateUrl: 'partials/product-form.html',
            controller: 'AddProductCtrl'
        })
        .when('/product/:id', {
            templateUrl: 'partials/product-form.html',
            controller: 'EditProductCtrl'
        })
        .when('/product/delete/:id', {
        templateUrl: 'partials/product-delete.html',
        controller: 'DeleteProductCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
}]);

// A directive that useing for the website
app.directive("headerDirective", function() {
  return {
    templateUrl : 'templates/header.html',
  };
});

//A controller for home
app.controller('HomeCtrl', ['$scope', '$resource',function($scope, $resource){
    var Products = $resource('/api/products');
    Products.query(function(products){
        $scope.products = products;
    });
}]);

//A controller for adding product
app.controller('AddProductCtrl', ['$scope', '$resource', '$location',function($scope, $resource, $location){
    $scope.save = function(){
        var Products = $resource('/api/products');
        Products.save($scope.product, function(){
            $location.path('/');
        });
    };
  }]);

//A controller for editing product
app.controller('EditProductCtrl', ['$scope', '$resource', '$location', '$routeParams',
  function($scope, $resource, $location, $routeParams){
    var Products = $resource('/api/products/:id', { id: '@_id' }, {
        update: { method: 'PUT' }
    });
    Products.get({ id: $routeParams.id }, function(product){
      $scope.product = product;
    });
    $scope.save = function(){
      Products.update($scope.product, function(){
        $location.path('/');
        });
      };
  }]);

//A controller for deleting product
app.controller('DeleteProductCtrl', ['$scope', '$resource', '$location', '$routeParams',
    function($scope, $resource, $location, $routeParams){
        var Products = $resource('/api/products/:id');
        Products.get({ id: $routeParams.id }, function(product){
            $scope.product = product;
        })
        $scope.delete = function(){
            Products.delete({ id: $routeParams.id }, function(product){
                $location.path('/');
            });
        };
    }]);
