angular.module('starter.controllers', [
  'ngStorage',
  'ngMap',
  'ng-token-auth'
])
//––––––––––––––– LoginCtrl –––––––––––––––//
.controller('LoginCtrl', function($scope, $stateParams, $state, $localStorage, $ionicHistory, $ionicPopup, $auth, $ionicLoading, UserData, HeadersSave) {
  $ionicLoading.show();
  $auth.validateUser().then(function(resp){
    $state.go('app.resumen');
  }).catch(function(resp){
    $ionicLoading.hide();
  });

  $scope.$sesion = $localStorage;
  console.log("LoginCtrl");
  $scope.loginForm = {};

  $scope.btnClick = function (){
    $ionicLoading.show();
    $auth.submitLogin($scope.loginForm)
      .then(function(resp) {
        HeadersSave.setHeaders(resp);
        var str = localStorage.auth_headers;
        var pre_sesion = str.replace("-","_");
        var sesion = JSON.parse(pre_sesion);
        $scope.$sesion.headers= sesion;
        $scope.$sesion.id = resp.id;
        $scope.$sesion.custId = resp.customer_id;
        UserData.getUserData($scope.$sesion.id, $scope.$sesion.header).then(function(response){
          $scope.$sesion.user = response;
          $ionicLoading.hide();
          $state.go('app.resumen');
        }).catch(function(response){
          $ionicLoading.hide();
          $scope.showAlert2();
        });

      })
      .catch(function(resp) {
        $scope.showAlert();
        $ionicLoading.hide();
    });
  }

  // An alert dialog
  $scope.showAlert = function() {
    var alertPopup = $ionicPopup.alert({
      title: 'Intento fallido',
      template: 'El usuario o la contraseña que ingresaste son incorrectos'
    });
    alertPopup.then(function(res) {
    });
  };
  $scope.showAlert2 = function() {
    var alertPopup = $ionicPopup.alert({
      title: 'Algo salió mal',
      template: 'Algo ocurrió mientras intentabamos recuperar tus datos, intenta de nuevo'
    });
    alertPopup.then(function(res) {
    });
  };

})// END LoginCtrl

//––––––––––––––– AppCtrl –––––––––––––––//
.controller('AppCtrl',
function($scope, $ionicModal, $ionicPopup, $timeout, $ionicPlatform, $state, $localStorage){

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  
  // La Plataforma ionic está lista
  $ionicPlatform.ready(function() {
    $scope.$sesion = $localStorage;

    $scope.nombre = $scope.$sesion.user.name+' '+$scope.$sesion.user.paternal_lastname+' '+$scope.$sesion.user.maternal_lastname;
    $scope.elnombre = $scope.$sesion.user.name;
    $scope.paterno = $scope.$sesion.user.paternal_lastname;
    $scope.materno = $scope.$sesion.user.maternal_lastname;
    if ($scope.$sesion.user.roles != ''){
      if ($scope.$sesion.user.roles[0].name === 't_admin') {
        $scope.rol = 'Administrador';
        $scope.rolId = 0;
      }else if ($scope.$sesion.user.roles[0].name === 't_manager') {
        $scope.rol = 'Gerente';
        $scope.rolId = 1;
      }else if ($scope.$sesion.user.roles[0].name === 't_mechanic') {
        $scope.rol = 'Mecánico';
        $scope.rolId = 2;
      }
    }else{
      $scope.rol = '';
    }
    $scope.correo = $scope.$sesion.user.email;
    if($scope.$sesion.user.customer.name != null){
      $scope.cliente = $scope.$sesion.user.customer.name;
      $scope.clienteId = $scope.$sesion.user.customer.id;
    }else{
      $scope.cliente = '';
      $scope.clienteId = '';
    }
    console.log('Rol: '+$scope.rolId);
	});
})//END AppCtrl

//––––––––––––––– ConfigCtrl –––––––––––––––//
.controller('ConfigCtrl', function($scope, $state, $stateParams, $localStorage,$ionicHistory, $ionicLoading, $auth, UserData) {
  $scope.$sesion = $localStorage;
  $scope.signOutClick = function() {
    console.log('botón de cerrar Sesion');
    $ionicLoading.show();
    $auth.signOut()
      .then(function(resp) {
        // handle success response
        console.log(resp);
        console.log("adiós sesión jajajajaja >:)");
        $ionicLoading.hide();
        $window.localStorage.clear();
        $ionicHistory.clearCache();
        $ionicHistory.clearHistory();
        $state.go('login');
      })
      .catch(function(resp) {
        // handle error response
        console.log(resp);
        console.log("cerrar Sesión incorrecto");
        $ionicLoading.hide();
      });
  };
  $ionicLoading.show();
  UserData.getSomeData().then(function(response){
    $scope.users = response;
    console.log(response);
    $ionicLoading.hide();
  }).catch(function(response){
    $ionicLoading.hide();
  });

})//END ConfigCtrl

//––––––––––––––– UnidadesCtrl –––––––––––––––//
.controller('UnidadesCtrl',
  function($filter, $scope, $state, $stateParams, $localStorage,$ionicLoading,$ionicHistory, $ionicModal,UnitsData,VehicleTypes) {
  
  console.log($ionicHistory.backView());
  $ionicLoading.show();
  $scope.$sesion = $localStorage;
  $scope.clientId = $scope.$sesion.user.customer.id;
  $scope.filtersOn = false;
  $scope.vehicles = {};//objeto que guarda los tipos de vehículo
  $scope.object = {};//objeto que se va a enviar contiene unidad y filtros
  $scope.unidad = {};//objeto que contiene los datos de la unidad
  $scope.filts = [];//arreglo que contiene los filtros de la unidad

  UnitsData.getUnitsData().then(function(response){
    $scope.units = response;
    UnitsData.setUnits(response);    $ionicLoading.hide();
  }).catch(function(response){
    console.log(response);
  });

  $scope.goUnit = function(unitId){
    $scope.singleUnit = $filter('filter')($scope.units, {id:unitId});
    UnitsData.setSingleUnit($scope.singleUnit[0]);
    $state.go('app.unidad', {unidadId:unitId});
  }

  // MODAL 1 NEW UNIT
  $ionicModal.fromTemplateUrl('templates/unidades/modal-new.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.openModal = function() {
    console.log('openModal() New Unit');
    $scope.unidad.customer_id = $scope.clientId;
    $scope.object.unit = {};
    $scope.object.filters = [];
    $scope.modal.show();
    $ionicLoading.show();
    VehicleTypes.getVehicleType().then(function(response){
      $scope.vehicles = response;
      $ionicLoading.hide();
    }).catch(function(response){
      console.log(response);
      $ionicLoading.hide();
    });

  };
  $scope.closeModal = function(from) {
    $scope.modal.hide();
  };
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
  $scope.$on('modal.hidden', function() {
    $state.reload().then(function(){
      console.log('reloading state');
    });
  });
  $scope.$on('modal.removed', function() {
  });

  $scope.vehicleTypeChange = function(vid){//ON CHANGE OF SELECT
    $scope.filtros = $filter('filter')($scope.vehicles, {id:vid});
    console.log($scope.filtros);
    $scope.filters = $scope.filtros[0].filters;
    $scope.filtersOn = true;
  }

  $scope.newUnit = function(){
    $ionicLoading.show();

    $scope.object.unit = $scope.unidad;
    $scope.object.filters = $scope.filts;

    UnitsData.postNewUnit($scope.object).then(function(response){
      console.log(response);
      $ionicLoading.hide();
      $scope.closeModal();
    }).catch(function(response){
      console.log(response);
      $ionicLoading.hide();
    });
  }

})//END UnidadesCtrl

//––––––––––––––– UnidadCtrl –––––––––––––––//
.controller('UnidadCtrl',
  function($scope, $state, $filter, $stateParams,$localStorage,
    $ionicLoading, $ionicHistory,$ionicModal,$ionicPopup,
    UnitsData,VehicleTypes) {

  if ($ionicHistory.backView() != null) {
    var sourceState = $ionicHistory.backView().stateId;
  }else{
    var sourceState = 'none';
  }

  $scope.cambiarTipo = false;
  $scope.filtersOn = false;
  $scope.vehicles = {};//objeto que guarda los tipos de vehículo
  $scope.object = {};//objeto que se va a enviar contiene unidad y filtros
  $scope.unidad = {};//objeto que contiene los datos de la unidad
  $scope.filts = [];//arreglo que contiene los filtros de la unidad
  $scope.$sesion = $localStorage;//variable de sesion
  $scope.clientId = $scope.$sesion.user.customer.id;

  var unidadId = $stateParams.unidadId;
  console.log(unidadId);
  console.log(sourceState);

  if(sourceState !== 'app.unidades'){
    UnitsData.getSingleUnit(unidadId).then(function(response){
      $scope.unit = response;
      // console.log('UNIT FILTER 0: '+$scope.unit.unit_filters[0].filter_id);
      console.log(response);
    }).catch(function(response){
      console.log(response);
    });
  }else{
    $scope.unit = UnitsData.getSingleUnit('none');
  }

  // MODAL EDIT UNIT
  $ionicModal.fromTemplateUrl('templates/unidades/modal-edit.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Se abre el modal
  $scope.openModal = function(filters) {
    console.log('openModal() Edit Unit');
    $scope.unidad.customer_id = $scope.clientId;
    VehicleTypes.getVehicleType().then(function(response){
      $scope.vehicles = response;
      $ionicLoading.hide();
    }).catch(function(response){
      console.log(response);
      $ionicLoading.hide();
    });

    $scope.object.unit = {};
    $scope.object.filters = [];
    $scope.unidad.customer_id = $scope.clientId;
    $scope.modal.show();

  };

  //se cierra el modal
  $scope.closeModal = function() {
    $scope.modal.hide();
    $scope.reloadData();
    
    $scope.$watch( 'unit',
      function(newValue, oldValue){
      console.log('unit Changed');
    });
  };
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
  $scope.$on('modal.hidden', function() {
    $state.reload().then(function(){
      console.log('reloading state');
    });
  });
  $scope.$on('modal.removed', function() {
  });

  // Cambia el select del tipo de vehículo
  $scope.vehicleTypeChange = function(source, vtID){//ON CHANGE OF SELECT
    console.log('Changed');
    console.log(vtID);

    if(source === 'edit'){
      $scope.filtros = $filter('filter')($scope.vehicles, {name:vtID});
    }else if(source === 'form'){
      $scope.filtros = $filter('filter')($scope.vehicles, {id:vtID});
    }
    $scope.filters = $scope.filtros[0].filters;
    $scope.filtersOn = true;
  }

  // Se confirma el cambio de tipo de vehículo
  $scope.showConfirm = function() {
   var confirmPopup = $ionicPopup.confirm({
     title: '¿Cambiar tipo de Vehículo?',
     template: 'Al cambiar el tipo de vehículo la información guardada sobre los filtros se borrará'
   });

   confirmPopup.then(function(res) {
     if(res) {
      $scope.cambiarTipo = true;
      $scope.vehicleTypeChange();
      console.log('You are sure');
     } else {
       console.log('You are not sure');
     }
   });
  };

  $scope.reloadData = function(){
    console.log('reloadData');
    UnitsData.getSingleUnit(unidadId).then(function(response){
      $scope.unit = response;
      $scope.$apply();
      console.log($scope.unit);
    }).catch(function(response){
      console.log(response);
    });
  }

  $scope.updateUnit = function(){
    $ionicLoading.show();
    $scope.object.unit = $scope.unidad;
    $scope.object.filters = $scope.filts;
    console.log($scope.object);
    UnitsData.updateUnit(unidadId,$scope.object).then(function(response){
      console.log(response);
      $ionicLoading.hide();
      $scope.closeModal();
    }).catch(function(response){
      console.log(response);
      $ionicLoading.hide();
    });
  }

})//END UnidadCtrl

//––––––––––––––– OrdenesCtrl –––––––––––––––//
.controller('OrdenesCtrl',
  function($scope, $state, $stateParams, $localStorage,$ionicLoading,OrdersData, $ionicModal) {
  $scope.$sesion = $localStorage;
  $ionicLoading.show();

  OrdersData.getOrdersData().then(function(response){
    $scope.orders = response;
    // console.log(response);
    $scope.$sesion.ordenes = response;
    $ionicLoading.hide();
  }).catch(function(response){
    // console.log(response);
  });

  $scope.goOrder = function(index){
    // console.log(index);
    // console.log($scope.orders[index]);
    var the_objeto = $scope.orders[index];
    var id = $scope.orders[index].id;
    $state.go('app.orden', {ordenId:id,ordenIn:index});
  }

  $scope.setTheClass = function(status){
    switch (status) {
      case 'Recepción de información':
        return 'recepcion-status';
        break;
      case 'Servicio programado':
        return 'servicio-status';
        break;
      case 'Ingreso de la uni':
        return 'ingreso-status';
        break;
      case 'En reparación':
        return 'repara-status';
        break;
      case 'Por finalizar':
        return 'porfin-status';
        break;
      case 'Finalizado':
        return 'final-status';
        break;
      default:
      break;
    }
  }

  $ionicModal.fromTemplateUrl('templates/ordenes/modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.openModal = function() {
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
  $scope.$on('modal.hidden', function() {
    $state.reload().then(function(){
      console.log('reloading state');
    });
  });
  $scope.$on('modal.removed', function() {
  });

})//END OrdenCtrl
//––––––––––––––– OrdenCtrl –––––––––––––––//
.controller('OrdenCtrl', function($scope, $state, $stateParams, $localStorage,$ionicLoading) {
  $scope.$sesion = $localStorage;
  var oi = $stateParams.ordenIn; // Order Index
  // console.log("indice "+oi);
  $scope.order = $scope.$sesion.ordenes[oi];
  // console.log($scope.order);
})//END OrdenCtrl

//––––––––––––––– MiCuentaCtrl –––––––––––––––//
.controller('MiCuentaCtrl', function($scope, $state, $stateParams, $localStorage, $ionicLoading, $auth) {
  $scope.$sesion = $localStorage;
  // console.log($scope.$sesion.user);
  $scope.signOutClick = function() {
    // console.log('botón de cerrar Sesion');
    $ionicLoading.show();
    $auth.signOut()
      .then(function(resp) {
        // handle success response
        //console.log("adiós sesión jajajajaja >:)");
        $ionicLoading.hide();
        localStorage.clear();
        $state.go('login');
      })
      .catch(function(resp) {
        // handle error response
        // console.log(resp);
        // console.log("cerrar Sesión incorrecto");
        $ionicLoading.hide();
      });
  };
})//END MiCuentaCtrl

.controller('PlaylistCtrl', function($scope, $stateParams) {
})

.controller('RescateCtrl', function($scope, $state, NgMap, $ionicLoading, $ionicModal){
  $scope.positionSelected=false;
  //$ionicLoading.show();
  $scope.message = 'You can not hide. :)';
  $scope.modal;
  $ionicModal.fromTemplateUrl('templates/modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.openModal = function(ubi) {
    $scope.ubi = ubi;
    $ionicLoading.show();
    NgMap.getMap().then(function(map) {
      $scope.map = map;
      $ionicLoading.hide().then(function(){
      });
    });
    $scope.modal.show();
  };
  $scope.callbackFunc = function(param) {
    $scope.myself = $scope.map.getCenter();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };
  $scope.confirmaUbi = function() {
    NgMap.getMap().then(function(map) {
      $scope.map = map;
    });
    $scope.selectedPos = $scope.map.getCenter();
    $scope.modal.hide();
    $scope.positionSelected = true;
  }
  // Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
  // Execute action on hide modal
  $scope.$on('modal.hidden', function() {
    // Execute action
  });
  // Execute action on remove modal
  $scope.$on('modal.removed', function() {
    // Execute action
  });
})

.controller('ResumenCtrl', function($scope, $stateParams, $state, $localStorage, $ionicLoading, UnitsData, OrdersData, $filter) {
  $ionicLoading.show();
  OrdersData.getOrdersData().then(function(response){
    $scope.ordenes = response;
    // console.log("tamaño ordenes: "+$scope.ordenes.length);
    $scope.ri = $filter('filter')($scope.ordenes, {status:'Recepción de información'});
    $scope.sp = $filter('filter')($scope.ordenes, {status:'Servicio programado'});
    $scope.iu = $filter('filter')($scope.ordenes, {status:'Ingreso de la unidad'});
    $scope.er = $filter('filter')($scope.ordenes, {status:'En reparación'});
    $scope.pf = $filter('filter')($scope.ordenes, {status:'Por finalizar'});
    $scope.f = $filter('filter')($scope.ordenes, {status:'Finalizado'});
    $ionicLoading.hide();
    // Longitud de las barras
    $scope.style_ri = Math.trunc(($scope.ri.length*100)/$scope.ordenes.length);
    $scope.style_sp = Math.trunc(($scope.sp.length*100)/$scope.ordenes.length);
    $scope.style_iu = Math.trunc(($scope.iu.length*100)/$scope.ordenes.length);
    $scope.style_er = Math.trunc(($scope.er.length*100)/$scope.ordenes.length);
    $scope.style_pf = Math.trunc(($scope.pf.length*100)/$scope.ordenes.length);
    $scope.style_f = Math.trunc(($scope.f.length*100)/$scope.ordenes.length);
    // console.log($scope.style_ri);
  }).catch(function(response){
    // console.log(response);
  });


});
