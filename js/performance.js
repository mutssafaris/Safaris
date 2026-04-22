// Muts Safaris - Performance Optimization Script
// Included on all pages for optimized content delivery

(function() {
    'use strict';

    // Preconnect to critical domains
    const domains = [
        'https://images.mutssafaris.com',
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com'
    ];

    domains.forEach(function(domain) {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = domain;
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
    });

    // Lazy load images with IntersectionObserver
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    
                    if (img.complete) {
                        img.classList.add('loaded');
                    } else {
                        img.addEventListener('load', function() {
                            img.classList.add('loaded');
                        });
                    }
                    
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '100px 0px',
            threshold: 0.01
        });

        document.addEventListener('DOMContentLoaded', function() {
            document.querySelectorAll('img[loading="lazy"], .category-img, .experience-card img').forEach(function(img) {
                imageObserver.observe(img);
            });
        });
    }

    // Critical CSS inlining helper
    function loadCSSAsync(href) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        link.media = 'print';
        link.onload = function() {
            link.media = 'all';
        };
        document.head.appendChild(link);
    }

    // Defer non-critical JS
    function deferScript(src) {
        const script = document.createElement('script');
        script.src = src;
        script.defer = true;
        document.body.appendChild(script);
    }

    // Error handling for failed images
    document.addEventListener('error', function(e) {
        if (e.target.tagName === 'IMG') {
            e.target.style.background = 'var(--bg-secondary)';
            e.target.style.minHeight = '100px';
            e.target.alt = 'Image failed to load';
        }
    }, true);

    // Performance metrics logging (for dev)
    if (window.performance && window.location.hostname === 'localhost') {
        window.addEventListener('load', function() {
            setTimeout(function() {
                const timing = performance.timing;
                console.log('Page Load Performance:');
                console.log('  DOMContentLoaded:', timing.domContentLoadedEventEnd - timing.navigationStart, 'ms');
                console.log('  Full Load:', timing.loadEventEnd - timing.navigationStart, 'ms');
            }, 0);
        });
    }

})();
