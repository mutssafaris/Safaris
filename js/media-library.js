/**
 * Media Library - Muts Safaris
 * Drag-and-drop media management with upload progress
 * 
 * Usage:
 *   new MutsMediaLibrary(element, options)
 *   
 * Options:
 *   maxFiles: Maximum files (default: 10)
 *   maxSize: Max file size in MB (default: 10)
 *   acceptedTypes: Array of accepted MIME types
 *   onSelect: Callback when image selected
 *   onUpload: Callback after upload completes
 */
(function() {
    'use strict';

    var MutsMediaLibrary = function(element, options) {
        options = options || {};
        
        this.container = typeof element === 'string' ? document.querySelector(element) : element;
        if (!this.container) {
            console.error('[MediaLib] Container not found:', element);
            return;
        }
        
        this.maxFiles = options.maxFiles || 10;
        this.maxSize = options.maxSize || 10 * 1024 * 1024;
        this.acceptedTypes = options.acceptedTypes || ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        this.onSelect = options.onSelect || null;
        this.onUpload = options.onUpload || null;
        
        this.files = [];
        this.previewFiles = [];
        
        this.init();
    };

    MutsMediaLibrary.prototype.init = function() {
        // Create library container
        this.library = document.createElement('div');
        this.library.className = 'mut-media-library';
        
        // Create drop zone
        this.dropZone = document.createElement('div');
        this.dropZone.className = 'mut-media-dropzone';
        this.dropZone.innerHTML = 
            '<div class="mut-media-dropzone-content">' +
            '<svg viewBox="0 0 24 24" width="48" height="48"><path fill="currentColor" d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/></svg>' +
            '<p>Drag images here or click to upload</p>' +
            '<span>JPG, PNG, WebP, GIF - Max ' + (this.maxSize / 1024 / 1024) + 'MB</span>' +
            '</div>';
        
        // Hidden file input
        this.fileInput = document.createElement('input');
        this.fileInput.type = 'file';
        this.fileInput.accept = this.acceptedTypes.join(',');
        this.fileInput.multiple = true;
        this.fileInput.style.display = 'none';
        
        // Preview grid
        this.previewGrid = document.createElement('div');
        this.previewGrid.className = 'mut-media-grid';
        
        // Progress overlay
        this.progressOverlay = document.createElement('div');
        this.progressOverlay.className = 'mut-media-progress-overlay';
        this.progressOverlay.innerHTML = 
            '<div class="mut-media-progress-content">' +
            '<div class="mut-media-spinner"></div>' +
            '<p>Uploading...</p>' +
            '<span class="mut-media-progress-percent">0%</span>' +
            '</div>';
        this.progressOverlay.style.display = 'none';
        
        // Build library
        this.library.appendChild(this.dropZone);
        this.library.appendChild(this.fileInput);
        this.library.appendChild(this.previewGrid);
        this.library.appendChild(this.progressOverlay);
        
        // Replace or append
        this.container.innerHTML = '';
        this.container.appendChild(this.library);
        
        // Add styles if not present
        this.addStyles();
        
        // Bind events
        this.bindEvents();
        
        console.log('[MediaLib] Initialized');
    };

    MutsMediaLibrary.prototype.addStyles = function() {
        if (document.getElementById('mut-media-styles')) return;
        
        var style = document.createElement('style');
        style.id = 'mut-media-styles';
        style.textContent = `
            .mut-media-library {
                display: flex;
                flex-direction: column;
                gap: 16px;
            }
            .mut-media-dropzone {
                border: 2px dashed var(--border-color);
                border-radius: 12px;
                padding: 40px 20px;
                text-align: center;
                cursor: pointer;
                transition: all 0.3s ease;
                background: var(--surface-card);
            }
            .mut-media-dropzone:hover,
            .mut-media-dropzone.dragover {
                border-color: var(--accent);
                background: var(--surface-hover);
                box-shadow: 0 0 20px var(--accent-glow);
            }
            .mut-media-dropzone-content {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 8px;
                color: var(--text-muted);
            }
            .mut-media-dropzone-content svg {
                color: var(--accent);
                opacity: 0.7;
            }
            .mut-media-dropzone-content p {
                font-size: 1rem;
                color: var(--text-secondary);
                margin: 0;
            }
            .mut-media-dropzone-content span {
                font-size: 0.8rem;
            }
            .mut-media-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
                gap: 12px;
            }
            .mut-media-item {
                position: relative;
                aspect-ratio: 1;
                border-radius: 8px;
                overflow: hidden;
                border: 2px solid transparent;
                cursor: pointer;
                transition: all 0.2s ease;
                background: var(--bg-card);
            }
            .mut-media-item:hover {
                border-color: var(--accent);
                transform: scale(1.02);
            }
            .mut-media-item.selected {
                border-color: var(--accent);
                box-shadow: 0 0 15px var(--accent-glow);
            }
            .mut-media-item img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
            .mut-media-item-overlay {
                position: absolute;
                inset: 0;
                background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%);
                opacity: 0;
                transition: opacity 0.2s ease;
                display: flex;
                align-items: flex-end;
                padding: 8px;
            }
            .mut-media-item:hover .mut-media-item-overlay {
                opacity: 1;
            }
            .mut-media-item-name {
                font-size: 0.7rem;
                color: #fff;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 100%;
            }
            .mut-media-item-remove {
                position: absolute;
                top: 4px;
                right: 4px;
                width: 24px;
                height: 24px;
                background: var(--danger);
                border: none;
                border-radius: 50%;
                color: #fff;
                cursor: pointer;
                font-size: 14px;
                line-height: 1;
                opacity: 0;
                transition: opacity 0.2s;
            }
            .mut-media-item:hover .mut-media-item-remove {
                opacity: 1;
            }
            .mut-media-item-check {
                position: absolute;
                top: 4px;
                left: 4px;
                width: 24px;
                height: 24px;
                background: var(--accent);
                border-radius: 50%;
                display: none;
                align-items: center;
                justify-content: center;
                color: var(--text-on-accent);
            }
            .mut-media-item.selected .mut-media-item-check {
                display: flex;
            }
            .mut-media-progress-overlay {
                position: fixed;
                inset: 0;
                background: rgba(0,0,0,0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
            }
            .mut-media-progress-content {
                text-align: center;
                color: var(--text-primary);
            }
            .mut-media-spinner {
                width: 48px;
                height: 48px;
                border: 3px solid var(--border-color);
                border-top-color: var(--accent);
                border-radius: 50%;
                animation: mut-media-spin 1s linear infinite;
                margin: 0 auto 16px;
            }
            @keyframes mut-media-spin {
                to { transform: rotate(360deg); }
            }
            .mut-media-progress-percent {
                font-size: 1.5rem;
                font-weight: 700;
                color: var(--accent);
            }
            .mut-media-uploading {
                position: relative;
                aspect-ratio: 1;
                border-radius: 8px;
                overflow: hidden;
                background: var(--bg-card);
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .mut-media-uploading .mut-media-spinner {
                width: 32px;
                height: 32px;
                border-width: 2px;
            }
        `;
        document.head.appendChild(style);
    };

    MutsMediaLibrary.prototype.bindEvents = function() {
        var self = this;
        
        // Click to open file picker
        this.dropZone.addEventListener('click', function() {
            self.fileInput.click();
        });
        
        // File input change
        this.fileInput.addEventListener('change', function(e) {
            self.handleFiles(this.files);
            this.value = '';
        });
        
        // Drag events
        this.dropZone.addEventListener('dragover', function(e) {
            e.preventDefault();
            self.dropZone.classList.add('dragover');
        });
        
        this.dropZone.addEventListener('dragleave', function(e) {
            e.preventDefault();
            self.dropZone.classList.remove('dragover');
        });
        
        this.dropZone.addEventListener('drop', function(e) {
            e.preventDefault();
            self.dropZone.classList.remove('dragover');
            if (e.dataTransfer.files.length) {
                self.handleFiles(e.dataTransfer.files);
            }
        });
        
        // Prevent default drag behaviors on window
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(function(event) {
            document.body.addEventListener(event, function(e) {
                e.preventDefault();
            });
        });
    };

    MutsMediaLibrary.prototype.handleFiles = function(fileList) {
        var self = this;
        var files = Array.from(fileList);
        
        // Validate
        var validFiles = files.filter(function(file) {
            if (!self.acceptedTypes.includes(file.type)) {
                console.warn('[MediaLib] Invalid type:', file.type);
                return false;
            }
            if (file.size > self.maxSize) {
                console.warn('[MediaLib] File too large:', file.size);
                return false;
            }
            return true;
        });
        
        if (validFiles.length === 0) return;
        if (self.files.length + validFiles.length > self.maxFiles) {
            console.warn('[MediaLib] Max files reached');
            return;
        }
        
        // Process files
        validFiles.forEach(function(file, index) {
            self.processFile(file, self.files.length + index);
        });
        
        self.files = self.files.concat(validFiles);
    };

    MutsMediaLibrary.prototype.processFile = function(file, index) {
        var self = this;
        
        // Create preview item
        var item = document.createElement('div');
        item.className = 'mut-media-item';
        item.dataset.index = index;
        
        // File reader for preview
        var reader = new FileReader();
        reader.onload = function(e) {
            item.innerHTML = 
                '<img src="' + e.target.result + '" alt="' + file.name + '">' +
                '<div class="mut-media-item-overlay">' +
                '<span class="mut-media-item-name">' + file.name + '</span>' +
                '</div>' +
                '<button type="button" class="mut-media-item-remove" title="Remove">&times;</button>' +
                '<div class="mut-media-item-check">✓</div>';
            
            item.querySelector('.mut-media-item-remove').addEventListener('click', function(e) {
                e.stopPropagation();
                self.removeFile(index);
            });
        };
        reader.readAsDataURL(file);
        
        this.previewGrid.appendChild(item);
        
        // Trigger select callback
        if (this.onSelect) {
            this.onSelect(file, index);
        }
    };

    MutsMediaLibrary.prototype.removeFile = function(index) {
        this.files.splice(index, 1);
        this.rerender();
        
        if (this.onSelect) {
            this.onSelect(null, index, 'remove');
        }
    };

    MutsMediaLibrary.prototype.rerender = function() {
        var self = this;
        this.previewGrid.innerHTML = '';
        this.files.forEach(function(file, index) {
            self.processFile(file, index);
        });
    };

    MutsMediaLibrary.prototype.showProgress = function(show) {
        this.progressOverlay.style.display = show ? 'flex' : 'none';
    };

    MutsMediaLibrary.prototype.setProgress = function(percent) {
        this.progressOverlay.querySelector('.mut-media-progress-percent').textContent = Math.round(percent) + '%';
    };

    MutsMediaLibrary.prototype.getFiles = function() {
        return this.files;
    };

    MutsMediaLibrary.prototype.getFileData = function() {
        return this.files.map(function(file) {
            return {
                name: file.name,
                size: file.size,
                type: file.type,
                dataUrl: null // Would need to generate
            };
        });
    };

    MutsMediaLibrary.prototype.clear = function() {
        this.files = [];
        this.previewGrid.innerHTML = '';
    };

    // Expose globally
    window.MutsMediaLibrary = MutsMediaLibrary;

})();