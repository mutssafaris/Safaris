/* Hotel Reviews Component - Muts Safaris */
(function() {
    'use strict';

    window.MutsHotelReviews = {
        init: function(options) {
            var defaults = {
                hotelId: '',
                containerId: 'reviews',
                hotelService: window.MutsHotelsService
            };
            var opts = Object.assign({}, defaults, options);
            
            if (!opts.hotelId) {
                console.error('Hotel ID is required for reviews component');
                return;
            }

            this.hotelId = opts.hotelId;
            this.containerId = opts.containerId;
            this.hotelService = opts.hotelService;
            this.currentRating = 0;

            this.render();
        },

        render: function() {
            var self = this;
            var container = document.getElementById(this.containerId);
            if (!container) return;

            this.hotelService.getById(this.hotelId).then(function(hotel) {
                if (!hotel) return;
                self.hotel = hotel;
                self.insertReviewsSection(container, hotel);
            });
        },

        insertReviewsSection: function(container, hotel) {
            var html = '\n<div id="reviews" style="margin-top:3rem;padding-top:2rem;border-top:1px solid var(--border-glow);">\n<h2 style="color:#fff;margin-bottom:1rem;">Guest Reviews <span id="reviews-count" style="color:var(--text-muted);font-size:0.9rem;font-weight:normal;">(<span class="dynamic-reviews-count">' + hotel.reviews + '</span> reviews)</span></h2>\n<div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.5rem;">\n<span style="font-size:2rem;font-weight:bold;color:var(--accent);"><span class="dynamic-rating">' + hotel.rating + '</span></span>\n<div><div style="color:var(--accent);font-size:1.2rem;">★★★★★</div><span style="color:var(--text-muted);font-size:0.85rem;">Based on <span class="dynamic-reviews-total">' + hotel.reviews + '</span> reviews</span></div>\n</div>\n<div id="reviews-list" style="max-height:400px;overflow-y:auto;margin-bottom:1.5rem;">\n<div style="background:var(--bg-card);border:1px solid var(--border-glow);padding:1rem;margin-bottom:1rem;">\n<p style="color:var(--text-secondary);margin-bottom:0.5rem;">"Great location and excellent service. Would definitely recommend!"</p>\n<span style="color:var(--text-muted);font-size:0.8rem;">- Happy Traveler, Kenya</span>\n</div>\n<div style="background:var(--bg-card);border:1px solid var(--border-glow);padding:1rem;margin-bottom:1rem;">\n<p style="color:var(--text-secondary);margin-bottom:0.5rem;">"Amazing experience! The staff went above and beyond."</p>\n<span style="color:var(--text-muted);font-size:0.8rem;">- John D., USA</span>\n</div>\n</div>\n<button class="btn btn-primary" id="add-review-btn" onclick="MutsHotelReviews.toggleForm()">Write a Review</button>\n<div id="review-form" style="display:none;background:var(--bg-card);border:1px solid var(--border-glow);padding:1.5rem;margin-top:1rem;">\n<h3 style="color:#fff;margin-bottom:1rem;">Your Review</h3>\n<div style="margin-bottom:1rem;">\n<label style="display:block;color:var(--text-muted);font-size:0.8rem;margin-bottom:0.5rem;">Your Rating</label>\n<div id="rating-stars" style="font-size:1.5rem;cursor:pointer;">\n<span data-rating="1" onclick="MutsHotelReviews.setRating(1)">★</span>\n<span data-rating="2" onclick="MutsHotelReviews.setRating(2)">★</span>\n<span data-rating="3" onclick="MutsHotelReviews.setRating(3)">★</span>\n<span data-rating="4" onclick="MutsHotelReviews.setRating(4)">★</span>\n<span data-rating="5" onclick="MutsHotelReviews.setRating(5)">★</span>\n</div>\n</div>\n<div style="margin-bottom:1rem;">\n<label style="display:block;color:var(--text-muted);font-size:0.8rem;margin-bottom:0.5rem;">Your Name</label>\n<input type="text" id="reviewer-name" placeholder="Your name" style="width:100%;padding:0.75rem;background:rgba(255,255,255,0.05);border:1px solid var(--border-glow);color:#fff;">\n</div>\n<div style="margin-bottom:1rem;">\n<label style="display:block;color:var(--text-muted);font-size:0.8rem;margin-bottom:0.5rem;">Your Review</label>\n<textarea id="review-text" placeholder="Share your experience..." rows="4" style="width:100%;padding:0.75rem;background:rgba(255,255,255,0.05);border:1px solid var(--border-glow);color:#fff;resize:vertical;"></textarea>\n</div>\n<div style="display:flex;gap:1rem;">\n<button class="btn btn-primary" onclick="MutsHotelReviews.submitReview()">Submit Review</button>\n<button class="btn btn-outline" onclick="MutsHotelReviews.toggleForm()">Cancel</button>\n</div>\n</div>\n</div>\n';
            container.innerHTML = html;
        },

        toggleForm: function() {
            var form = document.getElementById('review-form');
            if (form) {
                form.style.display = form.style.display === 'none' ? 'block' : 'none';
            }
        },

        setRating: function(rating) {
            this.currentRating = rating;
            var stars = document.querySelectorAll('#rating-stars span');
            stars.forEach(function(star, index) {
                star.style.color = index < rating ? 'var(--accent)' : 'var(--text-muted)';
            });
        },

        submitReview: function() {
            var name = document.getElementById('reviewer-name').value.trim();
            var text = document.getElementById('review-text').value.trim();
            
            if (!name || !text || this.currentRating === 0) {
                alert('Please provide your name, rating, and review.');
                return;
            }
            
            var reviewsList = document.getElementById('reviews-list');
            var newReview = document.createElement('div');
            newReview.style.background = 'var(--bg-card)';
            newReview.style.border = '1px solid var(--border-glow)';
            newReview.style.padding = '1rem';
            newReview.style.marginBottom = '1rem';
            newReview.innerHTML = '<p style="color:var(--text-secondary);margin-bottom:0.5rem;">"' + text + '"</p><span style="color:var(--text-muted);font-size:0.8rem;">- ' + name + ', Just now</span>';
            reviewsList.insertBefore(newReview, reviewsList.firstChild);
            
            var newCount = this.hotel.reviews + 1;
            document.querySelectorAll('.dynamic-reviews-count, .dynamic-reviews-total').forEach(function(el) {
                el.textContent = newCount;
            });
            
            this.hotelService.updateReviewsCount(this.hotelId, newCount);
            
            document.getElementById('reviewer-name').value = '';
            document.getElementById('review-text').value = '';
            this.currentRating = 0;
            this.setRating(0);
            this.toggleForm();
        }
    };
})();
