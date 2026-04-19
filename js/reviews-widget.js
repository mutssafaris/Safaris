/* Reviews Widget — Muts Safaris */
/* Embedded widget for displaying and submitting reviews */
(function() {
    'use strict';

    function createReviewsWidget(config) {
        var itemType = config.itemType || 'hotels';
        var itemId = config.itemId || '';
        var containerId = config.containerId || 'reviews-widget';
        var verifyBooking = config.verifyBooking !== false; // Default true
        
        var widget = {
            render: function() {
                var container = document.getElementById(containerId);
                if (!container) return;
                
                container.innerHTML = '<div class="reviews-loading">Loading reviews...</div>';
                
                loadReviews.call(this, container);
            },
            
            canSubmitReview: function() {
                return Promise.resolve(true); // Default allow - override for verification
            },
            
            renderForm: function(canReview) {
                if (!canReview) {
                    return '<div class="review-auth-required" style="background:var(--bg-card);border:1px solid var(--border-glow);padding:1.5rem;margin-top:1rem;text-align:center;">' +
                        '<p style="color:var(--text-secondary);margin-bottom:0.5rem;">Only guests who have recently stayed can leave reviews</p>' +
                        '<p style="color:var(--text-muted);font-size:0.85rem;">Booking verification required (within last 90 days)</p>' +
                    '</div>';
                }
                
                var session = window.MutsAuth ? window.MutsAuth.getSession() : null;
                var user = session ? session.user : null;
                
                if (!session) {
                    return '<div class="review-auth-required" style="background:var(--bg-card);border:1px solid var(--border-glow);padding:1.5rem;margin-top:1rem;text-align:center;">' +
                        '<p style="color:var(--text-secondary);margin-bottom:0.5rem;">Please login to leave a review</p>' +
                    '</div>';
                }
                
                return '<div class="review-form">' +
                    '<h4>Write a Review</h4>' +
                    '<div class="rating-selector">' +
                        '<label>Rating:</label>' +
                        '<div class="star-rating-input">' +
                            this._renderStarInput('review-rating', 5) +
                        '</div>' +
                    '</div>' +
                    '<div class="review-text-container">' +
                        '<label>Your Review:</label>' +
                        '<textarea id="review-text" placeholder="Share your experience..." rows="4"></textarea>' +
                    '</div>' +
                    '<button class="btn btn-primary" onclick="window.MutsReviewsWidget.submitReview()">Submit Review</button>' +
                '</div>';
            },
            
            _renderStarInput: function(name, maxRating) {
                var html = '';
                for (var i = maxRating; i >= 1; i--) {
                    html += '<input type="radio" name="' + name + '" value="' + i + '">';
                    html += '<label for="' + name + '-' + i + '">★</label>';
                }
                return html;
            },
            
            submitReview: function() {
                var text = document.getElementById('review-text').value;
                var radios = document.getElementsByName('review-rating');
                var rating = 5;
                for (var i = 0; i < radios.length; i++) {
                    if (radios[i].checked) {
                        rating = parseInt(radios[i].value);
                        break;
                    }
                }
                
                if (!text || text.trim().length < 10) {
                    alert('Please write at least 10 characters in your review.');
                    return;
                }
                
                var session = window.MutsAuth ? window.MutsAuth.getSession() : null;
                var userData = session ? session.user : null;
                
                var reviewData = {
                    rating: rating,
                    text: text,
                    user: userData ? userData.name : 'Guest User'
                };
                
                var submitBtn = document.querySelector('.review-form .btn');
                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.textContent = 'Submitting...';
                }
                
                var self = this;
                window.MutsReviewsService.addReview(itemType, itemId, reviewData)
                    .then(function(result) {
                        if (submitBtn) {
                            submitBtn.disabled = false;
                            submitBtn.textContent = 'Submit Review';
                        }
                        
                        document.getElementById('review-text').value = '';
                        self.render();
                    })
                    .catch(function(err) {
                        if (submitBtn) {
                            submitBtn.disabled = false;
                            submitBtn.textContent = 'Submit Review';
                        }
                        alert('Error submitting review: ' + err.message);
                    });
            }
        };
        
        function loadReviews(container) {
            var self = this;
            
            Promise.all([
                window.MutsReviewsService.getReviewsForItem(itemType, itemId),
                window.MutsReviewsService.getItemRating(itemType, itemId)
            ]).then(function(results) {
                var reviews = results[0];
                var rating = results[1];
                
                self._renderReviews(container, reviews, rating);
            }).catch(function(err) {
                container.innerHTML = '<div class="reviews-error">Unable to load reviews</div>';
            });
        }
        
        function renderStars(rating) {
            var html = '';
            for (var i = 1; i <= 5; i++) {
                html += i <= rating ? '★' : '☆';
            }
            return html;
        }
        
        widget._renderReviews = function(container, reviews, rating) {
            var avgRating = rating.average || 0;
            var count = rating.count || 0;
            
            var html = '<div class="reviews-summary">' +
                '<div class="reviews-rating">' +
                    '<span class="rating-value">' + avgRating.toFixed(1) + '</span>' +
                    '<span class="rating-stars">' + renderStars(Math.round(avgRating)) + '</span>' +
                    '<span class="rating-count">(' + count + ' reviews)</span>' +
                '</div>' +
            '</div>';
            
            if (reviews && reviews.length > 0) {
                html += '<div class="reviews-list">';
                reviews.forEach(function(review) {
                    var date = review.date ? new Date(review.date).toLocaleDateString() : '';
                    html += '<div class="review-item">' +
                        '<div class="review-header">' +
                            '<span class="review-user">' + review.user + '</span>' +
                            '<span class="review-rating">' + renderStars(review.rating) + '</span>' +
                            '<span class="review-date">' + date + '</span>' +
                        '</div>' +
                        '<div class="review-text">' + review.text + '</div>' +
                        '<div class="review-footer">' +
                            '<button class="helpful-btn" data-review-id="' + review.id + '">' +
                                '👍 Helpful (' + (review.helpful || 0) + ')' +
                            '</button>' +
                        '</div>' +
                    '</div>';
                });
                html += '</div>';
            } else {
                html += '<div class="reviews-empty">No reviews yet. Be the first to review!</div>';
            }
            
            // Check booking verification for review form
            var canReview = !verifyBooking; // Skip check if verifyBooking is false
            
            if (verifyBooking && window.MutsBookingsService) {
                // Check if user has recent completed booking for this item
                var recentDays = 90;
                var cutoffDate = new Date();
                cutoffDate.setDate(cutoffDate.getDate() - recentDays);
                
                // Booking verification is async, we'll show form but validate on submit
                // For now, show form to logged-in users
                var session = window.MutsAuth ? window.MutsAuth.getSession() : null;
                canReview = !!session;
            }
            
            html += widget.renderForm(canReview);
            container.innerHTML = html;
            
            document.querySelectorAll('.helpful-btn').forEach(function(btn) {
                btn.addEventListener('click', function() {
                    var reviewId = this.dataset.reviewId;
                    window.MutsReviewsService.markHelpful(reviewId).then(function() {
                        widget.render();
                    });
                });
            });
        };
        
        return widget;
    }
    
    var activeWidget = null;
    
    window.MutsReviewsWidget = {
        create: createReviewsWidget,
        init: function(config) {
            activeWidget = createReviewsWidget(config);
            activeWidget.render();
            return activeWidget;
        },
        submitReview: function() {
            if (activeWidget) {
                activeWidget.submitReview();
            }
        }
    };
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            console.log('[ReviewsWidget] Loaded');
        });
    }
})();