/**
 * API Request Logger - Muts Safaris
 * Logs API requests for debugging and security monitoring
 */
(function(window) {
    'use strict';

    var MAX_LOG_ENTRIES = 100;
    var STORAGE_KEY = 'muts_api_logs';
    var STORAGE_ENABLED = false; // Set to true to enable localStorage persistence

    var ApiLogger = {
        _logs: [],

        /**
         * Log an API request
         * @param {object} options
         */
        log: function(options) {
            var entry = {
                id: this._generateId(),
                timestamp: new Date().toISOString(),
                method: options.method || 'GET',
                url: options.url || '',
                status: options.status || 0,
                duration: options.duration || 0,
                requestBody: options.requestBody,
                responseSize: options.responseSize || 0,
                error: options.error,
                userAgent: navigator.userAgent,
                sessionId: this._getSessionId()
            };

            this._logs.unshift(entry);

            // Keep only MAX_LOG_ENTRIES
            if (this._logs.length > MAX_LOG_ENTRIES) {
                this._logs = this._logs.slice(0, MAX_LOG_ENTRIES);
            }

            // Optionally persist to localStorage
            if (STORAGE_ENABLED) {
                this._persist();
            }

            return entry;
        },

        /**
         * Log successful request
         */
        logSuccess: function(options) {
            return this.log(Object.assign({}, options, { status: 200, error: null }));
        },

        /**
         * Log failed request
         */
        logError: function(options) {
            return this.log(Object.assign({}, options, { status: options.status || 500 }));
        },

        /**
         * Get all logs
         * @returns {array}
         */
        getLogs: function() {
            return this._logs.slice();
        },

        /**
         * Get logs filtered by criteria
         * @param {object} filters
         * @returns {array}
         */
        getFilteredLogs: function(filters) {
            return this._logs.filter(function(log) {
                var match = true;
                if (filters.method) match = match && log.method === filters.method;
                if (filters.status) match = match && log.status === filters.status;
                if (filters.url) match = match && log.url.indexOf(filters.url) !== -1;
                if (filters.from) match = match && new Date(log.timestamp) >= new Date(filters.from);
                if (filters.to) match = match && new Date(log.timestamp) <= new Date(filters.to);
                return match;
            });
        },

        /**
         * Get error logs only
         * @returns {array}
         */
        getErrors: function() {
            return this._logs.filter(function(log) { return log.status >= 400; });
        },

        /**
         * Get statistics
         * @returns {object}
         */
        getStats: function() {
            var logs = this._logs;
            var total = logs.length;
            var errors = logs.filter(function(l) { return l.status >= 400; }).length;
            var avgDuration = total > 0 ? Math.round(logs.reduce(function(acc, l) { return acc + l.duration; }, 0) / total) : 0;
            return { total: total, errors: errors, errorRate: total > 0 ? Math.round(errors / total * 100) : 0, avgDuration: avgDuration };
        },

        /**
         * Clear all logs
         */
        clear: function() {
            this._logs = [];
            if (STORAGE_ENABLED) localStorage.removeItem(STORAGE_KEY);
        },

        /**
         * Export logs as JSON
         * @returns {string}
         */
        export: function() {
            return JSON.stringify(this._logs, null, 2);
        },

        _generateId: function() {
            return Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 5);
        },

        _getSessionId: function() {
            try {
                var session = JSON.parse(localStorage.getItem('muts_session') || localStorage.getItem('muts_manager_session'));
                return session ? (session.token || session.userId || 'anonymous') : 'anonymous';
            } catch(e) { return 'anonymous'; }
        },

        _persist: function() {
            try { localStorage.setItem(STORAGE_KEY, JSON.stringify(this._logs.slice(0, 50))); } catch(e) { STORAGE_ENABLED = false; }
        }
    };

    /**
     * Wrap fetch to automatically log requests
     */
    ApiLogger.wrapFetch = function(originalFetch) {
        return function(url, options) {
            var startTime = Date.now();
            var method = (options && options.method) || 'GET';
            return originalFetch(url, options).then(function(response) {
                var duration = Date.now() - startTime;
                var clone = response.clone();
                clone.text().then(function(text) {
                    ApiLogger.logSuccess({ url: url, method: method, status: response.status, duration: duration, responseSize: text.length });
                }).catch(function() {
                    ApiLogger.logSuccess({ url: url, method: method, status: response.status, duration: duration });
                });
                return response;
            }).catch(function(error) {
                ApiLogger.logError({ url: url, method: method, status: 0, duration: Date.now() - startTime, error: error.message });
                throw error;
            });
        };
    };

    /**
     * Initialize - wrap the global fetch
     */
    ApiLogger.init = function() {
        if (window.fetch && !window._fetchLogged) {
            window._fetchLogged = true;
            window.fetch = ApiLogger.wrapFetch(window.fetch);
        }
    };

    window.MutsApiLogger = ApiLogger;
})(window);
