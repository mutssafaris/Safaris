/**
 * Accessibility Utilities for Muts Safaris
 * Provides reusable functions for WCAG 2.1 AA compliance
 */

(function() {
    'use strict';

    /**
     * Initialize accessibility features
     */
    window.MutsA11y = {
        /**
         * Add skip link to page
         * @param {string} targetId - ID of main content element
         */
        addSkipLink: function(targetId) {
            var skipLink = document.createElement('a');
            skipLink.href = '#' + targetId;
            skipLink.className = 'skip-link';
            skipLink.textContent = 'Skip to main content';
            skipLink.setAttribute('aria-label', 'Skip to main content');
            document.body.insertBefore(skipLink, document.body.firstChild);
        },

        /**
         * Create focus trap inside a container
         * @param {HTMLElement} container - The modal/container element
         * @returns {Function} Function to release focus trap
         */
        trapFocus: function(container) {
            var focusableElements = container.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            var firstFocusable = focusableElements[0];
            var lastFocusable = focusableElements[focusableElements.length - 1];
            var previousActiveElement = document.activeElement;

            // Focus first element
            if (firstFocusable) {
                setTimeout(function() {
                    firstFocusable.focus();
                }, 50);
            }

            // Handle tab key
            var handleKeyDown = function(e) {
                if (e.key !== 'Tab') return;

                if (e.shiftKey) {
                    if (document.activeElement === firstFocusable) {
                        e.preventDefault();
                        lastFocusable.focus();
                    }
                } else {
                    if (document.activeElement === lastFocusable) {
                        e.preventDefault();
                        firstFocusable.focus();
                    }
                }
            };

            container.addEventListener('keydown', handleKeyDown);

            // Return release function
            return function() {
                container.removeEventListener('keydown', handleKeyDown);
                if (previousActiveElement) {
                    previousActiveElement.focus();
                }
            };
        },

        /**
         * Announce message to screen readers
         * @param {string} message - Message to announce
         * @param {string} priority - 'polite' or 'assertive'
         */
        announce: function(message, priority) {
            priority = priority || 'polite';
            var announcer = document.getElementById('a11y-announcer');
            if (!announcer) {
                announcer = document.createElement('div');
                announcer.id = 'a11y-announcer';
                announcer.setAttribute('role', 'status');
                announcer.setAttribute('aria-live', priority);
                announcer.setAttribute('aria-atomic', 'true');
                announcer.style.cssText = 'position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;';
                document.body.appendChild(announcer);
            }
            announcer.setAttribute('aria-live', priority);
            announcer.textContent = '';
            setTimeout(function() {
                announcer.textContent = message;
            }, 100);
        },

        /**
         * Add ARIA label to icon button
         * @param {HTMLElement} button - Button element
         * @param {string} label - Descriptive label
         */
        setButtonLabel: function(button, label) {
            button.setAttribute('aria-label', label);
            if (!button.title) {
                button.setAttribute('title', label);
            }
        },

        /**
         * Initialize form error announcement
         * @param {string} errorId - ID of error container
         */
        initErrorAnnouncement: function(errorId) {
            var errorEl = document.getElementById(errorId);
            if (errorEl) {
                errorEl.setAttribute('role', 'alert');
                errorEl.setAttribute('aria-live', 'polite');
                errorEl.setAttribute('aria-atomic', 'true');
            }
        },

        /**
         * Validate form inputs and announce errors
         * @param {HTMLFormElement} form - Form element
         * @param {Object} rules - Validation rules
         * @returns {boolean} Is form valid
         */
        validateForm: function(form, rules) {
            var isValid = true;
            var firstError = null;

            for (var fieldName in rules) {
                var field = form.querySelector('[name="' + fieldName + '"]');
                var rule = rules[fieldName];
                var errorId = fieldName + '-error';
                var errorEl = document.getElementById(errorId);

                if (!field) continue;

                // Clear previous error
                if (errorEl) {
                    errorEl.textContent = '';
                    errorEl.setAttribute('hidden', '');
                }
                field.setAttribute('aria-invalid', 'false');

                // Required check
                if (rule.required && !field.value.trim()) {
                    isValid = false;
                    if (!firstError) firstError = field;
                    if (errorEl) {
                        errorEl.textContent = rule.required;
                        errorEl.removeAttribute('hidden');
                    }
                    field.setAttribute('aria-invalid', 'true');
                    continue;
                }

                // Email check
                if (rule.email && field.value) {
                    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(field.value)) {
                        isValid = false;
                        if (!firstError) firstError = field;
                        if (errorEl) {
                            errorEl.textContent = rule.email;
                            errorEl.removeAttribute('hidden');
                        }
                        field.setAttribute('aria-invalid', 'true');
                    }
                }

                // Min length check
                if (rule.minLength && field.value && field.value.length < rule.minLength) {
                    isValid = false;
                    if (!firstError) firstError = field;
                    if (errorEl) {
                        errorEl.textContent = rule.minLength;
                        errorEl.removeAttribute('hidden');
                    }
                    field.setAttribute('aria-invalid', 'true');
                }
            }

            if (firstError) {
                firstError.focus();
                this.announce('Form has errors. Please correct them.', 'assertive');
            }

            return isValid;
        }
    };

    // Auto-init skip link if main element exists (add ID if missing)
    var mainEl = document.querySelector('main');
    if (mainEl) {
        if (!mainEl.id) {
            mainEl.id = 'main-content';
        }
        window.MutsA11y.addSkipLink(mainEl.id);
    }

    /**
     * Auto-add ARIA labels to icon-only buttons
     */
    window.MutsA11y.initIconButtons = function() {
        var iconButtonSelectors = [
            { selector: '.share-article-btn, [class*="share"]', label: 'Share article' },
            { selector: '.bookmark-article-btn, [class*="bookmark"]', label: 'Bookmark article' },
            { selector: '.like-btn, [class*="like"]', label: 'Like this content' },
            { selector: '.dislike-btn, [class*="dislike"]', label: 'Dislike this content' },
            { selector: '.favorite-btn', label: 'Toggle favorite' },
            { selector: '.btn-icon', label: 'Perform action' },
            { selector: '.chat-action-btn', label: 'Chat action' },
            { selector: '.filter-clear-btn', label: 'Clear all filters' },
            { selector: '.filter-pill', label: 'Toggle filter' },
            { selector: '[class*="delete"]', label: 'Delete item' },
            { selector: '[class*="edit"]', label: 'Edit item' },
            { selector: '[class*="close"]', label: 'Close' },
            { selector: '[class*="back"]', label: 'Go back' },
            { selector: '[class*="add"]', label: 'Add new item' },
            { selector: '[class*="remove"]', label: 'Remove item' }
        ];

        iconButtonSelectors.forEach(function(config) {
            var buttons = document.querySelectorAll(config.selector);
            buttons.forEach(function(btn) {
                if (!btn.hasAttribute('aria-label') && !btn.getAttribute('aria-label')) {
                    var label = btn.getAttribute('title') || config.label;
                    btn.setAttribute('aria-label', label);
                }
            });
        });
    };

    // Auto-init icon button labels when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            window.MutsA11y.initIconButtons();
        });
    } else {
        setTimeout(function() {
            window.MutsA11y.initIconButtons();
        }, 100);
    }
})();