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
    var url = 'https://production-tractostation.herokuapp.com/api/v1/users/';//production
    // var url = 'https://stage-tractostation.herokuapp.com/api/v1/users/';//stage
    var url2 = 'https://production-tractostation.herokuapp.com/api/v1/units/';//production
    // var url2 = 'https://stage-tractostation.herokuapp.com/api/v1/units/';//stage

    var cusId = localStorage.getItem('ngStorage-custId');
    var usrId = localStorage.getItem('ngStorage-id');
    var units = {};
    var singleUnit = {};

    return {
        getUnitsData: function(){
            console.log('getUnitsData()');
            return $http.get(url+usrId+'/units/').then(function(response){
                var data = response.data;
                //do something exciting with the data
                return data;
            });
        },
        getUnitsLength: function(){
            console.log('getUnitsLength()');
            return $http.get(url+usrId+'/units/').then(function(response){
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
        },
        deleteUnit: function(unitId){
            console.log('deleteUnit()');
            return $http.delete(url2+unitId).then(function(response){
                console.log('logramos borrar!');
                console.log(response);
            }).catch(function(){
                console.log('no lo logramos borrar :(');
                console.log(response);
            });
        }
    }
})
.factory('OrdersData', function($http){
    var url = 'https://production-tractostation.herokuapp.com/api/v1/users/';//production
    // var url = 'https://stage-tractostation.herokuapp.com/api/v1/users/';//stage
    var urlCat = 'https://production-tractostation.herokuapp.com/api/v1/categories/';//production
    // var urlCat = 'https://stage-tractostation.herokuapp.com/api/v1/categories/';//stage
    var urlCus = 'https://production-tractostation.herokuapp.com/api/v1/customers/';//production
    // var urlCus = 'https://stage-tractostation.herokuapp.com/api/v1/customers/';//stage
    var urlSer = 'https://production-tractostation.herokuapp.com/api/v1/services/';//production
    // var urlSer = 'https://stage-tractostation.herokuapp.com/api/v1/services/';//stage
    var urlOrder = 'https://production-tractostation.herokuapp.com/api/v1/orders/';//production
    // var urlOrder = 'https://stage-tractostation.herokuapp.com/api/v1/orders/';//stage

    
    var cusId = localStorage.getItem('ngStorage-custId');
    var usrId = localStorage.getItem('ngStorage-id');
    console.log(usrId);
    var singleOrder = {};

    return {
        getOrdersData: function(uid){
            return $http.get(url+uid+'/orders/').then(function(response){
                var data = response.data;
                console.log(data);
                //do something exciting with the data
                return data;
            });
        },
        setSingleOrder: function(obj){
            singleOrder = obj;
        },
        getSingleOrder: function(orderId){
            console.log('getSingleUnit()');

            if (orderId === 'none') {
                console.log('none');
                console.log(singleOrder);
                return singleOrder;
            }else {
                return $http.get(url+usrId+'/orders/'+orderId).then(function(response){
                    singleOrder = response.data;
                    console.log(orderId);
                    console.log(singleOrder);
                    return singleOrder;
                });
            }
            console(singleOrder);
            
        },
        getSimpleUnits: function(customerId){
            return $http.get(url+usrId+'/simple_units/'+customerId).then(function(response){
                var data = response.data;
                //do something exciting with the data
                return data;
            });
        },
        getSimpleServices: function(){
            return $http.get(urlSer).then(function(response){
                var data = response.data;
                //do something exciting with the data
                return data;
            });
        },
        getSimpleCategories: function(){
            return $http.get(urlCat).then(function(response){
                var data = response.data;
                //do something exciting with the data
                return data;
            });  
        },
        getSimpleCustomers: function(){
            return $http.get(url+usrId+'/customers/').then(function(response){
                var data = response.data;
                //do something exciting with the data
                return data;
            });
        },
        postNewOrder: function(obj){
            console.log('postNewOrder()');
            return $http.post(url+usrId+'/orders/',obj).then(function(response){
                console.log('lo logramos!');
                console.log(response);
                var data = response.data;
                return data;
            }).catch(function(response){
                console.log('no lo logramos :(');
                console.log(response);
            });
        },
        updateOrder: function(orderId,obj){
            return $http.patch(url+usrId+'/orders/'+orderId,obj).then(function(response){
                console.log('logramos hacer put!');
                console.log(response)
            }).catch(function(){
                console.log('no lo logramos :(');
                console.log(response)
            });
        },
        deleteOrder: function(orderId){
            console.log('deleteUnit()');
            return $http.delete(url+usrId+'/orders/'+orderId).then(function(response){
                console.log('logramos borrar!');
                console.log(response);
            }).catch(function(){
                console.log('no lo logramos borrar :(');
                console.log(response);
            });
        }
    }
})
.factory('VehicleTypes', function($http){

    var url = 'https://production-tractostation.herokuapp.com/api/v1/vehicle_types';//production
    // var url = 'https://stage-tractostation.herokuapp.com/api/v1/vehicle_types';//stage
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

    var url_u = 'https://production-tractostation.herokuapp.com/api/v1/users/';//production
    // var url_u = 'https://stage-tractostation.herokuapp.com/api/v1/users/';//stage
    return {
        getUserData: function(id,uid){
            console.log('getUserData()');
            console.log(uid);
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
