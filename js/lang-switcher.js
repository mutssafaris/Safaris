/**
 * Language Switcher - Muts Safaris
 * Quick language toggle for the UI
 * 
 * Usage:
 *   MutsLangSwitcher.init(containerSelector)
 */
(function() {
    'use strict';

    var MutsLangSwitcher = {
        container: null,
        
        init: function(selector) {
            this.container = document.querySelector(selector);
            if (!this.container) return;
            
            this.render();
            this.bindEvents();
            
            console.log('[LangSwitcher] initialized');
        },
        
        render: function() {
            var current = window.MutsI18n ? window.MutsI18n.getLanguage() : 'en';
            var languages = [
                { code: 'en', name: 'EN', label: 'English' },
                { code: 'sw', name: 'SW', label: 'Kiswahili' }
            ];
            
            var html = '<div class="lang-switcher">';
            languages.forEach(function(lang) {
                html += '<button type="button" class="lang-btn' + (lang.code === current ? ' active' : '') + '" data-lang="' + lang.code + '" title="' + lang.label + '">' + lang.name + '</button>';
            });
            html += '</div>';
            
            this.container.innerHTML = html;
            
            // Add styles
            this.addStyles();
        },
        
        addStyles: function() {
            if (document.getElementById('lang-switcher-styles')) return;
            
            var style = document.createElement('style');
            style.id = 'lang-switcher-styles';
            style.textContent = `
                .lang-switcher {
                    display: flex;
                    gap: 2px;
                    background: var(--surface-card);
                    border: 1px solid var(--border-color);
                    border-radius: 4px;
                    padding: 2px;
                }
                .lang-btn {
                    padding: 4px 8px;
                    background: transparent;
                    border: none;
                    color: var(--text-muted);
                    font-size: 0.7rem;
                    font-weight: 600;
                    cursor: pointer;
                    border-radius: 3px;
                    transition: all 0.2s ease;
                }
                .lang-btn:hover {
                    color: var(--accent);
                }
                .lang-btn.active {
                    background: var(--accent);
                    color: var(--text-on-accent);
                }
            `;
            document.head.appendChild(style);
        },
        
        bindEvents: function() {
            var self = this;
            var buttons = this.container.querySelectorAll('.lang-btn');
            
            buttons.forEach(function(btn) {
                btn.addEventListener('click', function() {
                    var lang = this.dataset.lang;
                    if (window.MutsI18n) {
                        window.MutsI18n.setLanguage(lang);
                    }
                    self.render();
                });
            });
        }
    };

    window.MutsLangSwitcher = MutsLangSwitcher;

})();