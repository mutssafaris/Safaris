/* Reviews Service — Muts Safaris */
/* Unified reviews and ratings system */
(function(window) {
    'use strict';

    var STORAGE_KEY = 'muts_reviews_cache';

    var mockReviews = {
        hotels: {
            'h1': [
                { id: 'r1', user: 'John D.', rating: 5, text: 'Amazing experience! The staff was incredibly friendly and the wildlife viewing was exceptional.', date: '2026-03-15', helpful: 12 },
                { id: 'r2', user: 'Sarah M.', rating: 4, text: 'Great location and comfortable accommodations. Would definitely return.', date: '2026-02-28', helpful: 8 }
            ],
            'h2': [
                { id: 'r3', user: 'Mike R.', rating: 5, text: 'The Kilimanjaro views were breathtaking. Best safari experience ever!', date: '2026-03-10', helpful: 15 }
            ]
        },
        destinations: {
            'maasai-mara': [
                { id: 'r4', user: 'Emma K.', rating: 5, text: 'Witnessed the Great Migration - a dream come true!', date: '2026-04-01', helpful: 20 },
                { id: 'r5', user: 'David L.', rating: 5, text: 'Incredible Big Five sightings. Our guide was fantastic!', date: '2026-03-20', helpful: 18 }
            ],
            'amboseli': [
                { id: 'r6', user: 'Lisa T.', rating: 4, text: 'Elephants everywhere! The sunset over Kilimanjaro was magical.', date: '2026-03-05', helpful: 10 }
            ]
        },
        tours: {
            't1': [
                { id: 'r7', user: 'Alex P.', rating: 5, text: 'Professional guides, excellent accommodations. Highly recommended!', date: '2026-03-25', helpful: 14 }
            ]
        },
        products: {
            'maasai-necklace-001': [
                { id: 'r8', user: 'Maria S.', rating: 5, text: 'Beautiful craftsmanship. Exactly as described.', date: '2026-02-10', helpful: 6 },
                { id: 'r9', user: 'James W.', rating: 4, text: 'Great quality, shipping was fast.', date: '2026-01-28', helpful: 3 }
            ]
        }
    };

    var ReviewsService = {
        // ============ GET REVIEWS ============
        getReviewsForItem: function(itemType, itemId) {
            if (window.MutsAPIConfig && window.MutsAPIConfig.isConnected()) {
                return this.fetchFromAPI('/reviews?type=' + itemType + '&itemId=' + itemId);
            }
            
            var typeReviews = mockReviews[itemType] || {};
            var itemReviews = typeReviews[itemId] || [];
            return Promise.resolve(itemReviews.slice());
        },

        getItemRating: function(itemType, itemId) {
            return this.getReviewsForItem(itemType, itemId).then(function(reviews) {
                if (!reviews || reviews.length === 0) {
                    return { average: 0, count: 0, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } };
                }
                
                var total = reviews.reduce(function(sum, r) { return sum + r.rating; }, 0);
                var avg = total / reviews.length;
                
                var distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
                reviews.forEach(function(r) {
                    distribution[r.rating] = (distribution[r.rating] || 0) + 1;
                });
                
                return {
                    average: Math.round(avg * 10) / 10,
                    count: reviews.length,
                    distribution: distribution
                };
            });
        },

        // ============ ADD REVIEW ============
        addReview: function(itemType, itemId, reviewData) {
            if (window.MutsAPIConfig && window.MutsAPIConfig.isConnected()) {
                return this.fetchFromAPI('/reviews', {
                    method: 'POST',
                    body: JSON.stringify({
                        itemType: itemType,
                        itemId: itemId,
                        rating: reviewData.rating,
                        text: reviewData.text,
                        user: reviewData.user
                    })
                });
            }
            
            var newReview = {
                id: 'r' + Date.now(),
                user: reviewData.user || 'Anonymous',
                rating: reviewData.rating,
                text: reviewData.text,
                date: new Date().toISOString().split('T')[0],
                helpful: 0
            };
            
            if (!mockReviews[itemType]) mockReviews[itemType] = {};
            if (!mockReviews[itemType][itemId]) mockReviews[itemType][itemId] = [];
            mockReviews[itemType][itemId].push(newReview);
            
            this._persistReviews();
            
            return Promise.resolve(newReview);
        },

        // ============ HELPFUL ============
        markHelpful: function(reviewId) {
            if (window.MutsAPIConfig && window.MutsAPIConfig.isConnected()) {
                return this.fetchFromAPI('/reviews/' + reviewId + '/helpful', {
                    method: 'POST'
                });
            }
            
            for (var type in mockReviews) {
                for (var itemId in mockReviews[type]) {
                    var review = mockReviews[type][itemId].find(function(r) { return r.id === reviewId; });
                    if (review) {
                        review.helpful = (review.helpful || 0) + 1;
                        this._persistReviews();
                        return Promise.resolve(review);
                    }
                }
            }
            return Promise.resolve(null);
        },

        // ============ REPORT ============
        reportReview: function(reviewId, reason) {
            if (window.MutsAPIConfig && window.MutsAPIConfig.isConnected()) {
                return this.fetchFromAPI('/reviews/' + reviewId + '/report', {
                    method: 'POST',
                    body: JSON.stringify({ reason: reason })
                });
            }
            
            console.log('[ReviewsService] Review reported:', reviewId, reason);
            return Promise.resolve({ success: true });
        },

        // ============ MY REVIEWS ============
        getMyReviews: function(userId) {
            if (window.MutsAPIConfig && window.MutsAPIConfig.isConnected()) {
                return this.fetchFromAPI('/reviews/user/' + userId);
            }
            
            var allReviews = [];
            for (var type in mockReviews) {
                for (var itemId in mockReviews[type]) {
                    mockReviews[type][itemId].forEach(function(r) {
                        allReviews.push(Object.assign({}, r, { itemType: type, itemId: itemId }));
                    });
                }
            }
            
            return Promise.resolve(allReviews);
        },

        // ============ STATISTICS ============
        getUserStats: function(userId) {
            if (window.MutsAPIConfig && window.MutsAPIConfig.isConnected()) {
                return this.fetchFromAPI('/reviews/stats/' + userId);
            }
            
            var allReviews = [];
            for (var type in mockReviews) {
                for (var itemId in mockReviews[type]) {
                    mockReviews[type][itemId].forEach(function(r) {
                        allReviews.push(r);
                    });
                }
            }
            
            var total = allReviews.length;
            var avgRating = total > 0 
                ? Math.round((allReviews.reduce(function(s, r) { return s + r.rating; }, 0) / total) * 10) / 10 
                : 0;
            
            return Promise.resolve({
                totalReviews: total,
                averageRating: avgRating,
                helpfulVotes: allReviews.reduce(function(s, r) { return s + (r.helpful || 0); }, 0)
            });
        },

        // ============ PERSISTENCE ============
        _persistReviews: function() {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(mockReviews));
            } catch (e) {
                console.warn('[ReviewsService] Could not persist reviews:', e);
            }
        },

        _loadPersisted: function() {
            try {
                var saved = localStorage.getItem(STORAGE_KEY);
                if (saved) {
                    var parsed = JSON.parse(saved);
                    for (var type in parsed) {
                        mockReviews[type] = parsed[type];
                    }
                }
            } catch (e) {}
        },

        // ============ API ============
        fetchFromAPI: function(endpoint, options) {
            var baseURL = (window.MutsAPIConfig && window.MutsAPIConfig.getBaseURL) 
                ? window.MutsAPIConfig.getBaseURL() 
                : '/api';
            
            var fetchOptions = Object.assign({
                headers: { 'Content-Type': 'application/json' }
            }, options);
            
            return fetch(baseURL + endpoint, fetchOptions)
                .then(function(response) {
                    if (!response.ok) throw new Error('API error: ' + response.status);
                    return response.json();
                })
                .catch(function(err) {
                    console.warn('[ReviewsService] API unavailable:', err.message);
                    return [];
                });
        },

        // ============ API CONTROL ============
        enableAPI: function() {
            console.log('[ReviewsService] API mode enabled');
        },

        disableAPI: function() {
            console.log('[ReviewsService] API mode disabled');
        },

        isAPILive: function() {
            return window.MutsAPIConfig && window.MutsAPIConfig.isConnected();
        }
    };

    ReviewsService._loadPersisted();
    window.MutsReviewsService = ReviewsService;
})(window);
// ES6 module export (for bundlers)
export default window.reviewsService || window.reviewsService;
