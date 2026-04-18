/**
 * Unit Tests - Muts Safaris
 * Simple test runner for utility functions
 * Run: Include this file and call runTests()
 */
(function() {
    'use strict';

    var TestRunner = {
        passed: 0,
        failed: 0,
        results: [],

        assert: function(condition, message) {
            if (condition) {
                this.passed++;
                this.results.push({ status: 'pass', message: message });
                console.log('✅ ' + message);
            } else {
                this.failed++;
                this.results.push({ status: 'fail', message: message });
                console.error('❌ ' + message);
            }
        },

        assertEqual: function(actual, expected, message) {
            var condition = actual === expected;
            this.assert(condition, message + ' (expected: ' + expected + ', got: ' + actual + ')');
        },

        assertNotEqual: function(actual, expected, message) {
            var condition = actual !== expected;
            this.assert(condition, message);
        },

        assertTrue: function(value, message) {
            this.assert(value === true, message);
        },

        assertFalse: function(value, message) {
            this.assert(value === false, message);
        },

        summary: function() {
            var total = this.passed + this.failed;
            console.log('\n========== TEST SUMMARY ==========');
            console.log('Total: ' + total + ' | Passed: ' + this.passed + ' | Failed: ' + this.failed);
            console.log('====================================\n');
            return { passed: this.passed, failed: this.failed, total: total };
        },

        reset: function() {
            this.passed = 0;
            this.failed = 0;
            this.results = [];
        }
    };

    // Test suites
    var tests = {
        /**
         * Validation Tests
         */
        validation: function() {
            console.log('\n--- Validation Tests ---');
            
            // Test isEmail
            TestRunner.assertTrue(window.MutsValidation.isEmail('test@example.com'), 'Valid email passes');
            TestRunner.assertFalse(window.MutsValidation.isEmail('invalid'), 'Invalid email fails');
            TestRunner.assertFalse(window.MutsValidation.isEmail(''), 'Empty string fails');
            
            // Test isPhone
            TestRunner.assertTrue(window.MutsValidation.isPhone('+254700000000'), 'Valid phone passes');
            TestRunner.assertFalse(window.MutsValidation.isPhone('123'), 'Short number fails');
            
            // Test isRequired
            TestRunner.assertTrue(window.MutsValidation.isRequired('test'), 'Non-empty string required');
            TestRunner.assertFalse(window.MutsValidation.isRequired(''), 'Empty string fails');
            TestRunner.assertFalse(window.MutsValidation.isRequired(null), 'Null fails');
            TestRunner.assertFalse(window.MutsValidation.isRequired([]), 'Empty array fails');
            
            // Test isLength
            TestRunner.assertTrue(window.MutsValidation.isLength('hello', 3, 10), 'Valid length passes');
            TestRunner.assertFalse(window.MutsValidation.isLength('hi', 5, 10), 'Too short fails');
            
            // Test sanitize (XSS prevention)
            var sanitized = window.MutsValidation.sanitize('<script>alert("xss")</script>');
            TestRunner.assertEqual(sanitized.indexOf('<script>'), -1, 'Script tags removed');
        },

        /**
         * Cache Tests
         */
        cache: function() {
            console.log('\n--- Cache Tests ---');
            
            // Clear any existing cache
            window.MutsCache.clear();
            
            // Test set and get
            window.MutsCache.set('test-key', { value: 'test-data' }, 60000);
            var data = window.MutsCache.get('test-key');
            TestRunner.assertTrue(data && data.value === 'test-data', 'Cache set/get works');
            
            // Test has
            TestRunner.assertTrue(window.MutsCache.has('test-key'), 'has() returns true for existing key');
            TestRunner.assertFalse(window.MutsCache.has('non-existent'), 'has() returns false for missing key');
            
            // Test remove
            window.MutsCache.remove('test-key');
            TestRunner.assertFalse(window.MutsCache.has('test-key'), 'remove() deletes key');
            
            // Test stats
            window.MutsCache.set('stat-test', 'value', 60000);
            var stats = window.MutsCache.stats();
            TestRunner.assertTrue(stats.total >= 0, 'stats() returns object');
            
            // Test clear
            window.MutsCache.clear();
            TestRunner.assertFalse(window.MutsCache.has('stat-test'), 'clear() removes all');
        },

        /**
         * Rate Limiter Tests
         */
        rateLimiter: function() {
            console.log('\n--- Rate Limiter Tests ---');
            
            // Reset limiter
            window.MutsRateLimiter.clear('test-api');
            window.MutsRateLimiter.setLimit('test-api', 5, 60000);
            
            // Test check (allowed)
            var check1 = window.MutsRateLimiter.check('test-api');
            TestRunner.assertTrue(check1.allowed, 'First request allowed');
            
            // Record requests
            for (var i = 0; i < 4; i++) {
                window.MutsRateLimiter.record('test-api');
            }
            
            // Should be blocked now (5 limit, 5 recorded)
            var check2 = window.MutsRateLimiter.check('test-api');
            TestRunner.assertFalse(check2.allowed, 'Limit exceeded - request blocked');
            
            // Test getRetryAfter
            var retry = window.MutsRateLimiter.getRetryAfter('test-api');
            TestRunner.assertTrue(retry > 0, 'RetryAfter returns positive value');
            
            // Reset
            window.MutsRateLimiter.clear('test-api');
        }
    };

    /**
     * Run all tests
     */
    window.runTests = function() {
        console.log('\n========== RUNNING UNIT TESTS ==========\n');
        TestRunner.reset();
        
        // Run each test suite
        if (window.MutsValidation) {
            try { tests.validation(); } catch(e) { console.error('Validation tests error:', e); }
        } else {
            console.warn('MutsValidation not found, skipping');
        }
        
        if (window.MutsCache) {
            try { tests.cache(); } catch(e) { console.error('Cache tests error:', e); }
        } else {
            console.warn('MutsCache not found, skipping');
        }
        
        if (window.MutsRateLimiter) {
            try { tests.rateLimiter(); } catch(e) { console.error('RateLimiter tests error:', e); }
        } else {
            console.warn('MutsRateLimiter not found, skipping');
        }
        
        return TestRunner.summary();
    };

    // Auto-run tests if ?test=true in URL
    if (window.location.search.indexOf('test=true') !== -1) {
        window.addEventListener('load', function() {
            setTimeout(runTests, 1000);
        });
    }

    window.TestRunner = TestRunner;
})();