/* Transactions Service — Muts Safaris */
(function (window) {
    'use strict';

    var API_READY = false;

    var mockTransactions = [
        {
            id: 'TXN-77421',
            date: '2023-10-24T14:30:00Z',
            description: 'Maasai Mara 5-Day Expedition Deposit',
            category: 'Safari',
            type: 'Debit',
            amount: 1200.00,
            status: 'completed',
            method: 'Visa •••• 4242'
        },
        {
            id: 'TXN-77422',
            date: '2023-10-25T09:15:00Z',
            description: 'Africasa Marketplace: Hand-carved Mask',
            category: 'Marketplace',
            type: 'Debit',
            amount: 85.50,
            status: 'completed',
            method: 'Neural Wallet'
        },
        {
            id: 'TXN-77423',
            date: '2023-10-26T18:00:00Z',
            description: 'Diani Beach Resort Upgrade',
            category: 'Hotel',
            type: 'Debit',
            amount: 450.00,
            status: 'pending',
            method: 'MasterCard •••• 8888'
        }
    ];

    var TransactionsService = {
        getAll: function () {
            if (window.MutsAPIConfig && window.MutsAPIConfig.isConnected()) {
                return this.fetchFromAPI('/transactions');
            }
            return new Promise(function(resolve) {
                setTimeout(function() {
                    resolve(JSON.parse(JSON.stringify(mockTransactions)));
                }, 300);
            });
        },

        getSummary: function() {
            if (window.MutsAPIConfig && window.MutsAPIConfig.isConnected()) {
                return this.fetchFromAPI('/transactions/summary');
            }
            return this.getAll().then(function(txns) {
                var total = txns.reduce(function(acc, t) { return acc + t.amount; }, 0);
                var pending = txns.filter(function(t) { return t.status === 'pending'; }).reduce(function(acc, t) { return acc + t.amount; }, 0);
                var completed = txns.filter(function(t) { return t.status === 'completed'; }).reduce(function(acc, t) { return acc + t.amount; }, 0);
                return { total: total, pending: pending, completed: completed };
            });
        },

        getById: function (id) {
            if (window.MutsAPIConfig && window.MutsAPIConfig.isConnected()) {
                return this.fetchFromAPI('/transactions/' + id);
            }
            return new Promise(function(resolve) {
                setTimeout(function() {
                    var found = mockTransactions.filter(function(t) { return t.id === id; });
                    resolve(found.length > 0 ? found[0] : null);
                }, 100);
            });
        },

        fetchFromAPI: function (endpoint, options) {
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
                if (endpoint.indexOf('/summary') !== -1) {
                    var total = mockTransactions.reduce(function(acc, t) { return acc + t.amount; }, 0);
                    var pending = mockTransactions.filter(function(t) { return t.status === 'pending'; }).reduce(function(acc, t) { return acc + t.amount; }, 0);
                    var completed = mockTransactions.filter(function(t) { return t.status === 'completed'; }).reduce(function(acc, t) { return acc + t.amount; }, 0);
                    return { total: total, pending: pending, completed: completed };
                }
                return mockTransactions;
            });
            
            var timeoutPromise = new Promise(function(_, reject) {
                setTimeout(function() { reject(new Error('Request timeout')); }, timeout);
            });
            
            return Promise.race([fetchPromise, timeoutPromise]).catch(function() {
                return mockTransactions;
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
