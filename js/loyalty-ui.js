/* Loyalty UI Component - Muts Safaris */
/* Points display, rewards, referral sharing */
(function() {
    if (window.MutsLoyaltyUI) return;
    
    var LoyaltyUI = {
        container: null,
        profile: null,
        
        /**
         * Initialize loyalty UI
         * @param {string} containerId - Container element ID
         * @param {Object} options - Configuration
         */
        init: function(containerId, options) {
            var self = this;
            this.container = document.getElementById(containerId);
            this.options = options || {};
            
            if (!this.container) {
                console.error('[LoyaltyUI] Container not found:', containerId);
                return;
            }
            
            this._loadProfile();
        },
        
        /**
         * Load loyalty profile
         */
        _loadProfile: function() {
            var self = this;
            
            if (window.MutsLoyaltyService) {
                window.MutsLoyaltyService.getProfile().then(function(profile) {
                    self.profile = profile;
                    self._render();
                }).catch(function() {
                    self._renderLocal();
                });
            } else {
                this._renderLocal();
            }
        },
        
        /**
         * Render the UI
         */
        _render: function() {
            var p = this.profile;
            
            var tierColors = {
                'bronze': '#cd7f32',
                'silver': '#c0c0c0',
                'gold': '#ffd700',
                'platinum': '#e5e4e2'
            };
            
            var html = 
                '<div class="loyalty-card">' +
                    '<div class="loyalty-header" style="background: linear-gradient(135deg, ' + tierColors[p.tier] + ', #333);">' +
                        '<div class="tier-badge">' + p.tier.toUpperCase() + '</div>' +
                        '<div class="points-display">' +
                            '<span class="points-value">' + p.points + '</span>' +
                            '<span class="points-label">POINTS</span>' +
                        '</div>' +
                    '</div>' +
                    '<div class="loyalty-body">' +
                        '<div class="stat-row">' +
                            '<div class="stat">' +
                                '<span class="stat-value">$' + p.totalSpent.toFixed(0) + '</span>' +
                                '<span class="stat-label">Total Spent</span>' +
                            '</div>' +
                            '<div class="stat">' +
                                '<span class="stat-value">' + p.lifetimePoints + '</span>' +
                                '<span class="stat-label">Lifetime Points</span>' +
                            '</div>' +
                        '</div>';
            
            if (p.nextTier) {
                html += 
                    '<div class="next-tier-progress">' +
                        '<div class="progress-label">' +
                            '<span>Next: ' + p.nextTier + '</span>' +
                            '<span>' + p.pointsToNextTier + ' points to go</span>' +
                        '</div>' +
                        '<div class="progress-bar">' +
                            '<div class="progress-fill" style="width: ' + this._getProgressPercent(p) + '%"></div>' +
                        '</div>' +
                    '</div>';
            }
            
            html += 
                        '<div class="referral-section">' +
                            '<h4>Your Referral Code</h4>' +
                            '<div class="referral-code">' +
                                '<code>' + p.referralCode + '</code>' +
                                '<button class="copy-btn" data-code="' + p.referralCode + '">Copy</button>' +
                            '</div>' +
                            '<p class="referral-info">Share your code - both you and your friend earn 500 points!</p>' +
                        '</div>' +
                        '<div class="actions">' +
                            '<button class="btn btn-primary" id="redeem-btn">Redeem Points</button>' +
                            '<button class="btn btn-secondary" id="history-btn">View History</button>' +
                        '</div>' +
                    '</div>' +
                '</div>';
            
            this.container.innerHTML = html;
            
            this._attachEvents();
        },
        
        /**
         * Render local fallback
         */
        _renderLocal: function() {
            this.container.innerHTML = 
                '<div class="loyalty-card">' +
                    '<div class="loyalty-header" style="background: linear-gradient(135deg, #cd7f32, #333);">' +
                        '<div class="tier-badge">BRONZE</div>' +
                        '<div class="points-display">' +
                            '<span class="points-value">0</span>' +
                            '<span class="points-label">POINTS</span>' +
                        '</div>' +
                    '</div>' +
                    '<div class="loyalty-body">' +
                        '<p class="login-prompt">Login to view your loyalty points</p>' +
                    '</div>' +
                '</div>';
        },
        
        /**
         * Get progress percentage
         */
        _getProgressPercent: function(p) {
            var thresholds = { 'bronze': 0, 'silver': 1000, 'gold': 5000, 'platinum': 15000 };
            var next = { 'bronze': 'silver', 'silver': 'gold', 'gold': 'platinum' };
            
            var currentThreshold = thresholds[p.tier];
            var nextThreshold = thresholds[next[p.tier]] || 15000;
            var progress = p.lifetimePoints - currentThreshold;
            var total = nextThreshold - currentThreshold;
            
            return Math.min(100, Math.max(0, (progress / total) * 100));
        },
        
        /**
         * Attach event handlers
         */
        _attachEvents: function() {
            var self = this;
            
            // Copy referral code
            var copyBtn = this.container.querySelector('.copy-btn');
            if (copyBtn) {
                copyBtn.addEventListener('click', function() {
                    var code = this.dataset.code;
                    navigator.clipboard.writeText(code).then(function() {
                        self._showToast('Referral code copied!');
                    });
                });
            }
            
            // Redeem button
            var redeemBtn = this.container.querySelector('#redeem-btn');
            if (redeemBtn) {
                redeemBtn.addEventListener('click', function() {
                    self._showRedeemModal();
                });
            }
            
            // History button
            var historyBtn = this.container.querySelector('#history-btn');
            if (historyBtn) {
                historyBtn.addEventListener('click', function() {
                    self._showHistoryModal();
                });
            }
        },
        
        /**
         * Show redeem modal
         */
        _showRedeemModal: function() {
            var self = this;
            var p = this.profile;
            
            var modal = document.createElement('div');
            modal.className = 'loyalty-modal';
            modal.innerHTML = 
                '<div class="modal-content">' +
                    '<div class="modal-header">' +
                        '<h2>Redeem Points</h2>' +
                        '<button class="modal-close">&times;</button>' +
                    '</div>' +
                    '<div class="modal-body">' +
                        '<div class="balance-info">' +
                            '<p>Your Balance: <strong>' + p.points + ' points</strong></p>' +
                            '<p>Value: <strong>$' + (p.points * 0.10).toFixed(2) + '</strong></p>' +
                        '</div>' +
                        '<div class="redeem-options">' +
                            '<button class="redeem-option" data-points="500">' +
                                '<span class="points">500 pts</span>' +
                                '<span class="value">= $50 off</span>' +
                            '</button>' +
                            '<button class="redeem-option" data-points="1000">' +
                                '<span class="points">1000 pts</span>' +
                                '<span class="value">= $100 off</span>' +
                            '</button>' +
                            '<button class="redeem-option" data-points="2500">' +
                                '<span class="points">2500 pts</span>' +
                                '<span class="value">= $250 off</span>' +
                            '</button>' +
                        '</div>' +
                    '</div>' +
                '</div>';
            
            document.body.appendChild(modal);
            
            modal.querySelector('.modal-close').addEventListener('click', function() {
                document.body.removeChild(modal);
            });
            
            modal.querySelectorAll('.redeem-option').forEach(function(btn) {
                btn.addEventListener('click', function() {
                    var points = parseInt(this.dataset.points);
                    if (points > p.points) {
                        self._showToast('Insufficient points!');
                        return;
                    }
                    self._redeemPoints(points, modal);
                });
            });
        },
        
        /**
         * Redeem points
         */
        _redeemPoints: function(points, modal) {
            var self = this;
            
            window.MutsLoyaltyService.redeemPoints(points).then(function(result) {
                if (result.success) {
                    self._showToast('Success! You got $' + result.discount.toFixed(2) + ' off!');
                    self._loadProfile(); // Refresh
                } else {
                    self._showToast(result.message);
                }
                document.body.removeChild(modal);
            }).catch(function(err) {
                self._showToast('Error: ' + err.message);
            });
        },
        
        /**
         * Show history modal
         */
        _showHistoryModal: function() {
            var modal = document.createElement('div');
            modal.className = 'loyalty-modal';
            modal.innerHTML = 
                '<div class="modal-content">' +
                    '<div class="modal-header">' +
                        '<h2>Points History</h2>' +
                        '<button class="modal-close">&times;</button>' +
                    '</div>' +
                    '<div class="modal-body">' +
                        '<div class="history-list" id="history-list">' +
                            '<p class="loading">Loading...</p>' +
                        '</div>' +
                    '</div>' +
                '</div>';
            
            document.body.appendChild(modal);
            
            modal.querySelector('.modal-close').addEventListener('click', function() {
                document.body.removeChild(modal);
            });
            
            window.MutsLoyaltyService.getTransactions().then(function(transactions) {
                var list = modal.querySelector('#history-list');
                
                if (!transactions || transactions.length === 0) {
                    list.innerHTML = '<p class="empty">No transactions yet</p>';
                    return;
                }
                
                var html = '';
                transactions.forEach(function(t) {
                    var isPositive = t.points > 0;
                    html += 
                        '<div class="history-item ' + (isPositive ? 'earned' : 'redeemed') + '">' +
                            '<div class="history-info">' +
                                '<span class="history-desc">' + t.description + '</span>' +
                                '<span class="history-date">' + new Date(t.createdAt).toLocaleDateString() + '</span>' +
                            '</div>' +
                            '<span class="history-points ' + (isPositive ? 'positive' : 'negative') + '">' +
                                (isPositive ? '+' : '') + t.points + ' pts' +
                            '</span>' +
                        '</div>';
                });
                
                list.innerHTML = html;
            });
        },
        
        /**
         * Show toast message
         */
        _showToast: function(message) {
            var toast = document.createElement('div');
            toast.className = 'loyalty-toast';
            toast.textContent = message;
            document.body.appendChild(toast);
            
            setTimeout(function() {
                toast.classList.add('show');
            }, 10);
            
            setTimeout(function() {
                toast.classList.remove('show');
                setTimeout(function() { document.body.removeChild(toast); }, 300);
            }, 3000);
        }
    };
    
    // Auto-init
    document.addEventListener('DOMContentLoaded', function() {
        var autoInit = document.querySelector('[data-auto-init="loyalty-ui"]');
        if (autoInit) {
            LoyaltyUI.init(autoInit.id || 'loyalty-ui');
        }
    });
    
    window.MutsLoyaltyUI = LoyaltyUI;
})();