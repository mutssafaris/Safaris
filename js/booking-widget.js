/* Booking Widget - Muts Safaris */
/* Stepped booking form with modern UI/UX */
(function(window) {
    'use strict';

    var BOOKING_WIDGET_VERSION = '1.0.0';

    function BookingWidget(config) {
        this.config = config || {};
        this.container = null;
        this.currentStep = 1;
        this.totalSteps = 3;
        this.bookingData = {
            destination: null,
            checkin: null,
            checkout: null,
            adults: 2,
            children: 0,
            infants: 0,
            travelers: [],
            promoCode: null,
            promoDiscount: 0
        };
        this.pricing = {
            basePrice: 0,
            perPerson: 0,
            total: 0,
            deposit: 0
        };
        this.isValid = {
            step1: false,
            step2: false,
            step3: false
        };
        this.destinations = [];
        this.availability = {};
    }

    BookingWidget.prototype.init = function(containerId, options) {
        options = options || {};
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error('[BookingWidget] Container not found:', containerId);
            return this;
        }
        this.config = Object.assign({}, this.config, options);
        this._loadDestinations();
        this._render();
        this._bindEvents();
        return this;
    };

    BookingWidget.prototype._loadDestinations = function() {
        var self = this;
        this.destinations = [
            { id: 'maasai-mara', name: 'Maasai Mara Safari', basePrice: 350, minNights: 2 },
            { id: 'amboseli', name: 'Amboseli Adventure', basePrice: 280, minNights: 2 },
            { id: 'tsavo', name: 'Tsavo Wildlife Safari', basePrice: 250, minNights: 2 },
            { id: 'samburu', name: 'Samburu Expedition', basePrice: 300, minNights: 3 },
            { id: 'diani', name: 'Diani Beach Escape', basePrice: 200, minNights: 3 },
            { id: 'nakuru', name: 'Lake Nakuru Day Trip', basePrice: 150, minNights: 1 },
            { id: 'nairobi', name: 'Nairobi City Tour', basePrice: 100, minNights: 1 }
        ];
        if (window.MutsDestinationsService) {
            window.MutsDestinationsService.getAll().then(function(destinations) {
                if (destinations && destinations.length > 0) {
                    self.destinations = destinations;
                }
            }).catch(function() {});
        }
    };

    BookingWidget.prototype._render = function() {
        var html = 
            '<div class="booking-widget" role="form" aria-label="Booking form">' +
                '<div class="booking-progress" role="progressbar" aria-valuenow="' + this.currentStep + '" aria-valuemin="1" aria-valuemax="' + this.totalSteps + '">' +
                    '<div class="progress-step ' + (this.currentStep >= 1 ? 'active' : '') + ' ' + (this.currentStep > 1 ? 'completed' : '') + '">' +
                        '<div class="step-number">1</div>' +
                        '<div class="step-label">Destination</div>' +
                    '</div>' +
                    '<div class="progress-line ' + (this.currentStep > 1 ? 'completed' : '') + '"></div>' +
                    '<div class="progress-step ' + (this.currentStep >= 2 ? 'active' : '') + ' ' + (this.currentStep > 2 ? 'completed' : '') + '">' +
                        '<div class="step-number">2</div>' +
                        '<div class="step-label">Travelers</div>' +
                    '</div>' +
                    '<div class="progress-line ' + (this.currentStep > 2 ? 'completed' : '') + '"></div>' +
                    '<div class="progress-step ' + (this.currentStep >= 3 ? 'active' : '') + '">' +
                        '<div class="step-number">3</div>' +
                        '<div class="step-label">Confirm</div>' +
                    '</div>' +
                '</div>' +
                '<div class="booking-steps">' +
                    this._renderStep1() +
                    this._renderStep2() +
                    this._renderStep3() +
                '</div>' +
                '<div class="booking-navigation">' +
                    '<button type="button" class="btn btn-secondary" id="btn-prev" disabled>&larr; Back</button>' +
                    '<button type="button" class="btn btn-primary" id="btn-next">Continue &rarr;</button>' +
                '</div>' +
                '<div class="booking-error" id="booking-error" aria-live="polite"></div>' +
            '</div>';
        this.container.innerHTML = html;
        this._updateNavigation();
    };

    BookingWidget.prototype._renderStep1 = function() {
        var destinationsOptions = this.destinations.map(function(d) {
            return '<option value="' + d.id + '" data-price="' + d.basePrice + '" data-min="' + d.minNights + '">' + d.name + ' ($' + d.basePrice + '/person/day)</option>';
        }).join('');
        var today = new Date().toISOString().split('T')[0];
        return '<div class="booking-step step-1" data-step="1" style="display:' + (this.currentStep === 1 ? 'block' : 'none') + '">' +
            '<h3 class="step-title">Select Destination & Dates</h3>' +
            '<div class="form-group">' +
                '<label for="booking-destination">Destination</label>' +
                '<select id="booking-destination" class="form-control" required>' +
                    '<option value="">-- Select Destination --</option>' +
                    destinationsOptions +
                '</select>' +
            '</div>' +
            '<div class="form-row">' +
                '<div class="form-group">' +
                    '<label for="booking-checkin">Check-in Date</label>' +
                    '<input type="date" id="booking-checkin" class="form-control" min="' + today + '" required>' +
                '</div>' +
                '<div class="form-group">' +
                    '<label for="booking-checkout">Check-out Date</label>' +
                    '<input type="date" id="booking-checkout" class="form-control" min="' + today + '" required>' +
                '</div>' +
            '</div>' +
            '<div class="availability-note" id="availability-note">' +
                '<small>Please select a destination and dates to check availability</small>' +
            '</div>' +
        '</div>';
    };

    BookingWidget.prototype._renderStep2 = function() {
        return '<div class="booking-step step-2" data-step="2" style="display:' + (this.currentStep === 2 ? 'block' : 'none') + '">' +
            '<h3 class="step-title">Traveler Details</h3>' +
            '<div class="form-row">' +
                '<div class="form-group">' +
                    '<label for="booking-adults">Adults (12+ years)</label>' +
                    '<select id="booking-adults" class="form-control">' +
                        this._generateOptions(1, 10, this.bookingData.adults) +
                    '</select>' +
                '</div>' +
                '<div class="form-group">' +
                    '<label for="booking-children">Children (2-11 years)</label>' +
                    '<select id="booking-children" class="form-control">' +
                        this._generateOptions(0, 6, this.bookingData.children) +
                    '</select>' +
                '</div>' +
                '<div class="form-group">' +
                    '<label for="booking-infants">Infants (0-1 years)</label>' +
                    '<select id="booking-infants" class="form-control">' +
                        this._generateOptions(0, 4, this.bookingData.infants) +
                    '</select>' +
                '</div>' +
            '</div>' +
            '<div class="travelers-summary" id="travelers-summary">' +
                '<p>Total guests: <strong id="total-guests">' + (this.bookingData.adults + this.bookingData.children + this.bookingData.infants) + '</strong></p>' +
            '</div>' +
            '<div class="promo-code-section">' +
                '<label for="booking-promo">Promo Code (optional)</label>' +
                '<div class="promo-input-group">' +
                    '<input type="text" id="booking-promo" class="form-control" placeholder="Enter promo code">' +
                    '<button type="button" class="btn btn-small" id="btn-apply-promo">Apply</button>' +
                '</div>' +
                '<div class="promo-message" id="promo-message"></div>' +
            '</div>' +
        '</div>';
    };

    BookingWidget.prototype._renderStep3 = function() {
        var deposit = this.pricing.deposit || this.pricing.total * 0.3;
        return '<div class="booking-step step-3" data-step="3" style="display:' + (this.currentStep === 3 ? 'block' : 'none') + '">' +
            '<h3 class="step-title">Confirm Booking</h3>' +
            '<div class="booking-summary">' +
                '<div class="summary-row">' +
                    '<span>Destination:</span>' +
                    '<span id="summary-destination">-</span>' +
                '</div>' +
                '<div class="summary-row">' +
                    '<span>Dates:</span>' +
                    '<span id="summary-dates">-</span>' +
                '</div>' +
                '<div class="summary-row">' +
                    '<span>Guests:</span>' +
                    '<span id="summary-guests">-</span>' +
                '</div>' +
                '<hr>' +
                '<div class="summary-row price-row">' +
                    '<span>Per Person:</span>' +
                    '<span id="summary-per-person">$' + this.pricing.perPerson + '</span>' +
                '</div>' +
                '<div class="summary-row price-row">' +
                    '<span>Total Price:</span>' +
                    '<span id="summary-total" class="price-amount">$' + this.pricing.total + '</span>' +
                '</div>' +
                '<div class="summary-row discount-row" id="discount-row" style="display:none">' +
                    '<span>Discount:</span>' +
                    '<span id="summary-discount">-20%</span>' +
                '</div>' +
                '<div class="summary-row deposit-row">' +
                    '<span>Deposit Required:</span>' +
                    '<span id="summary-deposit" class="deposit-amount">$' + deposit.toFixed(2) + '</span>' +
                '</div>' +
            '</div>' +
            '<div class="form-group">' +
                '<label for="booking-email">Email Address</label>' +
                '<input type="email" id="booking-email" class="form-control" placeholder="your@email.com" required>' +
            '</div>' +
            '<div class="form-group">' +
                '<label for="booking-phone">Phone Number</label>' +
                '<input type="tel" id="booking-phone" class="form-control" placeholder="+254712345678" required>' +
            '</div>' +
            '<div class="terms-check">' +
                '<input type="checkbox" id="booking-terms" required>' +
                '<label for="booking-terms">I agree to the <a href="terms.html" target="_blank">Booking Terms & Conditions</a></label>' +
            '</div>' +
        '</div>';
    };

    BookingWidget.prototype._generateOptions = function(min, max, selected) {
        var options = [];
        for (var i = min; i <= max; i++) {
            options.push('<option value="' + i + '"' + (i === selected ? ' selected' : '') + '>' + i + '</option>');
        }
        return options.join('');
    };

    BookingWidget.prototype._bindEvents = function() {
        var self = this;
        var btnPrev = document.getElementById('btn-prev');
        var btnNext = document.getElementById('btn-next');
        if (btnPrev) {
            btnPrev.addEventListener('click', function() {
                self._prevStep();
            });
        }
        if (btnNext) {
            btnNext.addEventListener('click', function() {
                self._nextStep();
            });
        }
        document.addEventListener('change', function(e) {
            if (e.target.id === 'booking-destination') {
                self._onDestinationChange(e.target.value);
            }
            if (e.target.id === 'booking-checkin') {
                self._onCheckinChange(e.target.value);
            }
            if (e.target.id === 'booking-checkout') {
                self._onCheckoutChange(e.target.value);
            }
            if (e.target.id === 'booking-adults') {
                self._onGuestCountChange();
            }
            if (e.target.id === 'booking-children') {
                self._onGuestCountChange();
            }
            if (e.target.id === 'booking-infants') {
                self._onGuestCountChange();
            }
        });
        document.addEventListener('click', function(e) {
            if (e.target.id === 'btn-apply-promo') {
                self._applyPromoCode();
            }
        });
    };

    BookingWidget.prototype._onDestinationChange = function(destinationId) {
        this.bookingData.destination = this.destinations.find(function(d) {
            return d.id === destinationId;
        }) || null;
        this._updatePricing();
        this._checkAvailability();
    };

    BookingWidget.prototype._onCheckinChange = function(checkin) {
        this.bookingData.checkin = checkin;
        this._validateDates();
        this._updatePricing();
        this._checkAvailability();
    };

    BookingWidget.prototype._onCheckoutChange = function(checkout) {
        this.bookingData.checkout = checkout;
        this._validateDates();
        this._updatePricing();
    };

    BookingWidget.prototype._onGuestCountChange = function() {
        var adults = parseInt(document.getElementById('booking-adults')?.value) || 2;
        var children = parseInt(document.getElementById('booking-children')?.value) || 0;
        var infants = parseInt(document.getElementById('booking-infants')?.value) || 0;
        this.bookingData.adults = adults;
        this.bookingData.children = children;
        this.bookingData.infants = infants;
        var totalGuests = document.getElementById('total-guests');
        if (totalGuests) {
            totalGuests.textContent = adults + children + infants;
        }
        this._updatePricing();
    };

    BookingWidget.prototype._validateDates = function() {
        if (!this.bookingData.checkin || !this.bookingData.checkout) {
            return false;
        }
        var checkin = new Date(this.bookingData.checkin);
        var checkout = new Date(this.bookingData.checkout);
        if (checkout <= checkin) {
            this._showError('Check-out date must be after check-in date');
            return false;
        }
        this._clearError();
        return true;
    };

    BookingWidget.prototype._updatePricing = function() {
        if (!this.bookingData.destination) {
            return;
        }
        var basePrice = this.bookingData.destination.basePrice;
        var checkin = this.bookingData.checkin ? new Date(this.bookingData.checkin) : new Date();
        var checkout = this.bookingData.checkout ? new Date(this.bookingData.checkout) : new Date(checkin.getTime() + 2 * 24 * 60 * 60 * 1000);
        var nights = Math.ceil((checkout - checkin) / (1000 * 60 * 60 * 24));
        var totalGuests = this.bookingData.adults + this.bookingData.children;
        var childDiscount = 0.5;
        var infantDiscount = 0;
        var adultPrice = basePrice * nights * this.bookingData.adults;
        var childPrice = basePrice * nights * this.bookingData.children * childDiscount;
        var infantPrice = basePrice * nights * this.bookingData.infants * infantDiscount;
        this.pricing.perPerson = basePrice;
        this.pricing.basePrice = basePrice * nights;
        this.pricing.nights = nights;
        this.pricing.total = adultPrice + childPrice + infantPrice;
        this.pricing.total = this.pricing.total * (1 - this.bookingData.promoDiscount);
        this.pricing.deposit = this.pricing.total * 0.3;
        this.isValid.step1 = this._validateDates();
        this._updateSummary();
    };

    BookingWidget.prototype._updateSummary = function() {
        var summaryDest = document.getElementById('summary-destination');
        var summaryDates = document.getElementById('summary-dates');
        var summaryGuests = document.getElementById('summary-guests');
        var summaryTotal = document.getElementById('summary-total');
        var summaryPerPerson = document.getElementById('summary-per-person');
        var summaryDeposit = document.getElementById('summary-deposit');
        var discountRow = document.getElementById('discount-row');
        var summaryDiscount = document.getElementById('summary-discount');
        if (summaryDest) {
            summaryDest.textContent = this.bookingData.destination?.name || '-';
        }
        if (summaryDates) {
            summaryDates.textContent = this.bookingData.checkin && this.bookingData.checkout ? 
                this.bookingData.checkin + ' to ' + this.bookingData.checkout : '-';
        }
        if (summaryGuests) {
            var guests = this.bookingData.adults + ' adults';
            if (this.bookingData.children > 0) guests += ', ' + this.bookingData.children + ' children';
            if (this.bookingData.infants > 0) guests += ', ' + this.bookingData.infants + ' infants';
            summaryGuests.textContent = guests;
        }
        if (summaryTotal) {
            summaryTotal.textContent = '$' + this.pricing.total;
        }
        if (summaryPerPerson) {
            summaryPerPerson.textContent = '$' + this.pricing.perPerson + '/person/night';
        }
        if (summaryDeposit) {
            summaryDeposit.textContent = '$' + this.pricing.deposit.toFixed(2);
        }
        if (discountRow && summaryDiscount) {
            if (this.bookingData.promoDiscount > 0) {
                discountRow.style.display = 'flex';
                summaryDiscount.textContent = '-' + (this.bookingData.promoDiscount * 100).toFixed(0) + '%';
            } else {
                discountRow.style.display = 'none';
            }
        }
    };

    BookingWidget.prototype._checkAvailability = function() {
        if (!this.bookingData.destination || !this.bookingData.checkin || !this.bookingData.checkout) {
            return;
        }
        var note = document.getElementById('availability-note');
        if (note) {
            note.innerHTML = '<small class="loading">Checking availability...</small>';
        }
        var self = this;
        setTimeout(function() {
            self.availability = { available: true, message: 'Rooms available!' };
            if (note) {
                note.innerHTML = '<small class="available">' + self.availability.message + '</small>';
            }
        }, 500);
    };

    BookingWidget.prototype._applyPromoCode = function() {
        var input = document.getElementById('booking-promo');
        var message = document.getElementById('promo-message');
        var code = input?.value?.trim().toUpperCase();
        if (!code) {
            if (message) message.innerHTML = '<small class="error">Please enter a promo code</small>';
            return;
        }
        var promoCodes = {
            'SAFARI25': { discount: 0.25, description: '25% off safari packages' },
            'AMBOSELI20': { discount: 0.20, description: '20% off Amboseli' },
            'WELCOME10': { discount: 0.10, description: '10% welcome discount' },
            'MUTS2026': { discount: 0.15, description: '15% off 2026 bookings' }
        };
        var promo = promoCodes[code];
        if (promo) {
            this.bookingData.promoCode = code;
            this.bookingData.promoDiscount = promo.discount;
            if (message) message.innerHTML = '<small class="success">' + promo.description + ' applied!</small>';
            this._updatePricing();
        } else {
            if (message) message.innerHTML = '<small class="error">Invalid promo code</small>';
        }
    };

    BookingWidget.prototype._nextStep = function() {
        if (this.currentStep === 1) {
            if (!this._validateStep1()) return;
        }
        if (this.currentStep === 2) {
            if (!this._validateStep2()) return;
        }
        if (this.currentStep < this.totalSteps) {
            this.currentStep++;
            this._showStep(this.currentStep);
            this._updateNavigation();
        } else {
            this._submitBooking();
        }
    };

    BookingWidget.prototype._prevStep = function() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this._showStep(this.currentStep);
            this._updateNavigation();
        }
    };

    BookingWidget.prototype._showStep = function(step) {
        var steps = document.querySelectorAll('.booking-step');
        steps.forEach(function(s) {
            s.style.display = 'none';
        });
        var currentStepEl = document.querySelector('.booking-step.step-' + step);
        if (currentStepEl) {
            currentStepEl.style.display = 'block';
        }
        var progress = document.querySelector('.booking-progress');
        if (progress) {
            progress.setAttribute('aria-valuenow', step);
        }
    };

    BookingWidget.prototype._updateNavigation = function() {
        var btnPrev = document.getElementById('btn-prev');
        var btnNext = document.getElementById('btn-next');
        if (btnPrev) {
            btnPrev.disabled = this.currentStep === 1;
        }
        if (btnNext) {
            if (this.currentStep === this.totalSteps) {
                btnNext.textContent = 'Confirm Booking';
                btnNext.classList.add('btn-success');
            } else {
                btnNext.textContent = 'Continue \u2192';
                btnNext.classList.remove('btn-success');
            }
        }
    };

    BookingWidget.prototype._validateStep1 = function() {
        var destination = document.getElementById('booking-destination');
        var checkin = document.getElementById('booking-checkin');
        var checkout = document.getElementById('booking-checkout');
        if (!destination?.value) {
            this._showError('Please select a destination');
            return false;
        }
        if (!checkin?.value) {
            this._showError('Please select a check-in date');
            return false;
        }
        if (!checkout?.value) {
            this._showError('Please select a check-out date');
            return false;
        }
        this.isValid.step1 = true;
        return true;
    };

    BookingWidget.prototype._validateStep2 = function() {
        var adults = parseInt(document.getElementById('booking-adults')?.value) || 0;
        if (adults < 1) {
            this._showError('At least one adult is required');
            return false;
        }
        this.isValid.step2 = true;
        return true;
    };

    BookingWidget.prototype._validateStep3 = function() {
        var email = document.getElementById('booking-email');
        var phone = document.getElementById('booking-phone');
        var terms = document.getElementById('booking-terms');
        if (!email?.value || !email.value.includes('@')) {
            this._showError('Please enter a valid email address');
            return false;
        }
        if (!phone?.value) {
            this._showError('Please enter a phone number');
            return false;
        }
        if (!terms?.checked) {
            this._showError('Please accept the terms and conditions');
            return false;
        }
        this.isValid.step3 = true;
        return true;
    };

    BookingWidget.prototype._showError = function(message) {
        var error = document.getElementById('booking-error');
        if (error) {
            error.textContent = message;
            error.classList.add('visible');
        }
    };

    BookingWidget.prototype._clearError = function() {
        var error = document.getElementById('booking-error');
        if (error) {
            error.textContent = '';
            error.classList.remove('visible');
        }
    };

    BookingWidget.prototype._submitBooking = function() {
        var self = this;
        if (!this._validateStep3()) return;
        var bookingData = Object.assign({}, this.bookingData, {
            totalPrice: this.pricing.total,
            deposit: this.pricing.deposit,
            nights: this.pricing.nights,
            createdAt: new Date().toISOString()
        });
        if (window.MutsBookingsService) {
            window.MutsBookingsService.createBooking(bookingData).then(function(result) {
                if (self.config.onSuccess) {
                    self.config.onSuccess(result);
                } else {
                    window.location.href = 'my-trips.html';
                }
            }).catch(function(err) {
                self._showError('Booking failed: ' + err.message);
            });
        }
    };

    window.MutsBookingWidget = BookingWidget;
})(window);