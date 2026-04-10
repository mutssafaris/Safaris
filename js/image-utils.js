/**
 * Image Utils - Muts Safaris Main Website
 * Handles image optimization, lazy loading, responsive images, and caching
 */
(function(window) {
    'use strict';

    var CDNS = {
        primary: 'https://images.mutssafaris.com',
        fallback: 'https://via.placeholder.com'
    };

    var ImageUtils = {
        /**
         * Initialize with CDN configuration
         * @param {Object} config - Configuration
         */
        init: function(config) {
            if (config && config.cdn) {
                CDNS.primary = config.cdn;
                localStorage.setItem('muts_cdn_primary', config.cdn);
            } else {
                CDNS.primary = localStorage.getItem('muts_cdn_primary') || CDNS.primary;
            }
        },

        /**
         * Get configured CDN base URL
         * @returns {string} CDN URL
         */
        getCDN: function() {
            return CDNS.primary;
        },

        /**
         * Build optimized image URL
         * @param {string} path - Image path or URL
         * @param {Object} options - Size/quality options
         * @returns {string} Optimized URL
         */
        buildURL: function(path, options) {
            if (!path) return this.getPlaceholder(options);
            if (path.startsWith('data:')) return path; // Data URL
            if (!path.startsWith('/') && !path.startsWith('http')) {
                path = '/' + path;
            }
            
            if (path.startsWith('http')) {
                return this.addImageParams(path, options);
            }
            
            var baseUrl = CDNS.primary + path;
            return this.addImageParams(baseUrl, options);
        },

        /**
         * Add resize/quality parameters to image URL
         * @param {string} url - Base URL
         * @param {Object} options - Options
         * @returns {string} URL with params
         */
        addImageParams: function(url, options) {
            if (!options) return url;
            var params = [];
            if (options.width) params.push('w=' + options.width);
            if (options.height) params.push('h=' + options.height);
            if (options.quality) params.push('q=' + options.quality);
            if (options.format) params.push('fmt=' + options.format);
            if (options.fit) params.push('fit=' + options.fit);
            
            if (params.length > 0) {
                var separator = url.includes('?') ? '&' : '?';
                return url + separator + params.join('&');
            }
            return url;
        },

        /**
         * Build srcset for responsive images
         * @param {string} path - Image path
         * @param {Array} sizes - Breakpoints
         * @returns {string} srcset string
         */
        buildSrcSet: function(path, sizes) {
            if (!path) return '';
            if (!sizes) sizes = [320, 640, 960, 1280, 1920];
            
            var baseUrl = path.startsWith('http') ? path : (CDNS.primary + path);
            
            return sizes.map(function(w) {
                return this.buildURL(baseUrl, { width: w }) + ' ' + w + 'w';
            }, this).join(', ');
        },

        /**
         * Generate picture element with WebP + fallback
         * @param {string} path - Image path
         * @param {Object} options - Options
         * @returns {string} HTML string
         */
        buildPicture: function(path, options) {
            if (!path) return this.getPlaceholderImg(options);
            
            var webpUrl = this.buildURL(path, { format: 'webp', width: options && options.width });
            var jpgUrl = this.buildURL(path, { format: 'jpg', width: options && options.width });
            
            var html = '<picture>';
            html += '<source srcset="' + webpUrl + '" type="image/webp">';
            html += '<img src="' + jpgUrl + '"';
            if (options) {
                if (options.alt) html += ' alt="' + options.alt + '"';
                if (options['class']) html += ' class="' + options['class'] + '"';
                if (options.loading !== 'eager') html += ' loading="lazy"';
            }
            html += '>';
            html += '</picture>';
            
            return html;
        },

        /**
         * Get placeholder image URL
         * @param {Object} options - Size options
         * @returns {string} Placeholder URL
         */
        getPlaceholder: function(options) {
            var w = (options && options.width) || 400;
            var h = (options && options.height) || 300;
            var text = (options && options.text) || '';
            return CDNS.fallback + '/' + w + 'x' + h + '?text=' + encodeURIComponent(text);
        },

        /**
         * Get placeholder as img tag
         * @param {Object} options - Options
         * @returns {string} IMG HTML
         */
        getPlaceholderImg: function(options) {
            var src = this.getPlaceholder(options);
            var html = '<img src="' + src + '"';
            if (options) {
                if (options.alt) html += ' alt="' + options.alt + '"';
                if (options['class']) html += ' class="' + options['class'] + '"';
            }
            html += '>';
            return html;
        },

        /**
         * Create lazy loading observer for images
         * @param {string} selector - Image selector
         * @param {Object} options - Options
         */
        initLazyLoading: function(selector, options) {
            if (!('IntersectionObserver' in window)) {
                // Fallback for older browsers
                document.querySelectorAll(selector).forEach(function(img) {
                    img.src = img.dataset.src || img.src;
                });
                return;
            }

            var observer = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        var img = entry.target;
                        var src = img.dataset.src || img.dataset.lazy;
                        if (src) {
                            img.src = src;
                            img.removeAttribute('data-src');
                            img.removeAttribute('data-lazy');
                        }
                        if (options && options.onLoad) {
                            img.onload = function() { options.onLoad(img); };
                        }
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: (options && options.rootMargin) || '50px',
                threshold: (options && options.threshold) || 0.1
            });

            document.querySelectorAll(selector).forEach(function(img) {
                observer.observe(img);
            });

            return observer;
        },

        /**
         * Cache image in localStorage for offline
         * @param {string} url - Image URL
         * @param {string} key - Cache key
         * @returns {Promise} Resolution
         */
        cacheImage: function(url, key) {
            return new Promise(function(resolve, reject) {
                var img = new Image();
                img.crossOrigin = 'anonymous';
                img.onload = function() {
                    try {
                        var canvas = document.createElement('canvas');
                        canvas.width = img.width;
                        canvas.height = img.height;
                        var ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0);
                        var dataUrl = canvas.toDataURL('image/jpeg', 0.7);
                        
                        var cacheData = {
                            data: dataUrl,
                            timestamp: Date.now()
                        };
                        localStorage.setItem('img_cache_' + key, JSON.stringify(cacheData));
                        resolve(dataUrl);
                    } catch (e) {
                        reject(e);
                    }
                };
                img.onerror = reject;
                img.src = url;
            });
        },

        /**
         * Get cached image
         * @param {string} key - Cache key
         * @param {number} maxAge - Max age in ms
         * @returns {string|null} Cached data URL or null
         */
        getCachedImage: function(key, maxAge) {
            try {
                var cached = localStorage.getItem('img_cache_' + key);
                if (!cached) return null;
                
                var data = JSON.parse(cached);
                var maxAgeMs = maxAge || (24 * 60 * 60 * 1000); // Default 24 hours
                
                if (Date.now() - data.timestamp > maxAgeMs) {
                    localStorage.removeItem('img_cache_' + key);
                    return null;
                }
                
                return data.data;
            } catch (e) {
                return null;
            }
        },

        /**
         * Preload images for faster display
         * @param {Array} urls - Array of image URLs
         */
        preloadImages: function(urls) {
            urls.forEach(function(url) {
                var img = new Image();
                img.src = url;
            });
        },

        /**
         * Create blurred placeholder for lazy loading
         * @param {string} src - Image source
         * @param {Function} callback - Callback with placeholder
         */
        createBlurPlaceholder: function(src, callback) {
            var img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = function() {
                var canvas = document.createElement('canvas');
                var size = 20;
                canvas.width = size;
                canvas.height = size;
                var ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, size, size);
                var blurSrc = canvas.toDataURL('image/jpeg', 0.3);
                callback(blurSrc);
            };
            img.onerror = function() {
                callback(null);
            };
            img.src = src;
        }
    };

    // Initialize lazy loading on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            ImageUtils.initLazyLoading('img[data-lazy]', { rootMargin: '100px' });
            ImageUtils.initLazyLoading('img[data-src]', { rootMargin: '100px' });
        });
    } else {
        ImageUtils.initLazyLoading('img[data-lazy]', { rootMargin: '100px' });
        ImageUtils.initLazyLoading('img[data-src]', { rootMargin: '100px' });
    }

    window.MutsImageUtils = ImageUtils;

})(window);