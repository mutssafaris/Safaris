/* Loyalty Service - Muts Safaris */
/* Points, rewards, and referral program */
(function() {
    'use strict';
    
    var LoyaltyService = {
        _dataPromise: null,
        
        _loadFromJSON: function() {
            var self = this;
            if (this._dataPromise) return this._dataPromise;
            
            this._dataPromise = fetch('../../data/loyalty.json')
                .then(function(response) {
                    if (!response.ok) throw new Error('Failed to load loyalty.json');
                    return response.json();
                })
                .then(function(data) {
                    self._loyaltyData = data;
                    return data;
                })
                .catch(function() {
                    console.warn('[LoyaltyService] Failed to load loyalty.json, using fallback data');
                    return null;
                });
            
            return this._dataPromise;
        },
        
        /**
         * Get user's loyalty profile
         */
        getProfile: function() {
            var self = this;
            var baseURL = this._getBaseURL();
            
            return fetch(baseURL + '/loyalty/profile', this._getAuthHeaders())
                .then(function(response) {
                    if (!response.ok) throw new Error('Failed to fetch profile');
                    return response.json();
                })
                .then(function(data) { return data.profile || data; })
                .catch(function(err) {
                    console.warn('[LoyaltyService] API unavailable:', err.message);
                    return self._loadFromJSON().then(function(data) {
                        return data ? data.profile : self._getLocalProfile();
                    });
                });
        },
        
        /**
         * Get transaction history
         */
        getTransactions: function() {
            var self = this;
            var baseURL = this._getBaseURL();
            
            return fetch(baseURL + '/loyalty/transactions', this._getAuthHeaders())
                .then(function(response) {
                    if (!response.ok) throw new Error('Failed to fetch transactions');
                    return response.json();
                })
                .then(function(data) { return data.transactions || data; })
                .catch(function() {
                    return self._loadFromJSON().then(function(data) {
                        return data ? data.transactions : [];
                    });
                });
        },
        
        /**
         * Get redeem options
         */
        getRedeemOptions: function() {
            var self = this;
            return this._loadFromJSON().then(function(data) {
                return data ? data.redeemOptions : self._getLocalRedeemOptions();
            });
        },
        
        /**
         * Get tier information
         */
        getTiers: function() {
            var self = this;
            return this._loadFromJSON().then(function(data) {
                return data ? data.tiers : self._getLocalTiers();
            });
        },
        
        /**
         * Redeem points for discount
         */
        redeemPoints: function(points, bookingId) {
            var baseURL = this._getBaseURL();
            var url = baseURL + '/loyalty/redeem?points=' + points;
            if (bookingId) url += '&bookingId=' + bookingId;
            
            return fetch(url, {
                method: 'POST',
                headers: this._getAuthHeaders()
            })
            .then(function(response) {
                if (!response.ok) return response.json().then(function(e) { throw new Error(e.message); });
                return response.json();
            });
        },
        
        /**
         * Get user's referral code
         */
        getReferralCode: function() {
            var self = this;
            var baseURL = this._getBaseURL();
            
            return fetch(baseURL + '/loyalty/referral-code', this._getAuthHeaders())
                .then(function(response) {
                    if (!response.ok) throw new Error('Failed to get code');
                    return response.json();
                })
                .then(function(data) { return data.code; })
                .catch(function() { 
                    return self._loadFromJSON().then(function(data) {
                        return data ? data.profile.referralCode : self._getLocalCode();
                    });
                });
        },
        
        /**
         * Use a referral code
         */
        useReferralCode: function(code) {
            var baseURL = this._getBaseURL();
            
            return fetch(baseURL + '/loyalty/refer?code=' + encodeURIComponent(code), {
                method: 'POST',
                headers: this._getAuthHeaders()
            })
            .then(function(response) {
                if (!response.ok) return response.json().then(function(e) { throw new Error(e.message); });
                return response.json();
            });
        },
        
        /**
         * Calculate redemption value
         */
        calculateRedemption: function(points) {
            var baseURL = this._getBaseURL();
            
            return fetch(baseURL + '/loyalty/calculate?points=' + points, {
                headers: this._getAuthHeaders()
            })
            .then(function(response) {
                if (!response.ok) throw new Error('Failed to calculate');
                return response.json();
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
        
        // ============ LOCAL FALLBACK ============
        
        _getLocalProfile: function() {
            return {
                userId: 'anonymous',
                points: 0,
                lifetimePoints: 0,
                tier: 'bronze',
                totalSpent: 0,
                nextTier: 'silver',
                pointsToNextTier: 1000,
                tierProgress: 0,
                recentTransactions: [],
                referralCode: 'MUTS' + Math.random().toString(36).substr(2, 6).toUpperCase(),
                referralCount: 0
            };
        },
        
        _getLocalCode: function() {
            return 'MUTS' + Math.random().toString(36).substr(2, 6).toUpperCase();
        },
        
        _getLocalRedeemOptions: function() {
            return [
                { points: 100, value: 10, label: "$10 off booking" },
                { points: 250, value: 30, label: "$30 off booking" },
                { points: 500, value: 75, label: "$75 off booking" }
            ];
        },
        
        _getLocalTiers: function() {
            return [
                { name: 'Bronze', minPoints: 0, maxPoints: 999, multiplier: 1, benefits: ['Base points earning'] },
                { name: 'Silver', minPoints: 1000, maxPoints: 4999, multiplier: 1.25, benefits: ['+25% points', 'Early access'] },
                { name: 'Gold', minPoints: 5000, maxPoints: 14999, multiplier: 1.5, benefits: ['+50% points', 'Free upgrades'] },
                { name: 'Platinum', minPoints: 15000, maxPoints: null, multiplier: 2, benefits: ['2x points', 'VIP support'] }
            ];
        }
    };
    
    window.MutsLoyaltyService = LoyaltyService;
})();