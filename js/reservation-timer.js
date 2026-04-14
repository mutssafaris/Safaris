/* Reservation Timer - Muts Safaris */
/* Countdown timer for 15-min reservation holds */
(function() {
    if (window.ReservationTimer) return;
    
    var activeTimers = {};
    
    /**
     * Initialize a countdown timer
     * @param {string} containerId - ID of the container element
     * @param {Object} options - Configuration options
     * @param {Function} options.onExpire - Called when timer expires
     * @param {Function} options.onUpdate - Called on each tick (remaining seconds)
     * @param {Function} options.onStart - Called when timer starts
     * @returns {Object} - Timer instance
     */
    function init(containerId, options) {
        options = options || {};
        
        var timer = {
            id: containerId,
            interval: null,
            onExpire: options.onExpire || function() {},
            onUpdate: options.onUpdate || function() {},
            onStart: options.onStart || function() {},
            expiresAt: null,
            remaining: 0,
            
            start: function(expiresAt) {
                var self = this;
                
                // Clear any existing timer
                if (this.interval) {
                    clearInterval(this.interval);
                }
                
                this.expiresAt = new Date(expiresAt);
                
                var update = function() {
                    var now = new Date();
                    var diff = self.expiresAt - now;
                    
                    if (diff <= 0) {
                        // Expired
                        self.remaining = 0;
                        clearInterval(self.interval);
                        self.interval = null;
                        delete activeTimers[containerId];
                        self.onExpire();
                        return;
                    }
                    
                    self.remaining = Math.floor(diff / 1000);
                    self.onUpdate(self.remaining);
                };
                
                // Initial update
                update();
                
                // Start interval
                this.interval = setInterval(update, 1000);
                activeTimers[containerId] = this;
                this.onStart();
                
                return this;
            },
            
            stop: function() {
                if (this.interval) {
                    clearInterval(this.interval);
                    this.interval = null;
                }
                delete activeTimers[this.id];
                return this;
            },
            
            getRemaining: function() {
                return this.remaining;
            },
            
            isExpired: function() {
                return this.remaining <= 0;
            }
        };
        
        return timer;
    }
    
    /**
     * Format seconds into mm:ss or hh:mm:ss
     * @param {number} seconds - Remaining seconds
     * @returns {Object} - { minutes, seconds, formatted }
     */
    function formatTime(seconds) {
        var mins = Math.floor(seconds / 60);
        var secs = seconds % 60;
        var hours = Math.floor(mins / 60);
        
        if (hours > 0) {
            mins = mins % 60;
        }
        
        var formatted = (hours > 0 ? hours + ':' : '') + 
                        (mins < 10 ? '0' : '') + mins + ':' + 
                        (secs < 10 ? '0' : '') + secs;
        
        return {
            minutes: mins,
            seconds: secs,
            hours: hours,
            formatted: formatted
        };
    }
    
    /**
     * Create default HTML for reservation timer display
     * @param {number} remainingSeconds - Remaining seconds
     * @returns {string} - HTML string
     */
    function createTimerHTML(remainingSeconds) {
        var time = formatTime(remainingSeconds);
        
        return '<div class="reservation-timer">' +
            '<div class="timer-icon">' +
                '<svg viewBox="0 0 24 24" width="20" height="20">' +
                    '<path fill="currentColor" d="M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z"/>' +
                '</svg>' +
            '</div>' +
            '<div class="timer-content">' +
                '<span class="timer-label">Reservation held for</span>' +
                '<span class="timer-countdown">' + time.formatted + '</span>' +
            '</div>' +
        '</div>';
    }
    
    /**
     * Update timer display in container
     * @param {string} containerId - Container element ID
     * @param {number} remainingSeconds - Remaining seconds
     */
    function updateDisplay(containerId, remainingSeconds) {
        var container = document.getElementById(containerId);
        if (!container) return;
        
        var time = formatTime(remainingSeconds);
        var countdown = container.querySelector('.timer-countdown');
        
        if (countdown) {
            countdown.textContent = time.formatted;
        }
        
        // Add urgent class when less than 2 minutes
        var timer = container.querySelector('.reservation-timer');
        if (timer) {
            if (remainingSeconds < 120) {
                timer.classList.add('urgent');
            } else {
                timer.classList.remove('urgent');
            }
        }
    }
    
    /**
     * Show reservation expiring message
     * @param {string} containerId - Container element ID
     */
    function showExpiredMessage(containerId) {
        var container = document.getElementById(containerId);
        if (!container) return;
        
        container.innerHTML = '<div class="reservation-expired">' +
            '<svg viewBox="0 0 24 24" width="24" height="24">' +
                '<path fill="currentColor" d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z"/>' +
            '</svg>' +
            '<span>Your reservation has expired. Please complete your booking again.</span>' +
        '</div>';
    }
    
    // Public API
    window.ReservationTimer = {
        init: init,
        formatTime: formatTime,
        createTimerHTML: createTimerHTML,
        updateDisplay: updateDisplay,
        showExpiredMessage: showExpiredMessage,
        
        /**
         * Quick start a timer with default options
         * @param {string} containerId - Container element ID
         * @param {string} expiresAt - Expiration datetime
         * @param {Function} onExpire - Callback when expired
         */
        start: function(containerId, expiresAt, onExpire) {
            var container = document.getElementById(containerId);
            if (!container) return null;
            
            // Show initial timer
            container.innerHTML = createTimerHTML(15 * 60); // Show 15:00 initially
            
            return init(containerId, {
                onExpire: function() {
                    showExpiredMessage(containerId);
                    if (onExpire) onExpire();
                },
                onUpdate: function(remaining) {
                    updateDisplay(containerId, remaining);
                }
            }).start(expiresAt);
        },
        
        /**
         * Stop all active timers
         */
        stopAll: function() {
            for (var id in activeTimers) {
                if (activeTimers.hasOwnProperty(id)) {
                    activeTimers[id].stop();
                }
            }
        }
    };
})();