/* Recommendation Service - Muts Safaris */
/* AI-powered recommendations and waitlist */
(function() {
    'use strict';
    
    var RecommendationService = {
        
        /**
         * Get personalized recommendations for user
         */
        getPersonal: function(limit) {
            limit = limit || 10;
            var baseURL = this._getBaseURL();
            
            return fetch(baseURL + '/recommendations/personal?limit=' + limit, this._getAuthHeaders())
                .then(function(response) {
                    if (!response.ok) throw new Error('Failed to fetch');
                    return response.json();
                })
                .catch(function() { return []; });
        },
        
        /**
         * Get similar items
         */
        getSimilar: function(itemType, itemId, limit) {
            limit = limit || 5;
            var baseURL = this._getBaseURL();
            
            return fetch(baseURL + '/recommendations/similar?itemType=' + itemType + '&itemId=' + itemId + '&limit=' + limit, this._getAuthHeaders())
                .then(function(response) {
                    if (!response.ok) throw new Error('Failed to fetch');
                    return response.json();
                })
                .catch(function() { return []; });
        },
        
        /**
         * Get frequently booked together
         */
        getBookedTogether: function(itemId, limit) {
            limit = limit || 5;
            var baseURL = this._getBaseURL();
            
            return fetch(baseURL + '/recommendations/together?itemId=' + itemId + '&limit=' + limit, this._getAuthHeaders())
                .then(function(response) {
                    if (!response.ok) throw new Error('Failed to fetch');
                    return response.json();
                })
                .catch(function() { return []; });
        },
        
        /**
         * Get trending items
         */
        getTrending: function(limit) {
            limit = limit || 10;
            var baseURL = this._getBaseURL();
            
            return fetch(baseURL + '/recommendations/trending?limit=' + limit, this._getAuthHeaders())
                .then(function(response) {
                    if (!response.ok) throw new Error('Failed to fetch');
                    return response.json();
                })
                .catch(function() { return this._getLocalTrending(); }.bind(this));
        },
        
        /**
         * Record a view
         */
        recordView: function(itemType, itemId) {
            var baseURL = this._getBaseURL();
            
            fetch(baseURL + '/recommendations/view?itemType=' + itemType + '&itemId=' + itemId, {
                method: 'POST',
                headers: this._getAuthHeaders()
            }).catch(function() {});
        },
        
        /**
         * Join waitlist
         */
        joinWaitlist: function(itemType, itemId, date, guests) {
            guests = guests || 1;
            var baseURL = this._getBaseURL();
            
            return fetch(baseURL + '/recommendations/waitlist?itemType=' + itemType + '&itemId=' + itemId + '&date=' + date + '&guests=' + guests, {
                method: 'POST',
                headers: this._getAuthHeaders()
            })
            .then(function(response) {
                if (!response.ok) throw new Error('Failed to join waitlist');
                return response.json();
            });
        },
        
        /**
         * Get user's waitlist
         */
        getWaitlist: function() {
            var baseURL = this._getBaseURL();
            
            return fetch(baseURL + '/recommendations/waitlist', this._getAuthHeaders())
                .then(function(response) {
                    if (!response.ok) throw new Error('Failed to fetch waitlist');
                    return response.json();
                })
                .catch(function() { return []; });
        },
        
/**
         * Leave waitlist
         */
        leaveWaitlist: function(entryId) {
            var baseURL = this._getBaseURL();
            
            return fetch(baseURL + '/recommendations/waitlist/' + entryId, {
                method: 'DELETE',
                headers: this._getAuthHeaders()
            })
            .then(function(response) {
                if (!response.ok) throw new Error('Failed to leave waitlist');
                return { success: true };
            });
        },
        
        // ============ ITINERARY (Trip Planner) ============
        
        /**
         * Create a new itinerary
         */
        createItinerary: function(name, startDate, endDate, description) {
            var baseURL = this._getBaseURL();
            var url = baseURL + '/recommendations/itineraries?name=' + encodeURIComponent(name) + 
                '&startDate=' + startDate + '&endDate=' + endDate;
            if (description) url += '&description=' + encodeURIComponent(description);
            
            return fetch(url, {
                method: 'POST',
                headers: this._getAuthHeaders()
            })
            .then(function(response) {
                if (!response.ok) throw new Error('Failed to create itinerary');
                return response.json();
            });
        },
        
        /**
         * Get user's itineraries
         */
        getItineraries: function() {
            var baseURL = this._getBaseURL();
            
            return fetch(baseURL + '/recommendations/itineraries', this._getAuthHeaders())
                .then(function(response) {
                    if (!response.ok) throw new Error('Failed to fetch');
                    return response.json();
                })
                .catch(function() { return []; });
        },
        
        /**
         * Get itinerary with items
         */
        getItinerary: function(itineraryId) {
            var baseURL = this._getBaseURL();
            
            return fetch(baseURL + '/recommendations/itineraries/' + itineraryId, this._getAuthHeaders())
                .then(function(response) {
                    if (!response.ok) throw new Error('Failed to fetch');
                    return response.json();
                });
        },
        
        /**
         * Add item to itinerary
         */
        addItineraryItem: function(itineraryId, itemType, itemId, name, date, price, options) {
            options = options || {};
            var baseURL = this._getBaseURL();
            
            var url = baseURL + '/recommendations/itineraries/' + itineraryId + '/items' +
                '?itemType=' + itemType + '&itemId=' + itemId + '&name=' + encodeURIComponent(name) +
                '&date=' + date + '&price=' + price;
            
            if (options.description) url += '&description=' + encodeURIComponent(options.description);
            if (options.time) url += '&time=' + encodeURIComponent(options.time);
            if (options.duration) url += '&duration=' + encodeURIComponent(options.duration);
            if (options.location) url += '&location=' + encodeURIComponent(options.location);
            
            return fetch(url, {
                method: 'POST',
                headers: this._getAuthHeaders()
            })
            .then(function(response) {
                if (!response.ok) throw new Error('Failed to add item');
                return response.json();
            });
        },
        
        /**
         * Remove item from itinerary
         */
        removeItineraryItem: function(itineraryId, itemId) {
            var baseURL = this._getBaseURL();
            
            return fetch(baseURL + '/recommendations/itineraries/' + itineraryId + '/items/' + itemId, {
                method: 'DELETE',
                headers: this._getAuthHeaders()
            })
            .then(function(response) {
                if (!response.ok) throw new Error('Failed to remove item');
                return { success: true };
            });
        },

        /**
         * Get base URL
         */
        _getBaseURL: function() {
            return (window.MutsAPIConfig && window.MutsAPIConfig.getBaseURL) 
                ? window.MutsAPIConfig.getBaseURL() 
                : '/api';
        },
        
        /**
         * Get auth headers
         */
        _getAuthHeaders: function() {
            var headers = { 'Content-Type': 'application/json' };
            var session = localStorage.getItem('muts_user_session');
            if (session) {
                try {
                    var sessionObj = JSON.parse(session);
                    if (sessionObj.token) {
                        headers['Authorization'] = 'Bearer ' + sessionObj.token;
                    }
                } catch (e) {}
            }
            return headers;
        },
        
        /**
         * Local fallback for trending
         */
        _getLocalTrending: function() {
            return [
                { id: 'd1', type: 'destination', name: 'Maasai Mara', subtitle: 'Kenya', image: '/images/destinations/maasai-mara.jpg', price: 500, rating: 4.9, reason: 'Trending' },
                { id: 'd2', type: 'destination', name: 'Diani Beach', subtitle: 'Kenya', image: '/images/destinations/diani.jpg', price: 400, rating: 4.8, reason: 'Popular' },
                { id: 'd3', type: 'destination', name: 'Amboseli', subtitle: 'Kenya', image: '/images/destinations/amboseli.jpg', price: 450, rating: 4.7, reason: 'Trending' },
                { id: 'h1', type: 'hotel', name: 'Serena Safari Lodge', subtitle: 'Maasai Mara', image: '/images/hotels/serena.jpg', price: 350, rating: 4.8, reason: 'Top Rated' }
            ];
        }
    };
    
    window.MutsRecommendationService = RecommendationService;
})();