angular.module('starter.controllers', [
  'ngStorage',
  'ngMap',
  'ng-token-auth'
])
//––––––––––––––– LoginCtrl –––––––––––––––//
.controller('LoginCtrl', function($scope, $stateParams, $state, $localStorage, $ionicHistory, $ionicPopup, $auth, $ionicLoading, UserData) {
  
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
        console.log(resp)
        var str = localStorage.auth_headers;
        var pre_sesion = str.replace("-","_");

        $scope.$sesion.headers = JSON.parse(pre_sesion);
        $scope.$sesion.id = resp.id;
        $scope.$sesion.custId = resp.customer_id;

        UserData.getUserData(resp.id,resp.uid).then(function(response){
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
function($scope, $auth, $ionicModal, $ionicPopup, $timeout, $ionicPlatform, $state, $localStorage){
  $auth.validateUser().then(function(resp){
    //nothing happens
  }).catch(function(resp){
    localStorage.clear();
    $state.go('login');
  });

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.$sesion = $localStorage;
  if(!$scope.$sesion.user){
    $scope.$sesion.user = {};
  }
  // La Plataforma ionic está lista
  $ionicPlatform.ready(function() {
    console.log($scope.$sesion.user);

    $scope.nombre = $scope.$sesion.user.name+' '+$scope.$sesion.user.paternal_lastname+' '+$scope.$sesion.user.maternal_lastname;
    $scope.elnombre = $scope.$sesion.user.name;
    $scope.paterno = $scope.$sesion.user.paternal_lastname;
    $scope.materno = $scope.$sesion.user.maternal_lastname;
    $scope.rol = $scope.$sesion.user.roles[0].name_alias;
    $scope.correo = $scope.$sesion.user.email;

    console.log($scope.rol);


    switch($scope.$sesion.user.roles[0].name){
      case 't_admin':
        $scope.rolId = 0;
        break;
      case 't_manager':
        $scope.rolId = 1;
        break;
      case 't_mechanic':
        $scope.rolId = 2;
        break;
      case 'c_admin':
        $scope.rolId = 3;
        break;
      case 'c_manager':
        $scope.rolId = 4;
        break;
      case 'c_supervisor':
        $scope.rolId = 5;
        break;
      case 'c_chief_of_staff':
        $scope.rolId = 6;
        break;
      case 'c_mechanic':
        $scope.rolId = 7;
        break;
      case 'c_operator':
        $scope.rolId = 8;
        break;
      default:
        $scope.rolId = 99;
        break;
    }

    $scope.$sesion.rolId = $scope.rolId;
    console.log('rolID: '+$scope.rolId)
    // if ($scope.$sesion.user.roles[0].name === 't_admin') {
    //   $scope.rolId = 0;
    // }else if ($scope.$sesion.user.roles[0].name === 't_manager') {
    //   $scope.rolId = 1;
    // }else if ($scope.$sesion.user.roles[0].name === 't_mechanic') {
    //   $scope.rolId = 2;
    // }
    
    if($scope.rolId != 0){
      if($scope.$sesion.user.customer.name != null){
        $scope.cliente = $scope.$sesion.user.customer.name;
        $scope.clienteId = $scope.$sesion.user.customer.id;
      }else{
        $scope.cliente = '';
        $scope.clienteId = '';
      }
    }else if($scope.rolId == 0){
      $scope.$sesion.user.customer = {};
      $scope.$sesion.user.customer.name = 'Tractostation';
      $scope.$sesion.user.customer.id = 0;
      $scope.cliente = $scope.$sesion.user.customer.name;
      $scope.clienteId = $scope.$sesion.user.customer.id;
    }

	});

  $scope.showAlert = function() {
    var alertPopup = $ionicPopup.alert({
     title: 'Don\'t eat that!',
     template: $scope.nombre+' '+$scope.rol
    });

    alertPopup.then(function(res) {
     console.log('Thank you for not eating my delicious ice cream cone');
    });
  };


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
  
  $ionicLoading.show();
  $scope.$sesion = $localStorage;
  $scope.clientId = $scope.$sesion.user.customer.id;
  $scope.rolId = $scope.$sesion.rolId;
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
    // $state.reload().then(function(){
    //   console.log('reloading state');
    // });
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
  $scope.rolId = $scope.$sesion.rolId;

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

  // Se confirma la eliminación de la unidad
  $scope.showDeleteConfirm = function() {
   var confirmPopup = $ionicPopup.confirm({
     title: '¿Deseas eliminar esta unidad?',
     template: 'Al eliminar la unidad se borrará definitivamente'
   });
   confirmPopup.then(function(res) {
     if(res) {
      $scope.deleteUnit();
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

  $scope.deleteUnit = function(){
    $ionicLoading.show();
    console.log($scope.object);
    UnitsData.deleteUnit(unidadId).then(function(response){
      console.log(response);
      $ionicLoading.hide();
      $state.go('app.unidades');
    }).catch(function(response){
      console.log(response);
      $ionicLoading.hide();
    });
  }

})//END UnidadCtrl

//––––––––––––––– OrdenesCtrl –––––––––––––––//
.controller('OrdenesCtrl',
  function($scope, $state, $stateParams, $filter, $localStorage,$ionicLoading,OrdersData, $ionicModal) {
  $scope.$sesion = $localStorage;
  $scope.rolId = $scope.$sesion.rolId;
  $scope.userId = $scope.$sesion.id;
  $scope.customer_id = $scope.$sesion.user.customer.id;
  $scope.customer_name = $scope.$sesion.user.customer.name;
  $scope.filtrado = $stateParams.filtrado;
  $scope.existen = true;
  $scope.filteredOrders;
  $scope.customers = [];
  $scope.categories = [];
  $scope.units = [];
  $scope.services = [];
  $scope.new_order = {};
  $scope.orders = [];

  $ionicLoading.show();

  OrdersData.getOrdersData($scope.userId).then(function(response){
    $scope.orders = response;
    // console.log(response);
    $scope.$sesion.ordenes = response;
    $ionicLoading.hide();
  }).catch(function(response){
    // console.log(response);
  });

  $scope.goOrder = function(orderId){
    $scope.singleOrder = $filter('filter')($scope.orders, {id:orderId});
    OrdersData.setSingleOrder($scope.singleOrder[0]);
    console.log($scope.singleOrder[0]);
    $state.go('app.orden', {ordenId:orderId});
  }

  $scope.setTheClass = function(status){
    switch (status) {
      case 'Recepción de información':
        return 'recepcion-status';
        break;
      case 'Servicio programado':
        return 'servicio-status';
        break;
      case 'Ingreso de la unidad':
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
      case "1":
        return 'recepcion-status';
        break;
      case "2":
        return 'servicio-status';
        break;
      case "3":
        return 'ingreso-status';
        break;
      case "4":
        return 'repara-status';
        break;
      case "5":
        return 'porfin-status';
        break;
      case "6":
        return 'final-status';
        break;
      default:
      break;
    }
  }

  $scope.setTheString = function(status){
    switch (status) {
      case "0":
        return 'Vista general';
        break;
      case "1":
        return 'Recepción de información';
        break;
      case "2":
        return 'Servicio programado';
        break;
      case "3":
        return 'Ingreso de la unidad';
        break;
      case "4":
        return 'En reparación';
        break;
      case "5":
        return 'Por finalizar';
        break;
      case "6":
        return 'Finalizado';
        break;
      default:
      break;
    }
  }

  $ionicModal.fromTemplateUrl('templates/ordenes/modal-new.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.openModal = function() {
    $scope.modal.show();
    $ionicLoading.show();
    OrdersData.getSimpleCustomers().then(function(response){
      $scope.customers = response;
      // console.log($scope.customers)
      $ionicLoading.hide();
    }).catch(function(response){
      // console.log(response);
      $ionicLoading.hide();
    });
    OrdersData.getSimpleCategories().then(function(response){
      $scope.categories = response;
      // console.log($scope.categories)
      $ionicLoading.hide();
    }).catch(function(response){
      // console.log(response);
      $ionicLoading.hide();
    });
    if (!$scope.clientCanSee()){
      console.log($scope.clientCanSee());
      OrdersData.getSimpleUnits($scope.customer_id).then(function(response){
        $scope.units = response;
        console.log($scope.units)
        $ionicLoading.hide();
      }).catch(function(response){
        console.log(response);
        $ionicLoading.hide();
      });
    }else{
      console.log($scope.clientCanSee());
    }
    OrdersData.getSimpleServices().then(function(response){
      $scope.services = response;
      // console.log($scope.services)
      $ionicLoading.hide();
    }).catch(function(response){
      // console.log(response);
      $ionicLoading.hide();
    });
  };

  $scope.closeModal = function() {
    $scope.modal.hide();
  };
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
  $scope.$on('modal.hidden', function() {
    // $state.reload().then(function(){
    //   console.log('reloading state');
    // });
  });
  $scope.$on('modal.removed', function() {
  });

  $scope.canCreate = function(){
    if ($scope.rolId == 2 ||  $scope.rolId == 7 || $scope.rolId == 8 || $scope.rolId == 99){
      return false;
    }else{
      return true;
    }
  }
  $scope.clientCanSee = function(){
    if ($scope.rolId == 3 || $scope.rolId == 4 || $scope.rolId == 5 || $scope.rolId == 6 || $scope.rolId == 7 || $scope.rolId == 8 || $scope.rolId == 99){
      return false;
    }else{
      return true;
    }
  }

  $scope.customerChange = function(cusId){
    OrdersData.getSimpleUnits(cusId).then(function(response){
      $scope.units = response;
      console.log($scope.units)
      $ionicLoading.hide();
    }).catch(function(response){
      console.log(response);
      $ionicLoading.hide();
    });
  }

  $scope.newOrder = function(){
    $ionicLoading.show();
    console.log($scope.new_order);
    OrdersData.postNewOrder($scope.new_order).then(function(response){
      console.log(response);
      $ionicLoading.hide();
      $scope.closeModal();
    }).catch(function(response){
      console.log(response);
      $ionicLoading.hide();
    });
  }

})//END OrdenCtrl
//––––––––––––––– OrdenCtrl –––––––––––––––//
.controller('OrdenCtrl', function(
  $scope, $state, $stateParams, $localStorage,$ionicLoading, $ionicPopup, $ionicHistory, $ionicModal, OrdersData) {
  
  $scope.$sesion = $localStorage;
  $scope.rolId = $scope.$sesion.rolId;
  
  if ($ionicHistory.backView() != null) {
    var sourceState = $ionicHistory.backView().stateId;
  }else{
    var sourceState = 'none';
  }

  var orderId = $stateParams.ordenId;
  $scope.order = {};
  //console.log($scope.order.id);

  if(sourceState !== 'app.unidades'){
    OrdersData.getSingleOrder(orderId).then(function(response){
      $scope.order = response;
      //console.log(response);
    }).catch(function(response){
      console.log(response);
    });
  }else{
    $scope.order = UnitsData.getSingleUnit('none');
    $scope.$watch('order', function() {
      console.log('hey, order has changed!');
    });
  }


  $scope.c_status = false;
  $scope.c_client = false;
  $scope.c_observ = false;
  $scope.c_catego = false;
  $scope.c_unit = false;
  $scope.c_servic = false;
  $scope.new_order = {};

  // Se confirma la eliminación de la unidad
  $scope.showDeleteConfirm = function() {
   var confirmPopup = $ionicPopup.confirm({
     title: '¿Deseas eliminar esta solicitud?',
     template: 'Al eliminar la solicitud se borrará definitivamente'
   });
   confirmPopup.then(function(res) {
     if(res) {
      $scope.deleteOrder();
      console.log('You are sure');
     } else {
       console.log('You are not sure');
     }
   });
  };

  $scope.canDelete = function(){
    if ($scope.rolId == 2 || $scope.rolId == 7 || $scope.rolId == 8 || $scope.rolId == 99){
      return false;
    }else{
      return true;
    }
  }
  $scope.canEdit = function(){
    if ($scope.rolId == 2 || $scope.rolId == 7 || $scope.rolId == 8 || $scope.rolId == 99){
      return false;
    }else{
      return true;
    }
  }
  $scope.canSee = function(){
    if ($scope.rolId == 3 || $scope.rolId == 4 || $scope.rolId == 5 || $scope.rolId == 6 || $scope.rolId == 7 || $scope.rolId == 8 || $scope.rolId == 99){
      return false;
    }else{
      return true;
    }
  }

  $scope.reloadData = function(){
    console.log('reloadData');
    OrdersData.getSingleOrder(orderId).then(function(response){
      $scope.order = response;
      $scope.$apply();
      console.log($scope.unit);
    }).catch(function(response){
      console.log(response);
    });
  }

  $scope.updateOrder = function(){
    $ionicLoading.show();
    console.log($scope.new_order);
    OrdersData.updateOrder(orderId,$scope.new_order).then(function(response){
      console.log(response);
      $ionicLoading.hide();
      $scope.closeModal();
    }).catch(function(response){
      console.log(response);
      $ionicLoading.hide();
    });
  }

  $scope.deleteOrder = function(){
    $ionicLoading.show();
    console.log($scope.object);
    OrdersData.deleteOrder(orderId).then(function(response){
      console.log(response);
      $ionicLoading.hide();
      $state.go('app.ordenes');
    }).catch(function(response){
      console.log(response);
      $ionicLoading.hide();
    });
  }

  $ionicModal.fromTemplateUrl('templates/ordenes/modal-edit.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.openModal = function() {
    $scope.modal.show();
    $ionicLoading.show();

    OrdersData.getSimpleCustomers().then(function(response){
      $scope.customers = response;
      // console.log($scope.customers)
      $ionicLoading.hide();
    }).catch(function(response){
      // console.log(response);
      $ionicLoading.hide();
    });
    OrdersData.getSimpleCategories().then(function(response){
      $scope.categories = response;
      // console.log($scope.categories)
      $ionicLoading.hide();
    }).catch(function(response){
      // console.log(response);
      $ionicLoading.hide();
    });
    OrdersData.getSimpleServices().then(function(response){
      $scope.services = response;
      // console.log($scope.services)
      $ionicLoading.hide();
    }).catch(function(response){
      // console.log(response);
      $ionicLoading.hide();
    });
  };

  $scope.closeModal = function() {
    $scope.modal.hide();
  };
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
  $scope.$on('modal.shown', function() {
    console.log('modal shown');
    $scope.$apply();
  });
  $scope.$on('modal.hidden', function() {
  });
  $scope.$on('modal.removed', function() {
  });

  $scope.setTheString = function(status){
    switch (status) {
      case "0":
        return 'Vista general';
        break;
      case "1":
        return 'Recepción de información';
        break;
      case "2":
        return 'Servicio programado';
        break;
      case "3":
        return 'Ingreso de la unidad';
        break;
      case "4":
        return 'En reparación';
        break;
      case "5":
        return 'Por finalizar';
        break;
      case "6":
        return 'Finalizado';
        break;
      default:
      break;
    }
  }
  $scope.statuses = [
    {id:1, name:'1. Recepción de información'},
    {id:2, name:'2. Servicio programado'},
    {id:3, name:'3. Ingreso de la unidad'},
    {id:4, name:'4. En reparación'},
    {id:5, name:'5. Por finalizar'},
    {id:6, name:'6. Finalizado'}
  ];

  $scope.wantsChange = function(from){
    switch(from){
      case 'status':
        $scope.c_status = !$scope.c_status;
      break;
      case 'client':
        $scope.c_client = !$scope.c_client;
      break;
      case 'observ':
        $scope.c_observ = !$scope.c_observ;
      break;
      case 'catego':
        $scope.c_catego = !$scope.c_catego;
      break;
      case 'unit':
        $scope.c_unit = !$scope.c_unit;
      break;
      case 'servic':
        $scope.c_servic = !$scope.c_servic;
      break;
    }
  }

})//END OrdenCtrl

//––––––––––––––– MiCuentaCtrl –––––––––––––––//
.controller('MiCuentaCtrl', function($scope, $state, $stateParams, $localStorage, $ionicLoading, $auth) {
  $scope.$sesion = $localStorage;
  $scope.signOutClick = function() {
    $ionicLoading.show();
    $auth.signOut()
      .then(function(resp) {
        $ionicLoading.hide();
        localStorage.clear();
        $state.go('login');
      })
      .catch(function(resp) {
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
  $scope.$sesion = $localStorage;
  $scope.userId = $scope.$sesion.id;
  OrdersData.getOrdersData($scope.userId).then(function(response){
    $scope.ordenes = response;
    // console.log("tamaño ordenes: "+$scope.ordenes.length);
    $scope.ri = $filter('filter')($scope.ordenes, {status:1});
    $scope.sp = $filter('filter')($scope.ordenes, {status:2});
    $scope.iu = $filter('filter')($scope.ordenes, {status:3});
    $scope.er = $filter('filter')($scope.ordenes, {status:4});
    $scope.pf = $filter('filter')($scope.ordenes, {status:5});
    $scope.f = $filter('filter')($scope.ordenes, {status:6});
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
