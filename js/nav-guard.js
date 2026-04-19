/* Navigation Guard - Muts Safaris */
/* Protects dashboard pages from unauthenticated access */
/* Note: login.html has built-in data-auth handling; this file provides utilities for other pages */
(function () {
    var EXEMPT_PAGES = [
        'pages/dashboard/contact.html'
    ];

    function isProtectedPage(href) {
        if (!href) return false;
        
        if (EXEMPT_PAGES.some(function (p) { return href.includes(p); })) {
            return false;
        }
        
        return href.includes('pages/dashboard/');
    }

    function requireAuth(e) {
        var link = e.currentTarget;
        var href = link.getAttribute('href');
        
        if (!href || href.startsWith('#') || href.startsWith('http')) {
            return false;
        }

        var authAttr = link.getAttribute('data-auth');
        
        if (authAttr === 'required') {
            e.preventDefault();
            showAuthModal();
            return true;
        }

        if (authAttr !== 'optional' && isProtectedPage(href)) {
            if (!window.MutsAuth || !window.MutsAuth.getSession()) {
                e.preventDefault();
                showAuthModal();
                return true;
            }
        }
        
        return false;
    }

    function showAuthModal() {
        var overlay = document.getElementById('auth-overlay');
        if (overlay) {
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        } else if (window.MutsAuth && window.MutsAuth.getSession && !window.MutsAuth.getSession()) {
            window.location.href = 'login.html';
        }
    }

    window.MutsNavGuard = {
        requireAuth: requireAuth,
        isProtectedPage: isProtectedPage
    };

    console.log('[NavGuard] Loaded');
})();