/* Bookings Service — Muts Safaris */
/* API Integration Ready with full CRUD operations */
(function (window) {
    'use strict';

    var BOOKINGS_KEY = 'muts_bookings';
    var _apiReady = false;
    var API_BASE_URL = '/api';

    var mockBookings = [
        { id: 'mock-1', userId: '*', destination: 'Maasai Mara Safari', checkin: '2026-04-18', checkout: '2026-04-24', adults: 2, children: 0, infants: 0, totalPrice: 2100, status: 'upcoming', createdAt: '2026-03-15' },
        { id: 'mock-2', userId: '*', destination: 'Amboseli Adventure', checkin: '2026-05-10', checkout: '2026-05-14', adults: 2, children: 1, infants: 0, totalPrice: 1960, status: 'upcoming', createdAt: '2026-03-20' },
        { id: 'mock-3', userId: '*', destination: 'Diani Beach Escape', checkin: '2026-06-01', checkout: '2026-06-07', adults: 1, children: 0, infants: 0, totalPrice: 1400, status: 'upcoming', createdAt: '2026-03-25' },
        { id: 'mock-4', userId: '*', destination: 'Samburu Expedition', checkin: '2026-07-12', checkout: '2026-07-16', adults: 2, children: 0, infants: 0, totalPrice: 1600, status: 'upcoming', createdAt: '2026-03-28' },
        { id: 'mock-5', userId: '*', destination: 'Lake Nakuru Day Trip', checkin: '2026-04-05', checkout: '2026-04-06', adults: 2, children: 2, infants: 1, totalPrice: 500, status: 'completed', createdAt: '2026-02-10' },
        { id: 'mock-6', userId: '*', destination: 'Tsavo Wildlife Safari', checkin: '2026-08-01', checkout: '2026-08-05', adults: 2, children: 0, infants: 0, totalPrice: 1200, status: 'cancellation_pending', createdAt: '2026-03-10' },
        { id: 'mock-7', userId: '*', destination: 'Nairobi City Tour', checkin: '2026-02-15', checkout: '2026-02-16', adults: 1, children: 0, infants: 0, totalPrice: 250, status: 'cancelled', createdAt: '2026-01-20' }
    ];

    function getSession() {
        try {
            return JSON.parse(localStorage.getItem('muts_session'));
        } catch (e) {
            return null;
        }
    }

    function getUserBookings(userId) {
        var all = JSON.parse(localStorage.getItem(BOOKINGS_KEY) || '[]');
        if (userId) {
            return all.filter(function (b) { return b.userId === userId; });
        }
        return all;
    }

    function getAllBookings(userId) {
        var userBookings = getUserBookings(userId);
        return userBookings.concat(mockBookings);
    }

    function saveBooking(booking) {
        var all = JSON.parse(localStorage.getItem(BOOKINGS_KEY) || '[]');
        var idx = all.findIndex(function (b) { return b.id === booking.id; });
        if (idx >= 0) {
            all[idx] = booking;
        } else {
            all.push(booking);
        }
        localStorage.setItem(BOOKINGS_KEY, JSON.stringify(all));
    }

    function buildQueryString(params) {
        if (!params) return '';
        var query = [];
        for (var key in params) {
            if (params.hasOwnProperty(key) && params[key] !== undefined && params[key] !== null) {
                query.push(encodeURIComponent(key) + '=' + encodeURIComponent(params[key]));
            }
        }
        return query.length > 0 ? '?' + query.join('&') : '';
    }

    function fetchFromAPI(endpoint, options) {
        var session = getSession();
        
        options = options || {};
        var fetchOptions = {
            method: options.method || 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        };
        
        if (session && session.token) {
            fetchOptions.headers['Authorization'] = 'Bearer ' + session.token;
        }
        
        if (options.body) {
            fetchOptions.body = JSON.stringify(options.body);
        }
        
        var url = endpoint.indexOf('http') === 0 ? endpoint : API_BASE_URL + endpoint;
        
        return fetch(url, fetchOptions)
            .then(function(response) {
                if (response.status === 401) {
                    window.location.href = '../../login.html';
                    throw new Error('Session expired');
                }
                if (!response.ok) {
                    return response.json().then(function(err) {
                        throw new Error(err.message || 'API error: ' + response.status);
                    });
                }
                return response.json();
            })
            .then(function(data) {
                return data;
            })
            .catch(function(error) {
                console.warn('[BookingsService] API unavailable, using local data:', error.message);
                throw error;
            });
    }
    
    function getLocalBookings(userId) {
        if (userId) {
            var userBookings = getUserBookings(userId);
            return userBookings.concat(mockBookings);
        }
        return getAllBookings(userId);
    }

    var BookingsService = {
        // Cache TTL - shorter for bookings (15 min) since availability changes
        CACHE_TTL: 15 * 60 * 1000,
        
        // Note: User bookings should NOT be cached long-term (security)
        // Only cache public availability data
        
        getRecent: function (userId, limit) {
            var self = this;
            if (_apiReady) {
                var params = { limit: limit || 5 };
                if (userId) params.userId = userId;
                return this.fetchFromAPI('/bookings' + buildQueryString(params))
                    .catch(function() {
                        var bookings = getLocalBookings(userId).slice(0, limit || 5);
                        return Promise.resolve(bookings);
                    });
            }
            var n = limit || 5;
            var bookings = getLocalBookings(userId).slice(0, n);
            return Promise.resolve(bookings);
        },

        getAll: function (filters) {
            var self = this;
            filters = filters || {};
            
            if (_apiReady) {
                return this.fetchFromAPI('/bookings' + buildQueryString(filters))
                    .catch(function() {
                        var bookings = getLocalBookings(filters.userId);
                        
                        if (filters.status) {
                            bookings = bookings.filter(function(b) { return b.status === filters.status; });
                        }
                        if (filters.fromDate) {
                            bookings = bookings.filter(function(b) { return b.checkin >= filters.fromDate; });
                        }
                        if (filters.toDate) {
                            bookings = bookings.filter(function(b) { return b.checkout <= filters.toDate; });
                        }
                        
                        return Promise.resolve(bookings);
                    });
            }
            
            var bookings = getLocalBookings(filters.userId);
            
            if (filters.status) {
                bookings = bookings.filter(function(b) { return b.status === filters.status; });
            }
            if (filters.fromDate) {
                bookings = bookings.filter(function(b) { return b.checkin >= filters.fromDate; });
            }
            if (filters.toDate) {
                bookings = bookings.filter(function(b) { return b.checkout <= filters.toDate; });
            }
            
            return Promise.resolve(bookings);
        },

        getById: function (id) {
            if (_apiReady) {
                return this.fetchFromAPI('/bookings/' + id);
            }
            var all = JSON.parse(localStorage.getItem(BOOKINGS_KEY) || '[]');
            var found = all.filter(function (b) { return b.id === id; });
            if (found.length === 0) {
                found = mockBookings.filter(function (b) { return b.id === id; });
            }
            return Promise.resolve(found.length > 0 ? found[0] : null);
        },

        updateStatus: function (id, newStatus, reason) {
            reason = reason || '';
            
            if (_apiReady) {
                return this.fetchFromAPI('/bookings/' + id + '/status', {
                    method: 'PUT',
                    body: { status: newStatus, reason: reason }
                });
            }
            
            var all = JSON.parse(localStorage.getItem(BOOKINGS_KEY) || '[]');
            var updated = false;
            for (var i = 0; i < all.length; i++) {
                if (all[i].id === id) {
                    all[i].status = newStatus;
                    all[i].statusReason = reason;
                    all[i].updatedAt = new Date().toISOString();
                    updated = true;
                    break;
                }
            }
            if (updated) {
                localStorage.setItem(BOOKINGS_KEY, JSON.stringify(all));
            }
            return Promise.resolve(updated ? { id: id, status: newStatus } : null);
        },

        cancelBooking: function (id, reason) {
            return this.updateStatus(id, 'cancelled', reason);
        },

        modifyBooking: function (id, updates) {
            if (_apiReady) {
                return this.fetchFromAPI('/bookings/' + id, {
                    method: 'PUT',
                    body: updates
                });
            }
            
            var all = JSON.parse(localStorage.getItem(BOOKINGS_KEY) || '[]');
            var idx = all.findIndex(function (b) { return b.id === id; });
            if (idx === -1) return Promise.resolve(null);
            
            all[idx] = Object.assign({}, all[idx], updates, { updatedAt: new Date().toISOString() });
            localStorage.setItem(BOOKINGS_KEY, JSON.stringify(all));
            return Promise.resolve(all[idx]);
        },

        updateBooking: function (booking) {
            if (_apiReady) {
                return this.fetchFromAPI('/bookings/' + booking.id, {
                    method: 'PUT',
                    body: booking
                });
            }
            
            saveBooking(booking);
            return Promise.resolve(booking);
        },

        createBooking: function (bookingData) {
            if (_apiReady) {
                return this.fetchFromAPI('/bookings', {
                    method: 'POST',
                    body: bookingData
                });
            }
            
            var newBooking = Object.assign({
                id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
                createdAt: new Date().toISOString(),
                status: 'pending'
            }, bookingData);
            
            saveBooking(newBooking);
            return Promise.resolve(newBooking);
        },

        deleteBooking: function (id) {
            if (_apiReady) {
                return this.fetchFromAPI('/bookings/' + id, {
                    method: 'DELETE'
                });
            }
            
            var all = JSON.parse(localStorage.getItem(BOOKINGS_KEY) || '[]');
            var filtered = all.filter(function (b) { return b.id !== id; });
            localStorage.setItem(BOOKINGS_KEY, JSON.stringify(filtered));
            return Promise.resolve({ success: true });
        },

        getBookingStats: function (userId) {
            if (_apiReady) {
                var params = {};
                if (userId) params.userId = userId;
                return this.fetchFromAPI('/bookings/stats' + buildQueryString(params));
            }
            
            var bookings = getAllBookings(userId);
            var stats = {
                total: bookings.length,
                upcoming: bookings.filter(function(b) { return b.status === 'upcoming'; }).length,
                completed: bookings.filter(function(b) { return b.status === 'completed'; }).length,
                cancelled: bookings.filter(function(b) { return b.status === 'cancelled'; }).length,
                totalSpent: bookings.reduce(function(sum, b) { return sum + (b.totalPrice || 0); }, 0)
            };
            return Promise.resolve(stats);
        },

        applyPromoCode: function (bookingId, promoCode) {
            if (_apiReady) {
                return this.fetchFromAPI('/bookings/' + bookingId + '/promo', {
                    method: 'POST',
                    body: { code: promoCode }
                });
            }
            
            var promoCodes = {
                'AMBOSELI20': { discount: 0.20, description: '20% off Amboseli' },
                'WELCOME10': { discount: 0.10, description: '10% welcome discount' },
                'SAFARI25': { discount: 0.25, description: '25% off safari packages' }
            };
            
            var promo = promoCodes[promoCode.toUpperCase()];
            if (!promo) {
                return Promise.resolve({ success: false, message: 'Invalid promo code' });
            }
            
return Promise.resolve({ success: true, discount: promo.discount, description: promo.description });
        },
        
        // ===== RESERVATION HOLD (Phase 4.5) =====
        
        /**
         * Check if booking has an active reservation hold
         * @param {Object} booking - The booking object
         * @returns {Object} - { isReserved: boolean, expiresAt: string|null, remainingMinutes: number }
         */
        checkReservationHold: function(booking) {
            if (!booking || !booking.expiresAt) {
                return { isReserved: false, expiresAt: null, remainingMinutes: 0 };
            }
            
            var now = new Date();
            var expires = new Date(booking.expiresAt);
            var remaining = Math.floor((expires - now) / 1000 / 60);
            
            if (remaining <= 0) {
                return { isReserved: false, expiresAt: booking.expiresAt, remainingMinutes: 0 };
            }
            
            return {
                isReserved: true,
                expiresAt: booking.expiresAt,
                remainingMinutes: remaining
            };
        },
        
        /**
         * Initiate a 15-minute reservation hold for a booking
         * @param {string} bookingId - The booking ID
         * @returns {Promise} - The updated booking
         */
        initiateReservation: function(bookingId) {
            if (_apiReady) {
                return this.fetchFromAPI('/bookings/' + bookingId + '/reserve', {
                    method: 'POST'
                });
            }
            
            // Fallback: Create local reservation
            var all = JSON.parse(localStorage.getItem(BOOKINGS_KEY) || '[]');
            var idx = all.findIndex(function(b) { return b.id === bookingId; });
            
            if (idx >= 0) {
                var now = new Date();
                var expires = new Date(now.getTime() + 15 * 60 * 1000); // 15 minutes
                
                all[idx].reservedAt = now.toISOString();
                all[idx].expiresAt = expires.toISOString();
                all[idx].isReserved = true;
                
                localStorage.setItem(BOOKINGS_KEY, JSON.stringify(all));
                return Promise.resolve(all[idx]);
            }
            
            return Promise.reject(new Error('Booking not found'));
        },
        
        /**
         * Release a reservation hold
         * @param {string} bookingId - The booking ID
         * @returns {Promise} - The updated booking
         */
        releaseReservation: function(bookingId) {
            if (_apiReady) {
                return this.fetchFromAPI('/bookings/' + bookingId + '/reserve', {
                    method: 'DELETE'
                });
            }
            
            // Fallback: Release local reservation
            var all = JSON.parse(localStorage.getItem(BOOKINGS_KEY) || '[]');
            var idx = all.findIndex(function(b) { return b.id === bookingId; });
            
            if (idx >= 0) {
                all[idx].reservedAt = null;
                all[idx].expiresAt = null;
                all[idx].isReserved = false;
                
                localStorage.setItem(BOOKINGS_KEY, JSON.stringify(all));
                return Promise.resolve(all[idx]);
            }
            
            return Promise.reject(new Error('Booking not found'));
        },
        
        /**
         * Check room availability for a hotel
         * @param {string} hotelId - The hotel ID
         * @param {string} checkin - Check-in date (YYYY-MM-DD)
         * @param {string} checkout - Check-out date (YYYY-MM-DD)
         * @returns {Promise} - { available: boolean, availableRooms: number }
         */
        checkAvailability: function(hotelId, checkin, checkout) {
            if (_apiReady) {
                var params = '?checkin=' + checkin + '&checkout=' + checkout;
                return this.fetchFromAPI('/hotels/' + hotelId + '/availability' + params);
            }
            
            // Fallback: Always available in mock mode
            return Promise.resolve({ available: true, availableRooms: 5 });
        },
        
        // ===== PHASE 12: SELF-SERVICE BOOKING MANAGEMENT =====
        
        /**
         * Cancel a booking
         * @param {string} bookingId - The booking ID
         * @param {string} reason - Optional cancellation reason
         * @returns {Promise} - Cancellation result with refund info
         */
        cancelBooking: function(bookingId, reason) {
            if (_apiReady) {
                var url = '/bookings/' + bookingId + '/cancel';
                if (reason) url += '?reason=' + encodeURIComponent(reason);
                return this.fetchFromAPI(url, { method: 'PUT' });
            }
            
            // Fallback: Local cancellation
            var all = JSON.parse(localStorage.getItem(BOOKINGS_KEY) || '[]');
            var idx = all.findIndex(function(b) { return b.id === bookingId; });
            
            if (idx >= 0) {
                all[idx].status = 'cancelled';
                all[idx].cancelledAt = new Date().toISOString();
                all[idx].cancellationReason = reason || '';
                localStorage.setItem(BOOKINGS_KEY, JSON.stringify(all));
                
                return Promise.resolve({
                    bookingId: bookingId,
                    status: 'cancelled',
                    refundAmount: 0,
                    refundPercentage: 0,
                    cancellationPolicy: 'No refund - local fallback'
                });
            }
            
            return Promise.reject(new Error('Booking not found'));
        },
        
        /**
         * Modify booking dates
         * @param {string} bookingId - The booking ID
         * @param {string} checkin - New check-in date (YYYY-MM-DD)
         * @param {string} checkout - New check-out date (YYYY-MM-DD)
         * @returns {Promise} - Updated booking
         */
        modifyBooking: function(bookingId, checkin, checkout) {
            if (_apiReady) {
                var url = '/bookings/' + bookingId + '/modify?checkin=' + checkin + '&checkout=' + checkout;
                return this.fetchFromAPI(url, { method: 'PUT' });
            }
            
            // Fallback: Local modification
            var all = JSON.parse(localStorage.getItem(BOOKINGS_KEY) || '[]');
            var idx = all.findIndex(function(b) { return b.id === bookingId; });
            
            if (idx >= 0) {
                all[idx].checkin = checkin;
                all[idx].checkout = checkout;
                all[idx].modifiedAt = new Date().toISOString();
                localStorage.setItem(BOOKINGS_KEY, JSON.stringify(all));
                return Promise.resolve(all[idx]);
            }
            
            return Promise.reject(new Error('Booking not found'));
        },
        
        /**
         * Check if booking can be cancelled
         * @param {string} bookingId - The booking ID
         * @returns {Promise} - { canCancel: boolean }
         */
        canCancel: function(bookingId) {
            if (_apiReady) {
                return this.fetchFromAPI('/bookings/' + bookingId + '/can-cancel');
            }
            
            // Fallback: Check locally
            var all = JSON.parse(localStorage.getItem(BOOKINGS_KEY) || '[]');
            var booking = all.find(function(b) { return b.id === bookingId; });
            return Promise.resolve({ canCancel: booking && (booking.status === 'upcoming' || booking.status === 'confirmed') });
        },
        
        /**
         * Check if booking can be modified
         * @param {string} bookingId - The booking ID
         * @returns {Promise} - { canModify: boolean }
         */
        canModify: function(bookingId) {
            if (_apiReady) {
                return this.fetchFromAPI('/bookings/' + bookingId + '/can-modify');
            }
            
            // Fallback
            return Promise.resolve({ canModify: false });
        },
        
        /**
         * Get cancellation policy
         * @param {number} daysUntilCheckin - Days until check-in
         * @returns {Promise} - { policy: string }
         */
        getCancellationPolicy: function(daysUntilCheckin) {
            if (_apiReady) {
                return this.fetchFromAPI('/bookings/cancellation-policy?daysUntilCheckin=' + daysUntilCheckin);
            }
            
            // Fallback: Local policy
            var policy;
            if (daysUntilCheckin >= 14) policy = 'Free cancellation - Full refund';
            else if (daysUntilCheckin >= 7) policy = '75% refund';
            else if (daysUntilCheckin >= 3) policy = '50% refund';
            else if (daysUntilCheckin >= 1) policy = '25% refund';
            else policy = 'No refund';
            
return Promise.resolve({ policy: policy });
        },

        setBaseURL: function (url) {
            API_BASE_URL = url;
        },

        enableAPI: function (baseURL) {
            _apiReady = true;
            if (baseURL) {
                API_BASE_URL = baseURL;
            }
            console.log('[BookingsService] API mode enabled');
        },

        disableAPI: function () {
            _apiReady = false;
        },

        isAPILive: function () {
            return _apiReady;
        }
    };

    window.MutsBookingsService = BookingsService;
})(window);

// ES6 module export (for bundlers)
export default window.bookingsService || window.bookingsService;
