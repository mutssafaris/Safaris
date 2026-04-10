/* Booking Detail Page JS — Muts Safaris */
(function () {
    var path = window.location.pathname;
    if (path.indexOf('booking-detail.html') === -1) {
        return;
    }

    var bookingId = null;

    function getBookingIdFromUrl() {
        var params = new URLSearchParams(window.location.search);
        var id = params.get('id');
        if (!id && window.location.hash) {
            var hash = window.location.hash.substring(1);
            var hashParams = new URLSearchParams(hash);
            id = hashParams.get('id');
        }
        if (!id) {
            var search = window.location.search;
            var match = search.match(/[?&]id=([^&]+)/);
            if (match) id = match[1];
        }
        return id;
    }

    function formatDate(dateStr) {
        if (!dateStr) return '-';
        var d = new Date(dateStr);
        var options = { year: 'numeric', month: 'short', day: 'numeric' };
        return d.toLocaleDateString('en-US', options);
    }

    function calculateDuration(checkin, checkout) {
        if (!checkin || !checkout) return '-';
        var start = new Date(checkin);
        var end = new Date(checkout);
        var days = Math.round((end - start) / (1000 * 60 * 60 * 24));
        return days + (days === 1 ? ' Day' : ' Days');
    }

    function loadBooking() {
        bookingId = getBookingIdFromUrl();
        
        console.log('Booking ID from URL:', bookingId);
        console.log('Full URL:', window.location.href);
        console.log('Search params:', window.location.search);
        
        if (!bookingId) {
            console.log('No booking ID found, showing empty');
            showEmptyState();
            return;
        }

        function fetchBooking() {
            console.log('MutsBookingsService available:', !!window.MutsBookingsService);
            console.log('MutsAuth available:', !!window.MutsAuth);
            
            if (!window.MutsBookingsService) {
                setTimeout(fetchBooking, 200);
                return;
            }
            window.MutsBookingsService.getById(bookingId).then(function (booking) {
                console.log('Booking fetched:', booking);
                if (!booking) {
                    console.log('Booking not found for ID:', bookingId);
                    showEmptyState();
                    return;
                }
                renderBooking(booking);
            }).catch(function(err) {
                console.log('Error fetching booking:', err);
                showEmptyState();
            });
        }

        fetchBooking();
    }

    function showEmptyState() {
        var empty = document.getElementById('booking-empty');
        var grid = document.querySelector('.booking-detail-grid');
        if (empty) empty.style.display = '';
        if (grid) grid.style.display = 'none';
    }

    function renderBooking(booking) {
        var titleEl = document.getElementById('booking-title');
        var statusEl = document.getElementById('booking-status');
        
        if (titleEl) titleEl.textContent = booking.destination;
        if (statusEl) {
            statusEl.textContent = booking.status.charAt(0).toUpperCase() + booking.status.slice(1);
            statusEl.className = 'booking-status-badge ' + booking.status;
        }

        document.getElementById('booking-id').textContent = booking.id;
        document.getElementById('booking-destination').textContent = booking.destination;
        document.getElementById('booking-checkin').textContent = formatDate(booking.checkin);
        document.getElementById('booking-checkout').textContent = formatDate(booking.checkout);
        document.getElementById('booking-duration').textContent = calculateDuration(booking.checkin, booking.checkout);
        document.getElementById('booking-guests').textContent = (booking.adults || 0) + ' Adults' + ((booking.children || 0) > 0 ? ', ' + booking.children + ' Children' : '');
        document.getElementById('booking-price').textContent = '$' + (booking.totalPrice || 0).toLocaleString();
        document.getElementById('booking-created').textContent = formatDate(booking.createdAt);

        document.getElementById('booking-adults').textContent = booking.adults || 0;
        document.getElementById('booking-children').textContent = booking.children || 0;
        document.getElementById('booking-infants').textContent = booking.infants || 0;

        var timelineBooked = document.getElementById('timeline-booked');
        if (timelineBooked) timelineBooked.textContent = formatDate(booking.createdAt);

        if (booking.status === 'cancelled') {
            disableActions();
        }
    }

    function disableActions() {
        var buttons = document.querySelectorAll('.action-btn');
        buttons.forEach(function (btn) {
            if (btn.id !== 'btn-contact') {
                btn.disabled = true;
                btn.style.opacity = '0.4';
                btn.style.cursor = 'not-allowed';
            }
        });
    }

    function initActions() {
        document.getElementById('btn-view-itinerary').addEventListener('click', function () {
            alert('Itinerary preview coming soon!');
        });

        document.getElementById('btn-modify').addEventListener('click', function () {
            alert('Modify booking feature coming soon!');
        });

        document.getElementById('btn-add-guest').addEventListener('click', function () {
            alert('Add guest feature coming soon!');
        });

        document.getElementById('btn-contact').addEventListener('click', function () {
            window.location.href = 'messages.html';
        });

        document.getElementById('btn-cancel').addEventListener('click', function () {
            if (bookingId && confirm('Are you sure you want to cancel this booking?')) {
                window.MutsBookingsService.cancelBooking(bookingId).then(function (success) {
                    if (success) {
                        alert('Booking cancelled successfully.');
                        window.location.reload();
                    } else {
                        alert('Failed to cancel booking. Please try again.');
                    }
                });
            }
        });

        document.getElementById('btn-download').addEventListener('click', function () {
            alert('PDF download coming soon!');
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        loadBooking();
        initActions();
    });
})();