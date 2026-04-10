/* Muts Safaris — Google Maps Integration */
(function () {
    if (window.mutsMapInitialized) return;
    window.mutsMapInitialized = true;

    var map;
    var markers = [];
    var infoWindow;
    var activeFilter = 'all';

    window.initMap = function () {
        var config = MUTS_MAP_CONFIG;
        var mapEl = document.getElementById('safari-map');
        if (!mapEl) return;

        if (config.apiKey === 'YOUR_API_KEY') {
            mapEl.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--text-muted);text-align:center;padding:2rem;"><div><h2 style="color:var(--accent);margin-bottom:1rem;">Map Configuration Needed</h2><p style="max-width:400px;line-height:1.7;">To enable the interactive map, add your Google Maps API key to <code style="color:var(--accent);background:var(--bg-input);padding:0.2rem 0.5rem;">js/map-config.js</code>.<br><br>Get a free key at <a href="https://console.cloud.google.com/" target="_blank" style="color:var(--accent);">Google Cloud Console</a>.<br>Enable "Maps JavaScript API" and paste your key.</p></div></div>';
            return;
        }

        map = new google.maps.Map(mapEl, {
            center: config.center,
            zoom: config.zoom,
            styles: config.style,
            disableDefaultUI: false,
            zoomControl: true,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: true
        });

        infoWindow = new google.maps.InfoWindow();

        config.markers.forEach(function (m) {
            var marker = new google.maps.Marker({
                position: { lat: m.lat, lng: m.lng },
                map: map,
                title: m.name,
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 8,
                    fillColor: m.type === 'park' ? '#FFB800' : m.type === 'beach' ? '#00e676' : m.type === 'hotel' ? '#ff9100' : '#7c3aed',
                    fillOpacity: 0.9,
                    strokeColor: '#fff',
                    strokeWeight: 1
                },
                type: m.type
            });

            marker.addListener('click', function () {
                var link = m.link.indexOf('pages/dashboard/') === 0 ? m.link : m.link;
                var html = '<div style="font-family:inherit;padding:0.5rem;max-width:260px;">' +
                    '<h3 style="color:#FFB800;margin:0 0 0.5rem;font-size:1rem;">' + m.name + '</h3>' +
                    '<span style="display:inline-block;padding:0.15rem 0.6rem;background:rgba(255,184,0,0.15);color:#FFB800;font-size:0.7rem;text-transform:uppercase;letter-spacing:1px;margin-bottom:0.5rem;">' + m.type + '</span>' +
                    '<p style="color:#8a8570;margin:0 0 0.75rem;font-size:0.85rem;line-height:1.5;">' + m.desc + '</p>' +
                    '<a href="' + link + '" style="color:#FFB800;font-size:0.85rem;font-weight:600;text-decoration:none;">View Details &rarr;</a>' +
                    '</div>';
                infoWindow.setContent(html);
                infoWindow.open(map, marker);
            });

            markers.push(marker);
        });

        initMapFilters();
        initMapSearch();
    };

    function initMapFilters() {
        var btns = document.querySelectorAll('.map-filter-btn');
        if (btns.length === 0) return;

        btns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                btns.forEach(function (b) { b.classList.remove('active'); });
                btn.classList.add('active');
                activeFilter = btn.dataset.filter;

                markers.forEach(function (marker) {
                    if (activeFilter === 'all' || marker.type === activeFilter) {
                        marker.setVisible(true);
                    } else {
                        marker.setVisible(false);
                    }
                });
            });
        });
    }

    function initMapSearch() {
        var input = document.getElementById('map-search');
        if (!input) return;

        input.addEventListener('input', function () {
            var q = input.value.toLowerCase();
            markers.forEach(function (marker) {
                var match = !q || marker.getTitle().toLowerCase().indexOf(q) !== -1;
                var typeMatch = activeFilter === 'all' || marker.type === activeFilter;
                marker.setVisible(match && typeMatch);
            });
        });
    }
})();
