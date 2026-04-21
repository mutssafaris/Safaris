/* API Configuration — Muts Safaris */
/* Unified API initialization for all services */
(function(window) {
    'use strict';

    var MutsAPIConfig = {
        _apiReady: false,
        _services: {},
        _initialized: false,
        _environment: 'development',
        
        _env: {
            development: {
                apiBaseUrl: 'http://localhost:3000/api',
                wsBaseUrl: 'ws://localhost:3000',
                timeout: 30000,
                retries: 3
            },
            staging: {
                apiBaseUrl: 'https://staging-api.mutssafaris.com/api',
                wsBaseUrl: 'wss://staging-api.mutssafaris.com',
                timeout: 30000,
                retries: 3
            },
            production: {
                apiBaseUrl: 'https://api.mutssafaris.com/api',
                wsBaseUrl: 'wss://api.mutssafaris.com',
                timeout: 15000,
                retries: 2
            }
        },

        init: function() {
            this._detectEnvironment();
            this._registerServices();
            this._initialized = true;
            
            if (this._apiReady) {
                this.connectAll();
            }
        },

        _detectEnvironment: function() {
            var hostname = window.location.hostname;
            var protocol = window.location.protocol;
            
            if (hostname === 'localhost' || hostname === '127.0.0.1') {
                this._environment = 'development';
            } else if (hostname.indexOf('staging') !== -1 || hostname.indexOf('test') !== -1) {
                this._environment = 'staging';
            } else if (hostname.indexOf('mutssafaris.com') !== -1 && protocol === 'https:') {
                this._environment = 'production';
            }
        },

        _registerServices: function() {
            var services = [
                'MutsAuth',
                'MutsWishlistService',
                'MutsBookingsService',
                'MutsHotelsService',
                'MutsMessagesService',
                'MutsTransactionsService',
                'MutsDestinationsService',
                'MutsListingsService',
                'MutsAfricasaService',
                'MutsBlog',
                'MutsPaymentService',
                'MutsSearchService',
                'MutsReviewsService',
                'ManagerService'
            ];
            
            var self = this;
            services.forEach(function(name) {
                var service = window[name];
                if (service && typeof service.enableAPI === 'function') {
                    self._services[name] = service;
                }
            });
        },

        connectAll: function() {
            var baseURL = this.getBaseURL();
            var self = this;
            
            Object.keys(this._services).forEach(function(name) {
                var service = self._services[name];
                service.enableAPI(baseURL);
            });
            
            this._apiReady = true;
            // Silent connect
        },

        disconnectAll: function() {
            var self = this;
            Object.keys(this._services).forEach(function(name) {
                var service = self._services[name];
                if (typeof service.disableAPI === 'function') {
                    service.disableAPI();
                }
            });
            this._apiReady = false;
            // Silent disconnect
        },

        setEnvironment: function(env) {
            if (this._env[env]) {
                this._environment = env;
                // Silent env
                if (this._apiReady) {
                    this.connectAll();
                }
            }
        },

        getEnvironment: function() {
            return this._environment;
        },

        getBaseURL: function() {
            return this._env[this._environment].apiBaseUrl;
        },

        getWSBaseURL: function() {
            return this._env[this._environment].wsBaseUrl;
        },

        getTimeout: function() {
            return this._env[this._environment].timeout;
        },

        getRetries: function() {
            return this._env[this._environment].retries;
        },

        getService: function(name) {
            return this._services[name] || null;
        },

        isConnected: function() {
            return this._apiReady;
        },

        getStatus: function() {
            var self = this;
            var status = {
                connected: this._apiReady,
                environment: this._environment,
                baseURL: this.getBaseURL(),
                services: {}
            };
            
            Object.keys(this._services).forEach(function(name) {
                var service = self._services[name];
                status.services[name] = typeof service.isAPILive === 'function' ? service.isAPILive() : false;
            });
            
            return status;
        },

        configure: function(options) {
            if (options.environment) {
                this.setEnvironment(options.environment);
            }
            
            if (options.connect === true) {
                this.connectAll();
            }
            
            if (options.disconnect === true) {
                this.disconnectAll();
            }
            
            // Silent apply
        }
    };

    window.MutsAPIConfig = MutsAPIConfig;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            MutsAPIConfig.init();
        });
    } else {
        MutsAPIConfig.init();
    }
    
    window.MutsAPI = {
        connect: function(env) {
            if (env) MutsAPIConfig.setEnvironment(env);
            MutsAPIConfig.connectAll();
        },
        disconnect: function() {
            MutsAPIConfig.disconnectAll();
        },
        status: function() {
            return MutsAPIConfig.getStatus();
        },
        getBaseURL: function() {
            return MutsAPIConfig.getBaseURL();
        },
        getService: function(name) {
            return MutsAPIConfig.getService(name);
        }
    };
    
    window.addEventListener('online', function() {
        // Silent
    });
    
    window.addEventListener('offline', function() {
        // Silent
    });

})(window);
