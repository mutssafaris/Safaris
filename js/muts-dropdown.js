/**
 * Custom Dropdown - Muts Safaris
 * Theme-styled dropdown replace select elements
 * 
 * Usage:
 *   new MutsDropdown(elementId, options)
 */
(function() {
    'use strict';

    var MutsDropdown = function(elementId, options) {
        options = options || {};
        
        this.select = document.getElementById(elementId);
        if (!this.select) {
            console.error('[Dropdown] Element not found:', elementId);
            return;
        }
        
        this.placeholder = options.placeholder || 'Select...';
        this.onChange = options.onChange || null;
        
        this.init();
    };

    MutsDropdown.prototype.init = function() {
        var self = this;
        
        // Get all options
        this.options = [];
        var nativeOptions = this.select.querySelectorAll('option');
        nativeOptions.forEach(function(opt) {
            self.options.push({
                value: opt.value,
                text: opt.textContent
            });
        });
        
        // Hide original select
        this.select.style.display = 'none';
        
        // Create custom dropdown
        this.container = document.createElement('div');
        this.container.className = 'mut-dropdown';
        
        // Selected display
        this.display = document.createElement('div');
        this.display.className = 'mut-dropdown-display';
        this.display.textContent = this.placeholder;
        this.display.addEventListener('click', function(e) {
            e.stopPropagation();
            self.toggle();
        });
        
        // Dropdown menu
        this.menu = document.createElement('div');
        this.menu.className = 'mut-dropdown-menu';
        this.menu.style.display = 'none';
        
        // Create options
        this.options.forEach(function(opt) {
            var item = document.createElement('div');
            item.className = 'mut-dropdown-item';
            item.textContent = opt.text;
            item.dataset.value = opt.value;
            
            item.addEventListener('click', function() {
                self.selectOption(opt.value, opt.text);
            });
            
            self.menu.appendChild(item);
        });
        
        // Build
        this.container.appendChild(this.display);
        this.container.appendChild(this.menu);
        
        // Insert after original select
        this.select.parentNode.insertBefore(this.container, this.select.nextSibling);
        
        // Add styles
        this.addStyles();
        
        // Close on outside click
        document.addEventListener('click', function() {
            self.close();
        });
        
        console.log('[Dropdown] Initialized for:', elementId);
    };

    MutsDropdown.prototype.toggle = function() {
        if (this.menu.style.display === 'none') {
            this.menu.style.display = 'block';
            this.display.classList.add('open');
        } else {
            this.close();
        }
    };

    MutsDropdown.prototype.close = function() {
        this.menu.style.display = 'none';
        this.display.classList.remove('open');
    };

    MutsDropdown.prototype.selectOption = function(value, text) {
        this.select.value = value;
        this.display.textContent = text;
        this.close();
        
        if (this.onChange) {
            this.onChange(value, text);
        }
    };

    MutsDropdown.prototype.addStyles = function() {
        if (document.getElementById('mut-dropdown-styles')) return;
        
        var style = document.createElement('style');
        style.id = 'mut-dropdown-styles';
        style.textContent = `
            .mut-dropdown {
                position: relative;
                width: 100%;
                max-width: 300px;
            }
            .mut-dropdown-display {
                background: var(--surface-card);
                border: 1px solid var(--border-color);
                border-radius: 6px;
                color: var(--text-primary);
                padding: 0.75rem 40px 0.75rem 14px;
                font-size: 1rem;
                cursor: pointer;
                transition: all 0.2s ease;
                position: relative;
            }
            .mut-dropdown-display:hover {
                border-color: var(--accent);
            }
            .mut-dropdown-display.open {
                border-color: var(--accent);
                box-shadow: 0 0 15px var(--accent-glow);
            }
            .mut-dropdown-display:after {
                content: '';
                position: absolute;
                right: 14px;
                top: 50%;
                transform: translateY(-50%);
                border: 5px solid transparent;
                border-top-color: var(--accent);
            }
            .mut-dropdown-display:empty:before {
                content: 'Select category...';
                color: var(--text-muted);
            }
            .mut-dropdown-menu {
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: var(--surface-card);
                border: 1px solid var(--border-color);
                border-radius: 6px;
                margin-top: 4px;
                max-height: 250px;
                overflow-y: auto;
                z-index: 1000;
                box-shadow: 0 8px 25px rgba(0,0,0,0.4);
            }
            .mut-dropdown-item {
                padding: 0.75rem 14px;
                color: var(--text-primary);
                cursor: pointer;
                transition: all 0.15s ease;
                border-bottom: 1px solid var(--border-color);
            }
            .mut-dropdown-item:last-child {
                border-bottom: none;
            }
            .mut-dropdown-item:hover {
                background: var(--accent);
                color: var(--text-on-accent);
            }
            .mut-dropdown-item.selected {
                background: var(--bg-hover);
                color: var(--accent);
            }
        `;
        document.head.appendChild(style);
    };

    window.MutsDropdown = MutsDropdown;

})();