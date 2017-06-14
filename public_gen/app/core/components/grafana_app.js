///<reference path="../../headers/common.d.ts" />
System.register(["app/core/config", "lodash", "jquery", "app/core/core_module", "app/core/profiler", "app/core/app_events"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    /** @ngInject */
    function grafanaAppDirective(playlistSrv, contextSrv) {
        return {
            restrict: 'E',
            controller: GrafanaCtrl,
            link: function (scope, elem) {
                var ignoreSideMenuHide;
                var body = jquery_1.default('body');
                // see https://github.com/zenorocha/clipboard.js/issues/155
                jquery_1.default.fn.modal.Constructor.prototype.enforceFocus = function () { };
                // handle sidemenu open state
                scope.$watch('contextSrv.sidemenu', function (newVal) {
                    if (newVal !== undefined) {
                        body.toggleClass('sidemenu-open', scope.contextSrv.sidemenu);
                        if (!newVal) {
                            contextSrv.setPinnedState(false);
                        }
                    }
                    if (contextSrv.sidemenu) {
                        ignoreSideMenuHide = true;
                        setTimeout(function () {
                            ignoreSideMenuHide = false;
                        }, 300);
                    }
                });
                scope.$watch('contextSrv.pinned', function (newVal) {
                    if (newVal !== undefined) {
                        body.toggleClass('sidemenu-pinned', newVal);
                    }
                });
                // tooltip removal fix
                // manage page classes
                var pageClass;
                scope.$on("$routeChangeSuccess", function (evt, data) {
                    if (pageClass) {
                        body.removeClass(pageClass);
                    }
                    if (data.$$route) {
                        pageClass = data.$$route.pageClass;
                        if (pageClass) {
                            body.addClass(pageClass);
                        }
                    }
                    jquery_1.default("#tooltip, .tooltip").remove();
                    // check for kiosk url param
                    if (data.params.kiosk) {
                        app_events_1.default.emit('toggle-kiosk-mode');
                    }
                });
                // handle kiosk mode
                app_events_1.default.on('toggle-kiosk-mode', function () {
                    body.toggleClass('page-kiosk-mode');
                });
                // handle in active view state class
                var lastActivity = new Date().getTime();
                var activeUser = true;
                var inActiveTimeLimit = 60 * 1000;
                function checkForInActiveUser() {
                    if (!activeUser) {
                        return;
                    }
                    // only go to activity low mode on dashboard page
                    if (!body.hasClass('page-dashboard')) {
                        return;
                    }
                    if ((new Date().getTime() - lastActivity) > inActiveTimeLimit) {
                        activeUser = false;
                        body.addClass('user-activity-low');
                    }
                }
                function userActivityDetected() {
                    lastActivity = new Date().getTime();
                    if (!activeUser) {
                        activeUser = true;
                        body.removeClass('user-activity-low');
                    }
                }
                // mouse and keyboard is user activity
                body.mousemove(userActivityDetected);
                body.keydown(userActivityDetected);
                // treat tab change as activity
                document.addEventListener('visibilitychange', userActivityDetected);
                // check every 2 seconds
                setInterval(checkForInActiveUser, 2000);
                app_events_1.default.on('toggle-view-mode', function () {
                    lastActivity = 0;
                    checkForInActiveUser();
                });
                // handle document clicks that should hide things
                body.click(function (evt) {
                    var target = jquery_1.default(evt.target);
                    if (target.parents().length === 0) {
                        return;
                    }
                    // for stuff that animates, slides out etc, clicking it needs to
                    // hide it right away
                    var clickAutoHide = target.closest('[data-click-hide]');
                    if (clickAutoHide.length) {
                        var clickAutoHideParent = clickAutoHide.parent();
                        clickAutoHide.detach();
                        setTimeout(function () {
                            clickAutoHideParent.append(clickAutoHide);
                        }, 100);
                    }
                    if (target.parents('.dash-playlist-actions').length === 0) {
                        playlistSrv.stop();
                    }
                    // hide search
                    if (body.find('.search-container').length > 0) {
                        if (target.parents('.search-container').length === 0) {
                            scope.$apply(function () {
                                scope.appEvent('hide-dash-search');
                            });
                        }
                    }
                    // hide menus
                    var openMenus = body.find('.navbar-page-btn--open');
                    if (openMenus.length > 0) {
                        if (target.parents('.navbar-page-btn--open').length === 0) {
                            openMenus.removeClass('navbar-page-btn--open');
                        }
                    }
                    // hide sidemenu
                    if (!ignoreSideMenuHide && !contextSrv.pinned && body.find('.sidemenu').length > 0) {
                        if (target.parents('.sidemenu').length === 0) {
                            scope.$apply(function () {
                                scope.contextSrv.toggleSideMenu();
                            });
                        }
                    }
                    // hide popovers
                    var popover = elem.find('.popover');
                    if (popover.length > 0 && target.parents('.graph-legend').length === 0) {
                        popover.hide();
                    }
                });
            }
        };
    }
    exports_1("grafanaAppDirective", grafanaAppDirective);
    var config_1, lodash_1, jquery_1, core_module_1, profiler_1, app_events_1, GrafanaCtrl;
    return {
        setters: [
            function (config_1_1) {
                config_1 = config_1_1;
            },
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (jquery_1_1) {
                jquery_1 = jquery_1_1;
            },
            function (core_module_1_1) {
                core_module_1 = core_module_1_1;
            },
            function (profiler_1_1) {
                profiler_1 = profiler_1_1;
            },
            function (app_events_1_1) {
                app_events_1 = app_events_1_1;
            }
        ],
        execute: function () {///<reference path="../../headers/common.d.ts" />
            GrafanaCtrl = (function () {
                /** @ngInject */
                function GrafanaCtrl($scope, alertSrv, utilSrv, $rootScope, $controller, contextSrv) {
                    $scope.init = function () {
                        $scope.contextSrv = contextSrv;
                        $rootScope.appSubUrl = config_1.default.appSubUrl;
                        $scope._ = lodash_1.default;
                        profiler_1.profiler.init(config_1.default, $rootScope);
                        alertSrv.init();
                        utilSrv.init();
                        $scope.dashAlerts = alertSrv;
                    };
                    $scope.initDashboard = function (dashboardData, viewScope) {
                        $scope.appEvent("dashboard-fetch-end", dashboardData);
                        $controller('DashboardCtrl', { $scope: viewScope }).init(dashboardData);
                    };
                    $rootScope.onAppEvent = function (name, callback, localScope) {
                        var unbind = $rootScope.$on(name, callback);
                        var callerScope = this;
                        if (callerScope.$id === 1 && !localScope) {
                            console.log('warning rootScope onAppEvent called without localscope');
                        }
                        if (localScope) {
                            callerScope = localScope;
                        }
                        callerScope.$on('$destroy', unbind);
                    };
                    $rootScope.appEvent = function (name, payload) {
                        $rootScope.$emit(name, payload);
                        app_events_1.default.emit(name, payload);
                    };
                    $rootScope.colors = [
                        "#7EB26D", "#EAB839", "#6ED0E0", "#EF843C", "#E24D42", "#1F78C1", "#BA43A9", "#705DA0",
                        "#508642", "#CCA300", "#447EBC", "#C15C17", "#890F02", "#0A437C", "#6D1F62", "#584477",
                        "#B7DBAB", "#F4D598", "#70DBED", "#F9BA8F", "#F29191", "#82B5D8", "#E5A8E2", "#AEA2E0",
                        "#629E51", "#E5AC0E", "#64B0C8", "#E0752D", "#BF1B00", "#0A50A1", "#962D82", "#614D93",
                        "#9AC48A", "#F2C96D", "#65C5DB", "#F9934E", "#EA6460", "#5195CE", "#D683CE", "#806EB7",
                        "#3F6833", "#967302", "#2F575E", "#99440A", "#58140C", "#052B51", "#511749", "#3F2B5B",
                        "#E0F9D7", "#FCEACA", "#CFFAFF", "#F9E2D2", "#FCE2DE", "#BADFF4", "#F9D9F9", "#DEDAF7"
                    ];
                    $scope.init();
                }
                return GrafanaCtrl;
            }());
            exports_1("GrafanaCtrl", GrafanaCtrl);
            core_module_1.default.directive('grafanaApp', grafanaAppDirective);
        }
    };
});
//# sourceMappingURL=grafana_app.js.map