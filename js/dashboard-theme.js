/* Dashboard Theme JS — Muts Safaris */
(function () {
    if (window.mutsDashboardInitialized) return;
    window.mutsDashboardInitialized = true;

    var isDashboardPage = window.location.pathname.indexOf('/pages/dashboard/') !== -1;

    function getImagePath(relativePath) {
        if (isDashboardPage) {
            return '../../' + relativePath;
        }
        return relativePath;
    }

    function getNavPath(page) {
        return page;
    }

    function initSidebar() {
        var expectedItems = [
            { href: 'index.html', label: 'Dashboard', icon: 'M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z' },
            { href: 'travel-info/index.html', label: 'Travel Info', icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z' },
            { href: 'my-trips.html', label: 'My Trips', icon: 'M17 6h-2V3H9v3H7c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM11 3h2v3h-2V3zm6 16H7V8h10v11z' },
            { href: 'gallery.html', label: 'Gallery', icon: 'M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z' },
            { href: 'map.html', label: 'Map', icon: 'M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z' },
            { href: 'beaches.html', label: 'Beaches', icon: 'M13.127 14.56l1.43-1.43 6.44 6.443L19.57 21zm4.293-5.73l2.86-2.86c-3.95-3.95-10.35-3.96-14.3-.02 3.93-1.3 8.31-.25 11.44 2.88zM5.95 5.98c-3.94 3.95-3.93 10.35.02 14.3l2.86-2.86C5.7 14.29 4.65 9.91 5.95 5.98zm.02-.02l-.01.01c-.38 3.01 1.17 6.88 4.3 10.02l5.73-5.73c-3.13-3.13-7.01-4.68-10.02-4.3z' },
            { href: 'packages.html', label: 'Packages', icon: 'M20 6h-2.18c.11-.31.18-.65.18-1a3 3 0 00-3-3c-1.05 0-1.95.56-2.47 1.37L12 4.13l-.53-.76A3 3 0 009 2a3 3 0 00-3 3c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2z' },
            { href: 'hotels.html', label: 'Hotels', icon: 'M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z' },
            { href: 'tours.html', label: 'Tours', icon: 'M14 6l-1-2H5v17h2v-7h5l1 2h7V6h-6zm4 8h-4l-1-2H7v2h4l1 2h6v-2z' },
            { href: 'experiences.html', label: 'Experiences', icon: 'M13.5.67s.87 3 3.48 3 3.48-3 3.48-3H17v14h2v-8.28c0-2.22-1.78-4-4-4-1.33 0-2.44.83-2.89 1.98l-1.61 2.1c-.38.48-.6 1.08-.6 1.75v3.25H7v-3.18c0-.97-.39-1.85-1.02-2.45L7.5 6.7 5.5 4 4 5.5l2 2 1.5-1.5V1h3v4h2V2.5l1.5 1.5-1.5 1.5 1.5 1.5V17h2V3.5c0-.83-.67-1.5-1.5-1.5z' },
            { href: 'africasa.html', label: 'Africasa', icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z' },
            { href: 'blog.html', label: 'Blog', icon: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z' },
            { href: 'faq.html', label: 'FAQ', icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z' },
            { href: 'about.html', label: 'About', icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z' },
            { href: 'contact.html', label: 'Contact', icon: 'M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z' },
            { href: 'favorites.html', label: 'Favorites', icon: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z' },
            { href: 'messages.html', label: 'Messages', icon: 'M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z', badge: true },
            { href: 'transactions.html', label: 'Transactions', icon: 'M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z' },
            { href: 'profile.html', label: 'Settings', icon: 'M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.12-.21.08-.47-.12-.61l-1.92-3.32a.49.49 0 00-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 00-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96a.49.49 0 00-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.12.21-.08.47.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6A3.6 3.6 0 1115.6 12 3.6 3.6 0 0112 15.6z' }
        ];
        
        try {
            var navList = document.querySelector('.sidebar-nav ul');
            if (!navList) {
                console.warn('[initSidebar] Sidebar nav list not found');
                return;
            }
            
            var existingLinks = {};
            navList.querySelectorAll('.nav-item').forEach(function(item) {
                var href = item.getAttribute('href');
                if (href) existingLinks[href] = true;
            });
            
            var addedCount = 0;
            expectedItems.forEach(function(item) {
                if (!existingLinks[item.href]) {
                    var badgeHTML = item.badge ? '<span class="badge" id="unread-badge"></span>' : '';
                    var li = document.createElement('li');
                    li.innerHTML = '<a href="' + item.href + '" class="nav-item"><svg viewBox="0 0 24 24"><path d="' + item.icon + '"/></svg><span class="nav-label">' + item.label + '</span>' + badgeHTML + '</a>';
                    navList.appendChild(li);
                    addedCount++;
                }
            });
            
            var path = window.location.pathname;
            navList.querySelectorAll('.nav-item').forEach(function(item) {
                var href = item.getAttribute('href');
                if (href && path.indexOf(href) !== -1) {
                    item.classList.add('active');
                }
            });

            var logoutBtn = document.getElementById('logout-btn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    if (window.MutsAuth) window.MutsAuth.logout();
                });
            }
            
            if (addedCount > 0) {
                console.log('[initSidebar] Added ' + addedCount + ' missing sidebar items');
            }
        } catch (e) {
            console.error('[initSidebar] Error:', e);
        }
    }

    function initMobileSidebar() {
        var toggle = document.getElementById('mobile-sidebar-toggle');
        var sidebar = document.getElementById('dashboardSidebar');
        var overlay = document.getElementById('sidebar-overlay');
        var layout = document.querySelector('.dashboard-layout');

        if (!toggle || !sidebar) return;

        toggle.addEventListener('click', function () {
            toggle.classList.toggle('active');
            sidebar.classList.toggle('open');
            if (overlay) overlay.classList.toggle('visible');
        });

        if (overlay) {
            overlay.addEventListener('click', function () {
                toggle.classList.remove('active');
                sidebar.classList.remove('open');
                overlay.classList.remove('visible');
            });
        }

        // Close sidebar when a nav link is clicked on mobile
        sidebar.querySelectorAll('.nav-item, .logout-btn').forEach(function (item) {
            item.addEventListener('click', function () {
                if (window.innerWidth <= 768) {
                    toggle.classList.remove('active');
                    sidebar.classList.remove('open');
                    if (overlay) overlay.classList.remove('visible');
                }
            });
        });

        // Handle resize
        window.addEventListener('resize', function () {
            if (window.innerWidth > 768) {
                sidebar.classList.remove('open');
                toggle.classList.remove('active');
                if (overlay) overlay.classList.remove('visible');
            }
        });
    }

    function loadGreeting() {
        if (!window.MutsAuth) return;
        var user = window.MutsAuth.getCurrentUser();
        if (!user) return;
        var nameEl = document.getElementById('greeting-name');
        if (nameEl) nameEl.textContent = user.name.split(' ')[0];
        var userNameEl = document.getElementById('user-name');
        if (userNameEl) userNameEl.textContent = user.name;
        var avatarEl = document.getElementById('user-avatar');
        if (avatarEl) avatarEl.textContent = user.name.charAt(0).toUpperCase();
    }

    function getBookings() {
        if (!window.MutsAuth) return [];
        var user = window.MutsAuth.getCurrentUser();
        if (!user) return [];
        var all = JSON.parse(localStorage.getItem('muts_bookings') || '[]');
        return all.filter(function (b) { return b.userId === user.id; });
    }

    function getMessages() {
        if (!window.MutsAuth) return [];
        var user = window.MutsAuth.getCurrentUser();
        if (!user) return [];
        var all = JSON.parse(localStorage.getItem('muts_messages') || '[]');
        return all.filter(function (m) { return m.userId === user.id; });
    }

    function getTransactions() {
        if (!window.MutsAuth) return [];
        var user = window.MutsAuth.getCurrentUser();
        if (!user) return [];
        var all = JSON.parse(localStorage.getItem('muts_transactions') || '[]');
        return all.filter(function (t) { return t.userId === user.id; });
    }

    function getFavorites() {
        if (!window.MutsAuth) return [];
        var user = window.MutsAuth.getCurrentUser();
        if (!user) return [];
        var all = JSON.parse(localStorage.getItem('muts_favorites') || '[]');
        return all.filter(function (f) { return f.userId === user.id; });
    }

    function initCalendar() {
        var calEl = document.getElementById('calendar-widget');
        var monthEl = document.getElementById('cal-month-year');
        if (!calEl || !monthEl) return;

        var now = new Date();
        var currentMonth = now.getMonth();
        var currentYear = now.getFullYear();

        function render() {
            var bookings = getBookings();
            var bookingDates = [];
            bookings.forEach(function (b) {
                var start = new Date(b.checkin);
                var end = new Date(b.checkout);
                for (var d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
                    bookingDates.push(d.toISOString().slice(0, 10));
                }
            });

            var first = new Date(currentYear, currentMonth, 1);
            var last = new Date(currentYear, currentMonth + 1, 0);
            var startDay = first.getDay();
            var daysInMonth = last.getDate();

            monthEl.textContent = first.toLocaleString('default', { month: 'long', year: 'numeric' });

            var html = '<div class="calendar-grid">';
            var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            days.forEach(function (d) { html += '<div class="day-header">' + d + '</div>'; });

            for (var i = 0; i < startDay; i++) {
                html += '<div class="day other-month"></div>';
            }

            for (var day = 1; day <= daysInMonth; day++) {
                var dateStr = currentYear + '-' + String(currentMonth + 1).padStart(2, '0') + '-' + String(day).padStart(2, '0');
                var isToday = day === now.getDate() && currentMonth === now.getMonth() && currentYear === now.getFullYear();
                var hasBooking = bookingDates.indexOf(dateStr) !== -1;
                var cls = 'day';
                if (isToday) cls += ' today';
                if (hasBooking) cls += ' has-booking';
                html += '<div class="' + cls + '">' + day + '</div>';
            }

            html += '</div>';
            calEl.innerHTML = html;
        }

        document.getElementById('cal-prev').addEventListener('click', function () {
            currentMonth--;
            if (currentMonth < 0) { currentMonth = 11; currentYear--; }
            render();
        });

        document.getElementById('cal-next').addEventListener('click', function () {
            currentMonth++;
            if (currentMonth > 11) { currentMonth = 0; currentYear++; }
            render();
        });

        render();
    }

    function loadRecentBookings() {
        var container = document.getElementById('bookings-list');
        if (!container) return;

        function renderBookings(bookings) {
            if (bookings.length === 0) {
                container.innerHTML = '<div class="empty-state"><p>No bookings yet.</p></div>';
                return;
            }
            container.classList.add('list-layout');
            container.innerHTML = bookings.map(function (b) {
                var status = b.status || 'upcoming';
                var statusDisplay = status === 'cancellation_pending' ? 'Cancellation Pending' : status.charAt(0).toUpperCase() + status.slice(1);
                var guests = (b.adults || 1) + ' adults' + (b.children > 0 ? ', ' + b.children + ' children' : '');
                return '<a href="booking-detail.html?id=' + b.id + '" class="booking-list-item">' +
                    '<div class="booking-list-status ' + status + '">' + statusDisplay + '</div>' +
                    '<div class="booking-list-body">' +
                        '<h4>' + b.destination + '</h4>' +
                        '<span class="booking-list-dates">' + b.checkin + ' &mdash; ' + b.checkout + '</span>' +
                    '</div>' +
                    '<div class="booking-list-meta">' +
                        '<span class="booking-list-guests">' + guests + '</span>' +
                        '<span class="booking-list-price">$' + b.totalPrice.toLocaleString() + '</span>' +
                    '</div>' +
                '</a>';
            }).join('');
        }

        if (window.MutsBookingsService) {
            var user = window.MutsAuth ? window.MutsAuth.getCurrentUser() : null;
            window.MutsBookingsService.getRecent(user ? user.id : null, 5).then(renderBookings);
        } else {
            var bookings = getBookings().slice(0, 5);
            renderBookings(bookings);
        }
    }

    function loadDestinations() {
        var container = document.getElementById('destination-cards');
        if (!container) return;

        function renderList(destinations) {
            container.classList.add('list-layout');
            container.innerHTML = destinations.map(function (d) {
                var imgSrc = d.img || getImagePath(d.image);
                var name = d.name;
                var region = d.region || '';
                var price = d.priceFrom || d.price;
                var duration = d.duration || '';
                var rating = d.rating || '';
                var tags = d.tags || [];
                var link = d.link || '#';
                var tagsHtml = tags.map(function (t) {
                    return '<span class="dest-tag">' + t + '</span>';
                }).join('');
                return '<a href="' + link + '" class="destination-list-item">' +
                    '<img src="' + imgSrc + '" alt="' + name + '" loading="lazy">' +
                    '<div class="destination-list-body">' +
                        '<div class="dest-region">' + region + '</div>' +
                        '<h4>' + name + '</h4>' +
                    '</div>' +
                    '<div class="destination-list-tags">' + tagsHtml + '</div>' +
                    '<div class="destination-list-meta">' +
                        '<span class="dest-price">From $' + price + '</span>' +
                        '<span class="dest-duration">' + duration + '</span>' +
                        '<span class="dest-rating">&#9733; ' + rating + '</span>' +
                    '</div>' +
                '</a>';
            }).join('');
        }

        if (window.MutsDestinationsService) {
            window.MutsDestinationsService.getPopular().then(renderList);
        } else {
            renderList([
                { name: 'Maasai Mara', region: 'Rift Valley', duration: '3-7 Days', priceFrom: 450, rating: 4.9, img: getImagePath('images/tours/maasai-mara-hero.jpg'), tags: ['Most Popular'], link: 'tours/maasai-mara.html' },
                { name: 'Amboseli', region: 'Kajiado County', duration: '2-3 Days', priceFrom: 380, rating: 4.7, img: getImagePath('images/tours/amboseli-hero.jpg'), tags: ['Elephant Paradise'], link: 'tours/amboseli.html' },
                { name: 'Diani Beach', region: 'South Coast', duration: '3-7 Days', priceFrom: 280, rating: 4.8, img: getImagePath('images/beaches/diani-beach.jpg'), tags: ['Beach'], link: 'beaches/diani.html' }
            ]);
        }
    }

    function renderTabList(container, items, viewAllLabel, viewAllLink, category) {
        if (!items || items.length === 0) {
            container.innerHTML = '<div class="empty-state"><p>No items available.</p></div>';
            return;
        }
        container.classList.add('list-layout');
        var html = items.map(function (item) {
            var imgSrc = getImagePath(item.image);
            var badge = item.badge ? '<span class="tab-list-badge">' + item.badge + '</span>' : '';
            var meta = '';
            var link = item.link;
            if (category === 'beaches') {
                var slug = item.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
                link = 'beaches/detail.html?beach=' + slug;
            } else if (category === 'packages') {
                var slug = item.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
                link = 'packages/detail.html?package=' + slug;
            }
            if (item.duration) {
                meta = '<span class="tab-list-duration">' + item.duration + '</span>';
            } else if (item.location) {
                meta = '<span class="tab-list-location">' + item.location + '</span>';
            }
            return '<a href="' + link + '" class="tab-list-item">' +
                '<img src="' + imgSrc + '" alt="' + item.name + '" loading="lazy">' +
                '<div class="tab-list-body">' +
                    '<h4>' + item.name + '</h4>' +
                    '<p>' + item.description + '</p>' +
                '</div>' +
                badge +
                (meta ? '<div class="tab-list-meta">' + meta + '</div>' : '') +
            '</a>';
        }).join('');
        html += '<div class="tab-list-view-all"><a href="' + viewAllLink + '">View All ' + viewAllLabel + ' &rarr;</a></div>';
        container.innerHTML = html;
    }

    function loadTabContent(category) {
        var container = document.getElementById('tab-' + category);
        if (!container) return;

        var viewAllMap = {
            tours: { label: 'Tours', link: 'tours.html' },
            packages: { label: 'Packages', link: 'packages.html' },
            beaches: { label: 'Beaches', link: 'beaches.html' },
            hotels: { label: 'Hotels', link: 'hotels.html' },
            experiences: { label: 'Experiences', link: 'experiences.html' }
        };

        var meta = viewAllMap[category] || { label: category, link: category + '.html' };

        if (window.MutsListingsService) {
            window.MutsListingsService.getByCategory(category).then(function (items) {
                renderTabList(container, items, meta.label, meta.link, category);
            });
        } else {
            renderTabList(container, [], meta.label, meta.link, category);
        }
    }

    function initTabs() {
        var btns = document.querySelectorAll('.tab-btn');

        function switchTab(category) {
            btns.forEach(function (b) { b.classList.remove('active'); });
            document.querySelectorAll('.tab-content').forEach(function (c) { c.classList.remove('active'); });
            var tab = document.getElementById('tab-' + category);
            if (tab) {
                tab.classList.add('active');
                if (!tab.querySelector('.tab-list-item')) {
                    loadTabContent(category);
                }
            }
            btns.forEach(function (b) {
                if (b.dataset.tab === category) b.classList.add('active');
            });
        }

        btns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                switchTab(btn.dataset.tab);
            });
        });

        // Load the initially active tab
        var activeBtn = document.querySelector('.tab-btn.active');
        if (activeBtn) {
            loadTabContent(activeBtn.dataset.tab);
        }
    }

    function initBanner() {
        var banner = document.getElementById('discount-banner');
        var closeBtn = document.getElementById('banner-close');
        if (!banner || !closeBtn) return;
        if (localStorage.getItem('muts_banner_dismissed')) {
            banner.style.display = 'none';
            return;
        }
        closeBtn.addEventListener('click', function () {
            banner.style.display = 'none';
            localStorage.setItem('muts_banner_dismissed', '1');
        });
    }

    function initSearch() {
        var input = document.getElementById('dashboard-search');
        if (!input) return;
        input.addEventListener('input', function () {
            var q = input.value.toLowerCase();
            document.querySelectorAll('.destination-card, .destination-list-item, .listing-card, .tab-list-item, .booking-list-item, .trip-card').forEach(function (card) {
                var text = card.textContent.toLowerCase();
                card.style.display = text.indexOf(q) !== -1 ? '' : 'none';
            });
        });
    }

    function loadUnreadBadge() {
        var badge = document.getElementById('unread-badge');
        if (!badge) return;
        var msgs = getMessages();
        var unread = msgs.filter(function (m) { return !m.read; }).length;
        badge.textContent = unread > 0 ? unread : '';
        badge.style.display = unread > 0 ? '' : 'none';
    }

    // Page-specific loaders
    function loadTripsPage() {
        var container = document.getElementById('trips-list');
        var emptyState = document.getElementById('trips-empty');
        if (!container) return;

        function render(filter) {
            function displayTrips(trips) {
                var today = new Date().toISOString().slice(0, 10);
                if (filter === 'upcoming') trips = trips.filter(function (t) { return t.checkin >= today && t.status !== 'cancelled'; });
                else if (filter === 'completed') trips = trips.filter(function (t) { return t.checkout < today || t.status === 'completed'; });
                else if (filter === 'cancelled') trips = trips.filter(function (t) { return t.status === 'cancelled' || t.status === 'cancellation_pending'; });

                if (trips.length === 0) {
                    container.innerHTML = '';
                    if (emptyState) emptyState.style.display = '';
                    return;
                }
                if (emptyState) emptyState.style.display = 'none';
                container.innerHTML = trips.map(function (t) {
                    var status = t.status;
                    if (status === 'cancelled' || status === 'cancellation_pending') {
                        // Keep the actual status for display
                    } else {
                        var today = new Date().toISOString().slice(0, 10);
                        status = t.checkin >= today ? 'upcoming' : 'completed';
                    }
                    var statusDisplay = status === 'cancellation_pending' ? 'Cancellation Pending' : status.charAt(0).toUpperCase() + status.slice(1);
                    return '<a href="booking-detail.html?id=' + t.id + '" class="trip-card">' +
                        '<span class="trip-status ' + status + '">' + statusDisplay + '</span>' +
                        '<div class="trip-details">' +
                            '<h3>' + t.destination + '</h3>' +
                            '<p>' + t.checkin + ' \u2014 ' + t.checkout + ' \u00b7 ' + t.adults + ' adults</p>' +
                        '</div>' +
                        '<div class="trip-meta">' +
                            '<span class="trip-price">$' + t.totalPrice.toLocaleString() + '</span>' +
                        '</div>' +
                    '</a>';
                }).join('');
            }

            if (window.MutsBookingsService) {
                window.MutsBookingsService.getAll(null).then(displayTrips);
            } else {
                displayTrips(getBookings());
            }
        }

        document.querySelectorAll('.trips-filters .filter-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                document.querySelectorAll('.trips-filters .filter-btn').forEach(function (b) { b.classList.remove('active'); });
                btn.classList.add('active');
                render(btn.dataset.filter);
            });
        });

        render('all');
    }

    function loadFavoritesPage() {
        var container = document.getElementById('favorites-grid');
        var emptyState = document.getElementById('favorites-empty');
        if (!container) return;
        var favs = getFavorites();
        if (favs.length === 0) {
            if (emptyState) emptyState.style.display = '';
            return;
        }
        if (emptyState) emptyState.style.display = 'none';
        container.innerHTML = favs.map(function (f) {
            return '<div class="favorite-card"><img src="' + (f.itemImage || getImagePath('images/hero/kenya-safari.jpg')) + '" alt="' + f.itemName + '" loading="lazy"><button class="fav-remove" data-id="' + f.itemId + '">&times;</button><div class="fav-body"><h4>' + f.itemName + '</h4><p>' + (f.itemType || 'Destination') + '</p></div></div>';
        }).join('');

        container.querySelectorAll('.fav-remove').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var user = window.MutsAuth.getCurrentUser();
                if (!user) return;
                var all = JSON.parse(localStorage.getItem('muts_favorites') || '[]');
                all = all.filter(function (f) { return !(f.userId === user.id && f.itemId === btn.dataset.id); });
                localStorage.setItem('muts_favorites', JSON.stringify(all));
                loadFavoritesPage();
            });
        });
    }

    function loadMessagesPage() {
        var list = document.getElementById('message-list');
        var detail = document.getElementById('message-detail');
        var emptyState = document.getElementById('messages-empty');
        if (!list || !detail) return;
        var msgs = getMessages().sort(function (a, b) { return new Date(b.createdAt) - new Date(a.createdAt); });

        if (msgs.length === 0) {
            if (emptyState) emptyState.style.display = '';
            return;
        }
        if (emptyState) emptyState.style.display = 'none';

        list.innerHTML = msgs.map(function (m) {
            return '<div class="message-preview' + (m.read ? '' : ' unread') + '" data-id="' + m.id + '"><h4>' + m.from + '</h4><p>' + m.subject + '</p><div class="msg-date">' + m.createdAt + '</div></div>';
        }).join('');

        function showMsg(id) {
            var msg = msgs.find(function (m) { return m.id === id; });
            if (!msg) return;
            detail.innerHTML = '<h3>' + msg.subject + '</h3><div class="msg-meta">From: ' + msg.from + ' \u00b7 ' + msg.createdAt + '</div><div class="msg-body">' + msg.body + '</div>';
            list.querySelectorAll('.message-preview').forEach(function (p) { p.classList.remove('active'); });
            var preview = list.querySelector('[data-id="' + id + '"]');
            if (preview) { preview.classList.add('active'); preview.classList.remove('unread'); }

            var allMsgs = JSON.parse(localStorage.getItem('muts_messages') || '[]');
            var idx = allMsgs.findIndex(function (m) { return m.id === id; });
            if (idx !== -1) { allMsgs[idx].read = true; localStorage.setItem('muts_messages', JSON.stringify(allMsgs)); }
            loadUnreadBadge();
        }

        list.querySelectorAll('.message-preview').forEach(function (el) {
            el.addEventListener('click', function () { showMsg(el.dataset.id); });
        });

        showMsg(msgs[0].id);
    }

    function loadTransactionsPage() {
        var body = document.getElementById('transactions-body');
        var emptyState = document.getElementById('transactions-empty');
        if (!body) return;
        var txns = getTransactions().sort(function (a, b) { return new Date(b.date) - new Date(a.date); });

        var total = 0, pending = 0, completed = 0;
        txns.forEach(function (t) {
            total += t.amount;
            if (t.status === 'Pending') pending += t.amount;
            else completed += t.amount;
        });

        var totalEl = document.getElementById('total-spent');
        var pendingEl = document.getElementById('pending-amount');
        var completedEl = document.getElementById('completed-amount');
        if (totalEl) totalEl.textContent = '$' + total.toLocaleString();
        if (pendingEl) pendingEl.textContent = '$' + pending.toLocaleString();
        if (completedEl) completedEl.textContent = '$' + completed.toLocaleString();

        if (txns.length === 0) {
            if (emptyState) emptyState.style.display = '';
            return;
        }
        if (emptyState) emptyState.style.display = 'none';

        body.innerHTML = txns.map(function (t) {
            var statusCls = t.status.toLowerCase();
            return '<tr><td>' + t.date + '</td><td>' + t.description + '</td><td>' + t.type + '</td><td class="amount">$' + t.amount.toLocaleString() + '</td><td><span class="status-badge ' + statusCls + '">' + t.status + '</span></td></tr>';
        }).join('');
    }

    function loadProfilePage() {
        var form = document.getElementById('profile-form');
        if (!form) return;
        var user = window.MutsAuth.getCurrentUser();
        if (!user) return;

        var nameEl = document.getElementById('profile-name');
        var emailEl = document.getElementById('profile-email');
        var phoneEl = document.getElementById('profile-phone');
        var countryEl = document.getElementById('profile-country');
        var avatarEl = document.getElementById('profile-avatar');
        var displayNameEl = document.getElementById('profile-display-name');

        if (nameEl) nameEl.value = user.name;
        if (emailEl) emailEl.value = user.email;
        if (phoneEl) phoneEl.value = user.phone || '';
        if (countryEl) countryEl.value = user.country || '';
        if (avatarEl) avatarEl.textContent = user.name.charAt(0).toUpperCase();
        if (displayNameEl) displayNameEl.textContent = user.name;

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var fields = {};
            if (nameEl) fields.name = nameEl.value.trim();
            if (emailEl) fields.email = emailEl.value.trim();
            if (phoneEl) fields.phone = phoneEl.value.trim();
            if (countryEl) fields.country = countryEl.value;

            var currentPwd = document.getElementById('current-password');
            var newPwd = document.getElementById('new-password');
            if (currentPwd && newPwd && currentPwd.value && newPwd.value) {
                var result = window.MutsAuth.changePassword(currentPwd.value, newPwd.value);
                if (!result.success) { alert(result.message); return; }
                currentPwd.value = '';
                newPwd.value = '';
            }

            window.MutsAuth.updateProfile(fields);
            loadGreeting();
            alert('Profile updated successfully!');
        });
    }

    function init3DTilt() {
        var cards = document.querySelectorAll('.listing-card, .destination-card, .destination-list-item, .tab-list-item, .booking-list-item, .trip-card');
        if (!cards.length || window.innerWidth <= 768) return;

        cards.forEach(function (card) {
            card.addEventListener('mousemove', function (e) {
                var rect = card.getBoundingClientRect();
                var x = e.clientX - rect.left;
                var y = e.clientY - rect.top;
                var centerX = rect.width / 2;
                var centerY = rect.height / 2;
                var rotateX = (y - centerY) / centerY * -6;
                var rotateY = (x - centerX) / centerX * 6;
                card.style.transform = 'perspective(800px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-4px)';
                card.style.transition = 'transform 0.05s ease';
            });

            card.addEventListener('mouseleave', function () {
                card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0)';
                card.style.transition = 'transform 0.4s ease';
            });
        });
    }

    function initSmartFilters() {
        var panels = document.querySelectorAll('.filter-panel');
        if (panels.length === 0) return;

        panels.forEach(function (panel) {
            var pills = panel.querySelectorAll('.filter-pill');
            var clearBtn = panel.querySelector('.filter-clear-btn');
            var grid = panel.nextElementSibling;
            while (grid && !grid.classList.contains('listing-grid') && !grid.classList.contains('gallery-grid')) {
                grid = grid.nextElementSibling;
            }
            if (!grid) return;

            var cards = grid.querySelectorAll('.listing-card, .gallery-item');

            pills.forEach(function (pill) {
                pill.addEventListener('click', function () {
                    pill.classList.toggle('active');
                    applyFilters(panel, cards);
                });
            });

            if (clearBtn) {
                clearBtn.addEventListener('click', function () {
                    pills.forEach(function (p) { p.classList.remove('active'); });
                    cards.forEach(function (card) { card.style.display = ''; });
                    var noResults = panel.parentElement.querySelector('.filter-no-results');
                    if (noResults) noResults.classList.remove('visible');
                });
            }
        });
    }

    function applyFilters(panel, cards) {
        var activeFilters = {};
        var groups = panel.querySelectorAll('.filter-group');

        groups.forEach(function (group) {
            var key = group.dataset.filterKey;
            if (!key) return;
            var activePills = group.querySelectorAll('.filter-pill.active');
            if (activePills.length > 0) {
                activeFilters[key] = Array.from(activePills).map(function (p) { return p.dataset.value; });
            }
        });

        var hasFilters = Object.keys(activeFilters).length > 0;
        var visibleCount = 0;

        cards.forEach(function (card) {
            if (!hasFilters) {
                card.style.display = '';
                visibleCount++;
                return;
            }

            var match = true;
            for (var key in activeFilters) {
                var cardValue = card.dataset[key];
                if (!cardValue || activeFilters[key].indexOf(cardValue) === -1) {
                    match = false;
                    break;
                }
            }

            card.style.display = match ? '' : 'none';
            if (match) visibleCount++;
        });

        var noResults = panel.parentElement.querySelector('.filter-no-results');
        if (noResults) {
            noResults.classList.toggle('visible', visibleCount === 0 && hasFilters);
        }
    }

    // Init
    document.addEventListener('DOMContentLoaded', function () {
        initSidebar();
        initMobileSidebar();
        loadGreeting();
        loadUnreadBadge();

        var path = window.location.pathname;
        if (path.indexOf('my-trips') !== -1) loadTripsPage();
        else if (path.indexOf('favorites') !== -1) loadFavoritesPage();
        else if (path.indexOf('messages') !== -1) loadMessagesPage();
        else if (path.indexOf('transactions') !== -1) loadTransactionsPage();
        else if (path.indexOf('profile') !== -1) loadProfilePage();
        else {
            initCalendar();
            loadRecentBookings();
            loadDestinations();
            initTabs();
            initBanner();
            initSearch();
        }

        init3DTilt();
        initSmartFilters();

        // Register service worker for PWA
        if ('serviceWorker' in navigator && window.location.pathname.indexOf('/pages/dashboard/') !== -1) {
            var swPath = '../../sw.js';
            var depth = (window.location.pathname.match(/\//g) || []).length - 1;
            if (depth <= 2) swPath = '../../sw.js';
            else swPath = '../../../sw.js';
            navigator.serviceWorker.register(swPath).catch(function () {});
        }
    });
})();
