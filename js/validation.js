/**
 * Input Validation Library - Muts Safaris
 * Provides validation utilities for user input across the application
 */
(function(window) {
    'use strict';

    var Validation = {
        /**
         * Email validation
         * @param {string} email 
         * @returns {boolean}
         */
        isEmail: function(email) {
            if (typeof email !== 'string') return false;
            var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        },

        /**
         * Phone number validation (international format)
         * @param {string} phone 
         * @returns {boolean}
         */
        isPhone: function(phone) {
            if (typeof phone !== 'string') return false;
            var phoneRegex = /^\+?[1-9]\d{6,14}$/;
            return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
        },

        /**
         * URL validation
         * @param {string} url 
         * @returns {boolean}
         */
        isURL: function(url) {
            if (typeof url !== 'string') return false;
            try {
                new URL(url);
                return true;
            } catch(e) {
                return false;
            }
        },

        /**
         * String length validation
         * @param {string} str 
         * @param {number} min 
         * @param {number} max 
         * @returns {boolean}
         */
        isLength: function(str, min, max) {
            if (typeof str !== 'string') return false;
            var len = str.trim().length;
            return len >= min && len <= max;
        },

        /**
         * Password strength validation
         * @param {string} password 
         * @returns {object} { valid: boolean, score: number, feedback: string }
         */
        isPassword: function(password) {
            if (typeof password !== 'string') {
                return { valid: false, score: 0, feedback: 'Password must be a string' };
            }
            
            var score = 0;
            var feedback = [];
            
            if (password.length >= 8) {
                score++;
            } else {
                feedback.push('At least 8 characters');
            }
            
            if (/[a-z]/.test(password)) {
                score++;
            } else {
                feedback.push('Add lowercase letters');
            }
            
            if (/[A-Z]/.test(password)) {
                score++;
            } else {
                feedback.push('Add uppercase letters');
            }
            
            if (/[0-9]/.test(password)) {
                score++;
            } else {
                feedback.push('Add numbers');
            }
            
            if (/[^a-zA-Z0-9]/.test(password)) {
                score++;
            } else {
                feedback.push('Add special characters');
            }
            
            var valid = score >= 4;
            if (feedback.length === 0) feedback.push('Strong password');
            
            return {
                valid: valid,
                score: score,
                feedback: feedback.join(', ')
            };
        },

        /**
         * Sanitize HTML to prevent XSS
         * @param {string} html 
         * @returns {string}
         */
        sanitizeHTML: function(html) {
            if (typeof html !== 'string') return '';
            var div = document.createElement('div');
            div.textContent = html;
            return div.innerHTML;
        },

        /**
         * Sanitize input string (remove dangerous characters)
         * @param {string} str 
         * @returns {string}
         */
        sanitize: function(str) {
            if (typeof str !== 'string') return '';
            return str.replace(/[<>'"]/g, '');
        },

        /**
         * Validate number range
         * @param {number} num 
         * @param {number} min 
         * @param {number} max 
         * @returns {boolean}
         */
        isInRange: function(num, min, max) {
            var n = Number(num);
            return !isNaN(n) && n >= min && n <= max;
        },

        /**
         * Date validation
         * @param {string} dateStr 
         * @returns {boolean}
         */
        isDate: function(dateStr) {
            if (typeof dateStr !== 'string') return false;
            var date = new Date(dateStr);
            return date instanceof Date && !isNaN(date);
        },

        /**
         * Future date validation
         * @param {string} dateStr 
         * @returns {boolean}
         */
        isFutureDate: function(dateStr) {
            if (!this.isDate(dateStr)) return false;
            return new Date(dateStr) > new Date();
        },

        /**
         * Validate required field
         * @param {any} value 
         * @returns {boolean}
         */
        isRequired: function(value) {
            if (value === null || value === undefined) return false;
            if (typeof value === 'string') return value.trim().length > 0;
            if (Array.isArray(value)) return value.length > 0;
            return true;
        },

        /**
         * Form validation - validates entire form data
         * @param {object} data - { fieldName: { value, rules: ['required', 'email', ...] } }
         * @returns {object} - { valid: boolean, errors: { fieldName: message } }
         */
        validateForm: function(data) {
            var errors = {};
            var isValid = true;

            for (var field in data) {
                var fieldData = data[field];
                var value = fieldData.value;
                var rules = fieldData.rules || [];

                for (var i = 0; i < rules.length; i++) {
                    var rule = rules[i];
                    var result = true;
                    var message = '';

                    switch(rule) {
                        case 'required':
                            result = this.isRequired(value);
                            message = 'This field is required';
                            break;
                        case 'email':
                            result = value ? this.isEmail(value) : true;
                            message = 'Invalid email address';
                            break;
                        case 'phone':
                            result = value ? this.isPhone(value) : true;
                            message = 'Invalid phone number';
                            break;
                        case 'url':
                            result = value ? this.isURL(value) : true;
                            message = 'Invalid URL';
                            break;
                        case 'min:8':
                            result = value ? this.isLength(value, 8, Infinity) : true;
                            message = 'Minimum 8 characters required';
                            break;
                    }

                    if (!result) {
                        errors[field] = message;
                        isValid = false;
                        break;
                    }
                }
            }

            return { valid: isValid, errors: errors };
        }
    };

    window.MutsValidation = Validation;
})(window);