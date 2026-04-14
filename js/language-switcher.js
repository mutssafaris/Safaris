/* Language Switcher Component - Muts Safaris */
/* Dropdown for switching between supported languages */
(function() {
    if (window.MutsLanguageSwitcher) return;
    
    var LanguageSwitcher = {
        currentLang: 'en',
        
        /**
         * Initialize language switcher
         * @param {string} containerId - ID of container element
         * @param {Object} options - Configuration options
         */
        init: function(containerId, options) {
            var self = this;
            options = options || {};
            
            var container = document.getElementById(containerId);
            if (!container) {
                console.error('[LanguageSwitcher] Container not found:', containerId);
                return;
            }
            
            // Get current language
            this.currentLang = localStorage.getItem('muts_lang') || 'en';
            
            // Build the switcher HTML
            this._render(container, options);
            
            // Listen for language changes
            window.addEventListener('languageChanged', function(e) {
                self.currentLang = e.detail.lang;
                self._updateDisplay();
            });
        },
        
        /**
         * Render the switcher
         */
        _render: function(container, options) {
            var self = this;
            var languages = window.MutsI18n ? window.MutsI18n.getAvailableLanguages() : [
                { code: 'en', name: 'English', native: 'English' },
                { code: 'sw', name: 'Swahili', native: 'Kiswahili' },
                { code: 'de', name: 'German', native: 'Deutsch' },
                { code: 'fr', name: 'French', native: 'Français' },
                { code: 'es', name: 'Spanish', native: 'Español' }
            ];
            
            var currentLangObj = languages.find(function(l) { 
                return l.code === self.currentLang; 
            }) || languages[0];
            
            // Create dropdown
            var html = '<div class="language-switcher">' +
                '<button class="lang-switcher-btn" type="button">' +
                    '<span class="lang-flag">' + this._getFlag(self.currentLang) + '</span>' +
                    '<span class="lang-name">' + currentLangObj.native + '</span>' +
                    '<svg class="lang-arrow" viewBox="0 0 24 24" width="16" height="16"><path d="M7 10l5 5 5-5z"/></svg>' +
                '</button>' +
                '<div class="lang-dropdown">';
            
            languages.forEach(function(lang) {
                var isActive = lang.code === self.currentLang;
                html += '<button class="lang-option' + (isActive ? ' active' : '') + '" data-lang="' + lang.code + '">' +
                    '<span class="lang-flag">' + self._getFlag(lang.code) + '</span>' +
                    '<span class="lang-info">' +
                        '<span class="lang-native">' + lang.native + '</span>' +
                        '<span class="lang-english">' + lang.name + '</span>' +
                    '</span>' +
                '</button>';
            });
            
            html += '</div></div>';
            
            container.innerHTML = html;
            
            // Add event listeners
            var btn = container.querySelector('.lang-switcher-btn');
            var dropdown = container.querySelector('.lang-dropdown');
            
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                dropdown.classList.toggle('show');
            });
            
            // Close on outside click
            document.addEventListener('click', function() {
                dropdown.classList.remove('show');
            });
            
            // Language option clicks
            dropdown.querySelectorAll('.lang-option').forEach(function(option) {
                option.addEventListener('click', function() {
                    var lang = this.dataset.lang;
                    self._changeLanguage(lang, options);
                });
            });
        },
        
        /**
         * Change language
         */
        _changeLanguage: function(lang, options) {
            // Update i18n if available
            if (window.MutsI18n) {
                window.MutsI18n.setLanguage(lang);
                window.MutsI18n.savePreference();
            } else {
                localStorage.setItem('muts_lang', lang);
                location.reload(); // Simple fallback
            }
            
            // Callback if specified
            if (options.onChange) {
                options.onChange(lang);
            }
            
            this.currentLang = lang;
            this._updateDisplay();
        },
        
        /**
         * Update display without re-render
         */
        _updateDisplay: function() {
            var self = this;
            var container = document.querySelector('.language-switcher');
            if (!container) return;
            
            var languages = window.MutsI18n ? window.MutsI18n.getAvailableLanguages() : [
                { code: 'en', name: 'English', native: 'English' },
                { code: 'sw', name: 'Swahili', native: 'Kiswahili' },
                { code: 'de', name: 'German', native: 'Deutsch' },
                { code: 'fr', name: 'French', native: 'Français' },
                { code: 'es', name: 'Spanish', native: 'Español' }
            ];
            
            var currentLangObj = languages.find(function(l) { 
                return l.code === self.currentLang; 
            }) || languages[0];
            
            var btn = container.querySelector('.lang-switcher-btn');
            btn.querySelector('.lang-flag').textContent = self._getFlag(self.currentLang);
            btn.querySelector('.lang-name').textContent = currentLangObj.native;
            
            // Update active state
            container.querySelectorAll('.lang-option').forEach(function(opt) {
                opt.classList.toggle('active', opt.dataset.lang === self.currentLang);
            });
        },
        
        /**
         * Get flag emoji for language
         */
        _getFlag: function(lang) {
            var flags = {
                'en': '🇬🇧',
                'sw': '🇰🇪',
                'de': '🇩🇪',
                'fr': '🇫🇷',
                'es': '🇪🇸'
            };
            return flags[lang] || '🌐';
        }
    };
    
    // Auto-init if data attribute present
    document.addEventListener('DOMContentLoaded', function() {
        var autoInit = document.querySelector('[data-auto-init="language-switcher"]');
        if (autoInit) {
            LanguageSwitcher.init(autoInit.id || 'language-switcher');
        }
    });
    
    window.MutsLanguageSwitcher = LanguageSwitcher;
})();