/* Booking Management UI - Muts Safaris */
/* Self-service booking modification and cancellation */
(function() {
    if (window.MutsBookingManagement) return;
    
    var BookingManagement = {
        
        /**
         * Initialize booking management for a booking
         * @param {string} bookingId - Booking ID
         * @param {Object} options - Configuration
         */
        init: function(bookingId, options) {
            this.bookingId = bookingId;
            this.options = options || {};
            this._loadBooking();
        },
        
        /**
         * Load booking details
         */
        _loadBooking: function() {
            var self = this;
            
            if (window.MutsBookingsService) {
                window.MutsBookingsService.getById(this.bookingId).then(function(booking) {
                    self.booking = booking;
                    self._checkCapabilities();
                });
            }
        },
        
        /**
         * Check what actions are available
         */
        _checkCapabilities: function() {
            var self = this;
            
            if (window.MutsBookingsService) {
                window.MutsBookingsService.canCancel(this.bookingId).then(function(result) {
                    self.canCancel = result.canCancel;
                });
                
                window.MutsBookingsService.canModify(this.bookingId).then(function(result) {
                    self.canModify = result.canModify;
                });
            }
        },
        
        /**
         * Show cancel confirmation modal
         */
        showCancelModal: function() {
            var self = this;
            
            var modal = document.createElement('div');
            modal.className = 'booking-modal';
            modal.innerHTML = 
                '<div class="modal-content">' +
                    '<div class="modal-header">' +
                        '<h2>Cancel Booking</h2>' +
                        '<button class="modal-close">&times;</button>' +
                    '</div>' +
                    '<div class="modal-body">' +
                        '<p>Are you sure you want to cancel this booking?</p>' +
                        '<div class="booking-info">' +
                            '<p><strong>Destination:</strong> ' + (this.booking.destination || '') + '</p>' +
                            '<p><strong>Check-in:</strong> ' + (this.booking.checkin || '') + '</p>' +
                            '<p><strong>Total:</strong> $' + (this.booking.totalPrice || 0) + '</p>' +
                        '</div>' +
                        '<div class="refund-preview" id="refund-preview">' +
                            '<p>Calculating refund...</p>' +
                        '</div>' +
                        '<div class="form-group">' +
                            '<label for="cancel-reason">Reason for cancellation (optional)</label>' +
                            '<textarea id="cancel-reason" rows="3" placeholder="Please let us know why..."></textarea>' +
                        '</div>' +
                    '</div>' +
                    '<div class="modal-footer">' +
                        '<button class="btn btn-secondary" id="cancel-no">Keep Booking</button>' +
                        '<button class="btn btn-danger" id="cancel-yes">Confirm Cancellation</button>' +
                    '</div>' +
                '</div>';
            
            document.body.appendChild(modal);
            
            // Calculate days until check-in
            var checkin = new Date(this.booking.checkin);
            var today = new Date();
            var daysUntil = Math.ceil((checkin - today) / (1000 * 60 * 60 * 24));
            
            // Show refund preview
            if (window.MutsBookingsService) {
                window.MutsBookingsService.getCancellationPolicy(daysUntil).then(function(result) {
                    var preview = document.getElementById('refund-preview');
                    if (preview) {
                        var refund = 0;
                        if (daysUntil >= 14) refund = this.booking.totalPrice;
                        else if (daysUntil >= 7) refund = this.booking.totalPrice * 0.75;
                        else if (daysUntil >= 3) refund = this.booking.totalPrice * 0.5;
                        else if (daysUntil >= 1) refund = this.booking.totalPrice * 0.25;
                        
                        preview.innerHTML = 
                            '<div class="refund-info">' +
                                '<p><strong>Cancellation Policy:</strong> ' + result.policy + '</p>' +
                                '<p class="refund-amount">Estimated Refund: <strong>$' + refund.toFixed(2) + '</strong></p>' +
                            '</div>';
                    }
                }.bind(this));
            }
            
            // Event handlers
            modal.querySelector('.modal-close').addEventListener('click', function() {
                document.body.removeChild(modal);
            });
            
            modal.querySelector('#cancel-no').addEventListener('click', function() {
                document.body.removeChild(modal);
            });
            
            modal.querySelector('#cancel-yes').addEventListener('click', function() {
                var reason = document.getElementById('cancel-reason').value;
                self._executeCancel(reason, modal);
            });
        },
        
        /**
         * Execute cancellation
         */
        _executeCancel: function(reason, modal) {
            var self = this;
            
            if (window.MutsBookingsService) {
                window.MutsBookingsService.cancelBooking(this.bookingId, reason).then(function(result) {
                    // Show success
                    modal.querySelector('.modal-body').innerHTML = 
                        '<div class="success-message">' +
                            '<svg viewBox="0 0 24 24" width="64" height="64"><path fill="#27ae60" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>' +
                            '<h3>Booking Cancelled</h3>' +
                            '<p>Your booking has been cancelled.</p>' +
                            (result.refundAmount > 0 ? '<p class="refund">Refund: <strong>$' + result.refundAmount.toFixed(2) + '</strong></p>' : '') +
                            '<p class="policy">Policy: ' + result.cancellationPolicy + '</p>' +
                        '</div>';
                    
                    modal.querySelector('.modal-footer').innerHTML = 
                        '<button class="btn btn-primary" id="close-modal">Close</button>';
                    
                    modal.querySelector('#close-modal').addEventListener('click', function() {
                        document.body.removeChild(modal);
                        if (self.options.onCancel) self.options.onCancel(result);
                    });
                }).catch(function(err) {
                    modal.querySelector('.modal-body').innerHTML = 
                        '<div class="error-message">' +
                            '<p>Failed to cancel booking: ' + err.message + '</p>' +
                        '</div>';
                });
            }
        },
        
        /**
         * Show modify modal
         */
        showModifyModal: function() {
            var modal = document.createElement('div');
            modal.className = 'booking-modal';
            modal.innerHTML = 
                '<div class="modal-content">' +
                    '<div class="modal-header">' +
                        '<h2>Modify Booking</h2>' +
                        '<button class="modal-close">&times;</button>' +
                    '</div>' +
                    '<div class="modal-body">' +
                        '<p>Change your booking dates:</p>' +
                        '<div class="form-group">' +
                            '<label for="new-checkin">New Check-in Date</label>' +
                            '<input type="date" id="new-checkin" value="' + (this.booking.checkin || '') + '">' +
                        '</div>' +
                        '<div class="form-group">' +
                            '<label for="new-checkout">New Check-out Date</label>' +
                            '<input type="date" id="new-checkout" value="' + (this.booking.checkout || '') + '">' +
                        '</div>' +
                        '<div class="info-note">' +
                            '<p>Note: Date changes may affect pricing. You will be notified if there are any price differences.</p>' +
                        '</div>' +
                    '</div>' +
                    '<div class="modal-footer">' +
                        '<button class="btn btn-secondary" id="modify-cancel">Cancel</button>' +
                        '<button class="btn btn-primary" id="modify-confirm">Confirm Changes</button>' +
                    '</div>' +
                '</div>';
            
            document.body.appendChild(modal);
            
            var self = this;
            
            modal.querySelector('.modal-close').addEventListener('click', function() {
                document.body.removeChild(modal);
            });
            
            modal.querySelector('#modify-cancel').addEventListener('click', function() {
                document.body.removeChild(modal);
            });
            
            modal.querySelector('#modify-confirm').addEventListener('click', function() {
                var newCheckin = document.getElementById('new-checkin').value;
                var newCheckout = document.getElementById('new-checkout').value;
                self._executeModify(newCheckin, newCheckout, modal);
            });
        },
        
        /**
         * Execute modification
         */
        _executeModify: function(checkin, checkout, modal) {
            var self = this;
            
            if (window.MutsBookingsService) {
                window.MutsBookingsService.modifyBooking(this.bookingId, checkin, checkout).then(function(booking) {
                    modal.querySelector('.modal-body').innerHTML = 
                        '<div class="success-message">' +
                            '<svg viewBox="0 0 24 24" width="64" height="64"><path fill="#27ae60" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>' +
                            '<h3>Booking Modified</h3>' +
                            '<p>Your new dates: ' + checkin + ' to ' + checkout + '</p>' +
                        '</div>';
                    
                    modal.querySelector('.modal-footer').innerHTML = 
                        '<button class="btn btn-primary" id="close-modal">Close</button>';
                    
                    modal.querySelector('#close-modal').addEventListener('click', function() {
                        document.body.removeChild(modal);
                        if (self.options.onModify) self.options.onModify(booking);
                    });
                }).catch(function(err) {
                    modal.querySelector('.modal-body').innerHTML = 
                        '<div class="error-message">' +
                            '<p>Failed to modify booking: ' + err.message + '</p>' +
                        '</div>';
                });
            }
        },
        
        /**
         * Create management buttons for a booking
         * @param {string} containerId - Container element ID
         */
        renderButtons: function(containerId) {
            var container = document.getElementById(containerId);
            if (!container) return;
            
            var self = this;
            
            var buttons = '';
            
            if (this.canCancel) {
                buttons += '<button class="btn btn-danger" id="cancel-booking-btn">Cancel Booking</button>';
            }
            
            if (this.canModify) {
                buttons += '<button class="btn btn-secondary" id="modify-booking-btn">Modify Dates</button>';
            }
            
            container.innerHTML = buttons;
            
            var cancelBtn = document.getElementById('cancel-booking-btn');
            if (cancelBtn) {
                cancelBtn.addEventListener('click', function() {
                    self.showCancelModal();
                });
            }
            
            var modifyBtn = document.getElementById('modify-booking-btn');
            if (modifyBtn) {
                modifyBtn.addEventListener('click', function() {
                    self.showModifyModal();
                });
            }
        }
    };
    
    // Auto-init for pages with booking-detail
    document.addEventListener('DOMContentLoaded', function() {
        var bookingDetail = document.querySelector('[data-booking-id]');
        if (bookingDetail) {
            var bookingId = bookingDetail.dataset.bookingId;
            var options = {};
            
            if (bookingDetail.dataset.onCancel) {
                try { options.onCancel = eval(bookingDetail.dataset.onCancel); } catch(e) {}
            }
            if (bookingDetail.dataset.onModify) {
                try { options.onModify = eval(bookingDetail.dataset.onModify); } catch(e) {}
            }
            
            BookingManagement.init(bookingId, options);
        }
    });
    
    window.MutsBookingManagement = BookingManagement;
})();