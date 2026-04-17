/* Destinations Service — Muts Safaris */
/* Provides mock data for safari destinations. Replace with API calls when backend is ready. */
/**
 * @module DestinationsService
 * @example
 * // ES6 import (when bundler used)
 * import { DestinationsService } from './services/index.js';
 * 
 * // Or legacy global
 * MutsDestinationsService.getAll().then(...)
 */
(function (window) {
    'use strict';

    var API_READY = false;

    // ES6 export (for module bundlers)
    var DestinationsService = {

    var mockDestinations = [
        {
            id: 'maasai-mara',
            name: 'Maasai Mara',
            region: 'Rift Valley',
            description: 'Home to the Great Migration and the Big Five. Witness millions of wildebeest crossing the Mara River.',
            duration: '3-7 Days',
            priceFrom: 450,
            rating: 4.9,
            image: 'images/tours/maasai-mara-hero.jpg',
            tags: ['Most Popular', 'Big Five'],
            type: 'safari',
            link: 'tours.html'
        },
        {
            id: 'amboseli',
            name: 'Amboseli',
            region: 'Kajiado County',
            description: 'Famous for large elephant herds and stunning views of Mount Kilimanjaro at sunrise.',
            duration: '2-3 Days',
            priceFrom: 380,
            rating: 4.7,
            image: 'images/tours/amboseli-hero.jpg',
            tags: ['Elephant Paradise'],
            type: 'safari',
            link: 'tours.html'
        },
        {
            id: 'tsavo',
            name: 'Tsavo',
            region: 'Coast & Rift Valley',
            description: "Kenya's largest national park, divided into Tsavo East and West. Known for red-dust elephants.",
            duration: '3-5 Days',
            priceFrom: 320,
            rating: 4.5,
            image: 'images/tours/tsavo-hero.jpg',
            tags: ['Red Elephant'],
            type: 'safari',
            link: 'tours.html'
        },
        {
            id: 'samburu',
            name: 'Samburu',
            region: 'Northern Kenya',
            description: 'A semi-arid reserve with unique wildlife: Grevy\'s zebra, reticulated giraffe, and Somali ostrich.',
            duration: '3-4 Days',
            priceFrom: 400,
            rating: 4.6,
            image: 'images/tours/samburu-hero.jpg',
            tags: ['Unique Wildlife'],
            type: 'safari',
            link: 'tours.html'
        },
        {
            id: 'lake-nakuru',
            name: 'Lake Nakuru',
            region: 'Rift Valley',
            description: 'World-famous for its flamingo spectacle and both black and white rhino sanctuary.',
            duration: '1-2 Days',
            priceFrom: 250,
            rating: 4.4,
            image: 'images/tours/nakuru-hero.jpg',
            tags: ['Birdwatching'],
            type: 'safari',
            link: 'tours.html'
        },
        {
            id: 'diani-beach',
            name: 'Diani Beach',
            region: 'South Coast',
            description: '20km of pristine white sand, turquoise waters, and world-class beach resorts.',
            duration: '3-7 Days',
            priceFrom: 280,
            rating: 4.8,
            image: 'images/beaches/diani-beach.jpg',
            tags: ['Most Popular', 'Beach'],
            type: 'beach',
            link: 'beaches.html'
        },
        {
            id: 'hells-gate',
            name: "Hell's Gate",
            region: 'Rift Valley',
            description: 'One of only two Kenyan parks where you can walk or cycle among wildlife. Dramatic gorges and cliffs.',
            duration: '1 Day',
            priceFrom: 120,
            rating: 4.3,
            image: 'images/tours/hells-gate-hero.jpg',
            tags: ['Adventure', 'Hiking'],
            type: 'safari',
            link: 'tours.html'
        },
        {
            id: 'mount-kenya',
            name: 'Mount Kenya',
            region: 'Central Kenya',
            description: "Africa's second-highest peak. Trek through bamboo forests to glacial peaks at 5,199m.",
            duration: '4-6 Days',
            priceFrom: 550,
            rating: 4.7,
            image: 'images/tours/mount-kenya-hero.jpg',
            tags: ['Trekking', 'Adventure'],
            type: 'safari',
            link: 'tours.html'
        },
        {
            id: 'nairobi-np',
            name: 'Nairobi National Park',
            region: 'Nairobi',
            description: "The world's only national park within a capital city. See lions and rhinos with the city skyline behind.",
            duration: '1 Day',
            priceFrom: 80,
            rating: 4.2,
            image: 'images/tours/nairobi-hero.jpg',
            tags: ['City Safari'],
            type: 'safari',
            link: 'tours.html'
        },
        {
            id: 'watamu',
            name: 'Watamu',
            region: 'North Coast',
            description: 'Pristine coral reefs, turtle nesting sites, and the ancient Gedi Ruins.',
            duration: '3-5 Days',
            priceFrom: 260,
            rating: 4.6,
            image: 'images/beaches/watamu.jpg',
            tags: ['Marine Life', 'Beach'],
            type: 'beach',
            link: 'beaches.html'
        }
    ];

    var DestinationsService = {
        getAll: function () {
            if (window.MutsAPIConfig && window.MutsAPIConfig.isConnected()) {
                return this.fetchFromAPI('/destinations');
            }
            return Promise.resolve(mockDestinations.slice());
        },

        getPopular: function () {
            if (window.MutsAPIConfig && window.MutsAPIConfig.isConnected()) {
                return this.fetchFromAPI('/destinations?popular=true');
            }
            return Promise.resolve(mockDestinations.slice());
        },

        getById: function (id) {
            if (window.MutsAPIConfig && window.MutsAPIConfig.isConnected()) {
                return this.fetchFromAPI('/destinations/' + id);
            }
            var found = mockDestinations.filter(function (d) { return d.id === id; });
            return Promise.resolve(found.length > 0 ? found[0] : null);
        },

        getByType: function (type) {
            if (window.MutsAPIConfig && window.MutsAPIConfig.isConnected()) {
                return this.fetchFromAPI('/destinations?type=' + type);
            }
            var filtered = mockDestinations.filter(function (d) { return d.type === type; });
            return Promise.resolve(filtered);
        },

        search: function (query) {
            if (window.MutsAPIConfig && window.MutsAPIConfig.isConnected()) {
                return this.fetchFromAPI('/destinations?search=' + encodeURIComponent(query || ''));
            }
            var q = (query || '').toLowerCase();
            var filtered = mockDestinations.filter(function (d) {
                return d.name.toLowerCase().indexOf(q) !== -1 ||
                    d.region.toLowerCase().indexOf(q) !== -1 ||
                    d.description.toLowerCase().indexOf(q) !== -1;
            });
            return Promise.resolve(filtered);
        },

        fetchFromAPI: function (endpoint, options) {
            var baseURL = (window.MutsAPIConfig && window.MutsAPIConfig.getBaseURL) 
                ? window.MutsAPIConfig.getBaseURL() 
                : '/api';
            var url = endpoint.indexOf('http') === 0 ? endpoint : baseURL + endpoint;
            var timeout = (window.MutsAPIConfig && window.MutsAPIConfig.getTimeout) 
                ? window.MutsAPIConfig.getTimeout() 
                : 30000;
            
            var fetchPromise = fetch(url, options).then(function (response) {
                if (!response.ok) throw new Error('API error: ' + response.status);
                return response.json();
            }).catch(function (err) {
                console.warn('[DestinationsService] API unavailable, using mock data:', err.message);
                return mockDestinations;
            });
            
            var timeoutPromise = new Promise(function(_, reject) {
                setTimeout(function() { reject(new Error('Request timeout')); }, timeout);
            });
            
            return Promise.race([fetchPromise, timeoutPromise]).catch(function() {
                return mockDestinations;
            });
        },

        enableAPI: function () {
            API_READY = true;
            console.log('[DestinationsService] API mode enabled');
        },

        disableAPI: function () {
            API_READY = false;
            console.log('[DestinationsService] API mode disabled');
        },

        isAPILive: function () {
            return window.MutsAPIConfig && window.MutsAPIConfig.isConnected();
        }
    };

    window.MutsDestinationsService = DestinationsService;
})(window);

// ES6 module export (for bundlers)
export default window.destinationsService || window.destinationsService;
