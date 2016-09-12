// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', [
  'ionic',
  'starter.controllers',
  'ngStorage',
  'ng-token-auth'
])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleBlackTranslucent();
    }
    if(navigator.splashscreen) {
  		navigator.splashscreen.hide();
  	}
  });
})

.config(function($stateProvider, $urlRouterProvider, $authProvider) {
  // the following shows the default values. values passed to this method
  // will extend the defaults using angular.extend

  $authProvider.configure({
    apiUrl: 'https://stage-tractostation.herokuapp.com/api/v1',
    storage: 'localStorage'
  });

  // STATE PROVIDER
  $stateProvider
  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl'
  })

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl',
    resolve: {
      auth: function($auth) {
        return $auth.validateUser();
      }
    }
  })

  .state('app.config', {
    url: '/config',
    views: {
      'menuContent': {
        templateUrl: 'templates/config.html',
        controller: 'ConfigCtrl'
      }
    }
  })

  .state('app.resumen', {
    url: '/resumen',
    views: {
      'menuContent': {
        templateUrl: 'templates/resumen.html',
        controller: 'ResumenCtrl'
      }
    }
  })

  .state('app.browse', {
    url: '/browse',
    views: {
      'menuContent': {
        templateUrl: 'templates/browse.html'
      }
    }
  })
  .state('app.unidades', {
    url: '/unidades',
    views: {
      'menuContent': {
        templateUrl: 'templates/unidades/unidades.html',
        controller: 'UnidadesCtrl'
      }
    }
  })
  .state('app.unidad', {
    url: '/unidades/:unidadId/:unidadIn',
    views: {
      'menuContent': {
        templateUrl: 'templates/unidades/unidad.html',
        controller: 'UnidadCtrl',
        params: {
          unidadId: '',
          unidadIn: ''
        }
      }
    }
  })
  .state('app.miCuenta', {
    url: '/miCuenta',
    views: {
      'menuContent': {
        templateUrl: 'templates/miCuenta/miCuenta.html',
        controller: 'MiCuentaCtrl'
      }
    }
  })
  .state('app.ordenes', {
    url: '/ordenes',
    views: {
      'menuContent': {
        templateUrl: 'templates/ordenes/ordenes.html',
        controller: 'OrdenesCtrl'
      }
    }
  })
  .state('app.orden', {
    url: '/ordenes/:ordenId/:ordenIn',
    views: {
      'menuContent': {
        templateUrl: 'templates/ordenes/orden.html',
        controller: 'OrdenCtrl',
        params: {
          ordenId: '',
          ordenIn: ''
        }
      }
    }
  })
  .state('app.rescate',{
    url:'/rescate',
    views:{
      'menuContent':{
        templateUrl: 'templates/rescate.html',
        controller: 'RescateCtrl'
      }
    }
  })

  .state('app.single', {
    url: '/playlists/:playlistId',
    views: {
      'menuContent': {
        templateUrl: 'templates/playlist.html',
        controller: 'PlaylistCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

});