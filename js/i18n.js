/* Internationalization (i18n) - Muts Safaris */
/* Multi-language support with Swahili, German, French, Spanish */
(function() {
    'use strict';
    
    var i18n = {
        currentLang: 'en',
        strings: {},
        loaded: false,
        
        /**
         * Initialize i18n
         * @param {string} defaultLang - Default language code
         */
        init: function(defaultLang) {
            var self = this;
            
            // Try to get saved preference
            var saved = localStorage.getItem('muts_lang');
            var lang = saved || defaultLang || 'en';
            
            this.setLanguage(lang);
        },
        
        /**
         * Set current language and load strings
         * @param {string} lang - Language code
         */
        setLanguage: function(lang) {
            var self = this;
            
            this.currentLang = lang;
            localStorage.setItem('muts_lang', lang);
            
            // Load strings from API or use bundled
            this._loadStrings(lang).then(function() {
                self.loaded = true;
                self._updateDOM();
                
                // Dispatch event for other components
                window.dispatchEvent(new CustomEvent('languageChanged', { 
                    detail: { lang: lang } 
                }));
            });
        },
        
        /**
         * Load strings from API
         */
        _loadStrings: function(lang) {
            var self = this;
            
            // Check if API is available
            var baseURL = (window.MutsAPIConfig && window.MutsAPIConfig.getBaseURL) 
                ? window.MutsAPIConfig.getBaseURL() 
                : '/api';
            
            return fetch(baseURL + '/localization/strings?lang=' + lang, {
                headers: { 'Content-Type': 'application/json' }
            })
            .then(function(response) {
                if (!response.ok) throw new Error('Failed to load strings');
                return response.json();
            })
            .then(function(data) {
                self.strings = data;
            })
            .catch(function() {
                // Use bundled strings as fallback
                self.strings = self._getBundledStrings(lang);
            });
        },
        
        /**
         * Get bundled strings (fallback)
         */
        _getBundledStrings: function(lang) {
            // Return embedded strings based on language
            return window.i18nBundledStrings || {};
        },
        
        /**
         * Update DOM with translated strings
         */
        _updateDOM: function() {
            // Update all elements with data-i18n attribute
            var elements = document.querySelectorAll('[data-i18n]');
            elements.forEach(function(el) {
                var key = el.getAttribute('data-i18n');
                var translated = this.t(key);
                
                if (el.tagName === 'INPUT' && (el.type === 'placeholder' || el.type === 'value')) {
                    el.placeholder = translated;
                } else if (el.tagName !== 'INPUT') {
                    el.textContent = translated;
                }
            }.bind(this));
            
            // Update elements with data-i18n-placeholder
            var placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
            placeholderElements.forEach(function(el) {
                var key = el.getAttribute('data-i18n-placeholder');
                el.placeholder = this.t(key);
            }.bind(this));
        },
        
        /**
         * Translate a key
         * @param {string} key - Translation key (e.g., 'nav.home')
         * @param {Object} params - Parameters for interpolation
         * @returns {string} - Translated string
         */
        t: function(key, params) {
            var text = this.strings[key] || key;
            
            // Simple parameter interpolation
            if (params) {
                for (var param in params) {
                    text = text.replace('{{' + param + '}}', params[param]);
                }
            }
            
            return text;
        },
        
        /**
         * Get current language
         * @returns {string} - Current language code
         */
        getLanguage: function() {
            return this.currentLang;
        },
        
        /**
         * Get available languages
         * @returns {Array} - List of supported languages
         */
        getAvailableLanguages: function() {
            return [
                { code: 'en', name: 'English', native: 'English' },
                { code: 'sw', name: 'Swahili', native: 'Kiswahili' },
                { code: 'de', name: 'German', native: 'Deutsch' },
                { code: 'fr', name: 'French', native: 'Français' },
                { code: 'es', name: 'Spanish', native: 'Español' }
            ];
        },
        
        /**
         * Save preference to backend
         */
        savePreference: function() {
            var baseURL = (window.MutsAPIConfig && window.MutsAPIConfig.getBaseURL) 
                ? window.MutsAPIConfig.getBaseURL() 
                : '/api';
            
            fetch(baseURL + '/localization/preference?lang=' + this.currentLang, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            }).catch(function() {});
        }
    };
    
    // Initialize on load
    document.addEventListener('DOMContentLoaded', function() {
        i18n.init('en');
    });
    
    // Expose to global
    window.MutsI18n = i18n;
    
    // Convenience function for templates
    window.t = function(key, params) {
        return i18n.t(key, params);
    };
    
})();