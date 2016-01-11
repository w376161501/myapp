// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services','ngCordova','starter.httpPost','starter.myfilter'])
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})




.constant('headimage', 'img/logo.png')//定义全局变量
// .constant('menuimage', 'img/logo-s.png')//定义全局变量
.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider,$httpProvider) {
   $ionicConfigProvider.platform.ios.tabs.style('standard'); 
   $ionicConfigProvider.platform.ios.tabs.position('bottom');
   $ionicConfigProvider.platform.android.tabs.style('standard');
   $ionicConfigProvider.platform.android.tabs.position('bottom');
   $ionicConfigProvider.platform.ios.navBar.alignTitle('center'); 
   $ionicConfigProvider.platform.android.navBar.alignTitle('center');
   $ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-ios-arrow-thin-left');
   $ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-android-arrow-back');        
   $ionicConfigProvider.platform.ios.views.transition('ios'); 
   $ionicConfigProvider.platform.android.views.transition('android');
   $stateProvider
  // setup an abstract state for the tabs directive
 .state('tutorial', {
        url: '/',      
        templateUrl: 'templates/tutorial.html',
        controller: 'TutorialCtrl'
     })



.state('tab', {
   url: '/tab',
   abstract: true,  
   templateUrl: 'templates/menu.html',
   controller: 'menuCtrl' 
  })


  .state('tab.tabs.dash', {
    url: '/dash',
    cache:true,
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })

  .state('tab.tabs.chats', {
      url: '/chats',
      views: {
        'tab-chats': {
          templateUrl: 'templates/tab-chats.html',
          controller: 'ChatsCtrl'
        }
      }
    })
    .state('tab.tabs.chat-detail', {
      url: '/chats/:chatId',
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })
     .state('tab.tabs.dash-detail', {
      url: '/dash/:chatId',
      views: {
        'tab-dash': {
          templateUrl: 'templates/dash-detail.html',
          controller: 'DashDetailCtrl'
        }
      }
    })

  .state('tab.tabs.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  })
  
   .state('tab.tabs', {
    url: '/tabs',
    views: {
      'menuContent': {
        templateUrl: 'templates/tabs.html',
      }
    }
  })

    .state('tab.tabs.comment', {
      url: '/comment/:commentId',
      views: {
        'tab-dash': {
          templateUrl: "templates/comment.html",
          controller: 'CommentCtrl'
        }
      }
    })






  // if none of the above states are matched, use this as the fallback
 $urlRouterProvider.otherwise('/');
 

});
