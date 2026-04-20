/* Booking Analytics - Muts Safaris */
/* Statistics and reporting for bookings */
(function(window) {
    'use strict';

    function BookingAnalytics() {
        this.cache = {};
        this.cacheExpiry = 5 * 60 * 1000;
    }

    BookingAnalytics.prototype.getStats = function(userId) {
        var self = this;
        var cacheKey = 'stats_' + (userId || 'all');
        if (this.cache[cacheKey] && Date.now() - this.cache[cacheKey].timestamp < this.cacheExpiry) {
            return Promise.resolve(this.cache[cacheKey].data);
        }
        if (window.MutsBookingsService) {
            return window.MutsBookingsService.getBookingStats(userId).then(function(stats) {
                self.cache[cacheKey] = { data: stats, timestamp: Date.now() };
                return stats;
            });
        }
        return Promise.resolve({
            total: 0,
            upcoming: 0,
            completed: 0,
            cancelled: 0,
            totalSpent: 0
        });
    };

    BookingAnalytics.prototype.getRevenueByMonth = function(year, userId) {
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        var revenue = months.map(function() { return 0; });
        if (window.MutsBookingsService) {
            return window.MutsBookingsService.getAll({ userId: userId }).then(function(bookings) {
                bookings.forEach(function(b) {
                    if (b.status === 'completed' && b.totalPrice) {
                        var date = new Date(b.checkin);
                        if (date.getFullYear() === year) {
                            revenue[date.getMonth()] += b.totalPrice;
                        }
                    }
                });
                return { year: year, months: months, revenue: revenue };
            });
        }
        return Promise.resolve({ year: year, months: months, revenue: revenue });
    };

    BookingAnalytics.prototype.getPopularDestinations = function(userId) {
        var counts = {};
        if (window.MutsBookingsService) {
            return window.MutsBookingsService.getAll({ userId: userId }).then(function(bookings) {
                bookings.forEach(function(b) {
                    var dest = b.destination || 'Unknown';
                    counts[dest] = (counts[dest] || 0) + 1;
                });
                var sorted = Object.keys(counts).map(function(k) {
                    return { destination: k, count: counts[k] };
                }).sort(function(a, b) { return b.count - a.count; });
                return sorted.slice(0, 5);
            });
        }
        return Promise.resolve([]);
    };

    BookingAnalytics.prototype.getConversionRate = function() {
        var self = this;
        if (window.MutsBookingsService) {
            return window.MutsBookingsService.getAll().then(function(bookings) {
                var total = bookings.length;
                var completed = bookings.filter(function(b) { return b.status === 'completed'; }).length;
                var rate = total > 0 ? (completed / total) * 100 : 0;
                return { total: total, completed: completed, rate: rate.toFixed(1) };
            });
        }
        return Promise.resolve({ total: 0, completed: 0, rate: '0.0' });
    };

    BookingAnalytics.prototype.clearCache = function() {
        this.cache = {};
    };

    window.MutsBookingAnalytics = new BookingAnalytics();
})(window);