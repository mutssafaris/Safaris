/**
 * Image Auto-Converter - Muts Safaris
 * Converts data-image-key elements to picture elements with WebP support
 * 
 * Add to any page:
 * <script src="js/image-auto-convert.js"></script>
 * 
 * Use on any element:
 * <div data-image-key="hotel-name" data-alt="Hotel Name" style="..."></div>
 * 
 * Or convert existing images:
 * <img src="path.jpg" data-image-key="hotel-name" alt="...">
 */
(function() {
    'use strict';
    
    // Configuration - use local paths, CDN is for production only
    var USE_CDN = false; // Set to true only when CDN is deployed
    var CDN_BASE = USE_CDN ? 'https://images.mutssafaris.com' : '';
    
    var ImageAutoConvert = {
        /**
         * Initialize auto-conversion
         */
        init: function() {
            this.convertElements();
            this.observeNewElements();
            console.log('[ImageAutoConvert] Initialized');
        },
        
        /**
         * Get image path from key
         */
        getImagePath: function(key) {
            if (!key) return null;
            
            // Map of known image keys
            var knownImages = {
                // Eco Budget Hotels
                'laikipia-community-camp': '/images/hotels/eco-budget/laikipia-community-camp.jpg',
                'amboseli-conservation-camp': '/images/hotels/eco-budget/amboseli-camp.jpg',
                'tsavo-eco-lodge': '/images/hotels/eco-budget/tsavo-camp.jpg',
                'mara-budget-camp': '/images/hotels/eco-budget/mara-budget-camp.jpg',
                'mombasa-budget-guesthouse': '/images/hotels/eco-budget/coastal-budget-guesthouse.jpg',
                'nakuru-eco-lodge': '/images/hotels/eco-budget/nakuru-budget-lodge.jpg',
                
                // Luxury Hotels
                'tsavo-lodge': '/images/hotels/luxury/tsavo-lodge.jpg',
                'maasai-mara-lodge': '/images/hotels/luxury/maasai-mara-lodge.jpg',
                'norfolk-hotel': '/images/hotels/luxury/nairobi-lodge.jpg',
                'samburu-lodge': '/images/hotels/luxury/samburu-lodge.jpg',
                'diani-resort': '/images/hotels/luxury/diani-lodge.jpg',
                'amboseli-lodge': '/images/hotels/luxury/amboseli-lodge.jpg',
                'matteos-italian-restaurant': '/images/hotels/luxury/matteos-hero.jpg',
                
                // Mid Range Hotels
                'tsavo-river-lodge': '/images/hotels/mid-range/tsavo-river-lodge.jpg',
                'amboseli-serena': '/images/hotels/mid-range/amboseli-serena.jpg',
                'kicheche-laikipia': '/images/hotels/mid-range/kicheche-laikipia.jpg',
                'samburu-serena': '/images/hotels/mid-range/samburu-serena.jpg',
                'mara-serena': '/images/hotels/mid-range/mara-serena.jpg',
                'lake-nakuru-lodge': '/images/hotels/mid-range/lake-nakuru-lodge.jpg',
                
                // Category Heroes
                'hotels-ecobudget': '/images/hero/hotels-ecobudget.jpg',
                'hotels-luxury': '/images/hero/hotels-luxury.jpg',
                'hotels-midrange': '/images/hero/hotels-midrange.jpg',
                'hotels': '/images/hero/hotels.jpg',
                'tours': '/images/hero/tours.jpg',
                'beaches': '/images/hero/beaches.jpg',
                
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
            
            return knownImages[key] || null;
        },
        
        /**
         * Build picture element with WebP
         */
        buildPicture: function(path, alt, options) {
            if (!path) {
                return this.buildPlaceholder(alt, options);
            }
            
            var style = (options && options.style) || '';
            var width = (options && options.width) || '';
            var height = (options && options.height) || '';
            var imgClass = (options && options['class']) || '';
            
            // Handle relative paths - convert to absolute for local dev
            if (path.startsWith('..')) {
                // Already a relative path, use as-is (browsers handle relative paths)
            } else if (!path.startsWith('/') && !path.startsWith('http')) {
                // Add leading slash for absolute paths
                path = '/' + path;
            }
            
            // CDN base (empty in local dev)
            var cdnBase = CDN_BASE;
            
            // Build URLs
            var jpgUrl = cdnBase + path;
            var webpPath = path.replace(/\.jpg$/i, '.webp');
            var webpUrl = cdnBase + webpPath;
            
            var html = '<picture>';
            
            // WebP source
            html += '<source srcset="' + webpUrl + '" type="image/webp">';
            
            // Fallback JPEG
            html += '<img';
            html += ' src="' + jpgUrl + '"';
            html += ' alt="' + (alt || '') + '"';
            if (imgClass) html += ' class="' + imgClass + '"';
            html += ' loading="lazy"';
            html += ' decoding="async"';
            if (width) html += ' width="' + width + '"';
            if (height) html += ' height="' + height + '"';
            if (style) html += ' style="' + style + '"';
            html += '>';
            
            html += '</picture>';
            
            return html;
        },
        
        /**
         * Build placeholder image
         */
        buildPlaceholder: function(alt, options) {
            var width = (options && options.width) || 800;
            var height = (options && options.height) || 600;
            var style = (options && options.style) || '';
            var imgClass = (options && options['class']) || '';
            
            var placeholderUrl = 'https://via.placeholder.com/' + width + 'x' + height + '?text=' + encodeURIComponent(alt || 'Image');
            
            var html = '<img';
            html += ' src="' + placeholderUrl + '"';
            html += ' alt="' + (alt || 'Image') + '"';
            if (imgClass) html += ' class="' + imgClass + '"';
            html += ' loading="lazy"';
            if (style) html += ' style="' + style + '"';
            html += '>';
            
            return html;
        },
        
        /**
         * Convert all matching elements on page
         */
        convertElements: function() {
            var self = this;
            
            // Convert elements with data-image-key attribute
            document.querySelectorAll('[data-image-key]').forEach(function(el) {
                self.convertElement(el);
            });
        },
        
        /**
         * Convert a single element
         */
        convertElement: function(el) {
            var key = el.dataset.imageKey;
            var alt = el.dataset.alt || el.getAttribute('alt') || '';
            var width = el.dataset.width || '';
            var height = el.dataset.height || '';
            
            var path = this.getImagePath(key);
            var options = {
                style: el.style.cssText,
                width: width,
                height: height,
                'class': el.className
            };
            
            var html = this.buildPicture(path, alt, options);
            
            // Replace content
            el.innerHTML = html;
            
            // Remove data attributes to prevent re-conversion
            el.removeAttribute('data-image-key');
        },
        
        /**
         * Observe for dynamically added elements
         */
        observeNewElements: function() {
            var self = this;
            
            if (!('MutationObserver' in window)) return;
            
            var observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === 1) { // Element node
                            if (node.dataset && node.dataset.imageKey) {
                                self.convertElement(node);
                            }
                            // Check children
                            node.querySelectorAll && node.querySelectorAll('[data-image-key]').forEach(function(el) {
                                self.convertElement(el);
                            });
                        }
                    });
                });
            });
            
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    };
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            ImageAutoConvert.init();
        });
    } else {
        ImageAutoConvert.init();
    }
    
    // Expose globally
    window.MutsImageAutoConvert = ImageAutoConvert;
    
})();