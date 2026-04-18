/**
 * SEO Manager - Muts Safaris
 * Meta tags management for blog posts and pages
 * 
 * Usage:
 *   new MutsSEOManager(formId, options)
 */
(function() {
    'use strict';

    var MutsSEOManager = function(formId, options) {
        options = options || {};
        
        this.container = document.getElementById(formId);
        if (!this.container) {
            console.error('[SEO] Container not found:', formId);
            return;
        }
        
        this.defaultTitle = options.defaultTitle || 'Muts Safaris';
        this.defaultDesc = options.defaultDescription || 'Premium African Safari Experiences';
        this.maxTitle = options.maxTitleLength || 60;
        this.maxDesc = options.maxDescLength || 160;
        
        this.init();
    };

    MutsSEOManager.prototype.init = function() {
        var self = this;
        
        // Build SEO form
        this.container.innerHTML = 
            '<div class="mut-seo-section">' +
            '<h4>Search Engine Optimization</h4>' +
            '<p class="mut-seo-hint">Optimize your post for search engines</p>' +
            
            '<div class="form-group">' +
            '<label for="seo-title">SEO Title <span class="mut-seo-count" id="seo-title-count">0/' + this.maxTitle + '</span></label>' +
            '<input type="text" id="seo-title" placeholder="' + this.defaultTitle + '">' +
            '<p class="mut-seo-preview-label">Preview:</p>' +
            '<div class="mut-seo-preview">' +
            '<div class="mut-seo-preview-title" id="seo-preview-title">' + this.defaultTitle + '</div>' +
            '<div class="mut-seo-preview-url">https://mutssafaris.com/blog/...</div>' +
            '<div class="mut-seo-preview-desc">' + this.defaultDesc + '</div>' +
            '</div>' +
            '</div>' +
            
            '<div class="form-group">' +
            '<label for="seo-description">Meta Description <span class="mut-seo-count" id="seo-desc-count">0/' + this.maxDesc + '</span></label>' +
            '<textarea id="seo-description" rows="3" placeholder="' + this.defaultDesc + '"></textarea>' +
            '</div>' +
            
            '<div class="form-group">' +
            '<label for="seo-keywords">Keywords</label>' +
            '<input type="text" id="seo-keywords" placeholder="safari, kenya, wildlife, maasai mara">' +
            '<p class="mut-seo-hint">Separate keywords with commas</p>' +
            '</div>' +
            
            '<div class="form-group">' +
            '<label for="seo-canonical">Canonical URL (optional)</label>' +
            '<input type="url" id="seo-canonical" placeholder="https://example.com/page">' +
            '</div>' +
            '</div>';
        
        // Add styles
        this.addStyles();
        
        // Bind events
        this.bindEvents();
        
        console.log('[SEO] Manager initialized');
    };

    MutsSEOManager.prototype.addStyles = function() {
        if (document.getElementById('mut-seo-styles')) return;
        
        var style = document.createElement('style');
        style.id = 'mut-seo-styles';
        style.textContent = `
            .mut-seo-section {
                padding: 1.5rem;
                background: var(--surface-card);
                border: 1px solid var(--border-color);
                border-radius: 8px;
            }
            .mut-seo-section h4 {
                margin: 0 0 0.25rem;
                color: var(--text-primary);
                font-family: var(--font-family-heading);
            }
            .mut-seo-hint {
                margin: 0 0 1rem;
                color: var(--text-muted);
                font-size: 0.85rem;
            }
            .mut-seo-count {
                float: right;
                font-size: 0.75rem;
                color: var(--text-muted);
            }
            .mut-seo-count.warning {
                color: var(--warning);
            }
            .mut-seo-count.danger {
                color: var(--danger);
            }
            .mut-seo-preview {
                margin-top: 0.5rem;
                padding: 1rem;
                background: var(--bg-primary);
                border-radius: 6px;
            }
            .mut-seo-preview-label {
                margin: 0.5rem 0 0.25rem;
                font-size: 0.75rem;
                color: var(--text-muted);
            }
            .mut-seo-preview-title {
                color: #8ab4f8;
                font-size: 1.1rem;
                margin-bottom: 0.25rem;
            }
            .mut-seo-preview-url {
                color: #b6e3b6;
                font-size: 0.85rem;
                margin-bottom: 0.25rem;
            }
            .mut-seo-preview-desc {
                color: var(--text-secondary);
                font-size: 0.85rem;
                line-height: 1.4;
            }
            #seo-title, #seo-description, #seo-keywords, #seo-canonical {
                width: 100%;
                padding: 0.75rem;
                background: var(--surface-card);
                border: 1px solid var(--border-color);
                color: var(--text-primary);
                border-radius: 6px;
                font-size: 0.95rem;
            }
            #seo-title:focus, #seo-description:focus, #seo-keywords:focus, #seo-canonical:focus {
                outline: none;
                border-color: var(--accent);
            }
            #seo-description {
                resize: vertical;
                min-height: 80px;
            }
        `;
        document.head.appendChild(style);
    };

    MutsSEOManager.prototype.bindEvents = function() {
        var self = this;
        
        // Title input
        var titleInput = document.getElementById('seo-title');
        var titleCount = document.getElementById('seo-title-count');
        var titlePreview = document.getElementById('seo-preview-title');
        
        titleInput.addEventListener('input', function() {
            var len = this.value.length;
            titleCount.textContent = len + '/' + self.maxTitle;
            titleCount.className = 'mut-seo-count' + (len > self.maxTitle ? ' danger' : len > self.maxTitle - 10 ? ' warning' : '');
            titlePreview.textContent = this.value || self.defaultTitle;
        });
        
        // Description input
        var descInput = document.getElementById('seo-description');
        var descCount = document.getElementById('seo-desc-count');
        var descPreview = document.querySelector('.mut-seo-preview-desc');
        
        descInput.addEventListener('input', function() {
            var len = this.value.length;
            descCount.textContent = len + '/' + self.maxDesc;
            descCount.className = 'mut-seo-count' + (len > self.maxDesc ? ' danger' : len > self.maxDesc - 20 ? ' warning' : '');
            descPreview.textContent = this.value || self.defaultDesc;
        });
    };

    MutsSEOManager.prototype.getData = function() {
        return {
            title: document.getElementById('seo-title').value,
            description: document.getElementById('seo-description').value,
            keywords: document.getElementById('seo-keywords').value,
            canonical: document.getElementById('seo-canonical').value
        };
    };

    MutsSEOManager.prototype.setData = function(data) {
        if (data.title) document.getElementById('seo-title').value = data.title;
        if (data.description) document.getElementById('seo-description').value = data.description;
        if (data.keywords) document.getElementById('seo-keywords').value = data.keywords;
        if (data.canonical) document.getElementById('seo-canonical').value = data.canonical;
    };

    // Generate meta tags
    MutsSEOManager.prototype.generateTags = function() {
        var data = this.getData();
        var tags = [];
        
        if (data.title) {
            tags.push('<meta name="title" content="' + data.title + '">');
            tags.push('<meta property="og:title" content="' + data.title + '">');
        }
        if (data.description) {
            tags.push('<meta name="description" content="' + data.description + '">');
            tags.push('<meta property="og:description" content="' + data.description + '">');
        }
        if (data.keywords) {
            tags.push('<meta name="keywords" content="' + data.keywords + '">');
        }
        if (data.canonical) {
            tags.push('<link rel="canonical" href="' + data.canonical + '">');
        }
        
        return tags.join('\n    ');
    };

    window.MutsSEOManager = MutsSEOManager;

})();