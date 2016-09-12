angular.module('starter')
.factory('HeadersSave', function(){
    var headers = {};
    return{
        setHeaders: function(heads){
            headers = heads;
        },
        getHeaders: function(){
            return headers;
        }
    }
})
.factory('UnitsData', function($http){
    var url = 'https://stage-tractostation.herokuapp.com/api/v1/units';
    var units = {};
    return {
        getUnitsData: function(){
            console.log('getUnitsData()');
            return $http.get(url).then(function(response){
                var data = response.data;
                //do something exciting with the data
                return data;
            });
        },
        getUnitsLength: function(){
            console.log('getUnitsLength()');
            return $http.get(url).then(function(response){
                var data = response.data.length;
                //do something exciting with the data
                return data;
            });
        },
        setUnits: function(obj){
            units = obj;
        },
        getUnits: function(){
            return units;
        }
    }
})
.factory('OrdersData', function($http){
    var url = 'https://stage-tractostation.herokuapp.com/api/v1/orders';

    return {
        getOrdersData: function(){
            return $http.get(url).then(function(response){
                var data = response.data;
                //do something exciting with the data
                return data;
            });
        }
    }
})
.factory('UserData', function($http){

    var url_u = 'https://stage-tractostation.herokuapp.com/api/v1/users/';
    return {
        getUserData: function(id,uid){
            console.log('getUserData()');
            var ops = {
                method: 'GET',
                url: url_u+id,
                header: {
                    'Uid': uid
                }
            }
            return $http(ops).then(function(response){
                var data = response.data;
                //do something exciting with the data
                return data;
            });
        },
        getUserLength: function(id,uid){
            console.log('getUserLength()');
            var ops = {
                method: 'GET',
                url: url_u+id,
                header: {
                    'Uid': uid
                }
            }
            return $http(ops).then(function(response){
                var data = response.data.length;
                //do something exciting with the data
                return data;
            });
        }
    }
});
