/* Gallery JS — Muts Safaris */
(function () {
    if (window.location.pathname.indexOf('gallery.html') === -1) {
        return;
    }

    var GALLERY_KEY = 'muts_gallery';
    var currentImages = [];
    var currentIndex = 0;

    var mockGallery = [
        { id: 'g1', title: 'Lion at Sunset', category: 'wildlife', image: 'images/gallery/wildlife/lion-sunset.jpg', userId: 'system', userName: 'Muts Safaris', likes: 234, createdAt: '2026-01-15' },
        { id: 'g2', title: 'Maasai Mara Plains', category: 'landscapes', image: 'images/gallery/landscapes/maasai-mara-plains.jpg', userId: 'system', userName: 'Muts Safaris', likes: 189, createdAt: '2026-01-20' },
        { id: 'g3', title: 'Elephant Family', category: 'wildlife', image: 'images/tours/maasai-mara-hero.jpg', userId: 'system', userName: 'Muts Safaris', likes: 312, createdAt: '2026-02-01' },
        { id: 'g4', title: 'Diani Beach Sunset', category: 'beaches', image: 'images/beaches/diani-beach.jpg', userId: 'system', userName: 'Muts Safaris', likes: 156, createdAt: '2026-02-10' },
        { id: 'g5', title: 'Luxury Tent Interior', category: 'accommodations', image: 'images/gallery/accommodations/luxury-tent.jpg', userId: 'system', userName: 'Muts Safaris', likes: 98, createdAt: '2026-02-15' },
        { id: 'g6', title: 'Hot Air Balloon', category: 'experiences', image: 'images/experiences/hot-air-balloon.jpg', userId: 'system', userName: 'Muts Safaris', likes: 267, createdAt: '2026-02-20' },
        { id: 'g7', title: 'Zebra Herd', category: 'wildlife', image: 'images/tours/amboseli-hero.jpg', userId: 'system', userName: 'Muts Safaris', likes: 198, createdAt: '2026-03-01' },
        { id: 'g8', title: 'Mount Kenya Sunrise', category: 'landscapes', image: 'images/tours/mount-kenya-hero.jpg', userId: 'system', userName: 'Muts Safaris', likes: 145, createdAt: '2026-03-05' },
        { id: 'g9', title: 'Flamingos at Lake Nakuru', category: 'wildlife', image: 'images/tours/nakuru-hero.jpg', userId: 'system', userName: 'Muts Safaris', likes: 223, createdAt: '2026-03-10' },
        { id: 'g10', title: 'Camel Safari', category: 'experiences', image: 'images/experiences/camel-safari.jpg', userId: 'system', userName: 'Muts Safaris', likes: 87, createdAt: '2026-03-15' },
        { id: 'g11', title: 'Watamu Coral Reef', category: 'beaches', image: 'images/beaches/watamu.jpg', userId: 'system', userName: 'Muts Safaris', likes: 134, createdAt: '2026-03-20' },
        { id: 'g12', title: 'Maasai Village Visit', category: 'experiences', image: 'images/experiences/maasai-village.jpg', userId: 'system', userName: 'Muts Safaris', likes: 176, createdAt: '2026-03-25' }
    ];

    function getGalleryImages(category, userId) {
        var stored = JSON.parse(localStorage.getItem(GALLERY_KEY) || '[]');
        var allImages = stored.concat(mockGallery);
        
        if (category && category !== 'all') {
            if (category === 'my-uploads' && userId) {
                allImages = allImages.filter(function (img) { return img.userId === userId; });
            } else if (category !== 'my-uploads') {
                allImages = allImages.filter(function (img) { return img.category === category; });
            }
        }
        
        return allImages.sort(function (a, b) { return new Date(b.createdAt) - new Date(a.createdAt); });
    }

    function saveImage(imageData) {
        var stored = JSON.parse(localStorage.getItem(GALLERY_KEY) || '[]');
        stored.push(imageData);
        localStorage.setItem(GALLERY_KEY, JSON.stringify(stored));
    }

    function getImagePath(relativePath) {
        var isDashboardPage = window.location.pathname.indexOf('/pages/dashboard/') !== -1;
        if (isDashboardPage) {
            return '../../' + relativePath;
        }
        return relativePath;
    }

    function openLightbox(index) {
        var modal = document.getElementById('lightbox-modal');
        var imgEl = document.getElementById('lightbox-image');
        var titleEl = document.getElementById('lightbox-title');
        var metaEl = document.getElementById('lightbox-meta');
        var counterEl = document.getElementById('lightbox-counter');
        
        if (!modal || !imgEl) return;
        
        currentIndex = index;
        var img = currentImages[index];
        
        imgEl.src = img.image.indexOf('data:') === 0 ? img.image : getImagePath(img.image);
        titleEl.textContent = img.title;
        metaEl.textContent = (img.likes || 0) + ' likes • by ' + (img.userName || 'Muts Safaris');
        counterEl.textContent = (index + 1) + ' / ' + currentImages.length;
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        var modal = document.getElementById('lightbox-modal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    function navigateLightbox(direction) {
        currentIndex += direction;
        if (currentIndex < 0) currentIndex = currentImages.length - 1;
        if (currentIndex >= currentImages.length) currentIndex = 0;
        openLightbox(currentIndex);
    }

    function initLightbox() {
        var modal = document.getElementById('lightbox-modal');
        var closeBtn = document.getElementById('lightbox-close');
        var prevBtn = document.getElementById('lightbox-prev');
        var nextBtn = document.getElementById('lightbox-next');
        
        if (!modal) return;
        
        if (closeBtn) {
            closeBtn.addEventListener('click', function (e) {
                e.stopPropagation();
                closeLightbox();
            });
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', function (e) {
                e.stopPropagation();
                navigateLightbox(-1);
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', function (e) {
                e.stopPropagation();
                navigateLightbox(1);
            });
        }
        
        modal.addEventListener('click', function (e) {
            if (e.target === modal || e.target.classList.contains('lightbox-image-container')) {
                closeLightbox();
            }
        });
        
        document.addEventListener('keydown', function (e) {
            if (!modal.classList.contains('active')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') navigateLightbox(-1);
            if (e.key === 'ArrowRight') navigateLightbox(1);
        });
    }

    function renderGallery(images) {
        var container = document.getElementById('gallery-masonry');
        var empty = document.getElementById('gallery-empty');
        
        if (!container) return;
        
        currentImages = images;
        
        if (images.length === 0) {
            container.innerHTML = '';
            if (empty) empty.style.display = '';
            return;
        }
        
        if (empty) empty.style.display = 'none';
        
        container.innerHTML = images.map(function (img, index) {
            var imgSrc = img.image.indexOf('data:') === 0 ? img.image : getImagePath(img.image);
            var userInitial = img.userName ? img.userName.charAt(0).toUpperCase() : 'U';
            return '<div class="gallery-item" data-index="' + index + '">' +
                '<img src="' + imgSrc + '" alt="' + img.title + '" loading="lazy" oncontextmenu="return false;" ondragstart="return false;">' +
                '<div class="gallery-item-overlay">' +
                    '<h3 class="gallery-item-title">' + img.title + '</h3>' +
                    '<p class="gallery-item-meta">' + (img.likes || 0) + ' likes</p>' +
                    '<div class="gallery-item-user">' +
                        '<div class="gallery-item-user-avatar">' + userInitial + '</div>' +
                        '<span class="gallery-item-user-name">' + img.userName + '</span>' +
                    '</div>' +
                '</div>' +
            '</div>';
        }).join('');

        container.querySelectorAll('.gallery-item').forEach(function (item, index) {
            item.addEventListener('click', function () {
                openLightbox(index);
            });
        });
    }

    function loadGallery() {
        var masonry = document.getElementById('gallery-masonry');
        if (!masonry) return;
        
        var activeFilter = document.querySelector('.gallery-filter-btn.active');
        var category = activeFilter ? activeFilter.dataset.filter : 'all';
        
        var user = window.MutsAuth && window.MutsAuth.getCurrentUser();
        var userId = user ? user.id : null;
        
        var images = getGalleryImages(category, userId);
        renderGallery(images);
    }

    function initFilters() {
        var filters = document.querySelectorAll('.gallery-filter-btn');
        filters.forEach(function (btn) {
            btn.addEventListener('click', function () {
                filters.forEach(function (b) { b.classList.remove('active'); });
                btn.classList.add('active');
                loadGallery();
            });
        });
    }

    function initUploadModal() {
        var modal = document.getElementById('upload-modal');
        var btn = document.getElementById('upload-btn');
        var close = document.getElementById('upload-modal-close');
        var dropzone = document.getElementById('upload-dropzone');
        var fileInput = document.getElementById('upload-file-input');
        var form = document.getElementById('upload-form');
        
        if (!modal || !btn) return;
        
        btn.addEventListener('click', function () {
            modal.classList.add('active');
        });
        
        if (close) {
            close.addEventListener('click', function () {
                modal.classList.remove('active');
            });
        }
        
        modal.addEventListener('click', function (e) {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
        
        dropzone.addEventListener('click', function () {
            fileInput.click();
        });
        
        dropzone.addEventListener('dragover', function (e) {
            e.preventDefault();
            dropzone.classList.add('dragover');
        });
        
        dropzone.addEventListener('dragleave', function () {
            dropzone.classList.remove('dragover');
        });
        
        dropzone.addEventListener('drop', function (e) {
            e.preventDefault();
            dropzone.classList.remove('dragover');
            if (e.dataTransfer.files.length) {
                fileInput.files = e.dataTransfer.files;
            }
        });
        
        fileInput.addEventListener('change', function () {
            if (fileInput.files.length) {
                dropzone.querySelector('.upload-dropzone-text').textContent = fileInput.files[0].name;
            }
        });

        var customSelect = document.getElementById('custom-category');
        var selectTrigger = customSelect.querySelector('.custom-select-trigger');
        var selectOptions = customSelect.querySelector('.custom-select-options');
        var selectInput = document.getElementById('upload-category');

        selectTrigger.addEventListener('click', function (e) {
            e.stopPropagation();
            customSelect.classList.toggle('active');
        });

        document.addEventListener('click', function () {
            customSelect.classList.remove('active');
        });

        var options = customSelect.querySelectorAll('.custom-select-option');
        options.forEach(function (option) {
            option.addEventListener('click', function () {
                var value = this.getAttribute('data-value');
                var text = this.textContent;
                selectInput.value = value;
                selectTrigger.querySelector('.custom-select-placeholder').textContent = text;
                selectTrigger.querySelector('.custom-select-placeholder').style.color = '#fff';
                customSelect.classList.remove('active');
                options.forEach(function (o) { o.classList.remove('selected'); });
                this.classList.add('selected');
            });
        });
        
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            
            var title = document.getElementById('upload-title').value;
            var category = document.getElementById('upload-category').value;
            var description = document.getElementById('upload-description').value;
            var file = fileInput.files[0];
            
            var errors = [];
            
            // 1. File validation
            if (!file) {
                errors.push('Please select an image file.');
            } else {
                // Allowed MIME types (with common variants)
                var allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
                // Check both file type and common image prefixes
                var validType = allowedTypes.indexOf(file.type) !== -1 || 
                               (file.type && file.type.indexOf('image/') === 0 && file.type !== 'image/heic' && file.type !== 'image/heif');
                
                var allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
                
                var fileName = file.name.toLowerCase();
                var fileType = file.type;
                var ext = fileName.substring(fileName.lastIndexOf('.'));
                
                // Check extension
                var validExt = allowedExtensions.some(function (e) { return ext === e; });
                if (!validExt) {
                    errors.push('Invalid file extension. Use .jpg, .jpeg, .png, .gif, .webp, or .svg');
                }
                
                // Only check MIME if browser provides it
                if (fileType && fileType.indexOf('image/') === 0) {
                    // Block specific unwanted types even if they have correct extension
                    var blockedTypes = ['image/heic', 'image/heif', 'image/tiff', 'image/bmp', 'image/x-icon'];
                    if (blockedTypes.indexOf(fileType) !== -1) {
                        errors.push('This image format is not supported. Use JPG, PNG, GIF, WebP, or SVG.');
                    }
                }
                
                // 2. File size validation (max 10MB)
                var maxSize = 10 * 1024 * 1024; // 10MB
                if (file.size > maxSize) {
                    errors.push('File too large. Maximum size is 10MB.');
                }
                
                // 3. Minimum file size (prevent empty/corrupt files)
                if (file.size < 1024) {
                    errors.push('File too small. Minimum size is 1KB.');
                }
            }
            
            // 4. Title validation
            if (!title || title.trim() === '') {
                errors.push('Please provide a title for the image.');
            } else {
                // Trim and check length
                title = title.trim();
                if (title.length > 100) {
                    errors.push('Title is too long. Maximum 100 characters allowed.');
                }
                if (title.length < 2) {
                    errors.push('Title must be at least 2 characters.');
                }
            }
            
            // 5. Category validation
            var validCategories = ['wildlife', 'landscapes', 'beaches', 'accommodations', 'experiences'];
            if (!category || validCategories.indexOf(category) === -1) {
                errors.push('Please select a valid category.');
            }
            
            // 6. Description validation (optional but sanitize if provided)
            if (description && description.trim() !== '') {
                description = description.trim();
                if (description.length > 500) {
                    errors.push('Description is too long. Maximum 500 characters allowed.');
                }
            } else {
                description = '';
            }
            
            // Show errors if any
            if (errors.length > 0) {
                showValidationErrors(errors);
                return;
            }
            
            // Sanitize inputs to prevent XSS
            var sanitizedTitle = sanitizeInput(title);
            var sanitizedDesc = description ? sanitizeInput(description) : '';
            
            var user = window.MutsAuth && window.MutsAuth.getCurrentUser();
            
            // Additional: Validate image content by loading it
            var img = new Image();
            var objectUrl = URL.createObjectURL(file);
            
            img.onload = function () {
                // Validate image dimensions (minimum reasonable size)
                if (img.width < 50 || img.height < 50) {
                    URL.revokeObjectURL(objectUrl);
                    showValidationErrors(['Image dimensions too small. Minimum 50x50 pixels required.']);
                    return;
                }
                
                // Validate it's actually an image (not just renamed file)
                if (!fileType || fileType.indexOf('image/') === -1) {
                    URL.revokeObjectURL(objectUrl);
                    showValidationErrors(['Invalid image file. Please upload a valid image.']);
                    return;
                }
                
                URL.revokeObjectURL(objectUrl);
                proceedWithUpload(sanitizedTitle, category, sanitizedDesc, file, user);
            };
            
            img.onerror = function () {
                URL.revokeObjectURL(objectUrl);
                showValidationErrors(['Unable to load image. Please try a different file.']);
            };
            
            img.src = objectUrl;
        });
        
        function showValidationErrors(errors) {
            var container = document.getElementById('upload-validation-errors');
            var list = document.getElementById('validation-errors-list');
            
            if (container && list) {
                list.innerHTML = '';
                errors.forEach(function (err) {
                    var li = document.createElement('li');
                    li.textContent = err;
                    list.appendChild(li);
                });
                container.classList.add('show');
                
                // Auto-hide after 8 seconds
                setTimeout(function () {
                    container.classList.remove('show');
                }, 8000);
            } else {
                // Fallback to alert
                var msg = errors.join('\n• ');
                alert('Validation Errors:\n• ' + msg);
            }
        }
        
        function sanitizeInput(input) {
            if (!input) return '';
            return input
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#x27;')
                .replace(/\//g, '&#x2F;')
                .replace(/script/gi, '')
                .replace(/on\w+/gi, '')
                .trim();
        }
        
        function proceedWithUpload(title, category, description, file, user) {
            var modal = document.getElementById('upload-modal');
            var dropzone = document.getElementById('upload-dropzone');
            var form = document.getElementById('upload-form');
            
            var reader = new FileReader();
            reader.onload = function (e) {
                var newImage = {
                    id: 'user-' + Date.now(),
                    title: title,
                    category: category,
                    image: e.target.result,
                    description: description,
                    userId: user ? user.id : 'guest',
                    userName: user ? user.name : 'Guest',
                    likes: 0,
                    createdAt: new Date().toISOString().slice(0, 10)
                };
                
                saveImage(newImage);
                alert('Image uploaded successfully!');
                modal.classList.remove('active');
                form.reset();
                dropzone.querySelector('.upload-dropzone-text').textContent = 'Click to select or drag image here';
                loadGallery();
            };
            reader.readAsDataURL(file);
        }
    }

    function initSearch() {
        var input = document.getElementById('dashboard-search');
        if (!input) return;
        
        input.addEventListener('input', function () {
            var q = input.value.toLowerCase();
            var items = document.querySelectorAll('.gallery-item');
            items.forEach(function (item) {
                var title = item.querySelector('.gallery-item-title').textContent.toLowerCase();
                item.style.display = title.indexOf(q) !== -1 ? '' : 'none';
            });
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        loadGallery();
        initFilters();
        initUploadModal();
        initSearch();
        initLightbox();
    });
})();