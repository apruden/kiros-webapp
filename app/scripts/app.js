'use strict';

/**
* @ngdoc overview
* @name kirosWebApp
* @description
* # kirosWebApp
*
* Main module of the application.
*/

angular

.module('kirosWebApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ngStorage',
    'ngFileUpload',
    'ui.bootstrap',
    'angular-loading-bar',
    'angular.filter'
    ])

.config(function ($routeProvider, $httpProvider, $locationProvider) {
  $routeProvider.when('/', {
    templateUrl: 'views/wiki.html',
    controller: 'WikiCtrl'
  })
  .when('/search', {
    templateUrl: 'views/search.html',
    controller: 'SearchCtrl'
  })
  .when('/login', {
    templateUrl: 'views/login.html',
    controller: 'AccountCtrl'
  })
  .when('/logout', {
    templateUrl: 'views/login.html',
    controller: 'AccountCtrl'
  })
  .when('/settings', {
    templateUrl: 'views/settings.html',
    controller: 'AccountSettingsCtrl'
  })
  .when('/articles/edit', {
    templateUrl: 'views/article-edit.html',
    controller: 'ArticleEditCtrl'
  })
  .when('/articles/:id/edit', {
    templateUrl: 'views/article-edit.html',
    controller: 'ArticleEditCtrl'
  })
  .when('/articles/:id', {
    templateUrl: 'views/article.html',
    controller: 'ArticleCtrl'
  })
  .when('/contact', {
    templateUrl: 'views/contact.html',
    controller: 'ContactCtrl'
  })
  .when('/files', {
    templateUrl: 'views/files.html',
    controller: 'FilesCtrl'
  })
  .when('/reports', {
    templateUrl: 'views/reports.html',
    controller: 'ReportsCtrl'
  })
  .when('/reports/edit', {
    templateUrl: 'views/report-edit.html',
    controller: 'ReportEditCtrl'
  })
  .when('/reports/:id', {
    templateUrl: 'views/report.html',
    controller: 'ReportCtrl'
  })
  .when('/reports/:id/edit', {
    templateUrl: 'views/report-edit.html',
    controller: 'ReportEditCtrl'
  })
  .otherwise({
    redirectTo: function() {
      return '/';
    }
  });

  $locationProvider.html5Mode(false);
  $httpProvider.interceptors.push('authInterceptor');
})

.factory('authInterceptor', function($q, $rootScope, $location, $localStorage) {
  return {
    request: function(conf) {
      if (!conf.headers.Authorization &&
        $localStorage.accessToken) {
          conf.headers.Authorization = 'Bearer ' + $localStorage.accessToken;
        }

      return conf;
    },
    response : function(response) {
      return response || $q.when(response);
    },
    responseError: function(rejection) {
      if (rejection.status === 401) {
        delete $localStorage.accessToken;

        if ($location.path() !== '/login') {
          $location.path('/login');
        }
      }

      $rootScope.$broadcast('error', rejection);

      return $q.reject(rejection);
    }
  };
})

.filter('username', function() {
  return function(t) {
    if (t) {
      return t.split('@')[0];
    }

    return '';
  };
})

.filter('sdate', function() {
  return function(t) {
    return new Date(Date.parse(t)).toDateString();
  };
})

.directive('focusable', [function() {
  return {
    restrict: 'A',
    scope: {
      msg: '&'
    },
    link: function(scope, elem, attr) {
      scope.$on(attr.msg, function() {
        elem.focus();
      });
    }
  };
}])

.directive('mdEditor',[function() {
  var setOptions = function(acee, session, opts) {
    //acee.setOptions({maxLines: Infinity});

    if (angular.isDefined(opts.workerPath)) {
      var config = window.ace.require('ace/config');
      config.set('workerPath', opts.workerPath);
    }

    if (angular.isDefined(opts.require)) {
      opts.require.forEach(function (n) {
        window.ace.require(n);
      });
    }

    if (angular.isDefined(opts.showGutter)) {
      acee.renderer.setShowGutter(opts.showGutter);
    } else {
      acee.renderer.setShowGutter(false);
    }

    if (angular.isDefined(opts.useWrapMode)) {
      session.setUseWrapMode(opts.useWrapMode);
    }

    if (angular.isDefined(opts.showInvisibles)) {
      acee.renderer.setShowInvisibles(opts.showInvisibles);
    }

    if (angular.isDefined(opts.showIndentGuides)) {
      acee.renderer.setDisplayIndentGuides(opts.showIndentGuides);
    }

    if (angular.isDefined(opts.useSoftTabs)) {
      session.setUseSoftTabs(opts.useSoftTabs);
    }

    if (angular.isDefined(opts.showPrintMargin)) {
      acee.setShowPrintMargin(opts.showPrintMargin);
    }

    // commands
    if (angular.isDefined(opts.disableSearch) && opts.disableSearch) {
      acee.commands.addCommands([{
            name: 'unfind',
            bindKey: {
              win: 'Ctrl-F',
              mac: 'Command-F'
            },
            exec: function () {
              return false;
            },
            readOnly: true
          }]);
    }

    if (angular.isString(opts.theme)) {
      acee.setTheme('ace/theme/' + opts.theme);
    }

    if (angular.isString(opts.mode)) {
      session.setMode('ace/mode/' + opts.mode);
    } else {
      session.setMode('ace/mode/markdown');
    }

    if (angular.isDefined(opts.firstLineNumber)) {
      if (angular.isNumber(opts.firstLineNumber)) {
        session.setOption('firstLineNumber', opts.firstLineNumber);
      } else if (angular.isFunction(opts.firstLineNumber)) {
        session.setOption('firstLineNumber', opts.firstLineNumber());
      }
    }

    var key, obj;
    if (angular.isDefined(opts.advanced)) {
      for (key in opts.advanced) {
        obj = { name: key, value: opts.advanced[key] };
        acee.setOption(obj.name, obj.value);
      }
    }

    if (angular.isDefined(opts.rendererOptions)) {
      for (key in opts.rendererOptions) {
        obj = { name: key, value: opts.rendererOptions[key] };
        acee.renderer.setOption(obj.name, obj.value);
      }
    }

    angular.forEach(opts.callbacks, function (cb) {
      if (angular.isFunction(cb)) {
        cb(acee);
      }
    });
    };

    return {
        restrict: 'A',
        require: '?ngModel',
      link: function (scope, elm, attrs, ngModel) {
        var options = {};
        var opts = {}; //angular.extend({}, options, scope.$eval(attrs.uiAce));
        var acee = window.ace.edit(elm[0]);
        var session = acee.getSession();
        var onChangeListener;
        var onBlurListener;
        var executeUserCallback = function () {
          var callback = arguments[0];
          var args = Array.prototype.slice.call(arguments, 1);

          if (angular.isDefined(callback)) {
            scope.$evalAsync(function () {
              if (angular.isFunction(callback)) {
                callback(args);
              } else {
                throw new Error('ui-ace use a function as callback.');
              }
            });
          }
        };

        /**
         * Listener factory. Until now only change listeners can be created.
         * @type object
         */
        var listenerFactory = {
          /**
           * Creates a change listener which propagates the change event
           * and the editor session to the callback from the user option
           * onChange. It might be exchanged during runtime, if this
           * happens the old listener will be unbound.
           *
           * @param callback callback function defined in the user options
           * @see onChangeListener
           */
          onChange: function (callback) {
            return function (e) {
              var newValue = session.getValue();

              if (ngModel && newValue !== ngModel.$viewValue &&
                  // HACK make sure to only trigger the apply outside of the
                  // digest loop 'cause ACE is actually using this callback
                  // for any text transformation !
                  !scope.$$phase && !scope.$root.$$phase) {
                scope.$evalAsync(function () {
                  ngModel.$setViewValue(newValue);
                });
              }

              executeUserCallback(callback, e, acee);
            };
          },
          /**
           * Creates a blur listener which propagates the editor session
           * to the callback from the user option onBlur. It might be
           * exchanged during runtime, if this happens the old listener
           * will be unbound.
           *
           * @param callback callback function defined in the user options
           * @see onBlurListener
           */
          onBlur: function (callback) {
            return function () {
              executeUserCallback(callback, acee);
            };
          }
        };

        /*attrs.$observe('readonly', function (value) {
          acee.setReadOnly(!!value || value === '');
        });*/

        // Value Blind
        if (ngModel) {
          ngModel.$formatters.push(function (value) {
            if (angular.isUndefined(value) || value === null) {
              return '';
            }
            else if (angular.isObject(value) || angular.isArray(value)) {
              throw new Error('ui-ace cannot use an object or an array as a model');
            }
            return value;
          });

          ngModel.$render = function () {
            session.setValue(ngModel.$viewValue);
          };
        }

        // Listen for option updates
        var updateOptions = function (current, previous) {
          if (current === previous)  { return; }
          opts = {};// angular.extend({}, options, scope.$eval(attrs.uiAce));

          opts.callbacks = [ opts.onLoad ];
          if (opts.onLoad !== options.onLoad) {
            // also call the global onLoad handler
            opts.callbacks.unshift(options.onLoad);
          }

          // EVENTS

          // unbind old change listener
          session.removeListener('change', onChangeListener);

          // bind new change listener
          onChangeListener = listenerFactory.onChange(opts.onChange);
          session.on('change', onChangeListener);

          // unbind old blur listener
          //session.removeListener('blur', onBlurListener);
          acee.removeListener('blur', onBlurListener);

          // bind new blur listener
          onBlurListener = listenerFactory.onBlur(opts.onBlur);
          acee.on('blur', onBlurListener);

          setOptions(acee, session, opts);
        };

        //scope.$watch(attrs.uiAce, updateOptions, /* deep watch */ true);

        // set the options here, even if we try to watch later, if this
        // line is missing things go wrong (and the tests will also fail)
        updateOptions(options);

        elm.on('$destroy', function () {
          acee.session.$stopWorker();
          acee.destroy();
        });

        scope.$watch(function() {
          return [elm[0].offsetWidth, elm[0].offsetHeight];
        }, function() {
          acee.resize();
          acee.renderer.updateFull();
        }, true);

      }
    };
}])
;
