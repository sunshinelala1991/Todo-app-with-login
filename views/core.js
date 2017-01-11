var myTodo=angular.module('myTodo',[]);

function mainController($scope,$http){
	$scope.formData={};


	$http.get('/profilepic').success(function(data){

		$scope.photo=data;
		

	}).error(function(data){
		console.log('error '+data);
	});


	$http.get('/todos').success(function(data){
		$scope.todos=data;
		console.log(data);
	}).error(function(data){
		console.log('error'+data);
	});



	$http.get('/currentuser').success(function(data){
		$scope.user=data;
		console.log(data);
	}).error(function(data){
		console.log('error'+data);
	});






	$scope.createTodo=function(){
		$http.post('/todos',$scope.formData).success(function(data){
			$scope.formData={};
			$scope.todos=data;
			console.log(data);
		}).error(function(data){
			console.log("error "+data);
		});
	};


	$scope.deleteTodo=function(id){
		$http.delete('/todos/'+id).success(function(data){
			$scope.todos=data;
			console.log(data);
		}).error(function(data){
			console.log("error"+data);
		});
	};


}

