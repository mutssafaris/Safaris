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
            
            // Load bundled strings directly (no API needed)
            this.strings = this._getBundledStrings(lang);
            this.currentLang = lang;
            this.loaded = true;
            this._updateDOM();
            
            console.log('[i18n] initialized:', lang);
        },
        
        /**
         * Set current language and load strings
         * @param {string} lang - Language code
         */
        setLanguage: function(lang) {
            var self = this;
            
            // Use only bundled strings (no API needed)
            this.strings = this._getBundledStrings(lang);
            this.currentLang = lang;
            this.loaded = true;
            localStorage.setItem('muts_lang', lang);
            
            this._updateDOM();
            
            // Dispatch event for other components
            window.dispatchEvent(new CustomEvent('languageChanged', { 
                detail: { lang: lang } 
            }));
            
            console.log('[i18n] language set:', lang);
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
         * Get bundled strings (fallback when API unavailable)
         */
        _getBundledStrings: function(lang) {
            var bundles = {
                en: {
                    // Navigation
                    'nav.dashboard': 'Dashboard',
                    'nav.travel_info': 'Travel Info',
                    'nav.my_trips': 'My Trips',
                    'nav.gallery': 'Gallery',
                    'nav.map': 'Map',
                    'nav.beaches': 'Beaches',
                    'nav.packages': 'Packages',
                    'nav.africasa': 'Africasa',
                    'nav.blog': 'Blog',
                    'nav.faq': 'FAQ',
                    'nav.about': 'About',
                    'nav.contact': 'Contact',
                    'nav.favorites': 'Favorites',
                    'nav.messages': 'Messages',
                    'nav.transactions': 'Transactions',
                    'nav.settings': 'Settings',
                    'nav.logout': 'Logout',
                    'nav.loyalty': 'My Points',
                    'nav.hotels': 'Hotels',
                    'nav.tours': 'Tours',
                    'nav.experiences': 'Experiences',
                    
                    // Common
                    'common.search': 'Search',
                    'common.loading': 'Loading...',
                    'common.no_results': 'No results found',
                    'common.error': 'An error occurred',
                    'common.save': 'Save',
                    'common.cancel': 'Cancel',
                    'common.delete': 'Delete',
                    'common.edit': 'Edit',
                    'common.view': 'View',
                    'common.back': 'Back',
                    'common.next': 'Next',
                    'common.previous': 'Previous',
                    'common.submit': 'Submit',
                    'common.close': 'Close',
                    
                    // Auth
                    'auth.login': 'Login',
                    'auth.signup': 'Sign Up',
                    'auth.logout': 'Logout',
                    'auth.email': 'Email',
                    'auth.password': 'Password',
                    'auth.forgot_password': 'Forgot Password?',
                    'auth.remember_me': 'Remember Me',
                    
                    // Blog
                    'blog.create': 'Create Blog',
                    'blog.title': 'Title',
                    'blog.content': 'Content',
                    'blog.category': 'Category',
                    'blog.tags': 'Tags',
                    'blog.publish': 'Publish',
                    'blog.draft': 'Save as Draft',
                    'blog.my_blogs': 'My Blogs',
                    'blog.all_blogs': 'All Blogs',
                    
                    // Footer
                    'footer.about': 'About Muts Safaris',
                    'footer.contact': 'Contact Us',
                    'footer.privacy': 'Privacy Policy',
                    'footer.terms': 'Terms of Service',
                    'footer.copyright': '© 2026 Muts Safaris. All rights reserved.'
                },
                
                sw: {
                    // Navigation
                    'nav.dashboard': 'Dashibodi',
                    'nav.travel_info': 'Habari ya Safari',
                    'nav.my_trips': 'Safari zangu',
                    'nav.gallery': 'Picha',
                    'nav.map': 'Ramani',
                    'nav.beaches': 'Mwani',
                    'nav.packages': 'Vifurushi',
                    'nav.africasa': 'Africasa',
                    'nav.blog': 'Blogu',
                    'nav.faq': 'Maswali',
                    'nav.about': 'Kuhusu',
                    'nav.contact': 'Wasiliana',
                    'nav.favorites': 'Vipenzi',
                    'nav.messages': 'Mahali',
                    'nav.transactions': 'Miamala',
                    'nav.settings': 'Mipangilio',
                    'nav.logout': 'Toka',
                    'nav.loyalty': 'Pointi zangu',
                    'nav.hotels': 'Hoteli',
                    'nav.tours': 'Safari',
                    'nav.experiences': 'Matukio',
                    
                    // Common
                    'common.search': 'Tafuta',
                    'common.loading': 'Inapakia...',
                    'common.no_results': 'Hakuna matokeo',
                    'common.error': 'Hitilafu imetokea',
                    'common.save': 'Hifadhi',
                    'common.cancel': 'Ghairi',
                    'common.delete': 'Futa',
                    'common.edit': 'Hariri',
                    'common.view': 'Angalia',
                    'common.back': 'Rudi',
                    'common.next': 'Mbele',
                    'common.previous': 'Nyuma',
                    'common.submit': 'Wasilisha',
                    'common.close': 'Funga',
                    
                    // Auth
                    'auth.login': 'Ingia',
                    'auth.signup': 'Jisajili',
                    'auth.logout': 'Toka',
                    'auth.email': 'Barua pepe',
                    'auth.password': 'Nenosiri',
                    'auth.forgot_password': 'Umesahau nenosiri?',
                    'auth.remember_me': 'Nikumbuke',
                    
                    // Blog
                    'blog.create': 'Andika',
                    'blog.title': 'Kichwa',
                    'blog.content': 'Maumbo',
                    'blog.category': 'Kitendo',
                    'blog.tags': 'Lebo',
                    'blog.publish': 'Chapisha',
                    'blog.draft': 'Hifadhi Rasimu',
                    'blog.my_blogs': 'Blogu yangu',
                    'blog.all_blogs': 'Blogu Zote',
                    
                    // Footer
                    'footer.about': 'Kuhusu Muts Safaris',
                    'footer.contact': 'Wasiliana',
                    'footer.privacy': 'Sera ya Faragha',
                    'footer.terms': 'Masharti',
                    'footer.copyright': '© 2026 Muts Safaris. Haki zote zimehifadhiwa.'
                }
            };
            
            return bundles[lang] || bundles.en;
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
         * Save preference (uses localStorage only)
         */
        savePreference: function() {
            // Already saved in setLanguage via localStorage
            console.log('[i18n] preference saved:', this.currentLang);
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