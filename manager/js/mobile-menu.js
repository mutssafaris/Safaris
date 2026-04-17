/* Mobile Menu Auto-Init - Muts Safaris Manager */
/* Automatically adds mobile menu toggle if not present */
(function() {
    document.addEventListener('DOMContentLoaded', function() {
        initMobileMenu();
    });
    
    // Also try on load for late-loading pages
    window.addEventListener('load', function() {
        if (!document.getElementById('mobile-menu-initialized')) {
            initMobileMenu();
        }
    });
    
    function initMobileMenu() {
        var dashboardLayout = document.querySelector('.dashboard-layout');
        if (!dashboardLayout) return;
        
        // Check if toggle already exists in HTML
        var existingToggle = document.getElementById('mobile-menu-toggle');
        if (!existingToggle) {
            var toggle = document.createElement('button');
            toggle.id = 'mobile-menu-toggle';
            toggle.className = 'mobile-menu-toggle';
            toggle.innerHTML = '<span></span><span></span><span></span>';
            toggle.setAttribute('aria-label', 'Toggle menu');
            dashboardLayout.appendChild(toggle);
        }
        
        // Check if overlay already exists
        if (!document.getElementById('sidebar-overlay')) {
            var overlay = document.createElement('div');
            overlay.id = 'sidebar-overlay';
            overlay.className = 'sidebar-overlay';
            var sidebar = document.querySelector('.sidebar');
            if (sidebar) {
                dashboardLayout.insertBefore(overlay, sidebar);
            }
        }
        
        // Mark as initialized
        var marker = document.createElement('div');
        marker.id = 'mobile-menu-initialized';
        marker.style.display = 'none';
        document.body.appendChild(marker);
        
        // Add event listeners
        var menuToggle = document.getElementById('mobile-menu-toggle');
        var sidebar = document.querySelector('.sidebar');
        var overlay = document.getElementById('sidebar-overlay');
        
        if (menuToggle && sidebar) {
            menuToggle.addEventListener('click', function(e) {
                e.stopPropagation();
                menuToggle.classList.toggle('active');
                sidebar.classList.toggle('active');
                if (overlay) overlay.classList.toggle('active');
            });
            
            if (overlay) {
                overlay.addEventListener('click', function() {
                    sidebar.classList.remove('active');
                    overlay.classList.remove('active');
                });
            }
        }
        
        // Close sidebar on nav click (mobile)
        var navLinks = document.querySelectorAll('.sidebar .nav-item');
        navLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768 && sidebar) {
                    sidebar.classList.remove('active');
                    if (overlay) overlay.classList.remove('active');
                }
            });
        });
    }
})();

// Reposition custom dropdowns on mobile to appear below their triggers
(function() {
    function repositionDropdowns() {
        var dropdowns = document.querySelectorAll('.custom-select');
        if (window.innerWidth > 480) return;
        
        dropdowns.forEach(function(dropdown) {
            var trigger = dropdown.querySelector('.select-trigger');
            var list = dropdown.querySelector('.dropdown-list');
            if (!trigger || !list) return;
            
            // Get trigger position
            var rect = trigger.getBoundingClientRect();
            
            // Position below trigger, within viewport
            var topPos = rect.bottom + window.scrollY + 4;
            var leftPos = rect.left + window.scrollX;
            var maxHeight = window.innerHeight - rect.bottom - 20;
            
            // Apply
            list.style.position = 'fixed';
            list.style.top = topPos + 'px';
            list.style.left = leftPos + 'px';
            list.style.right = 'auto';
            list.style.maxHeight = Math.min(maxHeight, 200) + 'px';
        });
    }
    
    // Run on toggle and scroll
    document.addEventListener('click', function(e) {
        var select = e.target.closest('.custom-select');
        if (select) {
            setTimeout(repositionDropdowns, 10);
        }
    });
    
    window.addEventListener('resize', repositionDropdowns);
    window.addEventListener('scroll', repositionDropdowns, true);
})();

// ==== Custom Dropdown Accessibility Enhancements ====
    // Add ARIA attributes to all custom selects and manage state on toggle
    var customSelects = document.querySelectorAll('.custom-select');
    customSelects.forEach(function(select) {
        var trigger = select.querySelector('.select-trigger');
        if (trigger) {
            trigger.setAttribute('role', 'button');
            trigger.setAttribute('aria-haspopup', 'listbox');
            trigger.setAttribute('aria-expanded', 'false');
            // Toggle aria-expanded on click
            trigger.addEventListener('click', function() {
                var expanded = trigger.getAttribute('aria-expanded') === 'true';
                trigger.setAttribute('aria-expanded', String(!expanded));
            });
        }
    });
