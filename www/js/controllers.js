angular.module('starter.controllers', [
  'ngStorage',
  'ngMap',
  'ng-token-auth'
])
//––––––––––––––– LoginCtrl –––––––––––––––//
.controller('LoginCtrl', function($scope, $stateParams, $state, $localStorage, $ionicHistory, $ionicPopup, $auth, $ionicLoading, UserData, HeadersSave) {
  $scope.$sesion = $localStorage;
  console.log("LoginCtrl");
  $scope.loginForm = {};

  $scope.btnClick = function (){
    // console.log("submit button is clicked");
    // console.log("email: "+$scope.loginForm.email+" password: "+$scope.loginForm.password);
    $ionicLoading.show();
    $auth.submitLogin($scope.loginForm)
      .then(function(resp) {
        // handle success response
        // console.log("login Correct");
        HeadersSave.setHeaders(resp);
        var str = localStorage.auth_headers;
        var pre_sesion = str.replace("-","_");
        var sesion = JSON.parse(pre_sesion);
        $scope.$sesion.headers= sesion;
        // console.log($scope.$sesion.headers);
        $scope.$sesion.id = resp.id;
        UserData.getUserData($scope.$sesion.id, $scope.$sesion.header).then(function(response){
          $scope.$sesion.user = response;
          // console.log(response);
          $ionicLoading.hide();
          $state.go('app.resumen');
        }).catch(function(response){
          $ionicLoading.hide();
          $scope.showAlert2();
        });

      })
      .catch(function(resp) {
        // handle error response
        // console.log("login inCorrect");
        // console.log(resp);
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

  $scope.$sesion = $localStorage;

  $scope.nombre = $scope.$sesion.user.name+' '+$scope.$sesion.user.paternal_lastname+' '+$scope.$sesion.user.maternal_lastname;
  $scope.elnombre = $scope.$sesion.user.name;
  $scope.paterno = $scope.$sesion.user.paternal_lastname;
  $scope.materno = $scope.$sesion.user.maternal_lastname;
  if ($scope.$sesion.user.roles != ''){
    if ($scope.$sesion.user.roles[0].name === 'admin') {
      $scope.rol = 'Administrador';
    }
  }else{
    $scope.rol = '';
  }
  $scope.correo = $scope.$sesion.user.email;
  // La Plataforma ionic está lista
  $ionicPlatform.ready(function() {
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
.controller('UnidadesCtrl', function($scope, $state, $stateParams, $localStorage,$ionicLoading,UnitsData) {
  $ionicLoading.show();
  UnitsData.getUnitsData().then(function(response){
    $scope.units = response;
    $scope.$sesion.unidades = response;
    // console.log("tamaño: "+response.length);
    $ionicLoading.hide();
  }).catch(function(response){
    // console.log(response);
  });

  $scope.goUnit = function(index){
    // console.log(index);
    // console.log($scope.orders[index]);
    var the_objeto = $scope.units[index];
    var id = $scope.units[index].id;
    $state.go('app.unidad', {unidadId:id,unidadIn:index});
  }
})//END UnidadesCtrl
//––––––––––––––– UnidadCtrl –––––––––––––––//
.controller('UnidadCtrl', function($scope, $state, $stateParams, $localStorage,$ionicLoading) {
  $scope.$sesion = $localStorage;
  var oi = $stateParams.unidadIn; // Order Index
  // console.log("indice "+oi);
  $scope.unit = $scope.$sesion.unidades[oi];
  // console.log($scope.unit);
})//END UnidadCtrl

//––––––––––––––– OrdenesCtrl –––––––––––––––//
.controller('OrdenesCtrl', function($scope, $state, $stateParams, $localStorage,$ionicLoading,OrdersData) {
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
