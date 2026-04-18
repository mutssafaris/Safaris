/**
 * Image Optimizer - Muts Safaris
 * Enhanced image optimization with responsive images, WebP, and lazy loading
 * 
 * Usage:
 *   MutsImageOptimizer.init() - Auto-init lazy loading
 *   MutsImageOptimizer.picture(path, options) - Create picture element
 *   MutsImageOptimizer.srcset(path, sizes) - Generate srcset
 *   MutsImageOptimizer.hero(path, options) - Hero image with priority loading
 *   MutsImageOptimizer.gallery(images, options) - Gallery grid with lazy load
 */
(function() {
    'use strict';

    var CDNs = {
        primary: 'https://images.mutssafaris.com',
        fallback: 'https://via.placeholder.com'
    };

    var defaults = {
        breakpoints: [320, 480, 640, 800, 1024, 1280, 1920],
        quality: 80,
        webpQuality: 75,
        lazyRootMargin: '100px',
        lazyThreshold: 0.1
    };

    var ImageOptimizer = {
        /**
         * Initialize optimizer
         * @param {Object} config - Configuration options
         */
        init: function(config) {
            if (config) {
                Object.assign(defaults, config);
            }
            
            if (config && config.cdn) {
                CDNs.primary = config.cdn;
            }
            
            // Initialize lazy loading observers
            this.initLazyObservers();
            
            // Preload critical hero images
            this.preloadHeroImages();
            
            console.log('[ImageOptim] Initialized with CDN:', CDNs.primary);
        },

        /**
         * Get CDN base URL
         */
        getCDN: function() {
            return CDNs.primary;
        },

        /**
         * Build responsive srcset from path
         * @param {string} path - Base image path
         * @param {Array} sizes - Breakpoint sizes
         * @returns {string} srcset string
         */
        srcset: function(path, sizes) {
            if (!path) return '';
            
            if (!sizes) sizes = defaults.breakpoints;
            
            var baseUrl = this.buildUrl(path);
            
            return sizes.map(function(w) {
                return baseUrl + '?w=' + w + '&q=' + defaults.quality + ' ' + w + 'w';
            }).join(', ');
        },

        /**
         * Build srcset for WebP format
         * @param {string} path - Base image path  
         * @param {Array} sizes - Breakpoint sizes
         * @returns {string} WebP srcset
         */
        srcsetWebP: function(path, sizes) {
            if (!path) return '';
            
            if (!sizes) sizes = defaults.breakpoints;
            
            var baseUrl = this.buildUrl(path, { format: 'webp' });
            
            return sizes.map(function(w) {
                return baseUrl + '&w=' + w + '&q=' + defaults.webpQuality + ' ' + w + 'w';
            }).join(', ');
        },

        /**
         * Build optimized URL with params
         * @param {string} path - Image path
         * @param {Object} params - URL parameters
         * @returns {string} Optimized URL
         */
        buildUrl: function(path, params) {
            if (!path) return this.placeholder();
            
            // Return external URLs as-is
            if (path.startsWith('http')) {
                return path;
            }
            
            // Ensure leading slash
            if (!path.startsWith('/')) {
                path = '/' + path;
            }
            
            var url = CDNs.primary + path;
            var queryParams = [];
            
            if (params) {
                if (params.width) queryParams.push('w=' + params.width);
                if (params.height) queryParams.push('h=' + params.height);
                if (params.quality) queryParams.push('q=' + params.quality);
                if (params.format) queryParams.push('fmt=' + params.format);
                if (params.fit) queryParams.push('fit=' + params.fit);
            }
            
            if (queryParams.length > 0) {
                url += (url.includes('?') ? '&' : '?') + queryParams.join('&');
            }
            
            return url;
        },

        /**
         * Create picture element with WebP and fallbacks
         * @param {string} path - Base image path
         * @param {Object} options - Image options
         * @returns {string} HTML picture element
         */
        picture: function(path, options) {
            options = options || {};
            
            if (!path) {
                return this.placeholderImg(options);
            }
            
            var alt = options.alt || '';
            var classes = options['class'] || '';
            var loading = options.loading || 'lazy';
            var fetchPriority = options.fetchPriority || 'auto';
            
            // Build URLs
            var jpgUrl = this.buildUrl(path, { format: 'jpg', width: options.width });
            var webpUrl = this.buildUrl(path, { format: 'webp', width: options.width });
            
            // Responsive srcset
            var jpgSrcset = this.srcset(path);
            var webpSrcset = this.srcsetWebP(path);
            
            // Sizes attribute
            var sizes = options.sizes || '(min-width: 768px) 50vw, 100vw';
            
            var html = '<picture>';
            
            // WebP source with srcset
            if (webpSrcset) {
                html += '<source srcset="' + webpSrcset + '" sizes="' + sizes + '" type="image/webp">';
            }
            
            // JPEG fallback with srcset
            html += '<img';
            html += ' src="' + jpgUrl + '"';
            html += ' srcset="' + jpgSrcset + '"';
            html += ' sizes="' + sizes + '"';
            html += ' alt="' + alt + '"';
            html += ' class="' + classes + '"';
            html += ' loading="' + loading + '"';
            html += ' fetchpriority="' + fetchPriority + '"';
            html += ' decoding="async"';
            
            if (options.width) html += ' width="' + options.width + '"';
            if (options.height) html += ' height="' + options.height + '"';
            if (options.style) html += ' style="' + options.style + '"';
            
            html += '>';
            html += '</picture>';
            
            return html;
        },

        /**
         * Create hero image with priority loading
         * @param {string} path - Image path
         * @param {Object} options - Options
         * @returns {string} HTML img element
         */
        hero: function(path, options) {
            options = options || {};
            options.loading = 'eager';
            options.fetchPriority = 'high';
            
            return this.picture(path, options);
        },

        /**
         * Create gallery item with lazy loading
         * @param {string} path - Image path
         * @param {Object} options - Options
         * @returns {string} HTML img element
         */
        gallery: function(path, options) {
            options = options || {};
            options.loading = 'lazy';
            options.fetchPriority = 'auto';
            
            return this.picture(path, options);
        },

        /**
         * Generate placeholder URL
         * @param {Object} options - Size options
         * @returns {string} Placeholder URL
         */
        placeholder: function(options) {
            var w = (options && options.width) || 400;
            var h = (options && options.height) || 300;
            var text = (options && options.text) || '';
            return CDNs.fallback + '/' + w + 'x' + h + '?text=' + encodeURIComponent(text);
        },

        /**
         * Generate placeholder image tag
         * @param {Object} options - Options
         * @returns {string} IMG HTML
         */
        placeholderImg: function(options) {
            var src = this.placeholder(options);
            var html = '<img src="' + src + '"';
            if (options) {
                if (options.alt) html += ' alt="' + options.alt + '"';
                if (options['class']) html += ' class="' + options['class'] + '"';
            }
            html += '>';
            return html;
        },

        /**
         * Initialize lazy loading observers
         */
        initLazyObservers: function() {
            var self = this;
            
            if (!('IntersectionObserver' in window)) {
                return;
            }
            
            // Observer for images with data-lazy
            var lazyObserver = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        var img = entry.target;
                        var src = img.dataset.lazy || img.dataset.src;
                        if (src) {
                            img.src = src;
                            img.removeAttribute('data-lazy');
                            img.removeAttribute('data-src');
                        }
                        img.classList.add('loaded');
                        lazyObserver.unobserve(img);
                    }
                });
            }, {
                rootMargin: defaults.lazyRootMargin,
                threshold: defaults.lazyThreshold
            });
            
            // Observe all lazy images
            document.querySelectorAll('img[data-lazy], img[data-src]').forEach(function(img) {
                lazyObserver.observe(img);
            });
            
            // Observer for background images
            var bgObserver = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        var el = entry.target;
                        var bg = el.dataset.bg || el.dataset.background;
                        if (bg) {
                            el.style.backgroundImage = 'url(' + bg + ')';
                            el.removeAttribute('data-bg');
                            el.removeAttribute('data-background');
                        }
                        bgObserver.unobserve(el);
                    }
                });
            }, {
                rootMargin: defaults.lazyRootMargin,
                threshold: defaults.lazyThreshold
            });
            
            document.querySelectorAll('[data-bg], [data-background]').forEach(function(el) {
                bgObserver.observe(el);
            });
        },

        /**
         * Preload critical hero images
         */
        preloadHeroImages: function() {
            var heroImages = document.querySelectorAll('img[fetchpriority="high"], .hero-image img');
            heroImages.forEach(function(img) {
                if (img.dataset.src) {
                    var link = document.createElement('link');
                    link.rel = 'preload';
                    link.as = 'image';
                    link.href = img.dataset.src;
                    document.head.appendChild(link);
                }
            });
        },

        /**
         * Create blur placeholder for smooth loading
         * @param {string} src - Image source
         * @param {Function} callback - Callback with placeholder
         */
        blurPlaceholder: function(src, callback) {
            var img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = function() {
                var canvas = document.createElement('canvas');
                var size = 20;
                canvas.width = size;
                canvas.height = size;
                var ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, size, size);
                var blurSrc = canvas.toDataURL('image/jpeg', 0.2);
                callback(blurSrc);
            };
            img.onerror = function() {
                callback(null);
            };
            img.src = src;
        },

        /**
         * Get optimal image size for viewport
         * @returns {number} Optimal width
         */
        getOptimalWidth: function() {
            var width = window.innerWidth;
            var dpr = window.devicePixelRatio || 1;
            return Math.ceil(width * dpr);
        },

        /**
         * Check WebP support
         * @returns {boolean} WebP supported
         */
        supportsWebP: function() {
            var canvas = document.createElement('canvas');
            canvas.width = 1;
            canvas.height = 1;
            return canvas.toDataURL('image/webp').startsWith('data:image/webp');
        }
    };

    // Auto-init on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            ImageOptimizer.init();
        });
    } else {
        // DOM already loaded
        setTimeout(function() {
            ImageOptimizer.init();
        }, 0);
    }

    window.MutsImageOptimizer = ImageOptimizer;

})();