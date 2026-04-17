/**
 * Cache Manager - Muts Safaris
 * Time-based localStorage caching with TTL support
 */
(function(window) {
    'use strict';

    var CacheManager = {
        _prefix: 'muts_cache_',
        
        /**
         * Store data with TTL
         * @param {string} key - Cache key
         * @param {any} data - Data to cache
         * @param {number} ttlMs - Time to live in milliseconds
         */
        set: function(key, data, ttlMs) {
            var ttl = ttlMs || (60 * 60 * 1000); // Default 1 hour
            var item = {
                data: data,
                timestamp: Date.now(),
                ttl: ttl,
                expiresAt: Date.now() + ttl
            };
            try {
                localStorage.setItem(this._prefix + key, JSON.stringify(item));
            } catch(e) {
                console.warn('[Cache] localStorage full, clearing old cache');
                this._evictOldest();
                try {
                    localStorage.setItem(this._prefix + key, JSON.stringify(item));
                } catch(e2) {
                    console.error('[Cache] Failed to store:', e2);
                }
            }
        },

        /**
         * Retrieve cached data
         * @param {string} key - Cache key
         * @returns {any|null} Cached data or null if expired/missing
         */
        get: function(key) {
            try {
                var stored = localStorage.getItem(this._prefix + key);
                if (!stored) return null;
                
                var item = JSON.parse(stored);
                
                // Check if expired
                if (Date.now() > item.expiresAt) {
                    this.remove(key);
                    return null;
                }
                
                return item.data;
            } catch(e) {
                return null;
            }
        },

        /**
         * Check if key exists and is valid
         * @param {string} key - Cache key
         * @returns {boolean}
         */
        has: function(key) {
            return this.get(key) !== null;
        },

        /**
         * Remove cached item
         * @param {string} key - Cache key
         */
        remove: function(key) {
            localStorage.removeItem(this._prefix + key);
        },

        /**
         * Clear all cache
         */
        clear: function() {
            var keys = this.keys();
            keys.forEach(function(k) {
                localStorage.removeItem(k);
            });
        },

        /**
         * Get all cache keys
         * @returns {array}
         */
        keys: function() {
            var keys = [];
            for (var i = 0; i < localStorage.length; i++) {
                var key = localStorage.key(i);
                if (key && key.startsWith(this._prefix)) {
                    keys.push(key.replace(this._prefix, ''));
                }
            }
            return keys;
        },

        /**
         * Get cache statistics
         * @returns {object}
         */
        stats: function() {
            var keys = this.keys();
            var totalSize = 0;
            var expired = 0;
            var valid = 0;
            
            keys.forEach(function(key) {
                var data = localStorage.getItem(this._prefix + key);
                totalSize += data ? data.length : 0;
                
                try {
                    var item = JSON.parse(data);
                    if (Date.now() > item.expiresAt) {
                        expired++;
                    } else {
                        valid++;
                    }
                } catch(e) {}
            }, this);
            
            return {
                total: keys.length,
                valid: valid,
                expired: expired,
                sizeKb: Math.round(totalSize / 1024)
            };
        },

        /**
         * Evict oldest cache entry when storage full
         * @private
         */
        _evictOldest: function() {
            var oldest = null;
            var oldestTime = Infinity;
            
            for (var i = 0; i < localStorage.length; i++) {
                var key = localStorage.key(i);
                if (key && key.startsWith(this._prefix)) {
                    try {
                        var item = JSON.parse(localStorage.getItem(key));
                        if (item.timestamp < oldestTime) {
                            oldestTime = item.timestamp;
                            oldest = key;
                        }
                    } catch(e) {}
                }
            }
            
            if (oldest) {
                localStorage.removeItem(oldest);
            }
        },

        /**
         * Clean expired entries
         */
        cleanup: function() {
            var keys = this.keys();
            keys.forEach(function(key) {
                this.get(key); // Will auto-remove if expired
            }, this);
        }
    };

    /**
     * Decorator to add caching to any function
     * @param {function} fn - Function to wrap
     * @param {string} key - Cache key
     * @param {number} ttlMs - Cache TTL in ms
     * @returns {function}
     */
    CacheManager.cached = function(fn, key, ttlMs) {
        return function() {
            var cacheKey = key + '_' + JSON.stringify(arguments);
            var cached = CacheManager.get(cacheKey);
            
            if (cached !== null) {
                return Promise.resolve(cached);
            }
            
            return fn.apply(this, arguments).then(function(result) {
                CacheManager.set(cacheKey, result, ttlMs);
                return result;
            });
        };
    };

    window.MutsCache = CacheManager;
})(window);
