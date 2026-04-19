/* Transactions Service — Muts Safaris */
(function (window) {
    'use strict';

    var API_READY = false;
    var mockData = null;

    function loadMockData() {
        return fetch('../../data/transactions.json')
            .then(function(response) {
                if (!response.ok) throw new Error('Failed to load mock data');
                return response.json();
            })
            .then(function(data) {
                mockData = data;
                return data;
            })
            .catch(function() {
                return getFallbackMockData();
            });
    }

    function getFallbackMockData() {
        return {
            transactions: [
                { id: 'TXN-77421', date: '2026-04-14T14:30:00Z', description: 'Maasai Mara 5-Day Expedition Deposit', category: 'Safari', type: 'Debit', amount: 1200.00, status: 'completed', method: 'Visa •••• 4242' },
                { id: 'TXN-77422', date: '2026-04-13T09:15:00Z', description: 'Africasa Marketplace: Hand-carved Mask', category: 'Marketplace', type: 'Debit', amount: 85.50, status: 'completed', method: 'Neural Wallet' },
                { id: 'TXN-77423', date: '2026-04-12T18:00:00Z', description: 'Diani Beach Resort Upgrade', category: 'Hotel', type: 'Debit', amount: 450.00, status: 'pending', method: 'MasterCard •••• 8888' }
            ],
            summary: { total: 1735.50, pending: 450.00, completed: 1285.50, failed: 0 }
        };
    }

    var TransactionsService = {
        _dataPromise: null,

        _ensureData: function() {
            if (!this._dataPromise) {
                this._dataPromise = loadMockData();
            }
            return this._dataPromise;
        },

        getAll: function () {
            var self = this;
            if (window.MutsAPIConfig && window.MutsAPIConfig.isConnected()) {
                return this.fetchFromAPI('/transactions');
            }
            return new Promise(function(resolve) {
                self._ensureData().then(function(data) {
                    setTimeout(function() {
                        resolve(data.transactions || []);
                    }, 300);
                });
            });
        },

        getSummary: function() {
            var self = this;
            if (window.MutsAPIConfig && window.MutsAPIConfig.isConnected()) {
                return this.fetchFromAPI('/transactions/summary');
            }
            return new Promise(function(resolve) {
                self._ensureData().then(function(data) {
                    if (data.summary) {
                        resolve(data.summary);
                    } else {
                        var txns = data.transactions || [];
                        var total = txns.reduce(function(acc, t) { return acc + Math.abs(t.amount); }, 0);
                        var pending = txns.filter(function(t) { return t.status === 'pending'; }).reduce(function(acc, t) { return acc + t.amount; }, 0);
                        var completed = txns.filter(function(t) { return t.status === 'completed'; }).reduce(function(acc, t) { return acc + t.amount; }, 0);
                        resolve({ total: total, pending: pending, completed: completed });
                    }
                });
            });
        },

        getById: function (id) {
            var self = this;
            if (window.MutsAPIConfig && window.MutsAPIConfig.isConnected()) {
                return this.fetchFromAPI('/transactions/' + id);
            }
            return new Promise(function(resolve) {
                self._ensureData().then(function(data) {
                    setTimeout(function() {
                        var found = (data.transactions || []).filter(function(t) { return t.id === id; });
                        resolve(found.length > 0 ? found[0] : null);
                    }, 100);
                });
            });
        },

        fetchFromAPI: function (endpoint, options) {
            var self = this;
            var baseURL = (window.MutsAPIConfig && window.MutsAPIConfig.getBaseURL) 
                ? window.MutsAPIConfig.getBaseURL() 
                : '/api';
            var url = endpoint.indexOf('http') === 0 ? endpoint : baseURL + endpoint;
            var timeout = (window.MutsAPIConfig && window.MutsAPIConfig.getTimeout) 
                ? window.MutsAPIConfig.getTimeout() 
                : 30000;
            
            var fetchPromise = fetch(url, options).then(function (response) {
                if (!response.ok) throw new Error('API error: ' + response.status);
                return response.json();
            }).catch(function (err) {
                console.warn('[TransactionsService] API unavailable, using mock data:', err.message);
                if (window.MutsMockIndicator) window.MutsMockIndicator.setMockMode(true);
                return self._ensureData().then(function(data) {
                    if (endpoint.indexOf('/summary') !== -1) {
                        return data.summary || { total: 0, pending: 0, completed: 0 };
                    }
                    return data.transactions || [];
                });
            });
            
            var timeoutPromise = new Promise(function(_, reject) {
                setTimeout(function() { reject(new Error('Request timeout')); }, timeout);
            });
            
            return Promise.race([fetchPromise, timeoutPromise]).catch(function() {
                if (window.MutsMockIndicator) window.MutsMockIndicator.setMockMode(true);
                return self._ensureData().then(function(data) {
                    if (endpoint.indexOf('/summary') !== -1) {
                        return data.summary || { total: 0, pending: 0, completed: 0 };
                    }
                    return data.transactions || [];
                });
            });
        },

        enableAPI: function () {
            API_READY = true;
            console.log('[TransactionsService] API mode enabled');
        },

        disableAPI: function () {
            API_READY = false;
            console.log('[TransactionsService] API mode disabled');
        },

        isAPILive: function () {
            return window.MutsAPIConfig && window.MutsAPIConfig.isConnected();
        }
    };

    window.MutsTransactionsService = TransactionsService;
})(window);

