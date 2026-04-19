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
            ],
            'laikipia-community-camp': [
                { id: 'r13', user: 'David L.', rating: 5, text: 'Authentic experience! The community-run camp was incredible.', date: '2026-04-12', helpful: 15 },
                { id: 'r14', user: 'Maria S.', rating: 4, text: 'Great cultural immersion. Guides were very knowledgeable.', date: '2026-04-08', helpful: 7 }
            ],
            'h11': [
                { id: 'r24', user: 'James W.', rating: 5, text: 'Amazing wildlife viewing right from the camp!', date: '2026-04-10', helpful: 11 },
                { id: 'r25', user: 'Linda M.', rating: 4, text: 'Great conservation efforts. Loved the elephants.', date: '2026-04-02', helpful: 6 }
            ],
            'h12': [
                { id: 'r26', user: 'Robert K.', rating: 4, text: 'Red elephants were incredible to see!', date: '2026-03-25', helpful: 9 }
            ],
            'h4': [
                { id: 'r27', user: 'Patricia A.', rating: 5, text: 'Great value for money. Friendly staff.', date: '2026-04-15', helpful: 14 },
                { id: 'r28', user: 'Thomas B.', rating: 4, text: 'Good safari experience. Would recommend.', date: '2026-04-05', helpful: 8 }
            ],
            'h10': [
                { id: 'r29', user: 'Nancy C.', rating: 5, text: 'Perfect location for flamingos!', date: '2026-03-20', helpful: 12 }
            ],
            'h20': [
                { id: 'r30', user: 'Susan D.', rating: 4, text: 'Good budget option near the beach.', date: '2026-04-01', helpful: 5 }
            ],
            'h5': [
                { id: 'r31', user: 'Karen E.', rating: 5, text: 'Luxury at its best! Beach front location perfect.', date: '2026-04-18', helpful: 16 },
                { id: 'r32', user: 'Charles F.', rating: 5, text: 'Amazing resort. Will definitely return.', date: '2026-04-12', helpful: 11 }
            ],
            'h6': [
                { id: 'r33', user: 'Helen G.', rating: 4, text: 'Great views over the river. Loved it.', date: '2026-03-28', helpful: 7 }
            ],
            'h15': [
                { id: 'r34', user: 'Brian H.', rating: 5, text: 'Outstanding safari experience!', date: '2026-04-08', helpful: 13 }
            ],
            'h16': [
                { id: 'r35', user: 'Elizabeth I.', rating: 5, text: 'Nostalgic luxury. Classic English hotel.', date: '2026-04-15', helpful: 10 }
            ],
            'h17': [
                { id: 'r36', user: 'George J.', rating: 4, text: 'Good location for lake viewing.', date: '2026-03-15', helpful: 6 }
            ],
            'h18': [
                { id: 'r37', user: 'Dorothy K.', rating: 5, text: 'Wonderful community experience!', date: '2026-04-02', helpful: 9 }
            ],
            'h19': [
                { id: 'r38', user: 'Frank L.', rating: 4, text: 'Great game viewing from the lodge.', date: '2026-03-22', helpful: 8 }
            ],
            'h21': [
                { id: 'r39', user: 'Irene M.', rating: 5, text: 'Best Italian food in Kenya!', date: '2026-04-10', helpful: 12 }
            ],
            'h22': [
                { id: 'r40', user: 'Peter N.', rating: 5, text: 'Luxury safari at its finest!', date: '2026-04-18', helpful: 15 }
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
            ],
            'samburu': [
                { id: 'r10', user: 'Emma K.', rating: 5, text: 'Incredible wildlife sightings! Our guide was amazing.', date: '2026-04-10', helpful: 8 },
                { id: 'r11', user: 'John D.', rating: 4, text: 'Great experience, well organized tour.', date: '2026-04-05', helpful: 5 }
            ],
            'maasai-mara': [
                { id: 'r12', user: 'Sarah M.', rating: 5, text: 'Witnessed the Great Migration! Dream come true!', date: '2026-04-01', helpful: 20 }
            ],
            'tsavo': [
                { id: 'r15', user: 'Michael B.', rating: 5, text: 'The red elephants were incredible! Best safari experience.', date: '2026-04-15', helpful: 12 },
                { id: 'r16', user: 'Lisa R.', rating: 4, text: 'Great wildlife viewing, well organized tour.', date: '2026-04-10', helpful: 7 }
            ],
            'amboseli': [
                { id: 'r17', user: 'Tom H.', rating: 5, text: 'Elephants with Kilimanjaro backdrop - absolutely magical!', date: '2026-04-12', helpful: 18 },
                { id: 'r18', user: 'Anna K.', rating: 5, text: 'Best place to see elephants up close. Our guide was fantastic!', date: '2026-04-08', helpful: 14 }
            ],
            'lake-nakuru': [
                { id: 'r19', user: 'David W.', rating: 5, text: 'Flamingos everywhere! A pink paradise.', date: '2026-03-28', helpful: 11 }
            ],
            'nairobi-np': [
                { id: 'r20', user: 'Sophie L.', rating: 4, text: 'Perfect for a day trip. Saw lions and rhinos!', date: '2026-04-05', helpful: 6 }
            ],
            'hells-gate': [
                { id: 'r21', user: 'Chris P.', rating: 5, text: 'Amazing cycling experience through the gorge!', date: '2026-04-02', helpful: 9 },
                { id: 'r22', user: 'Nina S.', rating: 4, text: 'Great hike, saw plenty of wildlife. Highly recommend!', date: '2026-03-25', helpful: 5 }
            ],
            'mount-kenya': [
                { id: 'r23', user: 'James R.', rating: 5, text: 'Summit attempt was incredible. Tough but worth it!', date: '2026-03-15', helpful: 16 }
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
        CACHE_TTL: 15 * 60 * 1000, // 15 min for reviews (can change frequently)
        
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
