/* 
 * Muts Safaris - Animation Controller
 * Handles scroll-based animations, parallax, and interactions
 */

(function() {
    'use strict';

    // Wait for DOM
    document.addEventListener('DOMContentLoaded', function() {
        AnimationController.init();
    });

    var AnimationController = {
        
        init: function() {
            // Guard against multiple initializations
            if (window.__animationsInitialized) return;
            window.__animationsInitialized = true;
            
            // Setup progressive loading FIRST to handle images immediately
            this.setupProgressiveLoading();
            
            this.setupScrollAnimations();
            this.setupParallax();
            this.setupTimelineAnimations();
            this.setupIntersectionObserver();
            this.setupSmoothScroll();
            this.setupNavbarAnimation();
            this.setupCardInteractions();
            this.setup3DCardTilt();
            this.setupLoadingAnimations();
            this.setupCounterAnimations();
            this.setupScrollProgress();
            this.setupIconPulseAnimation();
            this.setupGlobalImageLightbox();
            this.setupBookingFlowAnimations();
            this.setupThemeTransitions();
            this.setupAdvancedScrolling();
        },

        // ===========================================
        // SCROLL ANIMATIONS
        // ===========================================
        setupScrollAnimations: function() {
            var scrollElements = document.querySelectorAll('.scroll-reveal, .scroll-stagger, .reveal-fade, .reveal-slide-up, .reveal-slide-left, .reveal-slide-right, .reveal-scale, .reveal-stagger');
            
            // Fallback for older browsers
            if (!('IntersectionObserver' in window)) {
                scrollElements.forEach(function(el) {
                    el.classList.add('visible');
                });
                return;
            }

            // Adaptive thresholds - lower on mobile for better perceived performance
            var threshold = window.innerWidth < 768 ? 0.08 : 0.15;
            
            var observer = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        // Add small delay on mobile to prevent jank during scroll
                        var delay = window.innerWidth < 768 ? 30 : 0;
                        
                        setTimeout(function() {
                            entry.target.classList.add('visible');
                        }, delay);
                        
                        // Unobserve after animation to improve performance
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: threshold,
                rootMargin: '0px 0px -20px 0px'
            });

            scrollElements.forEach(function(el) {
                observer.observe(el);
            });
        },

        // ===========================================
        // PARALLAX EFFECTS
        // ===========================================
        setupParallax: function() {
            // Check for reduced motion preference
            var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (reducedMotion) return;
            
            // Auto-detect parallax elements - no manual attributes required
            var parallaxElements = document.querySelectorAll([
                '.dashboard-welcome',
                '.section-header',
                'section img', 
                '.card img',
                '.product-image',
                '.listing-hero',
                '.hero-background',
                '.page-header',
                '.timeline-item',
                '[data-parallax]'
            ].join(', '));
            
            var cardElements = document.querySelectorAll('.card, .destination-card, .experience-card');
            
            var ticking = false;
            var lastScrollY = 0;

            // Handle both window scroll and dashboard main scroll
            var mainContainer = document.querySelector('.dashboard-main');
            var scrollElement = mainContainer || window;
            
            scrollElement.addEventListener('scroll', function() {
                if (!ticking) {
                    var scrollY = scrollElement === window ? window.pageYOffset : scrollElement.scrollTop;
                    
                    window.requestAnimationFrame(function() {
                        // Background parallax - subtle slow movement
                        parallaxElements.forEach(function(el) {
                            // Skip if element is not in viewport
                            var rect = el.getBoundingClientRect();
                            if (rect.bottom < 0 || rect.top > window.innerHeight) return;
                            
                            // Calculate parallax based on element position
                            var speed = parseFloat(el.getAttribute('data-parallax')) || 0.15;
                            
                            // Calculate relative scroll through the element
                            var elementProgress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
                            elementProgress = Math.max(0, Math.min(1, elementProgress));
                            
                            // Subtle parallax effect - max 20px movement
                            var yPos = -(elementProgress - 0.5) * 40 * speed;
                            
                            el.style.transform = 'translateY(' + yPos + 'px)';
                        });
                        
                        // Card depth effect
                        cardElements.forEach(function(card) {
                            var rect = card.getBoundingClientRect();
                            if (rect.bottom < 0 || rect.top > window.innerHeight) return;
                            
                            // Calculate depth based on vertical position
                            var centerOffset = (rect.top + rect.height/2 - window.innerHeight/2) / window.innerHeight;
                            var rotateX = centerOffset * 2; // Max 2deg rotation
                            
                            card.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg)';
                        });
                        
                        ticking = false;
                    });
                    ticking = true;
                }
            });
            
            // Mouse parallax for cards on desktop
            if (window.innerWidth > 768) {
                document.addEventListener('mousemove', function(e) {
                    if (!ticking) {
                        window.requestAnimationFrame(function() {
                            cardElements.forEach(function(card) {
                                var rect = card.getBoundingClientRect();
                                if (e.clientX < rect.left || e.clientX > rect.right || 
                                    e.clientY < rect.top || e.clientY > rect.bottom) {
                                    card.style.transform = '';
                                    return;
                                }
                                
                                // Calculate mouse position relative to card
                                var x = (e.clientX - rect.left) / rect.width - 0.5;
                                var y = (e.clientY - rect.top) / rect.height - 0.5;
                                
                                // Subtle 3D tilt
                                card.style.transform = 'perspective(1000px) rotateY(' + (-x * 5) + 'deg) rotateX(' + (y * 3) + 'deg)';
                            });
                            ticking = false;
                        });
                        ticking = true;
                    }
                });
            }
        },

        // ===========================================
        // INTERSECTION OBSERVER
        // ===========================================
        setupIntersectionObserver: function() {
            // Lazy load images
            var lazyImages = document.querySelectorAll('img[data-src]');
            
            if ('IntersectionObserver' in window) {
                var imageObserver = new IntersectionObserver(function(entries) {
                    entries.forEach(function(entry) {
                        if (entry.isIntersecting) {
                            var img = entry.target;
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            imageObserver.unobserve(img);
                        }
                    });
                });

                lazyImages.forEach(function(img) {
                    imageObserver.observe(img);
                });
            }
        },

        // ===========================================
        // SMOOTH SCROLL
        // ===========================================
        setupSmoothScroll: function() {
            document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
                anchor.addEventListener('click', function(e) {
                    var targetId = this.getAttribute('href');
                    if (targetId === '#') return;

                    var target = document.querySelector(targetId);
                    if (target) {
                        e.preventDefault();
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                });
            });
        },

        // ===========================================
        // NAVBAR ANIMATION
        // ===========================================
        setupNavbarAnimation: function() {
            var navbar = document.querySelector('.dashboard-topbar, .navbar, header');
            var mainContainer = document.querySelector('.dashboard-main');
            var lastScroll = 0;

            if (mainContainer) {
                mainContainer.addEventListener('scroll', function() {
                    var currentScroll = mainContainer.scrollTop;
                    
                    // Africasa header collapse
                    if (currentScroll > lastScroll && currentScroll > 80) {
                        mainContainer.classList.add('scrolled-down');
                    } else if (currentScroll < lastScroll || currentScroll < 30) {
                        mainContainer.classList.remove('scrolled-down');
                    }

                    lastScroll = currentScroll;
                });
            }

            window.addEventListener('scroll', function() {
                var currentScroll = window.pageYOffset;

                if (navbar) {
                    if (currentScroll > 50) {
                        navbar.classList.add('scrolled');
                    } else {
                        navbar.classList.remove('scrolled');
                    }

                    // Hide on scroll down, show on scroll up
                    if (currentScroll > lastScroll && currentScroll > 100) {
                        navbar.classList.add('hide');
                    } else {
                        navbar.classList.remove('hide');
                    }
                }

                lastScroll = currentScroll;
            });
        },

        // ===========================================
        // CARD INTERACTIONS
        // ===========================================
        setupCardInteractions: function() {
            // Add staggered animation to card grids
            document.querySelectorAll('.destination-cards, .hotels-grid, .tours-grid, .packages-grid').forEach(function(grid) {
                grid.classList.add('stagger');
            });

            // Card tilt effect (3D)
            var tiltCards = document.querySelectorAll('.card[data-tilt]');
            
            tiltCards.forEach(function(card) {
                card.addEventListener('mousemove', function(e) {
                    var rect = card.getBoundingClientRect();
                    var x = e.clientX - rect.left;
                    var y = e.clientY - rect.top;
                    var centerX = rect.width / 2;
                    var centerY = rect.height / 2;
                    var rotateX = (y - centerY) / 20;
                    var rotateY = (centerX - x) / 20;

                    card.style.transform = 
                        'perspective(1000px) ' +
                        'rotateX(' + rotateX + 'deg) ' +
                        'rotateY(' + rotateY + 'deg) ' +
                        'scale3d(1.02, 1.02, 1.02)';
                });

                card.addEventListener('mouseleave', function() {
                    card.style.transform = '';
                });
            });
        },

        // ===========================================
        // 3D CARD TILT WITH AMBIENT LIGHT
        // ===========================================
        setup3DCardTilt: function() {
            // Skip on mobile or reduced motion
            if (window.innerWidth < 768 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
            
            // Create ambient light element
            var ambientLight = document.createElement('div');
            ambientLight.id = 'tiltAmbientLight';
            ambientLight.className = 'tilt-ambient-light';
            document.body.appendChild(ambientLight);
            
            // Get all tilt-enabled cards
            var tiltCards = document.querySelectorAll('.tilt-card, .tilt-effect, .card[data-tilt], .destination-card, .experience-card, .product-card');
            
            if (tiltCards.length === 0) return;
            
            var ticking = false;
            
            tiltCards.forEach(function(card) {
                card.style.transformStyle = 'preserve-3d';
                
                card.addEventListener('mousemove', function(e) {
                    if (ticking) return;
                    
                    var rect = card.getBoundingClientRect();
                    var x = e.clientX - rect.left;
                    var y = e.clientY - rect.top;
                    
                    // Calculate mouse position as percentage
                    var mouseX = (x / rect.width) * 100;
                    var mouseY = (y / rect.height) * 100;
                    
                    // Set CSS custom properties for ambient light gradient
                    card.style.setProperty('--mouse-x', mouseX + '%');
                    card.style.setProperty('--mouse-y', mouseY + '%');
                    
                    // Calculate rotation
                    var centerX = rect.width / 2;
                    var centerY = rect.height / 2;
                    var rotateX = (y - centerY) / (rect.height / 2) * 8; // Max 8deg
                    var rotateY = (centerX - x) / (rect.width / 2) * 8;
                    
                    // Apply transform
                    card.style.transform = 
                        'perspective(1000px) ' +
                        'rotateX(' + rotateX + 'deg) ' +
                        'rotateY(' + rotateY + 'deg) ' +
                        'scale3d(1.03, 1.03, 1.03)';
                    
                    // Move ambient light
                    ambientLight.style.left = e.clientX + 'px';
                    ambientLight.style.top = e.clientY + 'px';
                    ambientLight.classList.add('active');
                    
                    ticking = true;
                    requestAnimationFrame(function() {
                        ticking = false;
                    });
                });
                
                card.addEventListener('mouseleave', function() {
                    card.style.transform = '';
                    card.style.removeProperty('--mouse-x');
                    card.style.removeProperty('--mouse-y');
                    ambientLight.classList.remove('active');
                });
            });
        },

        // ===========================================
        // LOADING ANIMATIONS
        // ===========================================
        setupLoadingAnimations: function() {
            // Show loading states
            document.querySelectorAll('[data-loading]').forEach(function(el) {
                el.classList.add('skeleton');
            });

            // Fade in content when loaded
            window.addEventListener('load', function() {
                document.querySelectorAll('.page-content, main').forEach(function(el) {
                    el.classList.add('fade-in');
                });
            });
        },

        // ===========================================
        // COUNTER ANIMATIONS
        // ===========================================
        setupCounterAnimations: function() {
            var counters = document.querySelectorAll('[data-count]');
            
            if ('IntersectionObserver' in window) {
                var counterObserver = new IntersectionObserver(function(entries) {
                    entries.forEach(function(entry) {
                        if (entry.isIntersecting) {
                            var counter = entry.target;
                            var target = parseInt(counter.getAttribute('data-count'));
                            var duration = parseInt(counter.getAttribute('data-duration')) || 2000;
                            var prefix = counter.getAttribute('data-prefix') || '';
                            var suffix = counter.getAttribute('data-suffix') || '';
                            
                            AnimationController.animateCounter(counter, target, duration, prefix, suffix);
                            counterObserver.unobserve(counter);
                        }
                    });
                });

                counters.forEach(function(counter) {
                    counterObserver.observe(counter);
                });
            }
        },

        // Helper: Animate counter
        animateCounter: function(el, target, duration, prefix, suffix) {
            var start = 0;
            var startTime = null;

            function step(timestamp) {
                if (!startTime) startTime = timestamp;
                var progress = timestamp - startTime;
                var percentage = Math.min(progress / duration, 1);
                
                // Easing function
                var eased = 1 - Math.pow(1 - percentage, 3);
                var current = Math.floor(eased * target);

                el.textContent = prefix + current.toLocaleString() + suffix;

                if (progress < duration) {
                    requestAnimationFrame(step);
                } else {
                    el.textContent = prefix + target.toLocaleString() + suffix;
                }
            }

            requestAnimationFrame(step);
        },

        // ===========================================
        // ICON PULSE ANIMATION
        // ===========================================
        setupIconPulseAnimation: function() {
            // Apply pulse animation to active nav items
            document.querySelectorAll('.nav-item.active svg').forEach(function(svg) {
                svg.addEventListener('animationend', function() {
                    svg.classList.remove('animate-pulse');
                });
            });

            // Handle nav item clicks
            document.addEventListener('click', function(e) {
                var navItem = e.target.closest('.nav-item');
                if (navItem && navItem.querySelector('svg')) {
                    var svg = navItem.querySelector('svg');
                    svg.style.animation = 'none';
                    svg.offsetHeight; // Trigger reflow
                    svg.style.animation = 'iconPulse 0.8s ease-out';
                }
            });
        },

        // ===========================================
        // SCROLL PROGRESS BAR
        // ===========================================
        setupScrollProgress: function() {
            var mainContainer = document.querySelector('.dashboard-main');
            
            if (!mainContainer) return;
            
            // Auto-create progress bar if it doesn't exist
            var progressBar = document.getElementById('scrollProgress');
            
            if (!progressBar) {
                var progressContainer = document.createElement('div');
                progressContainer.className = 'scroll-progress-bar';
                
                var progressFill = document.createElement('div');
                progressFill.className = 'scroll-progress-fill';
                progressFill.id = 'scrollProgress';
                
                progressContainer.appendChild(progressFill);
                
                // Insert as first child of main container
                mainContainer.insertBefore(progressContainer, mainContainer.firstChild);
                progressBar = progressFill;
            }
            
            // Ensure we don't add duplicate listeners
            if (mainContainer.dataset.scrollListenerAttached) return;
            
            mainContainer.dataset.scrollListenerAttached = 'true';
            
            mainContainer.addEventListener('scroll', function() {
                var scrollTop = mainContainer.scrollTop;
                var scrollHeight = mainContainer.scrollHeight - mainContainer.clientHeight;
                var progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
                progressBar.style.width = progress + '%';
            });
            
            // Initialize immediately
            progressBar.style.width = '0%';
        },

        // ===========================================
        // PROGRESSIVE LOADING STATES
        // ===========================================
        setupProgressiveLoading: function() {
            // Handle all image loading
            function handleImageLoad(img) {
                if (img.complete && img.naturalHeight !== 0) {
                    img.classList.add('loaded');
                    return;
                }
                
                img.addEventListener('load', function() {
                    setTimeout(function() {
                        img.classList.add('loaded');
                    }, 50);
                }, { once: true });
                
                // Fallback for broken images
                img.addEventListener('error', function() {
                    img.classList.add('loaded');
                }, { once: true });
            }
            
            // Create skeleton placeholder that matches exact dimensions
            window.createSkeletonPlaceholder = function(element, options = {}) {
                var skeleton = document.createElement('div');
                skeleton.className = 'skeleton ' + (options.className || '');
                
                if (options.width) skeleton.style.width = options.width;
                if (options.height) skeleton.style.height = options.height;
                if (options.type === 'card') {
                    skeleton.innerHTML = `
                        <div class="skeleton-card-image"></div>
                        <div class="skeleton-card-body">
                            <div class="skeleton-text title" style="width: 60%"></div>
                            <div class="skeleton-text" style="width: 100%"></div>
                            <div class="skeleton-text" style="width: 80%"></div>
                            <div class="skeleton-text small" style="width: 40%; margin-top: 12px"></div>
                        </div>
                    `;
                }
                
                if (element.parentNode) {
                    element.parentNode.insertBefore(skeleton, element);
                }
                
                return skeleton;
            };
            
            // Remove skeleton when content loads
            window.removeSkeletonPlaceholder = function(skeleton) {
                if (skeleton && skeleton.parentNode) {
                    skeleton.style.opacity = '0';
                    skeleton.style.transition = 'opacity 0.3s ease';
                    setTimeout(function() {
                        if (skeleton.parentNode) {
                            skeleton.parentNode.removeChild(skeleton);
                        }
                    }, 300);
                }
            };
            
            // Process existing images
            document.querySelectorAll('img:not([data-no-fade])').forEach(handleImageLoad);
            
            // Observe dynamically added images
            if ('MutationObserver' in window) {
                var observer = new MutationObserver(function(mutations) {
                    mutations.forEach(function(mutation) {
                        mutation.addedNodes.forEach(function(node) {
                            if (node.nodeType === 1 && node.tagName === 'IMG' && !node.hasAttribute('data-no-fade')) {
                                handleImageLoad(node);
                            }
                            if (node.nodeType === 1 && node.querySelectorAll) {
                                node.querySelectorAll('img:not([data-no-fade])').forEach(handleImageLoad);
                            }
                        });
                    });
                });
                
                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });
            }
            
            // Page content fade-in
            document.addEventListener('DOMContentLoaded', function() {
                setTimeout(function() {
                    document.querySelectorAll('.fade-in-content').forEach(function(el) {
                        el.classList.add('loaded');
                    });
                }, 100);
            });
            
            // Add loading state classes to all grids
            document.querySelectorAll('.destination-cards, .hotels-grid, .tours-grid, .packages-grid, .africasa-grid, .listing-grid').forEach(function(grid) {
                if (grid.children.length === 0) {
                    grid.classList.add('skeleton-loading');
                }
            });
        },

        // ===========================================
        // TIMELINE ANIMATIONS
        // ===========================================
        setupTimelineAnimations: function() {
            var timelineItems = document.querySelectorAll('.timeline-item, .safari-journey-step, .booking-timeline .timeline-item');
            
            if (timelineItems.length === 0) return;
            
            var observer = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry, index) {
                    if (entry.isIntersecting) {
                        var delay = parseFloat(entry.target.getAttribute('data-delay')) || (index * 0.1);
                        setTimeout(function() {
                            entry.target.classList.add('visible');
                            entry.target.classList.add('timeline-visible');
                        }, delay * 1000);
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.3,
                rootMargin: '0px 0px -100px 0px'
            });
            
            timelineItems.forEach(function(item) {
                observer.observe(item);
            });
        },

        // ===========================================
        // GLOBAL IMAGE LIGHTBOX
        // ===========================================
        setupGlobalImageLightbox: function() {
            // Don't duplicate if already exists
            if (document.getElementById('global-lightbox')) return;
            
            // Disable lightbox completely on Africasa page
            if (window.location.pathname.includes('africasa')) return;
            
            // Create lightbox modal
            var lightbox = document.createElement('div');
            lightbox.id = 'global-lightbox';
            lightbox.className = 'lightbox-modal';
            lightbox.innerHTML = `
                <button class="lightbox-close" id="global-lightbox-close">&times;</button>
                <button class="lightbox-nav prev" id="global-lightbox-prev">&#8249;</button>
                <button class="lightbox-nav next" id="global-lightbox-next">&#8250;</button>
                <div class="lightbox-image-container">
                    <img class="lightbox-image" id="global-lightbox-image" src="" alt="">
                </div>
            `;
            document.body.appendChild(lightbox);
            
            var currentImages = [];
            var currentIndex = 0;
            
            // Collect all images on the page
            function collectImages() {
                currentImages = Array.from(document.querySelectorAll('img:not([data-no-lightbox]):not(.lightbox-image):not([src*="data:image"])')).filter(function(img) {
                    return img.offsetParent !== null && img.src && img.src.length > 0;
                });
            }
            
            function openGlobalLightbox(index) {
                collectImages();
                if (currentImages.length === 0) return;
                
                currentIndex = index;
                var img = currentImages[currentIndex];
                
                var lightboxImg = document.getElementById('global-lightbox-image');
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt || '';
                
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
                void lightbox.offsetWidth;
            }
            
            function closeGlobalLightbox() {
                lightbox.classList.remove('active');
                document.body.style.overflow = '';
            }
            
            function navigateLightbox(direction) {
                collectImages();
                currentIndex += direction;
                if (currentIndex < 0) currentIndex = currentImages.length - 1;
                if (currentIndex >= currentImages.length) currentIndex = 0;
                
                var lightboxImg = document.getElementById('global-lightbox-image');
                lightboxImg.classList.add('fade-transition');
                
                setTimeout(function() {
                    if (currentImages[currentIndex]) {
                        lightboxImg.src = currentImages[currentIndex].src;
                    }
                    setTimeout(function() {
                        lightboxImg.classList.remove('fade-transition');
                    }, 50);
                }, 150);
            }
            
            // Add click handlers to all images
            document.addEventListener('click', function(e) {
                var img = e.target.closest('img');
                if (img && !img.hasAttribute('data-no-lightbox') && !img.classList.contains('lightbox-image')) {
                    // Skip images inside interactive elements
                    if (img.closest('button') || img.closest('a') || img.closest('label') || img.closest('.upload-dropzone')) {
                        return;
                    }
                    
                    collectImages();
                    var index = currentImages.indexOf(img);
                    if (index !== -1) {
                        e.preventDefault();
                        e.stopPropagation();
                        openGlobalLightbox(index);
                    }
                }
            });
            
            // Lightbox controls
            document.getElementById('global-lightbox-close').addEventListener('click', function(e) {
                e.stopPropagation();
                closeGlobalLightbox();
            });
            
            document.getElementById('global-lightbox-prev').addEventListener('click', function(e) {
                e.stopPropagation();
                navigateLightbox(-1);
            });
            
            document.getElementById('global-lightbox-next').addEventListener('click', function(e) {
                e.stopPropagation();
                navigateLightbox(1);
            });
            
            lightbox.addEventListener('click', function(e) {
                if (e.target === lightbox || e.target.classList.contains('lightbox-image-container')) {
                    closeGlobalLightbox();
                }
            });
            
            document.addEventListener('keydown', function(e) {
                if (!lightbox.classList.contains('active')) return;
                if (e.key === 'Escape') closeGlobalLightbox();
                if (e.key === 'ArrowLeft') navigateLightbox(-1);
                if (e.key === 'ArrowRight') navigateLightbox(1);
            });
        },

        // ===========================================
        // THEME TRANSITIONS
        // ===========================================
        setupThemeTransitions: function() {
            // Create transition overlay element
            var overlay = document.createElement('div');
            overlay.id = 'themeTransitionOverlay';
            overlay.className = 'theme-transition-overlay';
            document.body.appendChild(overlay);
            
            // Theme switch function
            window.switchTheme = function(themeName, saveToStorage) {
                if (saveToStorage === undefined) saveToStorage = true;
                
                var overlay = document.getElementById('themeTransitionOverlay');
                var html = document.documentElement;
                var currentTheme = html.getAttribute('data-theme');
                
                if (currentTheme === themeName) return;
                
                // Show overlay
                overlay.classList.add('active');
                
                // Apply accent pulse to cards/buttons
                document.querySelectorAll('.btn-primary, .card, .destination-card').forEach(function(el) {
                    el.classList.remove('accent-pulse');
                    void el.offsetWidth; // Trigger reflow
                    el.classList.add('accent-pulse');
                });
                
                // Switch theme after overlay appears
                setTimeout(function() {
                    html.setAttribute('data-theme', themeName);
                    
                    if (saveToStorage) {
                        localStorage.setItem('muts-safaris-theme', themeName);
                    }
                    
                    // Hide overlay
                    setTimeout(function() {
                        overlay.classList.remove('active');
                    }, 100);
                }, 150);
            };
            
            // Auto-restore saved theme
            var savedTheme = localStorage.getItem('muts-safaris-theme');
            if (savedTheme && savedTheme !== document.documentElement.getAttribute('data-theme')) {
                document.documentElement.setAttribute('data-theme', savedTheme);
            }
            
            // Respect reduced motion
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                overlay.style.display = 'none';
            }
        },

        // ===========================================
        // ADVANCED SCROLLING
        // ===========================================
        setupAdvancedScrolling: function() {
            // Skip if reduced motion is preferred
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
            
            var mainContainer = document.querySelector('.dashboard-main');
            if (!mainContainer) mainContainer = document.documentElement;
            
            // Enable smooth scrolling on main container
            mainContainer.classList.add('smooth-scroll');
            
            // Hide scroll indicators when scrolling starts
            var scrollIndicator = document.querySelector('.scroll-indicator');
            if (scrollIndicator && mainContainer) {
                var hideIndicator = function() {
                    scrollIndicator.classList.add('hidden');
                    mainContainer.removeEventListener('scroll', hideIndicator);
                };
                mainContainer.addEventListener('scroll', hideIndicator, { once: true });
            }
            
            // Add momentum scroll enhancement
            var addMomentumEnhancement = function(container) {
                container.addEventListener('wheel', function(e) {
                    // Only enhance vertical scrolling
                    if (Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;
                    
                    var scrollTop = container.scrollTop;
                    var scrollHeight = container.scrollHeight - container.clientHeight;
                    var atTop = scrollTop <= 0 && e.deltaY < 0;
                    var atBottom = scrollTop >= scrollHeight && e.deltaY > 0;
                    
                    if (atTop || atBottom) {
                        e.preventDefault();
                        // Smooth stop at boundaries
                        if (atTop) {
                            container.scrollTo({ top: 0, behavior: 'smooth' });
                        } else {
                            container.scrollTo({ top: scrollHeight, behavior: 'smooth' });
                        }
                    }
                }, { passive: true });
            };
            
            // Apply to scroll containers
            document.querySelectorAll('.snap-container, .snap-scroll, .experience-cards-scroll').forEach(function(container) {
                addMomentumEnhancement(container);
            });
            
            // Keyboard navigation for snap sections
            var snapSections = document.querySelectorAll('.snap-section');
            if (snapSections.length > 0 && mainContainer) {
                mainContainer.addEventListener('keydown', function(e) {
                    if (e.key === 'PageDown' || e.key === 'ArrowDown') {
                        e.preventDefault();
                        var currentSection = null;
                        var sectionRects = [];
                        
                        snapSections.forEach(function(section) {
                            var rect = section.getBoundingClientRect();
                            sectionRects.push({ section: section, rect: rect });
                            if (rect.top <= 100) currentSection = section;
                        });
                        
                        // Find next section
                        var nextSection = null;
                        for (var i = 0; i < sectionRects.length; i++) {
                            if (sectionRects[i].rect.top > 100) {
                                nextSection = sectionRects[i].section;
                                break;
                            }
                        }
                        
                        if (nextSection) {
                            nextSection.scrollIntoView({ behavior: 'smooth' });
                        }
                    } else if (e.key === 'PageUp' || e.key === 'ArrowUp') {
                        e.preventDefault();
                        var currentSection = null;
                        var sectionRects = [];
                        
                        snapSections.forEach(function(section) {
                            var rect = section.getBoundingClientRect();
                            sectionRects.push({ section: section, rect: rect });
                            if (rect.top >= 0) currentSection = section;
                        });
                        
                        // Find previous section
                        var prevSection = null;
                        for (var i = sectionRects.length - 1; i >= 0; i--) {
                            if (sectionRects[i].rect.top < 0) {
                                prevSection = sectionRects[i].section;
                                break;
                            }
                        }
                        
                        if (prevSection) {
                            prevSection.scrollIntoView({ behavior: 'smooth' });
                        }
                    }
                });
            }
        },

        // ===========================================
        // BOOKING FLOW ANIMATIONS
        // ===========================================
        setupBookingFlowAnimations: function() {
            // Selection state animations
            document.addEventListener('click', function(e) {
                var selectable = e.target.closest('.selectable-item, .destination-card, .package-card, .tour-card');
                if (selectable) {
                    selectable.classList.add('selected');
                    
                    setTimeout(function() {
                        selectable.classList.remove('selected');
                    }, 300);
                }
            });
            
            // Form field validation animations
            document.addEventListener('invalid', function(e) {
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') {
                    e.target.classList.add('invalid');
                    setTimeout(function() {
                        e.target.classList.remove('invalid');
                    }, 500);
                }
            }, true);
            
            // Step progress animations
            window.animateStepProgress = function(currentStep, totalSteps) {
                var steps = document.querySelectorAll('.step-item');
                var connectors = document.querySelectorAll('.step-connector');
                
                steps.forEach(function(step, index) {
                    step.classList.remove('active', 'completed');
                    if (index < currentStep) {
                        step.classList.add('completed');
                    } else if (index === currentStep) {
                        step.classList.add('active');
                    }
                });
                
                connectors.forEach(function(connector, index) {
                    connector.classList.toggle('completed', index < currentStep);
                });
            };
            
            // Success confirmation animation
            window.showBookingSuccess = function(callback) {
                var celebration = document.createElement('div');
                celebration.className = 'celebration-animation';
                celebration.innerHTML = `
                    <svg class="success-checkmark" viewBox="0 0 52 52">
                        <circle class="success-checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
                        <path class="success-checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                    </svg>
                `;
                document.body.appendChild(celebration);
                
                // Confetti particles
                var colors = ['#FFB800', '#2ecc71', '#3498db', '#9b59b6', '#e74c3c'];
                for (var i = 0; i < 30; i++) {
                    var particle = document.createElement('div');
                    particle.className = 'confetti-particle';
                    particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                    particle.style.left = (Math.random() * 100 - 50) + 'px';
                    particle.style.animationDelay = (Math.random() * 0.5) + 's';
                    celebration.appendChild(particle);
                }
                
                setTimeout(function() {
                    celebration.remove();
                    if (callback) callback();
                }, 1500);
            };
        },

        // ===========================================
        // UTILITY METHODS
        // ===========================================
        
        // Add animation class with delay
        addAnimated: function(element, animation, delay) {
            element.classList.add(animation);
            if (delay) {
                element.style.animationDelay = delay + 'ms';
            }
        },

        // Remove animation class
        removeAnimated: function(element, animation) {
            element.classList.remove(animation);
        },

        // Trigger reflow
        reflow: function(element) {
            return element.offsetHeight;
        },

        // Animate CSS property
        animate: function(element, properties, duration) {
            element.style.transition = 'all ' + duration + 'ms ease';
            Object.keys(properties).forEach(function(key) {
                element.style[key] = properties[key];
            });
        }
    };

    // Make globally available
    window.AnimationController = AnimationController;

    // Convenience function for triggering animations
    window.animate = function(selector, animation, delay) {
        var elements = document.querySelectorAll(selector);
        elements.forEach(function(el, index) {
            el.classList.add(animation);
            if (delay) {
                el.style.animationDelay = (delay * index) + 'ms';
            }
        });
    };

})();