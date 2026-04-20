/* Auth Guard - Protects dashboard pages */
(function() {
    'use strict';
    
    var LOGIN_PATH = '../../login.html';
    var SESSION_KEY = 'muts_session';
    
    function getSession() {
        try {
            var session = JSON.parse(localStorage.getItem(SESSION_KEY));
            if (!session) return null;
            var expiresAt = new Date(session.expiresAt);
            if (expiresAt < new Date()) {
                handleExpired();
                return null;
            }
            return session;
        } catch (e) {
            return null;
        }
    }
    
    function handleExpired() {
        localStorage.removeItem(SESSION_KEY);
        window.dispatchEvent(new CustomEvent('auth:expired'));
        redirectToLogin();
    }
    
    function redirectToLogin() {
        var currentPath = window.location.pathname;
        var isSubDir = currentPath.includes('/pages/dashboard/') && 
                       !currentPath.endsWith('/pages/dashboard/index.html');
        var loginUrl = isSubDir ? '../../login.html' : LOGIN_PATH;
        window.location.href = loginUrl;
    }
    
    function protect() {
        var session = getSession();
        if (!session) {
            redirectToLogin();
            return false;
        }
        return true;
    }
    
    window.addEventListener('auth:expired', function() {
        redirectToLogin();
    });
    
    window.MutsAuthGuard = {
        protect: protect,
        check: getSession,
        logout: function() {
            localStorage.removeItem(SESSION_KEY);
            redirectToLogin();
        }
    };
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', protect);
    } else {
        protect();
    }
})();
