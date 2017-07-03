angular.module('todoApp')
  .controller('todoCtrl', ['$scope', '$http', 'todoService', function ($scope, $http, todoService) {


    $scope.formData = {};

    //GET
    // when landing on the page, get all todos and show them
    // use the service to get all the todos
    todoService.get()
      .success(function (data) {
        $scope.todos = data;
      }).error(function (data) {
        console.log('Error: ' + data);
      });

    //CREATE
    $scope.createTodo = function () {
      // validate the formData to make sure that something is there
      // if form is empty, nothing will happen
      // people can't just hold enter to keep adding the same to-do anymore
      if (!$.isEmptyObject($scope.formData)) {

        // call the create function from our service (returns a promise object)
        todoService.create($scope.formData)

          // if successful creation, call our get function to get all the new todos
          .success(function (data) {
            $scope.formData = {}; // clear the form so our user is ready to enter another
            $scope.todos = data; // assign our new list of todos
          });
      }
    }

    // DELETE ==================================================================
    // delete a todo after checking it
    $scope.deleteTodo = function (id) {
      todoService.delete(id)
        // if successful creation, call our get function to get all the new todos
        .success(function (data) {
          $scope.todos = data; // assign our new list of todos
        });
    };


}]);
