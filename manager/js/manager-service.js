/* Manager Service - Muts Safaris */
/* API service for manager dashboard operations */
(function(window) {
    'use strict';

    var API_READY = false;
    var BASE_URL = '/api/manager';

    var ManagerService = {
        init: function(options) {
            if (options && options.baseUrl) {
                BASE_URL = options.baseUrl;
            }
            if (options && options.apiReady) {
                API_READY = true;
            }
        },

        setBaseUrl: function(url) {
            BASE_URL = url;
        },

        enableAPI: function() {
            API_READY = true;
            console.log('[ManagerService] API mode enabled');
        },

        disableAPI: function() {
            API_READY = false;
            console.log('[ManagerService] API mode disabled');
        },

        isAPILive: function() {
            return window.MutsAPIConfig && window.MutsAPIConfig.isConnected();
        },

        // Generic fetch method
        fetch: function(endpoint, options) {
            var url = BASE_URL + endpoint;
            var defaultOptions = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            
            // Add auth token if available
            var session = JSON.parse(localStorage.getItem('muts_manager_session') || '{}');
            if (session.token) {
                defaultOptions.headers['Authorization'] = 'Bearer ' + session.token;
            }

            var fetchOptions = Object.assign({}, defaultOptions, options);
            
            return fetch(url, fetchOptions)
                .then(function(response) {
                    if (!response.ok) {
                        if (response.status === 401) {
                            window.location.href = 'index.html';
                            throw new Error('Unauthorized');
                        }
                        throw new Error('API error: ' + response.status);
                    }
                    return response.json();
                })
                .catch(function(err) {
                    console.error('[ManagerService] Error:', err);
                    throw err;
                });
        },

        // ============ AUTH ============
        login: function(email, password) {
            return this.fetch('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email: email, password: password })
            });
        },

        logout: function() {
            localStorage.removeItem('muts_manager_session');
            window.location.href = 'index.html';
        },

        checkAuth: function() {
            var sessionStr = localStorage.getItem('muts_manager_session');
            if (!sessionStr) {
                window.location.href = 'index.html';
                return false;
            }
            
            try {
                var session = JSON.parse(sessionStr);
                
                if (!session.token || !session.role) {
                    window.location.href = 'index.html';
                    return false;
                }
                
                if (session.expiresAt) {
                    var expiresAt = new Date(session.expiresAt);
                    if (expiresAt < new Date()) {
                        localStorage.removeItem('muts_manager_session');
                        window.location.href = 'index.html';
                        return false;
                    }
                }
                
                return true;
            } catch (e) {
                window.location.href = 'index.html';
                return false;
            }
        },

        getCurrentUser: function() {
            var sessionStr = localStorage.getItem('muts_manager_session');
            if (!sessionStr) return null;
            
            try {
                var session = JSON.parse(sessionStr);
                return {
                    id: session.userId,
                    name: session.name,
                    email: session.email,
                    role: session.role
                };
            } catch (e) {
                return null;
            }
        },

        // ============ DASHBOARD STATS ============
        getDashboardStats: function() {
            if (window.MutsAPIConfig && window.MutsAPIConfig.isConnected()) {
                return this.fetch('/dashboard/stats');
            }
            
            return Promise.resolve({
                totalBookings: 24,
                pendingMessages: 5,
                publishedHotels: 18,
                totalRevenue: 45200,
                bookingsChange: 12,
                revenueChange: 8,
                lastMonthBookings: 21,
                lastMonthRevenue: 41800
            });
        },

        getRecentBookings: function(limit) {
            limit = limit || 5;
            
            if (window.MutsAPIConfig && window.MutsAPIConfig.isConnected()) {
                return this.fetch('/dashboard/recent-bookings?limit=' + limit);
            }
            
            return Promise.resolve([
                { id: 'BKG-001', destination: 'Maasai Mara Safari', adults: 2, children: 1, checkin: '2026-04-18', status: 'upcoming', totalPrice: 2100 },
                { id: 'BKG-002', destination: 'Amboseli Adventure', adults: 2, children: 0, checkin: '2026-04-25', status: 'pending', totalPrice: 1960 },
                { id: 'BKG-003', destination: 'Diani Beach Escape', adults: 1, children: 0, checkin: '2026-05-01', status: 'confirmed', totalPrice: 1400 },
                { id: 'BKG-004', destination: 'Samburu Expedition', adults: 2, children: 0, checkin: '2026-05-10', status: 'upcoming', totalPrice: 1600 },
                { id: 'BKG-005', destination: 'Lake Nakuru Day Trip', adults: 2, children: 2, checkin: '2026-04-15', status: 'completed', totalPrice: 500 }
            ]);
        },

        getPendingMessages: function() {
            if (window.MutsAPIConfig && window.MutsAPIConfig.isConnected()) {
                return this.fetch('/dashboard/pending-messages');
            }
            
            return Promise.resolve([
                { id: 1, from: 'John Smith', subject: 'Booking Inquiry', date: '2026-04-10' },
                { id: 2, from: 'Sarah Johnson', subject: 'Safari Package Question', date: '2026-04-09' },
                { id: 3, from: 'Mike Williams', subject: 'Hotel Reservation', date: '2026-04-08' }
            ]);
        },

        getContentSummary: function() {
            if (window.MutsAPIConfig && window.MutsAPIConfig.isConnected()) {
                return this.fetch('/dashboard/content-summary');
            }
            
            return Promise.resolve({
                hotels: { total: 24, published: 18, draft: 6 },
                tours: { total: 15, published: 12, draft: 3 },
                packages: { total: 8, published: 6, draft: 2 },
                blogs: { total: 45, published: 38, draft: 7 },
                destinations: { total: 12, published: 10, draft: 2 }
            });
        },

        // ============ HOTELS ============
        getHotels: function(filters) {
            var query = '';
            if (filters) {
                var params = [];
                if (filters.status) params.push('status=' + filters.status);
                if (filters.tier) params.push('tier=' + filters.tier);
                if (filters.search) params.push('search=' + encodeURIComponent(filters.search));
                if (params.length) query = '?' + params.join('&');
            }
            return this.fetch('/content/hotels' + query);
        },

        getHotel: function(id) {
            return this.fetch('/content/hotels/' + id);
        },

        createHotel: function(data) {
            return this.fetch('/content/hotels', {
                method: 'POST',
                body: JSON.stringify(data)
            });
        },

        updateHotel: function(id, data) {
            return this.fetch('/content/hotels/' + id, {
                method: 'PUT',
                body: JSON.stringify(data)
            });
        },

        deleteHotel: function(id) {
            return this.fetch('/content/hotels/' + id, {
                method: 'DELETE'
            });
        },

        publishHotel: function(id) {
            return this.fetch('/content/hotels/' + id + '/publish', {
                method: 'POST'
            });
        },

        // ============ DESTINATIONS ============
        getDestinations: function(filters) {
            var query = '';
            if (filters) {
                var params = [];
                if (filters.status) params.push('status=' + filters.status);
                if (filters.type) params.push('type=' + filters.type);
                if (filters.search) params.push('search=' + encodeURIComponent(filters.search));
                if (params.length) query = '?' + params.join('&');
            }
            return this.fetch('/content/destinations' + query);
        },

        getDestination: function(id) {
            return this.fetch('/content/destinations/' + id);
        },

        createDestination: function(data) {
            return this.fetch('/content/destinations', {
                method: 'POST',
                body: JSON.stringify(data)
            });
        },

        updateDestination: function(id, data) {
            return this.fetch('/content/destinations/' + id, {
                method: 'PUT',
                body: JSON.stringify(data)
            });
        },

        deleteDestination: function(id) {
            return this.fetch('/content/destinations/' + id, {
                method: 'DELETE'
            });
        },

        publishDestination: function(id) {
            return this.fetch('/content/destinations/' + id + '/publish', {
                method: 'POST'
            });
        },

        // ============ TOURS ============
        getTours: function(filters) {
            var query = '';
            if (filters) {
                var params = [];
                if (filters.status) params.push('status=' + filters.status);
                if (filters.search) params.push('search=' + encodeURIComponent(filters.search));
                if (params.length) query = '?' + params.join('&');
            }
            return this.fetch('/content/tours' + query);
        },

        getTour: function(id) {
            return this.fetch('/content/tours/' + id);
        },

        createTour: function(data) {
            return this.fetch('/content/tours', {
                method: 'POST',
                body: JSON.stringify(data)
            });
        },

        updateTour: function(id, data) {
            return this.fetch('/content/tours/' + id, {
                method: 'PUT',
                body: JSON.stringify(data)
            });
        },

        deleteTour: function(id) {
            return this.fetch('/content/tours/' + id, {
                method: 'DELETE'
            });
        },

        // ============ PACKAGES ============
        getPackages: function(filters) {
            var query = '';
            if (filters) {
                var params = [];
                if (filters.status) params.push('status=' + filters.status);
                if (filters.search) params.push('search=' + encodeURIComponent(filters.search));
                if (params.length) query = '?' + params.join('&');
            }
            return this.fetch('/content/packages' + query);
        },

        getPackage: function(id) {
            return this.fetch('/content/packages/' + id);
        },

        createPackage: function(data) {
            return this.fetch('/content/packages', {
                method: 'POST',
                body: JSON.stringify(data)
            });
        },

        updatePackage: function(id, data) {
            return this.fetch('/content/packages/' + id, {
                method: 'PUT',
                body: JSON.stringify(data)
            });
        },

        deletePackage: function(id) {
            return this.fetch('/content/packages/' + id, {
                method: 'DELETE'
            });
        },

        // ============ BLOGS ============
        getBlogs: function(filters) {
            var query = '';
            if (filters) {
                var params = [];
                if (filters.status) params.push('status=' + filters.status);
                if (filters.category) params.push('category=' + filters.category);
                if (filters.search) params.push('search=' + encodeURIComponent(filters.search));
                if (params.length) query = '?' + params.join('&');
            }
            return this.fetch('/content/blogs' + query);
        },

        getBlog: function(id) {
            return this.fetch('/content/blogs/' + id);
        },

        createBlog: function(data) {
            return this.fetch('/content/blogs', {
                method: 'POST',
                body: JSON.stringify(data)
            });
        },

        updateBlog: function(id, data) {
            return this.fetch('/content/blogs/' + id, {
                method: 'PUT',
                body: JSON.stringify(data)
            });
        },

        deleteBlog: function(id) {
            return this.fetch('/content/blogs/' + id, {
                method: 'DELETE'
            });
        },

        publishBlog: function(id) {
            return this.fetch('/content/blogs/' + id + '/publish', {
                method: 'POST'
            });
        },

        // ============ AFRICASA PRODUCTS ============
        getProducts: function(filters) {
            var query = '';
            if (filters) {
                var params = [];
                if (filters.category) params.push('category=' + filters.category);
                if (filters.search) params.push('search=' + encodeURIComponent(filters.search));
                if (filters.featured !== undefined) params.push('featured=' + filters.featured);
                if (params.length) query = '?' + params.join('&');
            }
            return this.fetch('/content/products' + query);
        },

        getProduct: function(id) {
            return this.fetch('/content/products/' + id);
        },

        createProduct: function(data) {
            return this.fetch('/content/products', {
                method: 'POST',
                body: JSON.stringify(data)
            });
        },

        updateProduct: function(id, data) {
            return this.fetch('/content/products/' + id, {
                method: 'PUT',
                body: JSON.stringify(data)
            });
        },

        deleteProduct: function(id) {
            return this.fetch('/content/products/' + id, {
                method: 'DELETE'
            });
        },

        // ============ BOOKINGS ============
        getBookings: function(filters) {
            var query = '';
            if (filters) {
                var params = [];
                if (filters.status) params.push('status=' + filters.status);
                if (filters.search) params.push('search=' + encodeURIComponent(filters.search));
                if (filters.dateFrom) params.push('dateFrom=' + filters.dateFrom);
                if (filters.dateTo) params.push('dateTo=' + filters.dateTo);
                if (params.length) query = '?' + params.join('&');
            }
            return this.fetch('/bookings' + query);
        },

        getBooking: function(id) {
            return this.fetch('/bookings/' + id);
        },

        updateBooking: function(id, data) {
            return this.fetch('/bookings/' + id, {
                method: 'PUT',
                body: JSON.stringify(data)
            });
        },

        updateBookingStatus: function(id, status) {
            return this.fetch('/bookings/' + id + '/status', {
                method: 'PATCH',
                body: JSON.stringify({ status: status })
            });
        },

        assignGuide: function(bookingId, guideName) {
            return this.fetch('/bookings/' + bookingId + '/assign', {
                method: 'POST',
                body: JSON.stringify({ guide: guideName })
            });
        },

        // ============ MESSAGES ============
        getMessages: function(filters) {
            var query = '';
            if (filters) {
                var params = [];
                if (filters.status) params.push('status=' + filters.status);
                if (filters.type) params.push('type=' + filters.type);
                if (params.length) query = '?' + params.join('&');
            }
            return this.fetch('/messages' + query);
        },

        getMessage: function(id) {
            return this.fetch('/messages/' + id);
        },

        replyToMessage: function(id, text) {
            return this.fetch('/messages/' + id + '/reply', {
                method: 'POST',
                body: JSON.stringify({ text: text })
            });
        },

        markMessageResolved: function(id) {
            return this.fetch('/messages/' + id + '/resolve', {
                method: 'POST'
            });
        },

        sendMessageToUser: function(data) {
            return this.fetch('/messages/send', {
                method: 'POST',
                body: JSON.stringify({
                    to: data.to,
                    name: data.name,
                    type: data.type || 'direct',
                    subject: data.subject,
                    message: data.message
                })
            });
        },

        getSentMessages: function() {
            return this.fetch('/messages/sent');
        },

        // ============ ANALYTICS ============
        getAnalytics: function(period) {
            var query = period ? '?period=' + period : '';
            return this.fetch('/analytics' + query);
        },

        // ============ CACHE MANAGEMENT ============
        getCacheStats: function() {
            var stats = { hotels: 0, destinations: 0, tours: 0, packages: 0, users: 0 };
            try {
                var hotelsData = localStorage.getItem('muts_hotels_cache');
                if (hotelsData) stats.hotels = JSON.parse(hotelsData).length || 0;
                
                var destData = localStorage.getItem('muts_destinations_cache');
                if (destData) stats.destinations = JSON.parse(destData).length || 0;
                
                var toursData = localStorage.getItem('muts_tours_cache');
                if (toursData) stats.tours = JSON.parse(toursData).length || 0;
                
                var packagesData = localStorage.getItem('muts_packages_cache');
                if (packagesData) stats.packages = JSON.parse(packagesData).length || 0;
                
                var usersData = localStorage.getItem('muts_users_cache');
                if (usersData) stats.users = JSON.parse(usersData).length || 0;
            } catch (e) {
                console.error('[ManagerService] Error getting cache stats:', e);
            }
            return stats;
        },

        clearCache: function(type) {
            var keys = [];
            if (!type || type === 'hotels') keys.push('muts_hotels_cache');
            if (!type || type === 'destinations') keys.push('muts_destinations_cache');
            if (!type || type === 'tours') keys.push('muts_tours_cache');
            if (!type || type === 'packages') keys.push('muts_packages_cache');
            if (!type || type === 'users') keys.push('muts_users_cache');
            
            keys.forEach(function(key) {
                localStorage.removeItem(key);
            });
            return true;
        },

        // ============ API CONFIGURATION ============
        saveApiConfig: function(environment, apiUrl) {
            var config = {
                environment: environment || 'development',
                apiUrl: apiUrl || '',
                savedAt: new Date().toISOString()
            };
            localStorage.setItem('muts_manager_api_config', JSON.stringify(config));
            return config;
        },

        getApiConfig: function() {
            try {
                var config = localStorage.getItem('muts_manager_api_config');
                return config ? JSON.parse(config) : null;
            } catch (e) {
                return null;
            }
        },

        // ============ FAQS ============
        getFAQs: function(filters) {
            var query = '';
            if (filters) {
                var params = [];
                if (filters.category) params.push('category=' + filters.category);
                if (filters.search) params.push('search=' + encodeURIComponent(filters.search));
                if (params.length) query = '?' + params.join('&');
            }
            return this.fetch('/content/faq' + query);
        },

        getFAQ: function(id) {
            return this.fetch('/content/faq/' + id);
        },

        createFAQ: function(data) {
            return this.fetch('/content/faq', {
                method: 'POST',
                body: JSON.stringify(data)
            });
        },

        updateFAQ: function(id, data) {
            return this.fetch('/content/faq/' + id, {
                method: 'PUT',
                body: JSON.stringify(data)
            });
        },

        deleteFAQ: function(id) {
            return this.fetch('/content/faq/' + id, {
                method: 'DELETE'
            });
        },

        // ============ TRANSACTIONS ============
        getTransactions: function(filters) {
            var query = '';
            if (filters) {
                var params = [];
                if (filters.status) params.push('status=' + filters.status);
                if (filters.category) params.push('category=' + filters.category);
                if (filters.search) params.push('search=' + encodeURIComponent(filters.search));
                if (filters.dateFrom) params.push('dateFrom=' + filters.dateFrom);
                if (filters.dateTo) params.push('dateTo=' + filters.dateTo);
                if (filters.limit) params.push('limit=' + filters.limit);
                if (filters.offset) params.push('offset=' + filters.offset);
                if (params.length) query = '?' + params.join('&');
            }
            return this.fetch('/transactions' + query);
        },

        getTransaction: function(id) {
            return this.fetch('/transactions/' + id);
        },

        getTransactionSummary: function() {
            return this.fetch('/transactions/summary');
        },

        exportTransactions: function(format) {
            return this.fetch('/transactions/export?format=' + (format || 'csv'), {
                method: 'GET'
            });
        }
    };

    window.ManagerService = ManagerService;

})(window);
