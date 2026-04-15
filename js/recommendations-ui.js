/* Recommendations UI Component - Muts Safaris */
/* Display AI recommendations and waitlist on pages */
(function() {
    if (window.MutsRecommendationsUI) return;
    
    var RecommendationsUI = {
        
        /**
         * Initialize recommendations for a page
         * @param {Object} options - Configuration
         */
        init: function(options) {
            this.options = options || {};
            
            // Auto-load on hotel/destination pages
            if (this.options.showOnHotels) {
                this._loadSimilarItems();
            }
            
            // Show trending if enabled
            if (this.options.showTrending) {
                this._loadTrending();
            }
        },
        
        /**
         * Render similar items section
         * @param {string} containerId - Container element ID
         * @param {string} itemType - Type of item (hotel, destination)
         * @param {string} itemId - Item ID
         */
        renderSimilar: function(containerId, itemType, itemId) {
            var self = this;
            var container = document.getElementById(containerId);
            if (!container) return;
            
            container.innerHTML = '<div class="recommendations-loading">Loading recommendations...</div>';
            
            window.MutsRecommendationService.getSimilar(itemType, itemId, 4).then(function(items) {
                if (items.length === 0) {
                    container.style.display = 'none';
                    return;
                }
                
                self._renderItems(container, items, 'You Might Also Like');
            });
        },
        
        /**
         * Render "Frequently Booked Together"
         */
        renderBookedTogether: function(containerId, itemId) {
            var self = this;
            var container = document.getElementById(containerId);
            if (!container) return;
            
            container.innerHTML = '<div class="recommendations-loading">Loading...</div>';
            
            window.MutsRecommendationService.getBookedTogether(itemId, 4).then(function(items) {
                if (items.length === 0) {
                    container.style.display = 'none';
                    return;
                }
                
                self._renderItems(container, items, 'Frequently Booked Together');
            });
        },
        
        /**
         * Render trending section
         * @param {string} containerId - Container element ID
         */
        renderTrending: function(containerId) {
            var self = this;
            var container = document.getElementById(containerId);
            if (!container) return;
            
            container.innerHTML = '<div class="recommendations-loading">Loading...</div>';
            
            window.MutsRecommendationService.getTrending(6).then(function(items) {
                self._renderItems(container, items, 'Trending Now');
            });
        },
        
        /**
         * Render personalized recommendations
         * @param {string} containerId - Container element ID
         */
        renderPersonal: function(containerId) {
            var self = this;
            var container = document.getElementById(containerId);
            if (!container) return;
            
            container.innerHTML = '<div class="recommendations-loading">Loading...</div>';
            
            window.MutsRecommendationService.getPersonal(6).then(function(items) {
                self._renderItems(container, items, 'Recommended For You');
            });
        },
        
        /**
         * Render waitlist button for sold-out items
         * @param {string} containerId - Container element ID
         * @param {string} itemType - hotel, tour, package
         * @param {string} itemId - Item ID
         * @param {string} date - Date (YYYY-MM-DD)
         */
        renderWaitlistButton: function(containerId, itemType, itemId, date) {
            var container = document.getElementById(containerId);
            if (!container) return;
            
            container.innerHTML = 
                '<div class="waitlist-prompt">' +
                    '<p>This date is fully booked. Would you like to join the waitlist?</p>' +
                    '<button class="btn btn-primary" id="join-waitlist-btn">Join Waitlist</button>' +
                '</div>';
            
            var btn = container.querySelector('#join-waitlist-btn');
            btn.addEventListener('click', function() {
                this._joinWaitlist(itemType, itemId, date, container);
            }.bind(this));
        },
        
        /**
         * Join waitlist
         */
        _joinWaitlist: function(itemType, itemId, date, container) {
            var btn = container.querySelector('#join-waitlist-btn');
            btn.disabled = true;
            btn.textContent = 'Joining...';
            
            window.MutsRecommendationService.joinWaitlist(itemType, itemId, date).then(function(entry) {
                container.innerHTML = 
                    '<div class="waitlist-success">' +
                        '<svg viewBox="0 0 24 24" width="48" height="48"><path fill="#27ae60" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>' +
                        '<p>You\'re on the waitlist!</p>' +
                        '<span>We\'ll notify you if a spot becomes available.</span>' +
                    '</div>';
            }).catch(function(err) {
                btn.disabled = false;
                btn.textContent = 'Join Waitlist';
                this._showToast('Failed to join waitlist');
            }.bind(this));
        },
        
        /**
         * Internal: Load trending
         */
        _loadTrending: function() {
            var containers = document.querySelectorAll('[data-trending]');
            containers.forEach(function(container) {
                this.renderTrending(container.id);
            }.bind(this));
        },
        
        /**
         * Internal: Load similar items
         */
        _loadSimilarItems: function() {
            var itemType = this.options.itemType;
            var itemId = this.options.itemId;
            
            if (itemType && itemId) {
                this.renderSimilar('similar-items', itemType, itemId);
            }
        },
        
        /**
         * Internal: Render items list
         */
        _renderItems: function(container, items, title) {
            var html = '<div class="recommendations-section">' +
                '<h3>' + title + '</h3>' +
                '<div class="recommendations-grid">';
            
            items.forEach(function(item) {
                var link = this._getLink(item);
                var price = item.price ? '$' + Math.round(item.price) : '';
                var rating = item.rating ? '<span class="item-rating">★ ' + item.rating.toFixed(1) + '</span>' : '';
                
                html += 
                    '<a href="' + link + '" class="recommendation-card">' +
                        '<div class="item-image">' +
                            '<img src="' + (item.image || '/images/placeholder.jpg') + '" alt="' + item.name + '" loading="lazy">' +
                        '</div>' +
                        '<div class="item-info">' +
                            '<h4>' + item.name + '</h4>' +
                            '<p class="item-subtitle">' + item.subtitle + '</p>' +
                            '<div class="item-meta">' +
                                rating +
                                (price ? '<span class="item-price">' + price + '</span>' : '') +
                            '</div>' +
                            '<span class="item-reason">' + item.reason + '</span>' +
                        '</div>' +
                    '</a>';
            }.bind(this));
            
            html += '</div></div>';
            
            container.innerHTML = html;
        },
        
        /**
         * Get link based on item type
         */
        _getLink: function(item) {
            var base = '/pages/dashboard/';
            switch (item.type) {
                case 'hotel':
                    return base + 'hotels.html?id=' + item.id;
                case 'destination':
                    return base + 'tours.html?destination=' + item.id;
                case 'tour':
                    return base + 'tours.html?id=' + item.id;
                case 'package':
                    return base + 'packages/detail.html?id=' + item.id;
                default:
                    return base + 'index.html';
            }
        },
        
        /**
         * Show toast
         */
        _showToast: function(message) {
            var toast = document.createElement('div');
            toast.className = 'recommendations-toast';
            toast.textContent = message;
            document.body.appendChild(toast);
            
            setTimeout(function() {
                toast.classList.add('show');
            }, 10);
            
            setTimeout(function() {
                toast.classList.remove('show');
                setTimeout(function() { document.body.removeChild(toast); }, 300);
            }, 3000);
        }
    };
    
    // Auto-init for pages with data attributes
    document.addEventListener('DOMContentLoaded', function() {
        var similarSection = document.querySelector('[data-similar]');
        if (similarSection) {
            var itemType = similarSection.dataset.itemType || 'hotel';
            var itemId = similarSection.dataset.itemId;
            if (itemId) {
                RecommendationsUI.renderSimilar(similarSection.id, itemType, itemId);
            }
        }
        
        var trendingSection = document.querySelector('[data-trending]');
        if (trendingSection) {
            RecommendationsUI.renderTrending(trendingSection.id);
        }
        
        var personalSection = document.querySelector('[data-personal]');
        if (personalSection) {
            RecommendationsUI.renderPersonal(personalSection.id);
        }
    });
    
    window.MutsRecommendationsUI = RecommendationsUI;
})();