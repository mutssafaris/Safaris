/* Auth Module — Muts Safaris */
/* Security Enhanced - Token-Based Auth Ready */
(function () {
    if (window.mutsAuthInitialized) return;
    window.mutsAuthInitialized = true;

    var SESSION_KEY = 'muts_session';
    var USERS_KEY = 'muts_users';
    var BOOKINGS_KEY = 'muts_bookings';
    var FAVORITES_KEY = 'muts_favorites';
    var MESSAGES_KEY = 'muts_messages';
    var TRANSACTIONS_KEY = 'muts_transactions';
    var SESSION_EXPIRY_HOURS = 24;
    var TOKEN_REFRESH_BUFFER_MS = 5 * 60 * 1000; // Refresh 5 minutes before expiry

    var API_READY = false;
    var API_BASE_URL = '/api';
    var refreshTimer = null;

    function simpleHash(str) {
        var hash = 0;
        for (var i = 0; i < str.length; i++) {
            var char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString(16);
    }

    function generateSalt() {
        return Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
    }

    function hashPassword(password, salt) {
        var combined = salt + password + 'MUTS_SAFARIS_SALT';
        for (var i = 0; i < 10000; i++) {
            combined = simpleHash(combined);
        }
        return combined;
    }

    function getUsers() {
        return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    }

    function saveUsers(users) {
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }

    function getSession() {
        try {
            var session = JSON.parse(localStorage.getItem(SESSION_KEY));
            if (!session) return null;
            
            var expiresAt = new Date(session.expiresAt);
            if (expiresAt < new Date()) {
                handleTokenExpired();
                return null;
            }
            
            return session;
        } catch (e) {
            return null;
        }
    }

    function setSession(user, rememberMe, tokenData) {
        var expiryHours = rememberMe ? SESSION_EXPIRY_HOURS * 7 : SESSION_EXPIRY_HOURS;
        var expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + expiryHours);
        
        var token = tokenData ? tokenData.token : (generateSalt() + generateId());
        var refreshToken = tokenData ? tokenData.refreshToken : null;
        
        localStorage.setItem(SESSION_KEY, JSON.stringify({
            userId: user.id,
            name: user.name,
            email: user.email,
            token: token,
            refreshToken: refreshToken,
            loginTime: new Date().toISOString(),
            expiresAt: expiresAt.toISOString()
        }));
        
        scheduleTokenRefresh();
    }

    function handleTokenExpired() {
        clearTimeout(refreshTimer);
        localStorage.removeItem(SESSION_KEY);
        window.dispatchEvent(new CustomEvent('auth:expired'));
    }

    function scheduleTokenRefresh() {
        clearTimeout(refreshTimer);
        
        var session = getSession();
        if (!session) return;
        
        var expiresAt = new Date(session.expiresAt).getTime();
        var now = Date.now();
        var timeUntilExpiry = expiresAt - now - TOKEN_REFRESH_BUFFER_MS;
        
        if (timeUntilExpiry > 0) {
            refreshTimer = setTimeout(function() {
                refreshToken();
            }, timeUntilExpiry);
        } else {
            handleTokenExpired();
        }
    }

    function refreshToken() {
        var session = getSession();
        if (!session) return;
        
        if (API_READY && session.refreshToken) {
            fetchFromAPI('/auth/refresh', {
                method: 'POST',
                body: { refreshToken: session.refreshToken }
            }).then(function(response) {
                if (response.success && response.token) {
                    session.token = response.token;
                    if (response.refreshToken) {
                        session.refreshToken = response.refreshToken;
                    }
                    var expiresAt = new Date();
                    expiresAt.setHours(expiresAt.getHours() + SESSION_EXPIRY_HOURS);
                    session.expiresAt = expiresAt.toISOString();
                    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
                    scheduleTokenRefresh();
                    window.dispatchEvent(new CustomEvent('auth:refreshed'));
                } else {
                    handleTokenExpired();
                }
            }).catch(function() {
                handleTokenExpired();
            });
        } else {
            var expiresAt = new Date();
            expiresAt.setHours(expiresAt.getHours() + SESSION_EXPIRY_HOURS);
            session.expiresAt = expiresAt.toISOString();
            localStorage.setItem(SESSION_KEY, JSON.stringify(session));
            scheduleTokenRefresh();
        }
    }

    function generateId() {
        return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
    }

    function seedUserData(userId) {
        var bookings = JSON.parse(localStorage.getItem(BOOKINGS_KEY) || '[]');
        var existingUserBookings = bookings.filter(function(b) { return b.userId === userId; });
        
        if (existingUserBookings.length === 0) {
            bookings.push(
                { id: generateId(), userId: userId, destination: 'Maasai Mara Safari', checkin: '2026-04-18', checkout: '2026-04-24', adults: 2, children: 0, totalPrice: 2100, status: 'upcoming', createdAt: '2026-03-15' },
                { id: generateId(), userId: userId, destination: 'Amboseli Adventure', checkin: '2026-01-08', checkout: '2026-01-15', adults: 2, children: 1, totalPrice: 1960, status: 'completed', createdAt: '2025-12-20' }
            );
            localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
        }

        var messages = JSON.parse(localStorage.getItem(MESSAGES_KEY) || '[]');
        var existingUserMessages = messages.filter(function(m) { return m.userId === userId; });
        
        if (existingUserMessages.length === 0) {
            messages.push(
                { id: generateId(), userId: userId, from: 'Muts Safaris Team', subject: 'Welcome to Muts Safaris!', body: 'Hello! Welcome to your Muts Safaris dashboard. From here you can manage your trips, save favorites, and track all your bookings. Remember: Don\'t be a Tourist, be a Traveller!', read: false, createdAt: '2026-03-30' },
                { id: generateId(), userId: userId, from: 'Muts Safaris Team', subject: 'Your Maasai Mara Booking is Confirmed', body: 'Your booking for Maasai Mara Safari (Apr 18\u201324) has been confirmed. 2 adults, total $2,100. We look forward to hosting you on this incredible journey!', read: false, createdAt: '2026-03-15' },
                { id: generateId(), userId: userId, from: 'Muts Safaris Team', subject: 'Special Offer: 20% off Amboseli', body: 'Book an Amboseli adventure this month and get 20% off. Use code AMBOSELI20 at checkout. Experience elephants with Kilimanjaro as your backdrop.', read: true, createdAt: '2026-03-01' }
            );
            localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
        }

        var transactions = JSON.parse(localStorage.getItem(TRANSACTIONS_KEY) || '[]');
        var existingUserTransactions = transactions.filter(function(t) { return t.userId === userId; });
        
        if (existingUserTransactions.length === 0) {
            transactions.push(
                { id: generateId(), userId: userId, type: 'Booking', description: 'Maasai Mara Safari (6 nights)', amount: 2100, status: 'Pending', date: '2026-03-15' },
                { id: generateId(), userId: userId, type: 'Booking', description: 'Amboseli Adventure (7 nights)', amount: 1960, status: 'Completed', date: '2025-12-20' }
            );
            localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
        }
    }

    function fetchFromAPI(endpoint, options) {
        options = options || {};
        var session = getSession();
        
        if (!session) {
            return Promise.reject(new Error('No session'));
        }
        
        var expiresAt = new Date(session.expiresAt);
        var now = new Date();
        var timeUntilExpiry = expiresAt - now;
        
        if (timeUntilExpiry < TOKEN_REFRESH_BUFFER_MS && session.refreshToken) {
            return refreshToken().then(function() {
                var updatedSession = getSession();
                return doFetch(API_BASE_URL + endpoint, {
                    method: options.method || 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + updatedSession.token
                    },
                    body: options.body
                });
            });
        }
        
        return doFetch(API_BASE_URL + endpoint, {
            method: options.method || 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + session.token
            },
            body: options.body
        });
    }
    
    function doFetch(url, fetchOptions) {
        if (fetchOptions.body) {
            fetchOptions.body = JSON.stringify(fetchOptions.body);
        }
        
        return fetch(url, fetchOptions)
            .then(function(response) {
                if (response.status === 401) {
                    handleTokenExpired();
                    throw new Error('Session expired');
                }
                return response.json();
            })
            .then(function(data) {
                return data;
            })
            .catch(function(error) {
                console.error('[Auth API Error]', error);
                throw error;
            });
    }

    function login(email, password, rememberMe) {
        rememberMe = rememberMe || false;
        
        if (API_READY) {
            return fetchFromAPI('/auth/login', {
                method: 'POST',
                body: { email: email, password: password, rememberMe: rememberMe }
            }).then(function(response) {
                if (response.success) {
                    setSession(response.user, rememberMe, {
                        token: response.token,
                        refreshToken: response.refreshToken
                    });
                }
                return response;
            });
        }
        
        var users = getUsers();
        var user = users.find(function (u) { return u.email === email; });
        
        if (!user) {
            return Promise.resolve({ success: false, message: 'Invalid email or password.' });
        }
        
        var hashedInput = hashPassword(password, user.salt);
        if (hashedInput !== user.passwordHash) {
            return Promise.resolve({ success: false, message: 'Invalid email or password.' });
        }
        
        setSession(user, rememberMe);
        return Promise.resolve({ success: true });
    }

    function signup(name, email, password, extraData) {
        extraData = extraData || {};
        
        if (API_READY) {
            return fetchFromAPI('/auth/register', {
                method: 'POST',
                body: { 
                    name: name, 
                    email: email, 
                    password: password,
                    phone: extraData.phone,
                    country: extraData.country,
                    interest: extraData.interest,
                    newsletter: extraData.newsletter
                }
            }).then(function(response) {
                if (response.success) {
                    setSession(response.user, false, {
                        token: response.token,
                        refreshToken: response.refreshToken
                    });
                }
                return response;
            });
        }
        
        var users = getUsers();
        if (users.find(function (u) { return u.email === email; })) {
            return Promise.resolve({ success: false, message: 'An account with this email already exists.' });
        }
        
        var salt = generateSalt();
        var passwordHash = hashPassword(password, salt);
        
        var user = {
            id: generateId(),
            name: name,
            email: email,
            salt: salt,
            passwordHash: passwordHash,
            tier: 'Traveler Pro',
            phone: extraData.phone || '',
            country: extraData.country || '',
            interest: extraData.interest || '',
            newsletter: extraData.newsletter || false,
            role: 'user',
            emailVerified: false,
            createdAt: new Date().toISOString()
        };
        
        users.push(user);
        saveUsers(users);
        seedUserData(user.id);
        setSession(user, false);
        
        return Promise.resolve({ success: true });
    }

    function logout() {
        localStorage.removeItem(SESSION_KEY);
        
        if (API_READY) {
            fetchFromAPI('/auth/logout', { method: 'POST' }).catch(function() {});
        }
        
        window.location.href = isDashboardPage() ? '../../login.html' : 'login.html';
    }

    function isDashboardPage() {
        return window.location.pathname.indexOf('/pages/dashboard/') !== -1;
    }

    function getCurrentUser() {
        var session = getSession();
        if (!session) return null;
        
        if (API_READY) {
            return fetchFromAPI('/auth/me').catch(function() { return null; });
        }
        
        var users = getUsers();
        return users.find(function (u) { return u.id === session.userId; }) || null;
    }

    function requireAuth() {
        if (!getSession()) {
            window.location.href = isDashboardPage() ? '../../login.html' : 'login.html';
        }
    }

    function updateProfile(fields) {
        var session = getSession();
        if (!session) return false;
        
        if (API_READY) {
            return fetchFromAPI('/users/' + session.userId, {
                method: 'PUT',
                body: fields
            }).then(function(response) {
                return response.success;
            }).catch(function() { return false; });
        }
        
        var users = getUsers();
        var idx = users.findIndex(function (u) { return u.id === session.userId; });
        if (idx === -1) return false;
        
        Object.keys(fields).forEach(function (key) {
            if (key !== 'id' && key !== 'password' && key !== 'passwordHash' && key !== 'salt' && fields[key] !== undefined) {
                users[idx][key] = fields[key];
            }
        });
        
        saveUsers(users);
        session.name = users[idx].name;
        session.email = users[idx].email;
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        return true;
    }

    function changePassword(currentPwd, newPwd) {
        var session = getSession();
        if (!session) return Promise.resolve({ success: false, message: 'Not logged in.' });
        
        if (API_READY) {
            return fetchFromAPI('/auth/change-password', {
                method: 'POST',
                body: { currentPassword: currentPwd, newPassword: newPwd }
            });
        }
        
        var users = getUsers();
        var idx = users.findIndex(function (u) { return u.id === session.userId; });
        if (idx === -1) return Promise.resolve({ success: false, message: 'User not found.' });
        
        var hashedInput = hashPassword(currentPwd, users[idx].salt);
        if (hashedInput !== users[idx].passwordHash) {
            return Promise.resolve({ success: false, message: 'Current password is incorrect.' });
        }
        
        var newSalt = generateSalt();
        users[idx].salt = newSalt;
        users[idx].passwordHash = hashPassword(newPwd, newSalt);
        saveUsers(users);
        
        return Promise.resolve({ success: true });
    }

    function refreshSession() {
        var session = getSession();
        if (!session || API_READY) return;
        
        var expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + SESSION_EXPIRY_HOURS);
        session.expiresAt = expiresAt.toISOString();
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    }

    function updateHeaderAuthLinks() {
        var session = getSession();
        var loginLinks = document.querySelectorAll('.nav-login-link');
        var dashboardLinks = document.querySelectorAll('.nav-dashboard-link');
        
        loginLinks.forEach(function (el) {
            el.style.display = session ? 'none' : '';
        });
        
        dashboardLinks.forEach(function (el) {
            el.style.display = session ? '' : 'none';
        });
    }

    function enableAPI(baseUrl) {
        API_READY = true;
        if (baseUrl) {
            API_BASE_URL = baseUrl;
        }
    }

    function disableAPI() {
        API_READY = false;
    }

    function isAPILive() {
        return API_READY;
    }

    window.MutsAuth = {
        login: login,
        signup: signup,
        logout: logout,
        getCurrentUser: getCurrentUser,
        requireAuth: requireAuth,
        getSession: getSession,
        updateProfile: updateProfile,
        changePassword: changePassword,
        updateHeaderAuthLinks: updateHeaderAuthLinks,
        enableAPI: enableAPI,
        disableAPI: disableAPI,
        isAPILive: isAPILive,
        refreshToken: refreshToken,
        scheduleTokenRefresh: scheduleTokenRefresh,
        isTokenExpired: handleTokenExpired
    };

    document.addEventListener('DOMContentLoaded', function () {
        updateHeaderAuthLinks();
        
        var session = getSession();
        if (session) {
            scheduleTokenRefresh();
        }
    });
    
    window.addEventListener('beforeunload', function() {
        clearTimeout(refreshTimer);
    });
})();
