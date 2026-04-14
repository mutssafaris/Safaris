/* Notification UI Component - Muts Safaris */
/* Bell icon with notification dropdown */
(function() {
    if (window.MutsNotificationUI) return;
    
    var NotificationUI = {
        container: null,
        badge: null,
        dropdown: null,
        list: null,
        
        /**
         * Initialize the notification UI
         * @param {string} containerId - ID of container element
         */
        init: function(containerId) {
            var self = this;
            this.container = document.getElementById(containerId);
            
            if (!this.container) {
                console.error('[NotificationUI] Container not found:', containerId);
                return;
            }
            
            // Render the UI
            this._render();
            
            // Load initial data
            this.refresh();
            
            // Auto-refresh every 30 seconds
            setInterval(function() {
                self.refresh();
            }, 30000);
        },
        
        /**
         * Render the notification UI
         */
        _render: function() {
            var self = this;
            
            var html = 
                '<div class="notification-bell" id="notification-bell">' +
                    '<svg viewBox="0 0 24 24" width="24" height="24">' +
                        '<path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>' +
                    '</svg>' +
                    '<span class="notification-badge" id="notification-badge" style="display: none;">0</span>' +
                '</div>' +
                '<div class="notification-dropdown" id="notification-dropdown">' +
                    '<div class="notification-header">' +
                        '<span class="notification-title">Notifications</span>' +
                        '<button class="mark-all-read" id="mark-all-read">Mark all read</button>' +
                    '</div>' +
                    '<div class="notification-list" id="notification-list">' +
                        '<div class="notification-empty">No notifications</div>' +
                    '</div>' +
                    '<div class="notification-footer">' +
                        '<a href="/pages/dashboard/notifications.html">View all notifications</a>' +
                    '</div>' +
                '</div>';
            
            this.container.innerHTML = html;
            
            // Get references
            this.bell = this.container.querySelector('#notification-bell');
            this.badge = this.container.querySelector('#notification-badge');
            this.dropdown = this.container.querySelector('#notification-dropdown');
            this.list = this.container.querySelector('#notification-list');
            this.markAllBtn = this.container.querySelector('#mark-all-read');
            
            // Event listeners
            this.bell.addEventListener('click', function(e) {
                e.stopPropagation();
                self._toggleDropdown();
            });
            
            this.markAllBtn.addEventListener('click', function() {
                self._markAllAsRead();
            });
            
            // Close on outside click
            document.addEventListener('click', function(e) {
                if (!self.container.contains(e.target)) {
                    self.dropdown.classList.remove('show');
                }
            });
        },
        
        /**
         * Toggle dropdown visibility
         */
        _toggleDropdown: function() {
            this.dropdown.classList.toggle('show');
            
            if (this.dropdown.classList.contains('show')) {
                this.refresh();
            }
        },
        
        /**
         * Refresh notifications from API
         */
        refresh: function() {
            var self = this;
            
            // Get unread count
            if (window.MutsNotificationService) {
                window.MutsNotificationService.getUnreadCount().then(function(count) {
                    self._updateBadge(count);
                });
                
                window.MutsNotificationService.getNotifications().then(function(notifications) {
                    self._renderList(notifications);
                });
            } else {
                this._renderList(this._getLocalNotifications());
            }
        },
        
        /**
         * Update badge count
         */
        _updateBadge: function(count) {
            if (count > 0) {
                this.badge.textContent = count > 99 ? '99+' : count;
                this.badge.style.display = 'block';
            } else {
                this.badge.style.display = 'none';
            }
        },
        
        /**
         * Render notification list
         */
        _renderList: function(notifications) {
            var self = this;
            
            if (!notifications || notifications.length === 0) {
                this.list.innerHTML = '<div class="notification-empty">No notifications</div>';
                return;
            }
            
            // Show only first 10
            var displayNotifications = notifications.slice(0, 10);
            
            var html = '';
            displayNotifications.forEach(function(notif) {
                var icon = self._getTypeIcon(notif.type);
                var timeAgo = self._getTimeAgo(notif.createdAt);
                
                html += 
                    '<div class="notification-item' + (notif.isRead ? '' : ' unread') + '" data-id="' + notif.id + '">' +
                        '<div class="notification-icon">' + icon + '</div>' +
                        '<div class="notification-content">' +
                            '<div class="notification-item-title">' + notif.title + '</div>' +
                            '<div class="notification-message">' + notif.message + '</div>' +
                            '<div class="notification-time">' + timeAgo + '</div>' +
                        '</div>' +
                        '<button class="notification-delete" data-id="' + notif.id + '">&times;</button>' +
                    '</div>';
            });
            
            this.list.innerHTML = html;
            
            // Add click handlers
            this.list.querySelectorAll('.notification-item').forEach(function(item) {
                item.addEventListener('click', function(e) {
                    if (e.target.classList.contains('notification-delete')) {
                        self._deleteNotification(e.target.dataset.id);
                    } else {
                        self._markAsRead(item.dataset.id);
                        
                        // Follow link if present
                        var notif = notifications.find(function(n) { return n.id == item.dataset.id; });
                        if (notif && notif.linkUrl) {
                            window.location.href = notif.linkUrl;
                        }
                    }
                });
            });
        },
        
        /**
         * Get icon for notification type
         */
        _getTypeIcon: function(type) {
            var icons = {
                'booking': '<svg viewBox="0 0 24 24"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"/></svg>',
                'payment': '<svg viewBox="0 0 24 24"><path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/></svg>',
                'reminder': '<svg viewBox="0 0 24 24"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>',
                'system': '<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>'
            };
            return icons[type] || icons['system'];
        },
        
        /**
         * Format time ago
         */
        _getTimeAgo: function(dateString) {
            var date = new Date(dateString);
            var now = new Date();
            var diff = (now - date) / 1000; // seconds
            
            if (diff < 60) return 'Just now';
            if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
            if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
            if (diff < 604800) return Math.floor(diff / 86400) + 'd ago';
            return date.toLocaleDateString();
        },
        
        /**
         * Mark notification as read
         */
        _markAsRead: function(id) {
            var self = this;
            if (window.MutsNotificationService) {
                window.MutsNotificationService.markAsRead(id).then(function() {
                    self.refresh();
                });
            }
        },
        
        /**
         * Mark all as read
         */
        _markAllAsRead: function() {
            var self = this;
            if (window.MutsNotificationService) {
                window.MutsNotificationService.markAllAsRead().then(function() {
                    self.refresh();
                });
            }
        },
        
        /**
         * Delete notification
         */
        _deleteNotification: function(id) {
            var self = this;
            if (window.MutsNotificationService) {
                window.MutsNotificationService.deleteNotification(id).then(function() {
                    self.refresh();
                });
            }
        },
        
        /**
         * Get local notifications (fallback)
         */
        _getLocalNotifications: function() {
            try {
                return JSON.parse(localStorage.getItem('muts_notifications') || '[]');
            } catch (e) { return []; }
        }
    };
    
    // Auto-init if data attribute present
    document.addEventListener('DOMContentLoaded', function() {
        var autoInit = document.querySelector('[data-auto-init="notification-ui"]');
        if (autoInit) {
            NotificationUI.init(autoInit.id || 'notification-ui');
        }
    });
    
    window.MutsNotificationUI = NotificationUI;
})();