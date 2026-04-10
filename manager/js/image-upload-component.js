/**
 * Image Upload Component for Manager Dashboard
 * Reusable component for handling image uploads with preview, CDN URL input, and local storage
 */
(function(window) {
    'use strict';

    /**
     * Create an image upload field
     * @param {HTMLElement} container - Container element
     * @param {Object} options - Configuration options
     */
    function createImageUpload(container, options) {
        options = options || {};
        
        var fieldId = options.fieldId || 'image-upload-' + Date.now();
        var multiple = options.multiple || false;
        var maxImages = options.maxImages || 5;
        var currentImages = options.value || [];
        
        var html = '<div class="image-upload-field" id="' + fieldId + '">';
        
        // Current images preview
        if (currentImages.length > 0) {
            html += '<div class="image-upload-preview">';
            currentImages.forEach(function(img, index) {
                var url = img.url || img;
                html += '<div class="preview-item" data-index="' + index + '">';
                html += '<img src="' + (url.startsWith('http') ? url : (ImageService ? ImageService.buildImageURL(url) : url)) + '" alt="Preview">';
                html += '<button type="button" class="remove-btn" data-index="' + index + '">&times;</button>';
                html += '</div>';
            });
            html += '</div>';
        }
        
        // Upload area
        html += '<div class="image-upload-area">';
        
        // File input
        html += '<input type="file" id="' + fieldId + '-input" ' +
            'accept="image/jpeg,image/png,image/webp,image/gif" ' +
            (multiple ? 'multiple' : '') + 
            ' style="display: none;">';
        
        // Drop zone
        html += '<div class="drop-zone" id="' + fieldId + '-drop">';
        html += '<svg viewBox="0 0 24 24" fill="currentColor" width="40" height="40"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>';
        html += '<p>Click to upload or drag and drop</p>';
        html += '<span class="hint">JPEG, PNG, WebP, GIF (max 5MB)</span>';
        html += '</div>';
        
        // CDN URL input option
        html += '<div class="url-input-section">';
        html += '<label>Or enter image URL (CDN/external)</label>';
        html += '<div class="url-input-row">';
        html += '<input type="url" id="' + fieldId + '-url" placeholder="https://cdn.example.com/image.jpg" class="url-input">';
        html += '<button type="button" class="btn btn-secondary" id="' + fieldId + '-url-add">Add URL</button>';
        html += '</div>';
        html += '</div>';
        
        html += '</div>';
        
        // Gallery browser (for selecting existing images)
        html += '<div class="gallery-browser">';
        html += '<button type="button" class="btn btn-sm btn-secondary" id="' + fieldId + '-browse">Browse Gallery</button>';
        html += '</div>';
        
        html += '</div>';
        
        container.innerHTML = html;
        
        // Initialize event handlers
        initImageUpload(fieldId, options);
        
        return fieldId;
    }

    /**
     * Initialize image upload handlers
     * @param {string} fieldId - Field ID
     * @param {Object} options - Options
     */
    function initImageUpload(fieldId, options) {
        var container = document.getElementById(fieldId);
        var input = document.getElementById(fieldId + '-input');
        var dropZone = document.getElementById(fieldId + '-drop');
        var urlInput = document.getElementById(fieldId + '-url');
        var urlAddBtn = document.getElementById(fieldId + '-url-add');
        
        var currentImages = options.value ? (Array.isArray(options.value) ? options.value : [options.value]) : [];
        
        // File input change
        if (input) {
            input.addEventListener('change', function(e) {
                handleFiles(e.target.files, options);
            });
        }
        
        // Drop zone events
        if (dropZone) {
            dropZone.addEventListener('click', function() {
                input.click();
            });
            
            dropZone.addEventListener('dragover', function(e) {
                e.preventDefault();
                dropZone.classList.add('drag-over');
            });
            
            dropZone.addEventListener('dragleave', function() {
                dropZone.classList.remove('drag-over');
            });
            
            dropZone.addEventListener('drop', function(e) {
                e.preventDefault();
                dropZone.classList.remove('drag-over');
                handleFiles(e.dataTransfer.files, options);
            });
        }
        
        // URL input
        if (urlAddBtn && urlInput) {
            urlAddBtn.addEventListener('click', function() {
                var url = urlInput.value.trim();
                if (url) {
                    addImageByURL(url, options);
                    urlInput.value = '';
                }
            });
            
            urlInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    urlAddBtn.click();
                }
            });
        }
        
        // Handle files
        function handleFiles(files, opts) {
            if (!files || files.length === 0) return;
            
            Array.from(files).forEach(function(file) {
                var validation = ImageService.validateFile(file);
                if (!validation.valid) {
                    showError(validation.error);
                    return;
                }
                
                // Generate preview
                ImageService.generateThumbnail(file, 200).then(function(thumbnail) {
                    addImageToPreview(thumbnail, {
                        isLocal: true,
                        isNew: true,
                        file: file
                    }, opts);
                });
            });
        }
        
        // Add image by URL
        function addImageByURL(url, opts) {
            var isValidUrl = url.match(/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i);
            if (!isValidUrl) {
                showError('Please enter a valid image URL');
                return;
            }
            
            addImageToPreview(url, { url: url }, opts);
        }
        
        // Add image to preview
        function addImageToPreview(src, imageData, opts) {
            if (opts.onImageAdd) {
                opts.onImageAdd(src, imageData);
            }
            
            // Create preview element
            var preview = document.createElement('div');
            preview.className = 'preview-item new';
            preview.innerHTML = '<img src="' + (typeof src === 'string' ? src : src.data) + '" alt="Preview">' +
                '<button type="button" class="remove-btn">&times;</button>';
            
            preview.querySelector('.remove-btn').addEventListener('click', function() {
                preview.remove();
                if (opts.onImageRemove) {
                    opts.onImageRemove(imageData);
                }
            });
            
            var previewContainer = container.querySelector('.image-upload-preview');
            if (!previewContainer) {
                previewContainer = document.createElement('div');
                previewContainer.className = 'image-upload-preview';
                container.insertBefore(previewContainer, container.querySelector('.image-upload-area'));
            }
            previewContainer.appendChild(preview);
        }
        
        // Show error
        function showError(message) {
            if (options.onError) {
                options.onError(message);
            } else {
                alert(message);
            }
        }
    }

    /**
     * Get all image values from upload field
     * @param {string} fieldId - Field ID
     * @returns {Array} Array of image URLs
     */
    function getImageValues(fieldId) {
        var container = document.getElementById(fieldId);
        var images = [];
        
        container.querySelectorAll('.preview-item img').forEach(function(img) {
            images.push(img.src);
        });
        
        return images;
    }

    window.ImageUploadComponent = {
        create: createImageUpload,
        getValues: getImageValues
    };

})(window);