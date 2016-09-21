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
    var url = 'https://production-tractostation.herokuapp.com/api/v1/customer/units/';
    var url2 = 'https://production-tractostation.herokuapp.com/api/v1/units/';
    var cusId = localStorage.getItem('ngStorage-custId');
    var units = {};
    var singleUnit = {};

    return {
        getUnitsData: function(){
            console.log('getUnitsData()');
            return $http.get(url+cusId).then(function(response){
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
            console.log('setUnits()');
            units = obj;
        },
        getUnits: function(){
            console.log('getUnits()');
            return units;
        },
        setSingleUnit: function(obj){
            console.log('setSingleUnit()');
            singleUnit = obj;
            console.log(singleUnit);
        },
        getSingleUnit: function(unitId){
            console.log('getSingleUnit()');

            if (unitId === 'none') {
                for(i=0; i < singleUnit.unit_filters.length ;i++){
                    singleUnit.unit_filters[i].last_change = new Date(singleUnit.unit_filters[i].last_change);
                    singleUnit.unit_filters[i].next_change = new Date(singleUnit.unit_filters[i].next_change);
                }
                console.log(singleUnit);
                return singleUnit;
            }else {
                return $http.get(url2+unitId).then(function(response){
                    singleUnit = response.data;
                    for(i=0; i < singleUnit.unit_filters.length ;i++){
                        singleUnit.unit_filters[i].last_change = new Date(singleUnit.unit_filters[i].last_change);
                        singleUnit.unit_filters[i].next_change = new Date(singleUnit.unit_filters[i].next_change);
                    }
                    console.log(singleUnit);
                    return singleUnit;
                });
            }
            
        },
        postNewUnit: function(obj){
            return $http.post(url2,obj).then(function(response){
                console.log('lo logramos!');
                console.log(response)
            }).catch(function(response){
                console.log('no lo logramos :(');
                console.log(response)
            });
        },
        updateUnit: function(unitId,obj){
            return $http.patch(url2+unitId,obj).then(function(response){
                console.log('logramos hacer put!');
                console.log(response)
            }).catch(function(){
                console.log('no lo logramos :(');
                console.log(response)
            });
        }
    }
})
.factory('OrdersData', function($http){
    var url = 'https://production-tractostation.herokuapp.com/api/v1/customer/orders/';
    var cusId = localStorage.getItem('ngStorage-custId');
    var singleOrder = {};

    return {
        getOrdersData: function(){
            return $http.get(url+cusId).then(function(response){
                var data = response.data;
                //do something exciting with the data
                return data;
            });
        },
        setSingleOrder: function(obj){
            singleOrder = obj;
        },
        getSingleOrder: function(){
            return singleOrder;
        }
    }
})
.factory('VehicleTypes', function($http){

    var url = 'https://production-tractostation.herokuapp.com/api/v1/vehicle_types';
    var filters = {};
    return {
        getVehicleType: function(){
            console.log('getVehicleType()');
             return $http.get(url).then(function(response){
                var data = response.data;
                //do something exciting with the data
                console.log(data);
                return data;
            });
        }
    }
})
.factory('UserData', function($http){

    var url_u = 'https://production-tractostation.herokuapp.com/api/v1/users/';
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
