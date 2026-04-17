/* Experiences Service — Muts Safaris */
(function(window) {
    'use strict';

    var API_READY = false;

    var embeddedExperiences = [
        { id: 1, name: "Hot Air Balloon Safari", slug: "hot-air-balloon", description: "Drift over the Maasai Mara or Amboseli at dawn, spotting wildlife from a unique aerial perspective.", duration: "half-day", type: "wildlife", price: 450, rating: 4.9, image: "hot-air-balloon.jpg" },
        { id: 2, name: "Maasai Cultural Village", slug: "maasai-village", description: "Visit a traditional Maasai community to learn about their rituals, crafts, and way of life.", duration: "half-day", type: "cultural", price: 85, rating: 4.7, image: "maasai-village.jpg" },
        { id: 3, name: "Camel Safari", slug: "camel-safari", description: "Traverse semi-arid landscapes on camelback, following ancient trade routes in Laikipia and beyond.", duration: "multi-day", type: "adventure", price: 950, rating: 4.6, image: "camel-safari.jpg" },
        { id: 4, name: "Great Migration Balloon", slug: "migration-balloon", description: "Witness the epic wildebeest migration from above during the peak season in Maasai Mara.", duration: "half-day", type: "wildlife", price: 550, rating: 4.9, image: "migration-balloon.jpg" },
        { id: 5, name: "Swahili Cooking Class", slug: "cooking-class", description: "Learn to prepare traditional Kenyan dishes using fresh ingredients alongside local chefs.", duration: "half-day", type: "cultural", price: 65, rating: 4.8, image: "cooking-class.jpg" },
        { id: 6, name: "Photography Safari Workshop", slug: "photo-workshop", description: "Improve your wildlife photography skills with expert guides in the field.", duration: "multi-day", type: "wildlife", price: 3200, rating: 4.9, image: "photo-workshop.jpg" }
    ];

    var ExperiencesService = {
        _dataPromise: null,

        _loadFromJSON: function() {
            var self = this;
            if (this._dataPromise) return this._dataPromise;
            
            this._dataPromise = fetch('../../data/tours.json')
                .then(function(response) {
                    if (!response.ok) throw new Error('Failed to load tours.json');
                    return response.json();
                })
                .then(function(data) {
                    self._experiencesData = data;
                    return data;
                })
                .catch(function() {
                    console.warn('[ExperiencesService] Failed to load tours.json, using fallback data');
                    return { experiences: embeddedExperiences };
                });
            
            return this._dataPromise;
        },

        getAll: function() {
            var self = this;
            if (window.MutsAPIConfig && window.MutsAPIConfig.isConnected()) {
                return this.fetchFromAPI();
            }
            return this._loadFromJSON().then(function(data) {
                if (data.experiences) {
                    return data.experiences;
                }
                return embeddedExperiences;
            });
        },

        getByFilter: function(filter) {
            var self = this;
            return this.getAll().then(function(experiences) {
                return experiences.filter(function(exp) {
                    if (filter.duration && exp.duration !== filter.duration) return false;
                    if (filter.type && exp.type !== filter.type) return false;
                    return true;
                });
            });
        },

        fetchFromAPI: function(endpoint) {
            var baseURL = (window.MutsAPIConfig && window.MutsAPIConfig.getBaseURL) 
                ? window.MutsAPIConfig.getBaseURL() 
                : '/api';
            var url = baseURL + (endpoint || '/experiences');
            
            return fetch(url).then(function(response) {
                if (!response.ok) throw new Error('API error: ' + response.status);
                return response.json();
            }).catch(function(err) {
                console.warn('[ExperiencesService] API unavailable:', err.message);
                return embeddedExperiences;
            });
        },

        enableAPI: function() {
            API_READY = true;
            console.log('[ExperiencesService] API mode enabled');
        },

        disableAPI: function() {
            API_READY = false;
            console.log('[ExperiencesService] API mode disabled');
        },

        isAPILive: function() {
            return window.MutsAPIConfig && window.MutsAPIConfig.isConnected();
        }
    };

    window.MutsExperiencesService = ExperiencesService;
})(window);
// ES6 module export (for bundlers)
export default window.experiencesService || window.experiencesService;
