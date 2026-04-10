/* Hotels Service — Muts Safaris */
/* Dynamic hotel data service. Replace API calls with real backend when ready. */
(function(window) {
    'use strict';

    var STORAGE_KEY = 'muts_hotels_cache';
    var API_READY = false;

    var mockHotels = [
        {
            id: 'h1',
            name: "Governors' Camp",
            badge: 'Luxury',
            tier: 'luxury',
            location: 'mara',
            locationName: 'Maasai Mara',
            description: 'Luxury tented camp with exceptional Big Five viewing and personalized service in Maasai Mara.',
            price: 450,
            rating: 4.9,
            reviews: 234,
            image: '../../images/hotels/governors-camp.jpg',
            imageLoaded: false,
            amenities: [
                { icon: '📶', name: 'WiFi' },
                { icon: '🏊', name: 'Pool' },
                { icon: '💆', name: 'Spa' },
                { icon: '🍽️', name: 'Restaurant' },
                { icon: '🍸', name: 'Bar' },
                { icon: '🚙', name: 'Game Drives' },
                { icon: '✈️', name: 'Airport Transfer' }
            ],
            rooms: 25,
            link: 'hotels/luxury/maasai-mara-lodge.html'
        },
        {
            id: 'h2',
            name: 'Tortilis Camp',
            badge: 'Luxury',
            tier: 'luxury',
            location: 'amboseli',
            locationName: 'Amboseli',
            description: 'Designer luxury camp with stunning Kilimanjaro views and exceptional elephant encounters in Amboseli.',
            price: 520,
            rating: 4.8,
            reviews: 189,
            image: '../../images/hotels/tortilis-camp.jpg',
            imageLoaded: false,
            amenities: [
                { icon: '📶', name: 'WiFi' },
                { icon: '🏊', name: 'Pool' },
                { icon: '💆', name: 'Spa' },
                { icon: '🍽️', name: 'Restaurant' },
                { icon: '🍸', name: 'Bar' },
                { icon: '🚙', name: 'Game Drives' },
                { icon: '🏔️', name: 'Mountain View' }
            ],
            rooms: 20,
            link: 'hotels/luxury/amboseli-lodge.html'
        },
        {
            id: 'h3',
            name: 'Kicheche Laikipia Camp',
            badge: 'Mid-Range',
            tier: 'mid-range',
            location: 'laikipia',
            locationName: 'Laikipia',
            description: 'Comfortable lodge with excellent wildlife viewing and authentic Maasai cultural experiences.',
            price: 280,
            rating: 4.7,
            reviews: 156,
            image: '../../images/hotels/kicheche-lodge.jpg',
            imageLoaded: false,
            amenities: [
                { icon: '📶', name: 'WiFi' },
                { icon: '🍽️', name: 'Restaurant' },
                { icon: '🍸', name: 'Bar' },
                { icon: '🚙', name: 'Game Drives' },
                { icon: '🎭', name: 'Cultural Tours' }
            ],
            rooms: 12,
            link: 'hotels/mid-range/kicheche-laikipia.html'
        },
        {
            id: 'h4',
            name: 'Mara Budget Camp',
            badge: 'Eco-Budget',
            tier: 'eco-budget',
            location: 'mara',
            locationName: 'Maasai Mara',
            description: 'Comfortable budget accommodation with shared facilities and authentic safari experiences.',
            price: 120,
            rating: 4.3,
            reviews: 312,
            image: '../../images/hotels/budget-camp.jpg',
            imageLoaded: false,
            amenities: [
                { icon: '🍽️', name: 'Restaurant' },
                { icon: '🚿', name: 'Shared Facilities' },
                { icon: '🚙', name: 'Game Drives' },
                { icon: '🔥', name: 'Camp Fire' }
            ],
            rooms: 40,
            link: 'hotels/eco-budget/mara-budget-camp.html'
        },
        {
            id: 'h5',
            name: 'Diani Beach Resort',
            badge: 'Luxury',
            tier: 'luxury',
            location: 'coast',
            locationName: 'Diani Beach',
            description: 'Oceanfront luxury resort with private beach, world-class spa, and exceptional coastal cuisine.',
            price: 380,
            rating: 4.9,
            reviews: 428,
            image: '../../images/hotels/four-seasons-diani.jpg',
            imageLoaded: false,
            amenities: [
                { icon: '📶', name: 'WiFi' },
                { icon: '🏊', name: 'Pool' },
                { icon: '💆', name: 'Spa' },
                { icon: '🏖️', name: 'Beach Access' },
                { icon: '🍽️', name: 'Restaurant' },
                { icon: '🏄', name: 'Water Sports' }
            ],
            rooms: 45,
            link: 'hotels/luxury/diani-resort.html'
        },
        {
            id: 'h6',
            name: 'Tsavo River Lodge',
            badge: 'Mid-Range',
            tier: 'mid-range',
            location: 'tsavo',
            locationName: 'Tsavo East',
            description: 'Comfortable lodge overlooking the Galana River with excellent game viewing opportunities.',
            price: 220,
            rating: 4.5,
            reviews: 178,
            image: '../../images/hotels/tsavo-lodge.jpg',
            imageLoaded: false,
            amenities: [
                { icon: '📶', name: 'WiFi' },
                { icon: '🍽️', name: 'Restaurant' },
                { icon: '🍸', name: 'Bar' },
                { icon: '🚙', name: 'Game Drives' },
                { icon: '🌊', name: 'River View' }
            ],
            rooms: 18,
            link: 'hotels/mid-range/tsavo-river-lodge.html'
        },
        {
            id: 'h7',
            name: 'Samburu Serena Lodge',
            badge: 'Mid-Range',
            tier: 'mid-range',
            location: 'samburu',
            locationName: 'Samburu',
            description: 'Scenic lodge perched atop a kopje with panoramic views of the Ewaso Ng\'iro river.',
            price: 250,
            rating: 4.6,
            reviews: 145,
            image: '../../images/hotels/samburu-lodge.jpg',
            imageLoaded: false,
            amenities: [
                { icon: '📶', name: 'WiFi' },
                { icon: '🏊', name: 'Pool' },
                { icon: '🍽️', name: 'Restaurant' },
                { icon: '🍸', name: 'Bar' },
                { icon: '🚙', name: 'Game Drives' },
                { icon: '🚶', name: 'Bush Walks' }
            ],
            rooms: 22,
            link: 'hotels/mid-range/samburu-serena.html'
        },
        {
            id: 'h8',
            name: 'Maasai Mara Lodge',
            badge: 'Luxury',
            tier: 'luxury',
            location: 'mara',
            locationName: 'Maasai Mara',
            description: 'Award-winning luxury lodge on the Mara River with front-row seats to the Great Migration.',
            price: 650,
            rating: 4.9,
            reviews: 267,
            image: '../../images/hotels/maasai-mara-lodge.jpg',
            imageLoaded: false,
            amenities: [
                { icon: '📶', name: 'WiFi' },
                { icon: '🏊', name: 'Pool' },
                { icon: '💆', name: 'Spa' },
                { icon: '🍽️', name: 'Restaurant' },
                { icon: '🍸', name: 'Bar' },
                { icon: '🏛️', name: 'Private Deck' },
                { icon: '🕴️', name: 'Butler Service' }
            ],
            rooms: 30,
            link: 'hotels/luxury/maasai-mara-lodge.html'
        },
        {
            id: 'h9',
            name: 'Amboseli Serena Lodge',
            badge: 'Luxury',
            tier: 'luxury',
            location: 'amboseli',
            locationName: 'Amboseli',
            description: 'Elegant lodge with stunning views of Mount Kilimanjaro and elephant herds.',
            price: 420,
            rating: 4.7,
            reviews: 198,
            image: '../../images/hotels/luxury/amboseli-lodge.jpg',
            imageLoaded: false,
            amenities: [
                { icon: '📶', name: 'WiFi' },
                { icon: '🏊', name: 'Pool' },
                { icon: '🍽️', name: 'Restaurant' },
                { icon: '🍸', name: 'Bar' },
                { icon: '🚙', name: 'Game Drives' },
                { icon: '🏔️', name: 'Kilimanjaro View' }
            ],
            rooms: 28,
            link: 'hotels/luxury/amboseli-lodge.html'
        },
        {
            id: 'h10',
            name: 'Lake Nakuru Lodge',
            badge: 'Mid-Range',
            tier: 'mid-range',
            location: 'nakuru',
            locationName: 'Lake Nakuru',
            description: 'Comfortable lodge overlooking the lake with excellent birdwatching opportunities.',
            price: 200,
            rating: 4.4,
            reviews: 167,
            image: '../../images/hotels/lake-nakuru-lodge.jpg',
            imageLoaded: false,
            amenities: [
                { icon: '📶', name: 'WiFi' },
                { icon: '🍽️', name: 'Restaurant' },
                { icon: '🍸', name: 'Bar' },
                { icon: '🦅', name: 'Bird Watching' },
                { icon: '🚙', name: 'Game Drives' }
            ],
            rooms: 16,
            link: 'hotels/mid-range/lake-nakuru-lodge.html'
        },
        {
            id: 'h11',
            name: 'Nairobi Tented Camp',
            badge: 'Eco-Budget',
            tier: 'eco-budget',
            location: 'nairobi',
            locationName: 'Nairobi',
            description: 'Unique eco-camp on the outskirts of Nairobi National Park for a city safari experience.',
            price: 150,
            rating: 4.2,
            reviews: 89,
            image: '../../images/hotels/eco-budget/nairobi-np-camp.jpg',
            imageLoaded: false,
            amenities: [
                { icon: '📶', name: 'WiFi' },
                { icon: '🍽️', name: 'Restaurant' },
                { icon: '🚙', name: 'Game Drives' },
                { icon: '🏙️', name: 'City Tours' }
            ],
            rooms: 15,
            link: 'hotels/eco-budget/amboseli-conservation-camp.html'
        },
        {
            id: 'h12',
            name: 'Eco Budget Camp Tsavo',
            badge: 'Eco-Budget',
            tier: 'eco-budget',
            location: 'tsavo',
            locationName: 'Tsavo',
            description: 'Affordable eco-camp in Tsavo East with authentic bush camping experience.',
            price: 90,
            rating: 4.1,
            reviews: 145,
            image: '../../images/hotels/eco-budget/tsavo-camp.jpg',
            imageLoaded: false,
            amenities: [
                { icon: '🍽️', name: 'Restaurant' },
                { icon: '🚙', name: 'Game Drives' },
                { icon: '⛺', name: 'Bush Camp' }
            ],
            rooms: 25,
            link: 'hotels/eco-budget/nakuru-eco-lodge.html'
        },
        {
            id: 'h13',
            name: 'Laikipia Community Camp',
            badge: 'Eco-Budget',
            tier: 'eco-budget',
            location: 'laikipia',
            locationName: 'Laikipia',
            description: 'Community-run eco-camp offering authentic cultural experiences and wildlife encounters in the Laikipia Plateau.',
            price: 95,
            rating: 4.2,
            reviews: 78,
            image: '../../images/hotels/eco-budget/laikipia-camp.jpg',
            imageLoaded: false,
            amenities: [
                { icon: '🍽️', name: 'Restaurant' },
                { icon: '🚙', name: 'Game Drives' },
                { icon: '🎭', name: 'Cultural Tours' }
            ],
            rooms: 20,
            link: 'hotels/eco-budget/laikipia-community-camp.html'
        },
        {
            id: 'h14',
            name: 'Amboseli Serena Lodge',
            badge: 'Luxury',
            tier: 'luxury',
            location: 'amboseli',
            locationName: 'Amboseli',
            description: 'Elegant lodge with stunning views of Mount Kilimanjaro and elephant herds.',
            price: 420,
            rating: 4.7,
            reviews: 198,
            image: '../../images/hotels/luxury/amboseli-lodge.jpg',
            imageLoaded: false,
            amenities: [
                { icon: '📶', name: 'WiFi' },
                { icon: '🏊', name: 'Pool' },
                { icon: '🍽️', name: 'Restaurant' },
                { icon: '🍸', name: 'Bar' },
                { icon: '🚙', name: 'Game Drives' },
                { icon: '🏔️', name: 'Kilimanjaro View' }
            ],
            rooms: 28,
            link: 'hotels/luxury/amboseli-lodge.html'
        },
        {
            id: 'h15',
            name: 'Samburu Lodge',
            badge: 'Luxury',
            tier: 'luxury',
            location: 'samburu',
            locationName: 'Samburu',
            description: 'Luxury lodge in the Samburu National Reserve with stunning views of the Ewaso Ng\'iro river.',
            price: 380,
            rating: 4.6,
            reviews: 145,
            image: '../../images/hotels/samburu-lodge.jpg',
            imageLoaded: false,
            amenities: [
                { icon: '📶', name: 'WiFi' },
                { icon: '🏊', name: 'Pool' },
                { icon: '🍽️', name: 'Restaurant' },
                { icon: '🍸', name: 'Bar' },
                { icon: '🚙', name: 'Game Drives' }
            ],
            rooms: 24,
            link: 'hotels/luxury/samburu-lodge.html'
        },
        {
            id: 'h16',
            name: 'Norfolk Hotel',
            badge: 'Luxury',
            tier: 'luxury',
            location: 'nairobi',
            locationName: 'Nairobi',
            description: 'Historic luxury hotel in the heart of Nairobi, offering timeless elegance and world-class amenities.',
            price: 400,
            rating: 4.8,
            reviews: 267,
            image: '../../images/hotels/norfolk-hotel.jpg',
            imageLoaded: false,
            amenities: [
                { icon: '📶', name: 'WiFi' },
                { icon: '🏊', name: 'Pool' },
                { icon: '💆', name: 'Spa' },
                { icon: '🍽️', name: 'Restaurant' },
                { icon: '🍸', name: 'Bar' }
            ],
            rooms: 35,
            link: 'hotels/luxury/norfolk-hotel.html'
        },
        {
            id: 'h17',
            name: 'Lake Nakuru Lodge',
            badge: 'Mid-Range',
            tier: 'mid-range',
            location: 'nakuru',
            locationName: 'Lake Nakuru',
            description: 'Comfortable lodge overlooking the lake with excellent birdwatching opportunities.',
            price: 200,
            rating: 4.4,
            reviews: 167,
            image: '../../images/hotels/lake-nakuru-lodge.jpg',
            imageLoaded: false,
            amenities: [
                { icon: '📶', name: 'WiFi' },
                { icon: '🍽️', name: 'Restaurant' },
                { icon: '🍸', name: 'Bar' },
                { icon: '🦅', name: 'Bird Watching' },
                { icon: '🚙', name: 'Game Drives' }
            ],
            rooms: 16,
            link: 'hotels/mid-range/lake-nakuru-lodge.html'
        },
        {
            id: 'h18',
            name: 'Samburu Serena Lodge',
            badge: 'Mid-Range',
            tier: 'mid-range',
            location: 'samburu',
            locationName: 'Samburu',
            description: 'Scenic lodge perched atop a kopje with panoramic views of the Ewaso Ng\'iro river.',
            price: 250,
            rating: 4.6,
            reviews: 145,
            image: '../../images/hotels/samburu-lodge.jpg',
            imageLoaded: false,
            amenities: [
                { icon: '📶', name: 'WiFi' },
                { icon: '🏊', name: 'Pool' },
                { icon: '🍽️', name: 'Restaurant' },
                { icon: '🍸', name: 'Bar' },
                { icon: '🚙', name: 'Game Drives' },
                { icon: '🚶', name: 'Bush Walks' }
            ],
            rooms: 22,
            link: 'hotels/mid-range/samburu-serena.html'
        },
        {
            id: 'h19',
            name: 'Mara Serena Lodge',
            badge: 'Mid-Range',
            tier: 'mid-range',
            location: 'mara',
            locationName: 'Maasai Mara',
            description: 'Safari lodge on the Mara River with stunning views of the Great Migration route.',
            price: 320,
            rating: 4.5,
            reviews: 198,
            image: '../../images/hotels/mara-serena.jpg',
            imageLoaded: false,
            amenities: [
                { icon: '📶', name: 'WiFi' },
                { icon: '🏊', name: 'Pool' },
                { icon: '🍽️', name: 'Restaurant' },
                { icon: '🍸', name: 'Bar' },
                { icon: '🚙', name: 'Game Drives' }
            ],
            rooms: 26,
            link: 'hotels/mid-range/mara-serena.html'
        },
        {
            id: 'h20',
            name: 'Mombasa Budget Guesthouse',
            badge: 'Eco-Budget',
            tier: 'eco-budget',
            location: 'coast',
            locationName: 'Mombasa',
            description: 'Affordable guesthouse near the beach with easy access to Mombasa attractions.',
            price: 75,
            rating: 3.9,
            reviews: 89,
            image: '../../images/hotels/eco-budget/mombasa-guesthouse.jpg',
            imageLoaded: false,
            amenities: [
                { icon: '📶', name: 'WiFi' },
                { icon: '🍽️', name: 'Restaurant' },
                { icon: '🏖️', name: 'Beach Access' }
            ],
            rooms: 18,
            link: 'hotels/eco-budget/mombasa-budget-guesthouse.html'
        },
        {
            id: 'h21',
            name: 'Matteo\'s Italian Restaurant',
            badge: 'Luxury',
            tier: 'luxury',
            location: 'coast',
            locationName: 'Diani Beach',
            description: 'Renowned Italian restaurant with ocean views and authentic Mediterranean cuisine.',
            price: 0,
            rating: 4.9,
            reviews: 312,
            image: '../../images/hotels/matteos-restaurant.jpg',
            imageLoaded: false,
            amenities: [
                { icon: '🍽️', name: 'Fine Dining' },
                { icon: '🍷', name: 'Wine Cellar' },
                { icon: '🏖️', name: 'Beach View' }
            ],
            rooms: 0,
            link: 'hotels/luxury/matteos-italian-restaurant.html'
        },
        {
            id: 'h22',
            name: 'Tsavo Lodge',
            badge: 'Luxury',
            tier: 'luxury',
            location: 'tsavo',
            locationName: 'Tsavo West',
            description: 'Luxury lodge with volcanic views and access to Mzima Springs in Tsavo West.',
            price: 480,
            rating: 4.7,
            reviews: 156,
            image: '../../images/hotels/tsavo-lodge.jpg',
            imageLoaded: false,
            amenities: [
                { icon: '📶', name: 'WiFi' },
                { icon: '🏊', name: 'Pool' },
                { icon: '🍽️', name: 'Restaurant' },
                { icon: '🍸', name: 'Bar' },
                { icon: '🚙', name: 'Game Drives' }
            ],
            rooms: 28,
            link: 'hotels/luxury/tsavo-lodge.html'
        }
    ];

    var filters = {
        tiers: ['luxury', 'mid-range', 'eco-budget'],
        locations: ['mara', 'amboseli', 'coast', 'nairobi', 'laikipia', 'tsavo', 'samburu', 'nakuru']
    };

    var HotelsService = {
        getAll: function() {
            if (window.MutsAPIConfig && window.MutsAPIConfig.isConnected()) {
                return this.fetchFromAPI();
            }
            // Try to load from localStorage first
            try {
                var stored = localStorage.getItem(STORAGE_KEY);
                if (stored) {
                    var parsed = JSON.parse(stored);
                    // Merge with default data to ensure all fields exist
                    return Promise.resolve(parsed.map(function(h) {
                        var defaultHotel = mockHotels.find(function(d) { return d.id === h.id; });
                        return defaultHotel ? Object.assign({}, defaultHotel, h) : h;
                    }));
                }
            } catch (e) {}
            
            return Promise.resolve(mockHotels);
        },

        getById: function(id) {
            if (window.MutsAPIConfig && window.MutsAPIConfig.isConnected()) {
                return this.fetchFromAPI('/' + id);
            }
            var hotel = mockHotels.find(function(h) { return h.id === id; });
            return Promise.resolve(hotel || null);
        },

        getByFilter: function(filter) {
            if (window.MutsAPIConfig && window.MutsAPIConfig.isConnected()) {
                var queryParams = [];
                if (filter.tier) queryParams.push('tier=' + filter.tier);
                if (filter.location) queryParams.push('location=' + filter.location);
                if (filter.minPrice) queryParams.push('minPrice=' + filter.minPrice);
                if (filter.maxPrice) queryParams.push('maxPrice=' + filter.maxPrice);
                if (filter.search) queryParams.push('search=' + encodeURIComponent(filter.search));
                var endpoint = queryParams.length > 0 ? '?' + queryParams.join('&') : '';
                return this.fetchFromAPI(endpoint);
            }
            var results = mockHotels.filter(function(hotel) {
                if (filter.tier && hotel.tier !== filter.tier) return false;
                if (filter.location && hotel.location !== filter.location) return false;
                if (filter.minPrice && hotel.price < filter.minPrice) return false;
                if (filter.maxPrice && hotel.price > filter.maxPrice) return false;
                if (filter.search) {
                    var search = filter.search.toLowerCase();
                    var match = hotel.name.toLowerCase().indexOf(search) !== -1 ||
                                hotel.description.toLowerCase().indexOf(search) !== -1 ||
                                hotel.locationName.toLowerCase().indexOf(search) !== -1;
                    if (!match) return false;
                }
                return true;
            });
            return Promise.resolve(results);
        },

        getTiers: function() {
            return Promise.resolve(filters.tiers);
        },

        getLocations: function() {
            return Promise.resolve(filters.locations);
        },

        getLocationName: function(locationSlug) {
            var names = {
                mara: 'Maasai Mara',
                amboseli: 'Amboseli',
                coast: 'Coastal',
                nairobi: 'Nairobi',
                laikipia: 'Laikipia',
                tsavo: 'Tsavo',
                samburu: 'Samburu',
                nakuru: 'Lake Nakuru'
            };
            return names[locationSlug] || locationSlug;
        },

        getTierName: function(tierSlug) {
            var names = {
                'luxury': 'Luxury',
                'mid-range': 'Mid-Range',
                'eco-budget': 'Eco-Budget'
            };
            return names[tierSlug] || tierSlug;
        },

        getImage: function(hotelId, size) {
            var hotel = mockHotels.find(function(h) { return h.id === hotelId; });
            if (!hotel) return null;
            
            var imagePath = hotel.image;
            hotel.imageLoaded = true;
            
            return imagePath;
        },

        getReviewsCount: function(hotelId) {
            var hotel = mockHotels.find(function(h) { return h.id === hotelId; });
            return hotel ? hotel.reviews : 0;
        },

        getRating: function(hotelId) {
            var hotel = mockHotels.find(function(h) { return h.id === hotelId; });
            return hotel ? hotel.rating : 0;
        },

        updateReviewsCount: function(hotelId, count) {
            var hotel = mockHotels.find(function(h) { return h.id === hotelId; });
            if (hotel) {
                hotel.reviews = count;
            }
            // Persist to localStorage
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(mockHotels));
            } catch (e) {}
        },

        getImages: function(hotelIds) {
            var self = this;
            return hotelIds.map(function(id) {
                return {
                    id: id,
                    url: self.getImage(id),
                    loaded: false
                };
            });
        },

        preloadImages: function(hotelIds, callback) {
            var self = this;
            var loaded = 0;
            var total = hotelIds.length;
            
            if (total === 0) {
                if (callback) callback();
                return;
            }
            
            hotelIds.forEach(function(id) {
                var hotel = mockHotels.find(function(h) { return h.id === id; });
                if (!hotel) {
                    loaded++;
                    if (loaded === total && callback) callback();
                    return;
                }
                
                var img = new Image();
                img.onload = function() {
                    hotel.imageLoaded = true;
                    loaded++;
                    if (loaded === total && callback) callback();
                };
                img.onerror = function() {
                    loaded++;
                    if (loaded === total && callback) callback();
                };
                img.src = hotel.image;
            });
        },

        fetchFromAPI: function(endpoint) {
            var baseURL = (window.MutsAPIConfig && window.MutsAPIConfig.getBaseURL) 
                ? window.MutsAPIConfig.getBaseURL() 
                : '/api';
            var url = baseURL + '/hotels' + (endpoint || '');
            var timeout = (window.MutsAPIConfig && window.MutsAPIConfig.getTimeout) 
                ? window.MutsAPIConfig.getTimeout() 
                : 30000;
            
            var fetchPromise = fetch(url).then(function(response) {
                if (!response.ok) throw new Error('API error');
                return response.json();
            }).catch(function() {
                console.warn('[HotelsService] API unavailable, using mock data');
                return mockHotels;
            });
            
            var timeoutPromise = new Promise(function(_, reject) {
                setTimeout(function() { reject(new Error('Request timeout')); }, timeout);
            });
            
            return Promise.race([fetchPromise, timeoutPromise]).catch(function() {
                return mockHotels;
            });
        },
        
        enableAPI: function() {
            API_READY = true;
            console.log('[HotelsService] API mode enabled');
        },
        
        disableAPI: function() {
            API_READY = false;
            console.log('[HotelsService] API mode disabled');
        },
        
        isAPILive: function() {
            return window.MutsAPIConfig && window.MutsAPIConfig.isConnected();
        },
        
        // ============ IMAGE HANDLING ============
        getOptimizedImageURL: function(path, options) {
            if (!path) return this.getPlaceholderImage(options);
            
            // Use ImageUtils if available
            if (window.MutsImageUtils && window.MutsImageUtils.buildURL) {
                return window.MutsImageUtils.buildURL(path, options);
            }
            
            // Fallback: construct URL with params
            var baseUrl = path.startsWith('http') ? path : (this.getCDN() + path);
            var params = [];
            if (options && options.width) params.push('w=' + options.width);
            if (options && options.height) params.push('h=' + options.height);
            if (options && options.quality) params.push('q=' + options.quality);
            
            if (params.length > 0) {
                return baseUrl + (baseUrl.includes('?') ? '&' : '?') + params.join('&');
            }
            return baseUrl;
        },
        
        getCDN: function() {
            return (window.MutsImageUtils && window.MutsImageUtils.getCDN) 
                ? window.MutsImageUtils.getCDN() 
                : 'https://images.mutssafaris.com';
        },
        
        getPlaceholderImage: function(options) {
            var w = (options && options.width) || 400;
            var h = (options && options.height) || 300;
            return 'https://via.placeholder.com/' + w + 'x' + h + '?text=No+Image';
        },
        
        getImageSrcSet: function(path, sizes) {
            if (!path) return '';
            
            if (window.MutsImageUtils && window.MutsImageUtils.buildSrcSet) {
                return window.MutsImageUtils.buildSrcSet(path, sizes);
            }
            
            // Fallback: build srcset manually
            if (!sizes) sizes = [320, 640, 960, 1280];
            var cdn = this.getCDN();
            var baseUrl = path.startsWith('http') ? path : (cdn + path);
            
            return sizes.map(function(w) {
                var url = baseUrl + (baseUrl.includes('?') ? '&' : '?') + 'w=' + w;
                return url + ' ' + w + 'w';
            }).join(', ');
        },
        
        preloadHotelImages: function(hotels) {
            var urls = hotels.map(function(h) { return h.image; }).filter(Boolean);
            if (window.MutsImageUtils && window.MutsImageUtils.preloadImages) {
                window.MutsImageUtils.preloadImages(urls);
            } else {
                urls.forEach(function(url) {
                    var img = new Image();
                    img.src = url;
                });
            }
        }
    };

    window.MutsHotelsService = HotelsService;
})(window);
