/**
 * Manager Image Service
 * Handles image uploads, management, and CDN integration for the manager dashboard
 */
(function(window) {
    'use strict';

    var API_BASE = '';
    var CDN_BASE = '';
    var IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    var MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

    var ImageService = {
        /**
         * Initialize with configuration
         * @param {Object} config - Configuration object
         */
        init: function(config) {
            if (config && config.apiBase) API_BASE = config.apiBase;
            if (config && config.cdnBase) CDN_BASE = config.cdnBase;
        },

        /**
         * Set CDN base URL
         * @param {string} url - CDN base URL
         */
        setCDNBase: function(url) {
            CDN_BASE = url;
            localStorage.setItem('muts_cdn_base', url);
        },

        /**
         * Get CDN base URL
         * @returns {string} CDN base URL
         */
        getCDNBase: function() {
            if (!CDN_BASE) {
                CDN_BASE = localStorage.getItem('muts_cdn_base') || '';
            }
            return CDN_BASE;
        },

        /**
         * Build full CDN URL
         * @param {string} path - Image path
         * @returns {string} Full URL
         */
        buildImageURL: function(path) {
            if (!path) return '';
            if (path.startsWith('http')) return path;
            return this.getCDNBase() + path;
        },

        /**
         * Build responsive image srcset
         * @param {string} path - Base image path
         * @param {Array} sizes - Available sizes
         * @returns {string} srcset string
         */
        buildSrcSet: function(path, sizes) {
            if (!path) return '';
            var baseUrl = this.buildImageURL(path);
            if (!sizes) sizes = [320, 640, 960, 1280, 1920];
            
            return sizes.map(function(size) {
                return baseUrl + '?w=' + size + ' ' + size + 'w';
            }).join(', ');
        },

        /**
         * Validate image file
         * @param {File} file - File to validate
         * @returns {Object} Validation result
         */
        validateFile: function(file) {
            var result = { valid: true, error: '' };
            
            if (!file) {
                result.valid = false;
                result.error = 'No file selected';
                return result;
            }
            
            if (IMAGE_TYPES.indexOf(file.type) === -1) {
                result.valid = false;
                result.error = 'Invalid file type. Allowed: JPEG, PNG, WebP, GIF';
                return result;
            }
            
            if (file.size > MAX_FILE_SIZE) {
                result.valid = false;
                result.error = 'File too large. Maximum size: 5MB';
                return result;
            }
            
            return result;
        },

        /**
         * Compress image using canvas
         * @param {File} file - Image file
         * @param {number} maxWidth - Max width
         * @param {number} maxHeight - Max height
         * @param {number} quality - JPEG quality (0-1)
         * @returns {Promise<Blob>} Compressed image blob
         */
        compressImage: function(file, maxWidth, maxHeight, quality) {
            return new Promise(function(resolve, reject) {
                var img = new Image();
                img.onload = function() {
                    var canvas = document.createElement('canvas');
                    var ctx = canvas.getContext('2d');
                    
                    var width = img.width;
                    var height = img.height;
                    
                    if (width > maxWidth) {
                        height = Math.round(height * (maxWidth / width));
                        width = maxWidth;
                    }
                    if (height > maxHeight) {
                        width = Math.round(width * (maxHeight / height));
                        height = maxHeight;
                    }
                    
                    canvas.width = width;
                    canvas.height = height;
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    canvas.toBlob(function(blob) {
                        resolve(blob);
                    }, 'image/jpeg', quality || 0.8);
                };
                img.onerror = reject;
                img.src = URL.createObjectURL(file);
            });
        },

        /**
         * Generate thumbnail
         * @param {File} file - Image file
         * @param {number} size - Thumbnail size
         * @returns {Promise<string>} Data URL
         */
        generateThumbnail: function(file, size) {
            return new Promise(function(resolve, reject) {
                var img = new Image();
                img.onload = function() {
                    var canvas = document.createElement('canvas');
                    var ctx = canvas.getContext('2d');
                    
                    var scale = size / Math.max(img.width, img.height);
                    var width = Math.round(img.width * scale);
                    var height = Math.round(img.height * scale);
                    
                    canvas.width = width;
                    canvas.height = height;
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    resolve(canvas.toDataURL('image/jpeg', 0.7));
                };
                img.onerror = reject;
                img.src = URL.createObjectURL(file);
            });
        },

        /**
         * Upload image to server/CDN
         * @param {File} file - Image file
         * @param {Object} options - Upload options (category, entityId, etc.)
         * @returns {Promise<Object>} Upload result with URL
         */
        upload: function(file, options) {
            var _this = this;
            return new Promise(function(resolve, reject) {
                var validation = _this.validateFile(file);
                if (!validation.valid) {
                    reject(new Error(validation.error));
                    return;
                }
                
                // If API is configured, upload to server
                if (API_BASE) {
                    var formData = new FormData();
                    formData.append('image', file);
                    if (options && options.category) {
                        formData.append('category', options.category);
                    }
                    if (options && options.entityId) {
                        formData.append('entityId', options.entityId);
                    }
                    if (options && options.entityType) {
                        formData.append('entityType', options.entityType);
                    }
                    
                    fetch(API_BASE + '/images/upload', {
                        method: 'POST',
                        headers: {
                            'Authorization': 'Bearer ' + (JSON.parse(localStorage.getItem('muts_manager_session') || '{}').token || '')
                        },
                        body: formData
                    })
                    .then(function(response) {
                        if (!response.ok) throw new Error('Upload failed');
                        return response.json();
                    })
                    .then(resolve)
                    .catch(reject);
                } else {
                    // Fallback: store locally using IndexedDB
                    _this.storeLocally(file, options).then(resolve).catch(reject);
                }
            });
        },

        /**
         * Store image locally when API not available
         * @param {File} file - Image file
         * @param {Object} options - Storage options
         * @returns {Promise<Object>} Storage result
         */
        storeLocally: function(file, options) {
            var _this = this;
            return new Promise(function(resolve, reject) {
                var reader = new FileReader();
                reader.onload = function(e) {
                    var imageData = {
                        id: 'img_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
                        data: e.target.result,
                        name: file.name,
                        type: file.type,
                        size: file.size,
                        category: options && options.category || 'general',
                        entityId: options && options.entityId || '',
                        entityType: options && options.entityType || '',
                        createdAt: new Date().toISOString()
                    };
                    
                    // Store in localStorage (for small images) or IndexedDB
                    var key = 'muts_images_' + (options && options.category || 'general');
                    var existing = JSON.parse(localStorage.getItem(key) || '[]');
                    existing.push(imageData);
                    
                    // Limit stored images to prevent localStorage overflow
                    if (existing.length > 50) {
                        existing = existing.slice(-50);
                    }
                    
                    // SECURE: Check localStorage size before storing (max ~4.5MB leave buffer)
                    try {
                        var testKey = key + '_test';
                        localStorage.setItem(testKey, JSON.stringify(existing));
                        localStorage.removeItem(testKey);
                        localStorage.setItem(key, JSON.stringify(existing));
                    } catch (e) {
                        // If quota exceeded, remove oldest and retry
                        existing.shift();
                        localStorage.setItem(key, JSON.stringify(existing));
                        resolve({
                            success: false,
                            error: 'Storage limit reached. Older images removed.',
                            warning: true
                        });
                        return;
                    }
                    
                    resolve({
                        success: true,
                        id: imageData.id,
                        url: imageData.data, // Data URL for local storage
                        local: true
                    });
                };
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        },

        /**
         * Get all stored images
         * @param {string} category - Filter by category
         * @returns {Array} Array of stored images
         */
        getStoredImages: function(category) {
            var key = category ? 'muts_images_' + category : 'muts_images_all';
            try {
                var images = JSON.parse(localStorage.getItem(key) || '[]');
                return images.map(function(img) {
                    return {
                        id: img.id,
                        url: img.data,
                        name: img.name,
                        createdAt: img.createdAt
                    };
                });
            } catch (e) {
                return [];
            }
        },

        /**
         * Delete stored image
         * @param {string} imageId - Image ID
         * @param {string} category - Category
         * @returns {boolean} Success
         */
        deleteImage: function(imageId, category) {
            var key = 'muts_images_' + (category || 'general');
            try {
                var images = JSON.parse(localStorage.getItem(key) || '[]');
                var filtered = images.filter(function(img) { return img.id !== imageId; });
                localStorage.setItem(key, JSON.stringify(filtered));
                return true;
            } catch (e) {
                return false;
            }
        },

        /**
         * Build image upload config for forms
         * @param {Object} config - Configuration
         * @returns {Object} Form config with upload handlers
         */
        buildUploadConfig: function(config) {
            var _this = this;
            return {
                accept: 'image/jpeg,image/png,image/webp,image/gif',
                maxSize: MAX_FILE_SIZE,
                maxSizeLabel: '5MB',
                allowedTypes: IMAGE_TYPES.join(', '),
                
                onFileSelect: function(file) {
                    var validation = _this.validateFile(file);
                    if (!validation.valid) {
                        if (config.onError) config.onError(validation.error);
                        return false;
                    }
                    return true;
                },
                
                onFileProcess: function(file, callback) {
                    // Generate thumbnail preview
                    _this.generateThumbnail(file, 200).then(function(thumbnail) {
                        callback({ thumbnail: thumbnail });
                    });
                },
                
                onUpload: function(file, options, callback) {
                    _this.upload(file, options).then(function(result) {
                        callback({ 
                            success: true, 
                            url: result.url,
                            id: result.id,
                            isLocal: result.local 
                        });
                    }).catch(function(err) {
                        if (config.onError) config.onError(err.message);
                        callback({ success: false });
                    });
                }
            };
        },

        /**
         * Get image categories for manager
         * @returns {Array} Available categories
         */
        getCategories: function() {
            return [
                { id: 'hotels', label: 'Hotels', entityType: 'hotel' },
                { id: 'destinations', label: 'Destinations', entityType: 'destination' },
                { id: 'tours', label: 'Tours', entityType: 'tour' },
                { id: 'packages', label: 'Packages', entityType: 'package' },
                { id: 'blogs', label: 'Blog Posts', entityType: 'blog' },
                { id: 'products', label: 'Africasa Products', entityType: 'product' },
                { id: 'gallery', label: 'Gallery', entityType: 'gallery' },
                { id: 'users', label: 'User Uploads', entityType: 'user' },
                { id: 'general', label: 'General', entityType: 'general' }
            ];
        }
    };

    window.ImageService = ImageService;

})(window);