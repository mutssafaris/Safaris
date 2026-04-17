/**
 * Dashboard Initialization - Muts Safaris
 * Auto-loads security and utility libraries for all dashboard pages
 * 
 * Include this ONE script in any dashboard page:
 *   <script src="js/init-dashboard.js"></script>
 * 
 * Wait for init before loading data:
 *   if (window._dashboardReady) { loadData(); }
 */
(function() {
    'use strict';

    // Lazy-load utilities (only load once)
    var loaded = window._dashboardInitDone;
    if (loaded) return;
    window._dashboardInitDone = true;
    window._dashboardReady = false;

    var libs = [
        '../../js/cache.js',
        '../../js/validation.js',
        '../../js/sw-register.js'
    ];

    var loadedCount = 0;
    libs.forEach(function(src) {
        var exists = document.querySelector('script[src*="' + src.split('/').pop() + '"]');
        if (exists) {
            loadedCount++;
            return;
        }
        var s = document.createElement('script');
        s.src = src;
        s.async = false;
        s.onload = function() { 
            loadedCount++; 
            checkReady();
        };
        s.onerror = function() { 
            console.warn('[Init] Failed:', src); 
            checkReady();
        };
        (document.head || document.getElementsByTagName('head')[0]).appendChild(s);
    });

    function checkReady() {
        // Mark ready after all libs load (with timeout)
        setTimeout(function() {
            window._dashboardReady = true;
            console.log('[Init] Dashboard ready');
            
            // Trigger custom event for pages to listen
            window.dispatchEvent(new CustomEvent('dashboardReady'));
        }, 500);
    }

    // Fallback if no libs to load
    if (loadedCount === libs.length) {
        checkReady();
    }

    console.log('[Init] Dashboard utilities loaded');
})();
