var myTodo=angular.module('myTodo',['ngMaterial', 'ngMessages']);

myTodo.controller("mainController",function($scope,$http){
	$scope.formData={};
	$scope.formData.date=new Date();




	


	$http.get('/profilepic').success(function(data){

		$scope.photo=data;
		

	}).error(function(data){
		console.log('error '+data);
	});


	$http.get('/todos').success(function(data){
		$scope.todos=data;
		//console.log(data);
	}).error(function(data){
		console.log('error'+data);
	});



	$http.get('/currentuser').success(function(data){
		$scope.user=data;
		//console.log(data);
	}).error(function(data){
		console.log('error'+data);
	});






	$scope.createTodo=function(){
		$http.post('/todos',$scope.formData).success(function(data){
			$scope.formData={};
			$scope.formData.date=new Date();
			$scope.todos=data;
			//console.log(data);
		}).error(function(data){
			console.log("error "+data);
		});
	};


	$scope.deleteTodo=function(id){
		$http.delete('/todos/'+id).success(function(data){
			$scope.todos=data;



			$http.get('/num_todos').success(function(data){
				visualize(data);
			}).error(function(data){
				console.log('error'+data);
			});



			//console.log(data);
		}).error(function(data){
			console.log("error"+data);
		});
	};

	$http.get('/num_todos').success(function(data){
		visualize(data);
	}).error(function(data){
		console.log('error'+data);
	});



	function visualize(data){
		 Highcharts.chart('chart', {
                    chart: {
                        type: 'column'
                    },
                    title: {
                        text: 'The number of todos completed each day'
                    },
                    exporting: { enabled: false },
                    xAxis: {
                        type: 'datetime',
                        dateTimeLabelFormats: { // don't display the dummy year
                            month: '%e. %b',
                            year: '%b'
                        },
                        title: {
                            text: 'Date'
                        }
                    },
                    yAxis: {
                        title: {
                            text: 'number of todos'
                        },
                        min: 0
                    },
                    tooltip: {
                        headerFormat: '<b>{series.name}</b><br>',
                        pointFormat: '{point.x:%e. %b}: {point.y} '
                    },
            
                    plotOptions: {
                        spline: {
                            marker: {
                                enabled: true
                            }
                        }
                    },
            
                    series: [{
                        name: 'todos',
                        // Define the data points. All series have a dummy year
                        // of 1970/71 in order to be compared on the same x axis. Note
                        // that in JavaScript, months start at 0 for January, 1 for February etc.
                        data: data
                    }]
                });

	}





});




