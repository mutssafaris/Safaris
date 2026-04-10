/* Payment Service — Muts Safaris */
/* Unified payment processing service supporting Stripe, MPesa, PayPal */
(function(window) {
    'use strict';

    var STORAGE_KEY = 'muts_payments_cache';
    
    var mockPayments = {
        stripe: {
            enabled: true,
            publishableKey: 'pk_test_xxxxxxxxxxxxx',
            currency: 'USD'
        },
        mpesa: {
            enabled: true,
            shortCode: '123456',
            environment: 'sandbox'
        },
        paypal: {
            enabled: true,
            clientId: 'xxxxxxxxxxxxx',
            currency: 'USD'
        }
    };

    var mockTransactions = [
        {
            id: 'PAY-001',
            bookingId: 'BKG-001',
            amount: 2100,
            currency: 'USD',
            method: 'stripe',
            status: 'completed',
            createdAt: '2026-04-08T10:30:00Z',
            description: 'Maasai Mara Safari Deposit'
        },
        {
            id: 'PAY-002',
            bookingId: 'BKG-002',
            amount: 1960,
            currency: 'USD',
            method: 'mpesa',
            status: 'completed',
            createdAt: '2026-04-07T14:22:00Z',
            description: 'Amboseli Adventure Full Payment'
        },
        {
            id: 'PAY-003',
            bookingId: 'BKG-003',
            amount: 700,
            currency: 'USD',
            method: 'paypal',
            status: 'pending',
            createdAt: '2026-04-10T09:15:00Z',
            description: 'Diani Beach Escape Deposit'
        }
    ];

    var PaymentService = {
        _config: mockPayments,

        init: function(config) {
            if (config) {
                this._config = Object.assign({}, mockPayments, config);
            }
        },

        getConfig: function() {
            return this._config;
        },

        isMethodEnabled: function(method) {
            return this._config[method] && this._config[method].enabled;
        },

        getEnabledMethods: function() {
            var methods = [];
            if (this._config.stripe && this._config.stripe.enabled) methods.push('stripe');
            if (this._config.mpesa && this._config.mpesa.enabled) methods.push('mpesa');
            if (this._config.paypal && this._config.paypal.enabled) methods.push('paypal');
            return methods;
        },

        // ============ STRIPE ============
        initStripe: function() {
            if (!this._config.stripe || !this._config.stripe.enabled) {
                return Promise.reject(new Error('Stripe not enabled'));
            }
            
            if (window.Stripe) {
                return Promise.resolve(window.Stripe(this._config.stripe.publishableKey));
            }
            
            return new Promise(function(resolve, reject) {
                var script = document.createElement('script');
                script.src = 'https://js.stripe.com/v3/';
                script.onload = function() {
                    resolve(window.Stripe(self._config.stripe.publishableKey));
                };
                script.onerror = function() {
                    reject(new Error('Failed to load Stripe'));
                };
                document.head.appendChild(script);
            });
        },

        createStripePaymentIntent: function(amount, currency, metadata) {
            if (window.MutsAPIConfig && window.MutsAPIConfig.isConnected()) {
                return this.fetchAPI('/payments/stripe/create-intent', {
                    method: 'POST',
                    body: JSON.stringify({ amount: amount, currency: currency, metadata: metadata })
                });
            }
            
            return Promise.resolve({
                clientSecret: 'pi_mock_secret_' + Date.now(),
                paymentId: 'PAY-MOCK-' + Date.now()
            });
        },

        confirmStripePayment: function(clientSecret, paymentMethod) {
            return this.initStripe().then(function(stripe) {
                return stripe.confirmCardPayment(clientSecret, {
                    payment_method: paymentMethod
                });
            });
        },

        // ============ M-PESA ============
        initiateMpesaPayment: function(phone, amount, reference) {
            if (window.MutsAPIConfig && window.MutsAPIConfig.isConnected()) {
                return this.fetchAPI('/payments/mpesa/initiate', {
                    method: 'POST',
                    body: JSON.stringify({ phone: phone, amount: amount, reference: reference })
                });
            }
            
            return Promise.resolve({
                checkoutRequestId: 'MOCK-' + Date.now(),
                merchantRequestId: 'MOCK-MERCHANT-' + Date.now(),
                responseCode: '0',
                responseDescription: 'Success'
            });
        },

        checkMpesaStatus: function(checkoutRequestId) {
            if (window.MutsAPIConfig && window.MutsAPIConfig.isConnected()) {
                return this.fetchAPI('/payments/mpesa/status', {
                    method: 'POST',
                    body: JSON.stringify({ checkoutRequestId: checkoutRequestId })
                });
            }
            
            return Promise.resolve({
                status: 'completed',
                mpesaReceiptNumber: 'MOCK-REC-' + Date.now()
            });
        },

        // ============ PAYPAL ============
        createPaypalOrder: function(amount, currency) {
            if (window.MutsAPIConfig && window.MutsAPIConfig.isConnected()) {
                return this.fetchAPI('/payments/paypal/create-order', {
                    method: 'POST',
                    body: JSON.stringify({ amount: amount, currency: currency })
                });
            }
            
            return Promise.resolve({
                orderId: 'MOCK-ORDER-' + Date.now(),
                status: 'CREATED'
            });
        },

        capturePaypalOrder: function(orderId) {
            if (window.MutsAPIConfig && window.MutsAPIConfig.isConnected()) {
                return this.fetchAPI('/payments/paypal/capture', {
                    method: 'POST',
                    body: JSON.stringify({ orderId: orderId })
                });
            }
            
            return Promise.resolve({
                status: 'COMPLETED',
                captureId: 'MOCK-CAPTURE-' + Date.now()
            });
        },

        // ============ TRANSACTIONS ============
        getTransactions: function(filters) {
            if (window.MutsAPIConfig && window.MutsAPIConfig.isConnected()) {
                var params = [];
                if (filters && filters.status) params.push('status=' + filters.status);
                if (filters && filters.method) params.push('method=' + filters.method);
                var query = params.length ? '?' + params.join('&') : '';
                return this.fetchAPI('/payments/transactions' + query);
            }
            
            var results = mockTransactions.slice();
            if (filters) {
                if (filters.status) {
                    results = results.filter(function(t) { return t.status === filters.status; });
                }
                if (filters.method) {
                    results = results.filter(function(t) { return t.method === filters.method; });
                }
            }
            return Promise.resolve(results);
        },

        getTransaction: function(id) {
            if (window.MutsAPIConfig && window.MutsAPIConfig.isConnected()) {
                return this.fetchAPI('/payments/transactions/' + id);
            }
            
            var found = mockTransactions.filter(function(t) { return t.id === id; });
            return Promise.resolve(found[0] || null);
        },

        getTransactionSummary: function() {
            if (window.MutsAPIConfig && window.MutsAPIConfig.isConnected()) {
                return this.fetchAPI('/payments/transactions/summary');
            }
            
            var total = mockTransactions.reduce(function(acc, t) {
                return t.status === 'completed' ? acc + t.amount : acc;
            }, 0);
            var pending = mockTransactions.reduce(function(acc, t) {
                return t.status === 'pending' ? acc + t.amount : acc;
            }, 0);
            
            return Promise.resolve({
                total: total,
                pending: pending,
                completed: mockTransactions.filter(function(t) { return t.status === 'completed'; }).length,
                failed: mockTransactions.filter(function(t) { return t.status === 'failed'; }).length
            });
        },

        // ============ PAYOUTS (for guides/vendors) ============
        createPayout: function(recipientId, amount, method) {
            if (window.MutsAPIConfig && window.MutsAPIConfig.isConnected()) {
                return this.fetchAPI('/payments/payouts', {
                    method: 'POST',
                    body: JSON.stringify({
                        recipientId: recipientId,
                        amount: amount,
                        method: method
                    })
                });
            }
            
            return Promise.resolve({
                payoutId: 'PO-MOCK-' + Date.now(),
                status: 'pending'
            });
        },

        getPayouts: function(filters) {
            if (window.MutsAPIConfig && window.MutsAPIConfig.isConnected()) {
                return this.fetchAPI('/payments/payouts');
            }
            
            return Promise.resolve([]);
        },

        // ============ REFUNDS ============
        initiateRefund: function(transactionId, amount, reason) {
            if (window.MutsAPIConfig && window.MutsAPIConfig.isConnected()) {
                return this.fetchAPI('/payments/refunds', {
                    method: 'POST',
                    body: JSON.stringify({
                        transactionId: transactionId,
                        amount: amount,
                        reason: reason
                    })
                });
            }
            
            return Promise.resolve({
                refundId: 'REF-MOCK-' + Date.now(),
                status: 'processing'
            });
        },

        // ============ API ============
        fetchAPI: function(endpoint, options) {
            var baseURL = (window.MutsAPIConfig && window.MutsAPIConfig.getBaseURL) 
                ? window.MutsAPIConfig.getBaseURL() 
                : '/api';
            
            var defaultOptions = {
                headers: { 'Content-Type': 'application/json' }
            };
            
            var fetchOptions = Object.assign({}, defaultOptions, options);
            
            return fetch(baseURL + endpoint, fetchOptions)
                .then(function(response) {
                    if (!response.ok) throw new Error('API error: ' + response.status);
                    return response.json();
                })
                .catch(function(err) {
                    console.warn('[PaymentService] API unavailable:', err.message);
                    throw err;
                });
        },

        // ============ API CONTROL ============
        enableAPI: function() {
            console.log('[PaymentService] API mode enabled');
        },

        disableAPI: function() {
            console.log('[PaymentService] API mode disabled');
        },

        isAPILive: function() {
            return window.MutsAPIConfig && window.MutsAPIConfig.isConnected();
        }
    };

    window.MutsPaymentService = PaymentService;
})(window);