///<reference path="../../headers/common.d.ts" />
System.register(["../../core/core_module", "app/core/utils/kbn"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var core_module_1, kbn_1, PlaylistSrv;
    return {
        setters: [
            function (core_module_1_1) {
                core_module_1 = core_module_1_1;
            },
            function (kbn_1_1) {
                kbn_1 = kbn_1_1;
            }
        ],
        execute: function () {///<reference path="../../headers/common.d.ts" />
            PlaylistSrv = (function () {
                /** @ngInject */
                function PlaylistSrv($rootScope, $location, $timeout, backendSrv) {
                    this.$rootScope = $rootScope;
                    this.$location = $location;
                    this.$timeout = $timeout;
                    this.backendSrv = backendSrv;
                }
                PlaylistSrv.prototype.next = function () {
                    var _this = this;
                    this.$timeout.cancel(this.cancelPromise);
                    var playedAllDashboards = this.index > this.dashboards.length - 1;
                    if (playedAllDashboards) {
                        window.location.href = this.startUrl;
                    }
                    else {
                        var dash = this.dashboards[this.index];
                        this.$location.url('dashboard/' + dash.uri);
                        this.index++;
                        this.cancelPromise = this.$timeout(function () { return _this.next(); }, this.interval);
                    }
                };
                PlaylistSrv.prototype.prev = function () {
                    this.index = Math.max(this.index - 2, 0);
                    this.next();
                };
                PlaylistSrv.prototype.start = function (playlistId) {
                    var _this = this;
                    this.stop();
                    this.startUrl = window.location.href;
                    this.index = 0;
                    this.playlistId = playlistId;
                    this.isPlaying = true;
                    this.backendSrv.get("/api/playlists/" + playlistId).then(function (playlist) {
                        _this.backendSrv.get("/api/playlists/" + playlistId + "/dashboards").then(function (dashboards) {
                            _this.dashboards = dashboards;
                            _this.interval = kbn_1.default.interval_to_ms(playlist.interval);
                            _this.next();
                        });
                    });
                };
                PlaylistSrv.prototype.stop = function () {
                    this.index = 0;
                    this.isPlaying = false;
                    this.playlistId = 0;
                    if (this.cancelPromise) {
                        this.$timeout.cancel(this.cancelPromise);
                    }
                };
                return PlaylistSrv;
            }());
            core_module_1.default.service('playlistSrv', PlaylistSrv);
        }
    };
});
//# sourceMappingURL=playlist_srv.js.map