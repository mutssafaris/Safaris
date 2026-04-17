/**
 * Dashboard Initialization - Muts Safaris
 * Auto-loads security and utility libraries for all dashboard pages
 * 
 * Include this ONE script in any dashboard page:
 *   <script src="js/init-dashboard.js"></script>
 */
(function() {
    'use strict';

    // Lazy-load utilities (only load once)
    var loaded = window._dashboardInitDone;
    if (loaded) return;
    window._dashboardInitDone = true;

    var libs = [
        '../../js/cache.js',
        '../../js/validation.js',
        '../../js/sw-register.js'
    ];

    var loadedCount = 0;
    libs.forEach(function(src) {
        var exists = document.querySelector('script[src*="' + src + '"]');
        if (exists) {
            loadedCount++;
            return;
        }
        var s = document.createElement('script');
        s.src = src;
        s.async = false;
        s.onload = function() { loadedCount++; };
        s.onerror = function() { console.warn('[Init] Failed:', src); };
        (document.head || document.getElementsByTagName('head')[0]).appendChild(s);
    });

    // Load services index
    var servicesDone = document.querySelector('script[src*="services/index.js"]');
    if (!servicesDone) {
        var sv = document.createElement('script');
        sv.src = '../../js/services/index.js';
        sv.async = false;
        (document.head || document.getElementsByTagName('head')[0]).appendChild(sv);
    }

    console.log('[Init] Dashboard utilities loaded');
})();
