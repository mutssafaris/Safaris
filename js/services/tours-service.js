/* Tours Service — Muts Safaris */
(function(window) {
    'use strict';

    var API_READY = false;

    var embeddedTours = {
        destinations: [
            {id: 1, name: "Maasai Mara National Reserve", slug: "maasai-mara", region: "Southwest Kenya", description: "Famous for the Great Migration and abundant wildlife viewing", highlights: ["Great Migration", "Big Five", "Hot Air Balloon"], bestTime: "Jun-Oct", duration: "long", season: "jun-oct", image: "maasai-mara.jpg", rating: 4.9, priceRange: "$$$"},
            {id: 2, name: "Amboseli National Park", slug: "amboseli", region: "Southern Kenya", description: "Land of the giants with stunning Mt Kilimanjaro views", highlights: ["Elephants", "Mt Kilimanjaro", "Bird Watching"], bestTime: "Dec-Mar", duration: "medium", season: "jun-oct", image: "amboseli.jpg", rating: 4.7, priceRange: "$$"},
            {id: 3, name: "Tsavo East & West", slug: "tsavo", region: "Eastern Kenya", description: "Kenya's largest national parks with diverse landscapes", highlights: ["Red Elephants", "Mysterious Lava", "Chimps"], bestTime: "Jun-Oct", duration: "long", season: "jun-oct", image: "tsavo.jpg", rating: 4.5, priceRange: "$$"},
            {id: 4, name: "Samburu National Reserve", slug: "samburu", region: "Northern Kenya", description: "Remote wilderness with unique wildlife species", highlights: ["Grevy's Zebra", "Reticulated Giraffe", "Camel Safari"], bestTime: "Jun-Oct, Dec-Mar", duration: "long", season: "jun-oct", image: "samburu.jpg", rating: 4.6, priceRange: "$$$"},
            {id: 5, name: "Lake Nakuru National Park", slug: "lake-nakuru", region: "Rift Valley", description: "Famous for flamingos and rhino sanctuary", highlights: ["Flamingos", "Rhinos", "Bird Paradise"], bestTime: "Jun-Oct, Nov-Dec", duration: "medium", season: "year-round", image: "lake-nakuru.jpg", rating: 4.7, priceRange: "$$"},
            {id: 6, name: "Diani Beach", slug: "diani", region: "Coast Kenya", description: "Pristine white sand beach and marine adventures", highlights: ["White Beach", "Snorkeling", "Dolphins"], bestTime: "Oct-Mar, May-Jun", duration: "long", season: "year-round", image: "diani.jpg", rating: 4.8, priceRange: "$$$"},
            {id: 7, name: "Watamu Marine Park", slug: "watamu", region: "Coast Kenya", description: "World-class diving and coral reef experiences", highlights: ["Coral Reefs", "Turtles", "Deep Sea Fishing"], bestTime: "Oct-Mar", duration: "medium", season: "year-round", image: "watamu.jpg", rating: 4.6, priceRange: "$$"},
            {id: 8, name: "Nairobi National Park", slug: "nairobi-park", region: "Central Kenya", description: "Kenya's only national park in a capital city", highlights: ["City Views", "Black Rhinos", "Walking Safari"], bestTime: "Jun-Oct, Dec-Mar", duration: "short", season: "year-round", image: "nairobi-np.jpg", rating: 4.4, priceRange: "$"},
            {id: 9, name: "Mount Kenya National Park", slug: "mount-kenya", region: "Central Kenya", description: "Africa's second highest mountain with climbing routes", highlights: ["Mountain Climbing", "Alpine Forests", "Wildlife"], bestTime: "Dec-Mar", duration: "long", season: "year-round", image: "mount-kenya.jpg", rating: 4.7, priceRange: "$$$"},
            {id: 10, name: "Hell's Gate National Park", slug: "hells-gate", region: "Rift Valley", description: "Unique geothermal features and adventure activities", highlights: ["Geothermal Wells", "Cycling", "Rock Climbing"], bestTime: "Jun-Oct, Dec-Mar", duration: "short", season: "year-round", image: "hells-gate.jpg", rating: 4.5, priceRange: "$"}
        ]
    };

    var ToursService = {
        _dataPromise: null,
        CACHE_TTL: 30 * 60 * 1000, // 30 min

        _loadFromJSON: function() {
            var self = this;
            if (this._dataPromise) return this._dataPromise;
            
            this._dataPromise = fetch('../../data/tours.json')
                .then(function(response) {
                    if (!response.ok) throw new Error('Failed to load tours.json');
                    return response.json();
                })
                .then(function(data) {
                    self._toursData = data;
                    return data;
                })
                .catch(function() {
                    console.warn('[ToursService] Failed to load tours.json, using fallback data');
                    return embeddedTours;
                });
            
            return this._dataPromise;
        },

        getAll: function() {
            var self = this;
            if (window.MutsAPIConfig && window.MutsAPIConfig.isConnected()) {
                return this.fetchFromAPI();
            }
            // Check cache first
            if (window.MutsCache && window.MutsCache.has('tours_all')) {
                return Promise.resolve(window.MutsCache.get('tours_all'));
            }
            return this._loadFromJSON().then(function(data) {
                var result = data.destinations ? data : { destinations: data.tours || [] };
                window.MutsCache && window.MutsCache.set('tours_all', result, self.CACHE_TTL);
                return result;
            });
        },

        getDestinations: function() {
            return this.getAll();
        },

        getById: function(id) {
            var self = this;
            return this._loadFromJSON().then(function(data) {
                var items = data.destinations || data.tours || [];
                var found = items.find(function(item) { return item.id == id; });
                return found || null;
            });
        },

        getByFilter: function(filter) {
            var self = this;
            return this._loadFromJSON().then(function(data) {
                var items = data.destinations || data.tours || [];
                var results = items.filter(function(tour) {
                    if (filter.duration && tour.duration !== filter.duration) return false;
                    if (filter.season && tour.season !== filter.season && tour.season !== 'year-round') return false;
                    if (filter.search) {
                        var search = filter.search.toLowerCase();
                        var match = tour.name.toLowerCase().indexOf(search) !== -1 ||
                                    tour.description.toLowerCase().indexOf(search) !== -1;
                        if (!match) return false;
                    }
                    return true;
                });
                return { destinations: results };
            });
        },

        fetchFromAPI: function(endpoint) {
            var baseURL = (window.MutsAPIConfig && window.MutsAPIConfig.getBaseURL) 
                ? window.MutsAPIConfig.getBaseURL() 
                : '/api';
            var url = baseURL + (endpoint || '/tours');
            
            return fetch(url).then(function(response) {
                if (!response.ok) throw new Error('API error: ' + response.status);
                return response.json();
            }).catch(function(err) {
                console.warn('[ToursService] API unavailable:', err.message);
                return embeddedTours;
            });
        },

        enableAPI: function() {
            API_READY = true;
            console.log('[ToursService] API mode enabled');
        },

        disableAPI: function() {
            API_READY = false;
            console.log('[ToursService] API mode disabled');
        },

        isAPILive: function() {
            return window.MutsAPIConfig && window.MutsAPIConfig.isConnected();
        }
    };

    window.MutsToursService = ToursService;
})(window);
