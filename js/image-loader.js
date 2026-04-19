/**
 * Smart Image Loader - Muts Safaris
 * Handles multiple image formats with WebP support and graceful fallbacks
 * 
 * Usage:
 *   MutsImageLoader.init() - Initialize
 *   MutsImageLoader.load(selector) - Convert img tags to picture elements
 *   MutsImageLoader.hero(path, alt, options) - Generate hero image HTML
 *   MutsImageLoader.card(path, alt) - Generate card image HTML
 */
(function() {
    'use strict';
    
    // CDN only used in production
    var isProduction = window.location.hostname !== '127.0.0.1' && 
                       window.location.hostname !== 'localhost' &&
                       !window.location.hostname.endsWith('.local');
    
    var CDN_BASE = isProduction ? 'https://images.mutssafaris.com' : '';
    var PLACEHOLDER = 'https://via.placeholder.com';
    
    // Known image paths that exist (for static fallback)
    var KNOWN_IMAGES = {
        // Hotels - Eco Budget
        'hotels-ecobudget': '/images/hero/hotels-ecobudget.jpg',
        'laikipia-community-camp': '/images/hotels/eco-budget/laikipia-community-camp.jpg',
        'amboseli-conservation-camp': '/images/hotels/eco-budget/amboseli-camp.jpg',
        'tsavo-eco-lodge': '/images/hotels/eco-budget/tsavo-camp.jpg',
        'mara-budget-camp': '/images/hotels/eco-budget/mara-budget-camp.jpg',
        'mombasa-budget-guesthouse': '/images/hotels/eco-budget/coastal-budget-guesthouse.jpg',
        'nakuru-eco-lodge': '/images/hotels/eco-budget/nakuru-budget-lodge.jpg',
        
        // Hotels - Luxury  
        'hotels-luxury': '/images/hero/hotels-luxury.jpg',
        'tsavo-lodge': '/images/hotels/luxury/tsavo-lodge.jpg',
        'maasai-mara-lodge': '/images/hotels/luxury/maasai-mara-lodge.jpg',
        'norfolk-hotel': '/images/hotels/luxury/nairobi-lodge.jpg',
        'samburu-lodge': '/images/hotels/luxury/samburu-lodge.jpg',
        'diani-resort': '/images/hotels/luxury/diani-lodge.jpg',
        'amboseli-lodge': '/images/hotels/luxury/amboseli-lodge.jpg',
        
        // Hotels - Mid Range
        'hotels-midrange': '/images/hero/hotels-midrange.jpg',
        'tsavo-river-lodge': '/images/hotels/mid-range/tsavo-river-lodge.jpg',
        'amboseli-serena': '/images/hotels/mid-range/amboseli-serena.jpg',
        'kicheche-laikipia': '/images/hotels/mid-range/kicheche-laikipia.jpg',
        'samburu-serena': '/images/hotels/mid-range/samburu-serena.jpg',
        'mara-serena': '/images/hotels/mid-range/mara-serena.jpg',
        'lake-nakuru-lodge': '/images/hotels/mid-range/lake-nakuru-lodge.jpg',
        
        // Tours
        'samburu': '/images/tours/samburu.jpg',
        'maasai-mara': '/images/tours/maasai-mara.jpg',
        'tsavo': '/images/tours/tsavo.jpg',
        'amboseli': '/images/tours/amboseli.jpg',
        'lake-nakuru': '/images/tours/lake-nakuru.jpg',
        'nairobi-np': '/images/tours/nairobi-np.jpg',
        'hells-gate': '/images/tours/hells-gate.jpg',
        'mount-kenya': '/images/tours/mount-kenya.jpg'
    };
    
    var ImageLoader = {
        /**
         * Initialize the image loader
         */
        init: function() {
            this.cacheImagePaths();
            console.log('[ImageLoader] Initialized');
        },
        
        /**
         * Cache available image paths
         */
        cacheImagePaths: function() {
            // Pre-check which images exist to avoid 404s
            var checkPaths = [
                '/images/hotels/eco-budget/',
                '/images/hotels/luxury/',
                '/images/hotels/mid-range/',
                '/images/tours/'
            ];
            
            // This is a no-op for now - we rely on KNOWN_IMAGES map
            this.imagePathsCached = true;
        },
        
        /**
         * Get the best available image path
         * @param {string} key - Image key (hotel id, tour name, etc)
         * @param {string} fallback - Fallback path
         * @returns {string} Best image path
         */
        getImagePath: function(key, fallback) {
            // Check known images first
            if (KNOWN_IMAGES[key]) {
                return KNOWN_IMAGES[key];
            }
            
            // Try common path patterns
            if (key) {
                var lowerKey = key.toLowerCase().replace(/\s+/g, '-');
                
                // Check hotel paths
                var hotelPath = '/images/hotels/' + lowerKey + '.jpg';
                if (KNOWN_IMAGES[lowerKey] || this.pathExists(hotelPath)) {
                    return hotelPath;
                }
            }
            
            return fallback || '/images/hero/hotels.jpg';
        },
        
        /**
         * Check if a path exists (async, for future use)
         */
        pathExists: function(path) {
            // In a real implementation, this would check the server
            // For now, we rely on the KNOWN_IMAGES map
            return KNOWN_IMAGES[path] !== undefined;
        },
        
        /**
         * Build CDN URL with format conversion
         * @param {string} path - Local path
         * @param {Object} options - URL options
         * @returns {string} CDN URL
         */
        buildCDNUrl: function(path, options) {
            if (!path) return this.placeholder(options);
            
            // External URLs pass through
            if (path.startsWith('http')) {
                return path;
            }
            
            // Ensure leading slash
            if (!path.startsWith('/')) {
                path = '/' + path;
            }
            
            // If no CDN configured (development), return local path
            if (!CDN_BASE) {
                return path;
            }
            
            var url = CDN_BASE + path;
            var params = [];
            
            // Add format conversion via CDN
            if (options && options.format) {
                params.push('fmt=' + options.format);
            }
            if (options && options.width) {
                params.push('w=' + options.width);
            }
            if (options && options.height) {
                params.push('h=' + options.height);
            }
            if (options && options.quality) {
                params.push('q=' + options.quality);
            }
            
            if (params.length > 0) {
                url += (url.includes('?') ? '&' : '?') + params.join('&');
            }
            
            return url;
        },
        
        /**
         * Generate picture element with WebP and JPEG sources
         * @param {string} path - Image path (local or URL)
         * @param {string} alt - Alt text
         * @param {Object} options - Image options
         * @returns {string} HTML string
         */
        picture: function(path, alt, options) {
            options = options || {};
            
            if (!path || path === '') {
                return this.placeholderImg(alt, options);
            }
            
            var classes = options['class'] || '';
            var loading = options.loading || 'lazy';
            var fetchPriority = options.fetchPriority || 'auto';
            var width = options.width || '';
            var height = options.height || '';
            var style = options.style || '';
            
            // Get base path without extension
            var basePath = path.replace(/\.(jpg|jpeg|png|webp)$/i, '');
            
            // Build URLs for different formats
            var jpgUrl = this.buildCDNUrl(path, { format: 'jpg', width: options.width });
            var webpUrl = this.buildCDNUrl(basePath + '.jpg', { format: 'webp', width: options.width });
            
            var html = '<picture>';
            
            // WebP source (browser will use if supported)
            html += '<source srcset="' + webpUrl + '" type="image/webp">';
            
            // JPEG fallback
            html += '<img';
            html += ' src="' + jpgUrl + '"';
            html += ' alt="' + (alt || '') + '"';
            if (classes) html += ' class="' + classes + '"';
            if (loading) html += ' loading="' + loading + '"';
            if (fetchPriority) html += ' fetchpriority="' + fetchPriority + '"';
            html += ' decoding="async"';
            if (width) html += ' width="' + width + '"';
            if (height) html += ' height="' + height + '"';
            if (style) html += ' style="' + style + '"';
            html += '>';
            
            html += '</picture>';
            
            return html;
        },
        
        /**
         * Generate hero image (eager loaded)
         * @param {string} path - Image path
         * @param {string} alt - Alt text
         * @param {Object} options - Options
         * @returns {string} HTML
         */
        hero: function(path, alt, options) {
            options = options || {};
            options.loading = 'eager';
            options.fetchPriority = 'high';
            return this.picture(path, alt, options);
        },
        
        /**
         * Generate card image
         * @param {string} path - Image path
         * @param {string} alt - Alt text
         * @returns {string} HTML
         */
        card: function(path, alt) {
            return this.picture(path, alt, {
                loading: 'lazy',
                class: 'card-img'
            });
        },
        
        /**
         * Generate placeholder URL
         */
        placeholder: function(options) {
            var w = (options && options.width) || 800;
            var h = (options && options.height) || 600;
            var text = (options && options.text) || 'Image';
            return PLACEHOLDER + '/' + w + 'x' + h + '?text=' + encodeURIComponent(text);
        },
        
        /**
         * Generate placeholder image
         */
        placeholderImg: function(alt, options) {
            var src = this.placeholder({ width: options && options.width, height: options && options.height });
            var html = '<img src="' + src + '"';
            html += ' alt="' + (alt || 'Image') + '"';
            if (options && options['class']) html += ' class="' + options['class'] + '"';
            if (options && options.loading) html += ' loading="' + options.loading + '"';
            if (options && options.style) html += ' style="' + options.style + '"';
            html += '>';
            return html;
        },
        
        /**
         * Convert existing img elements to picture elements with WebP
         * Call this after DOM load
         */
        convertImages: function() {
            var self = this;
            var images = document.querySelectorAll('img[data-image-key]');
            
            images.forEach(function(img) {
                var key = img.dataset.imageKey;
                var alt = img.alt || '';
                var options = {
                    'class': img.className,
                    loading: img.loading || 'lazy',
                    style: img.style.cssText,
                    width: img.width,
                    height: img.height
                };
                
                var path = self.getImagePath(key);
                var pictureHtml = self.picture(path, alt, options);
                
                // Replace img with picture
                var wrapper = document.createElement('div');
                wrapper.innerHTML = pictureHtml;
                img.parentNode.replaceChild(wrapper.firstChild, img);
            });
        },
        
        /**
         * Get category hero image
         */
        getCategoryHero: function(category) {
            var heroes = {
                'luxury': '/images/hero/hotels-luxury.jpg',
                'mid-range': '/images/hero/hotels-midrange.jpg',
                'eco-budget': '/images/hero/hotels-ecobudget.jpg',
                'tours': '/images/hero/tours.jpg',
                'beaches': '/images/hero/beaches.jpg',
                'experiences': '/images/hero/experiences.jpg'
            };
            return heroes[category] || '/images/hero/hotels.jpg';
        }
    };
    
    // Auto-init
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            ImageLoader.init();
        });
    } else {
        ImageLoader.init();
    }
    
    window.MutsImageLoader = ImageLoader;
    
})();