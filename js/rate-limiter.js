/**
 * Rate Limiter - Muts Safaris
 * Prevents API abuse by limiting request frequency
 */
(function(window) {
    'use strict';

    var RateLimiter = {
        _limits: {},
        _storageKey: 'muts_rate_limits',

        /**
         * Configure rate limit for an endpoint
         * @param {string} key - Endpoint identifier
         * @param {number} maxRequests - Max requests allowed
         * @param {number} windowMs - Time window in milliseconds
         */
        setLimit: function(key, maxRequests, windowMs) {
            this._limits[key] = {
                maxRequests: maxRequests,
                windowMs: windowMs,
                requests: []
            };
        },

        /**
         * Check if request is allowed
         * @param {string} key - Endpoint identifier
         * @returns {object} { allowed: boolean, remaining: number, resetAt: number }
         */
        check: function(key) {
            var limit = this._limits[key];
            if (!limit) {
                return { allowed: true, remaining: Infinity, resetAt: 0 };
            }

            var now = Date.now();
            var windowStart = now - limit.windowMs;

            // Clean old requests outside the window
            limit.requests = limit.requests.filter(function(ts) {
                return ts > windowStart;
            });

            var remaining = Math.max(0, limit.maxRequests - limit.requests.length);
            var oldestInWindow = limit.requests[0];
            var resetAt = oldestInWindow ? oldestInWindow + limit.windowMs : now + limit.windowMs;

            return {
                allowed: remaining > 0,
                remaining: remaining,
                resetAt: resetAt
            };
        },

        /**
         * Record a request
         * @param {string} key - Endpoint identifier
         * @returns {boolean} - Whether request was recorded
         */
        record: function(key) {
            var limit = this._limits[key];
            if (!limit) return true;

            var check = this.check(key);
            if (check.allowed) {
                limit.requests.push(Date.now());
                return true;
            }
            return false;
        },

        /**
         * Get time until next request is allowed
         * @param {string} key - Endpoint identifier
         * @returns {number} - Milliseconds until reset
         */
        getRetryAfter: function(key) {
            var limit = this._limits[key];
            if (!limit) return 0;

            var check = this.check(key);
            if (check.allowed) return 0;

            return Math.max(0, check.resetAt - Date.now());
        },

        /**
         * Clear rate limit for an endpoint
         * @param {string} key - Endpoint identifier
         */
        clear: function(key) {
            if (this._limits[key]) {
                this._limits[key].requests = [];
            }
        },

        /**
         * Initialize default limits
         */
        init: function() {
            // API endpoints default limits
            this.setLimit('api_login', 5, 60000);        // 5 login attempts per minute
            this.setLimit('api_search', 30, 60000);      // 30 searches per minute
            this.setLimit('api_booking', 10, 60000);     // 10 bookings per minute
            this.setLimit('api_message', 20, 60000);     // 20 messages per minute
            this.setLimit('api_upload', 5, 60000);       // 5 uploads per minute
        }
    };

    // Initialize default limits
    RateLimiter.init();

    /**
     * Decorator function to add rate limiting to any function
     * @param {function} fn - Function to wrap
     * @param {string} key - Rate limit key
     * @returns {function}
     */
    RateLimiter.wrap = function(fn, key) {
        return function() {
            var check = RateLimiter.check(key);
            if (!check.allowed) {
                var retryAfter = Math.ceil(RateLimiter.getRetryAfter(key) / 1000);
                return Promise.reject({
                    error: 'Rate limit exceeded',
                    retryAfter: retryAfter,
                    code: 'RATE_LIMITED'
                });
            }
            RateLimiter.record(key);
            return fn.apply(this, arguments);
        };
    };

    window.MutsRateLimiter = RateLimiter;
})(window);