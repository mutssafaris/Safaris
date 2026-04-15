/**
 * Muts Safaris Theme Switcher
 * Handles theme switching between dark (orange) and light (blue) themes
 */

(function() {
    'use strict';

    const THEME_STORAGE_KEY = 'muts-safaris-theme';
    const THEME_DARK = 'dark';
    const THEME_LIGHT = 'light';

    class MutsThemeSwitcher {
        constructor() {
            const existingTheme = document.documentElement.getAttribute('data-theme');
            this.currentTheme = this.getStoredTheme() || existingTheme || THEME_DARK;
            this.init();
        }

        init() {
            // Skip if dark theme is already set in HTML (login page pattern)
            const existingTheme = document.documentElement.getAttribute('data-theme');
            if (existingTheme === 'dark') {
                this.currentTheme = THEME_DARK;
                this.setStoredTheme(THEME_DARK);
                return;
            }
            this.applyTheme(this.currentTheme);
            this.setupEventListeners();
            this.createThemeSwitcherUI();
        }

        getStoredTheme() {
            try {
                return localStorage.getItem(THEME_STORAGE_KEY);
            } catch (e) {
                console.warn('[ThemeSwitcher] Could not read from localStorage:', e);
                return null;
            }
        }

        setStoredTheme(theme) {
            try {
                localStorage.setItem(THEME_STORAGE_KEY, theme);
            } catch (e) {
                console.warn('[ThemeSwitcher] Could not write to localStorage:', e);
            }
        }

        applyTheme(theme) {
            document.documentElement.setAttribute('data-theme', theme);
            this.currentTheme = theme;
            this.setStoredTheme(theme);

            // Update meta theme-color for mobile browsers
            const metaThemeColor = document.querySelector('meta[name="theme-color"]');
            if (metaThemeColor) {
                const browserColor = this.getThemeBrowserColor(theme);
                metaThemeColor.setAttribute('content', browserColor);
            }

            // Dispatch custom event for other components to listen
            window.dispatchEvent(new CustomEvent('themeChanged', {
                detail: { theme: theme }
            }));
        }

        switchTheme() {
            const newTheme = this.currentTheme === THEME_DARK ? THEME_LIGHT : THEME_DARK;
            this.applyTheme(newTheme);
        }

        setTheme(theme) {
            if (theme === THEME_DARK || theme === THEME_LIGHT) {
                this.applyTheme(theme);
            }
        }

        getThemeBrowserColor(theme) {
            const rootStyles = getComputedStyle(document.documentElement);
            const token = rootStyles.getPropertyValue('--theme-browser-color').trim();
            if (token) {
                return token;
            }
            return theme === THEME_LIGHT ? '#f8fbff' : '#050510';
        }

        getCurrentTheme() {
            return this.currentTheme;
        }

        createThemeSwitcherUI() {
            // Create theme switcher component
            const themeSwitcher = document.createElement('div');
            themeSwitcher.className = 'theme-switcher';
            themeSwitcher.innerHTML = `
                <button class="theme-switcher-btn ${this.currentTheme === THEME_LIGHT ? 'active' : ''}"
                        data-theme="${THEME_LIGHT}"
                        title="Light Theme">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm-14.34 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06c.39-.39.39-1.03 0-1.41-.39.39-1.03.39-1.41 0zM12 9c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                    </svg>
                </button>
                <button class="theme-switcher-btn ${this.currentTheme === THEME_DARK ? 'active' : ''}"
                        data-theme="${THEME_DARK}"
                        title="Dark Theme">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9.37 5.51c-.18.64-.27 1.31-.27 1.99 0 4.08 3.32 7.4 7.4 7.4.68 0 1.35-.09 1.99-.27C17.45 17.19 14.93 19 12 19c-3.86 0-7-3.14-7-7 0-2.93 1.81-5.45 4.37-6.49zM12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"/>
                    </svg>
                </button>
            `;

            // Add event listeners
            themeSwitcher.addEventListener('click', (e) => {
                const btn = e.target.closest('.theme-switcher-btn');
                if (btn) {
                    const theme = btn.dataset.theme;
                    this.setTheme(theme);
                    this.updateUI();
                }
            });

            // Store reference for UI updates
            this.themeSwitcherElement = themeSwitcher;
            this.updateUI();
        }

        updateUI() {
            if (!this.themeSwitcherElement) return;

            const lightBtn = this.themeSwitcherElement.querySelector('[data-theme="light"]');
            const darkBtn = this.themeSwitcherElement.querySelector('[data-theme="dark"]');

            if (lightBtn && darkBtn) {
                lightBtn.classList.toggle('active', this.currentTheme === THEME_LIGHT);
                darkBtn.classList.toggle('active', this.currentTheme === THEME_DARK);
            }
        }

        setupEventListeners() {
            // Listen for system theme changes (if supported)
            if (window.matchMedia) {
                const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
                mediaQuery.addEventListener('change', (e) => {
                    // Only auto-switch if no theme is stored (first visit)
                    if (!this.getStoredTheme()) {
                        this.setTheme(e.matches ? THEME_LIGHT : THEME_DARK);
                    }
                });
            }
        }

        // Public API methods
        getThemeSwitcherElement() {
            return this.themeSwitcherElement;
        }

        toggle() {
            this.switchTheme();
        }

        toLight() {
            this.setTheme(THEME_LIGHT);
        }

        toDark() {
            this.setTheme(THEME_DARK);
        }

        isLight() {
            return this.currentTheme === THEME_LIGHT;
        }

        isDark() {
            return this.currentTheme === THEME_DARK;
        }
    }

    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        window.MutsThemeSwitcher = new MutsThemeSwitcher();

        // Auto-initialize in common containers
        const containers = [
            'theme-switcher-container',
            'dashboard-theme-switcher',
            'header-theme-switcher'
        ];

        containers.forEach(containerId => {
            const container = document.getElementById(containerId);
            if (container && window.MutsThemeSwitcher.getThemeSwitcherElement()) {
                container.appendChild(window.MutsThemeSwitcher.getThemeSwitcherElement());
            }
        });
    });

    // Expose to global scope
    window.MutsThemeSwitcher = window.MutsThemeSwitcher || {};

})();
