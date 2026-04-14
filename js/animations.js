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
            this.setupScrollAnimations();
            this.setupParallax();
            this.setupIntersectionObserver();
            this.setupSmoothScroll();
            this.setupNavbarAnimation();
            this.setupCardInteractions();
            this.setupLoadingAnimations();
            this.setupCounterAnimations();
        },

        // ===========================================
        // SCROLL ANIMATIONS
        // ===========================================
        setupScrollAnimations: function() {
            var scrollElements = document.querySelectorAll('.scroll-reveal, .scroll-stagger');
            
            // Fallback for older browsers
            if (!('IntersectionObserver' in window)) {
                scrollElements.forEach(function(el) {
                    el.classList.add('visible');
                });
                return;
            }

            var observer = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        // Unobserve after animation
                        // observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            scrollElements.forEach(function(el) {
                observer.observe(el);
            });
        },

        // ===========================================
        // PARALLAX EFFECTS
        // ===========================================
        setupParallax: function() {
            var parallaxElements = document.querySelectorAll('[data-parallax]');
            var ticking = false;

            window.addEventListener('scroll', function() {
                if (!ticking) {
                    window.requestAnimationFrame(function() {
                        parallaxElements.forEach(function(el) {
                            var speed = parseFloat(el.getAttribute('data-parallax')) || 0.5;
                            var yPos = -(window.pageYOffset * speed);
                            el.style.transform = 'translateY(' + yPos + 'px)';
                        });
                        ticking = false;
                    });
                    ticking = true;
                }
            });
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
            var lastScroll = 0;

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