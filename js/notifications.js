/* Notifications Service - Muts Safaris */
/* Handles in-app notifications and preferences */
(function() {
    'use strict';
    
    var NotificationService = {
        _notifications: [],
        _unreadCount: 0,
        _preferences: null,
        
        // ============ NOTIFICATIONS ============
        
        /**
         * Get user notifications
         */
        getNotifications: function(unreadOnly) {
            var self = this;
            var baseURL = this._getBaseURL();
            
            var url = baseURL + '/notifications';
            if (unreadOnly) url += '?unreadOnly=true';
            
            return fetch(url, this._getAuthHeaders())
                .then(function(response) {
                    if (!response.ok) throw new Error('Failed to fetch notifications');
                    return response.json();
                })
                .then(function(data) {
                    self._notifications = data;
                    return data;
                })
                .catch(function(err) {
                    console.warn('[NotificationService] API unavailable:', err.message);
                    return self._getLocalNotifications();
                });
        },
        
        /**
         * Get unread count
         */
        getUnreadCount: function() {
            var self = this;
            var baseURL = this._getBaseURL();
            
            return fetch(baseURL + '/notifications/unread-count', this._getAuthHeaders())
                .then(function(response) {
                    if (!response.ok) throw new Error('Failed to get count');
                    return response.json();
                })
                .then(function(data) {
                    self._unreadCount = data.count || 0;
                    return data.count;
                })
                .catch(function() {
                    return self._getLocalUnreadCount();
                });
        },
        
        /**
         * Mark notification as read
         */
        markAsRead: function(notificationId) {
            var baseURL = this._getBaseURL();
            
            return fetch(baseURL + '/notifications/' + notificationId + '/read', {
                method: 'PUT',
                headers: this._getAuthHeaders()
            })
            .then(function(response) {
                if (!response.ok) throw new Error('Failed to mark as read');
                return response.json();
            })
            .then(function(data) {
                // Update local state
                NotificationService._updateLocalRead(notificationId, true);
                return data;
            });
        },
        
        /**
         * Mark all as read
         */
        markAllAsRead: function() {
            var baseURL = this._getBaseURL();
            
            return fetch(baseURL + '/notifications/read-all', {
                method: 'PUT',
                headers: this._getAuthHeaders()
            })
            .then(function(response) {
                if (!response.ok) throw new Error('Failed to mark all as read');
                return response.json();
            })
            .then(function(data) {
                NotificationService._unreadCount = 0;
                NotificationService._markAllLocalRead();
                return data;
            });
        },
        
        /**
         * Delete notification
         */
        deleteNotification: function(notificationId) {
            var baseURL = this._getBaseURL();
            
            return fetch(baseURL + '/notifications/' + notificationId, {
                method: 'DELETE',
                headers: this._getAuthHeaders()
            })
            .then(function(response) {
                if (!response.ok) throw new Error('Failed to delete');
                NotificationService._removeLocalNotification(notificationId);
                return { success: true };
            });
        },
        
        // ============ PREFERENCES ============
        
        /**
         * Get notification preferences
         */
        getPreferences: function() {
            var self = this;
            var baseURL = this._getBaseURL();
            
            return fetch(baseURL + '/notifications/preferences', this._getAuthHeaders())
                .then(function(response) {
                    if (!response.ok) throw new Error('Failed to get preferences');
                    return response.json();
                })
                .then(function(data) {
                    self._preferences = data;
                    return data;
                })
                .catch(function() {
                    return self._getLocalPreferences();
                });
        },
        
        /**
         * Update notification preferences
         */
        updatePreferences: function(prefs) {
            var baseURL = this._getBaseURL();
            
            return fetch(baseURL + '/notifications/preferences', {
                method: 'PUT',
                headers: this._getAuthHeaders(),
                body: JSON.stringify(prefs)
            })
            .then(function(response) {
                if (!response.ok) throw new Error('Failed to update preferences');
                return response.json();
            })
            .then(function(data) {
                NotificationService._preferences = data;
                NotificationService._saveLocalPreferences(data);
                return data;
            });
        },
        
        // ============ UTILITIES ============
        
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
        
        _getLocalNotifications: function() {
            try {
                return JSON.parse(localStorage.getItem('muts_notifications') || '[]');
            } catch (e) { return []; }
        },
        
        _getLocalUnreadCount: function() {
            var notifications = this._getLocalNotifications();
            return notifications.filter(function(n) { return !n.isRead; }).length;
        },
        
        _getLocalPreferences: function() {
            try {
                return JSON.parse(localStorage.getItem('muts_notification_prefs') || '{"emailEnabled": true, "smsEnabled": false, "bookingConfirmations": true, "paymentUpdates": true, "bookingReminders": true, "marketingEmails": false, "priceAlerts": false}');
            } catch (e) { 
                return { emailEnabled: true, smsEnabled: false, bookingConfirmations: true, paymentUpdates: true, bookingReminders: true, marketingEmails: false, priceAlerts: false };
            }
        },
        
        _saveLocalPreferences: function(prefs) {
            localStorage.setItem('muts_notification_prefs', JSON.stringify(prefs));
        },
        
        _updateLocalRead: function(id, isRead) {
            var notifications = this._getLocalNotifications();
            notifications.forEach(function(n) {
                if (n.id === id) n.isRead = isRead;
            });
            localStorage.setItem('muts_notifications', JSON.stringify(notifications));
        },
        
        _markAllLocalRead: function() {
            var notifications = this._getLocalNotifications();
            notifications.forEach(function(n) { n.isRead = true; });
            localStorage.setItem('muts_notifications', JSON.stringify(notifications));
        },
        
        _removeLocalNotification: function(id) {
            var notifications = this._getLocalNotifications();
            notifications = notifications.filter(function(n) { return n.id !== id; });
            localStorage.setItem('muts_notifications', JSON.stringify(notifications));
        },
        
        /**
         * Create local notification (for testing/demo)
         */
        createNotification: function(type, title, message, linkUrl) {
            var notification = {
                id: Date.now(),
                type: type,
                title: title,
                message: message,
                linkUrl: linkUrl || null,
                isRead: false,
                createdAt: new Date().toISOString()
            };
            
            var notifications = this._getLocalNotifications();
            notifications.unshift(notification);
            localStorage.setItem('muts_notifications', JSON.stringify(notifications.slice(0, 50)));
            
            // Trigger UI update
            if (window.MutsNotificationUI) {
                window.MutsNotificationUI.refresh();
            }
            
            return notification;
        }
    };
    
    // Expose to global
    window.MutsNotificationService = NotificationService;
    
})();