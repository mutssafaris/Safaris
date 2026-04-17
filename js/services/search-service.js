/* Search Service — Muts Safaris */
/* Advanced search across destinations, hotels, tours, packages */
(function(window) {
    'use strict';

    var SearchService = {
        _lastQuery: '',
        _lastResults: null,
        _history: [],
        _maxHistory: 10,
        CACHE_TTL: 10 * 60 * 1000, // 10 min for search results

        // ============ MAIN SEARCH ============
        search: function(query, filters) {
            if (!query || query.trim() === '') {
                return Promise.resolve([]);
            }
            
            this._lastQuery = query;
            
            if (window.MutsAPIConfig && window.MutsAPIConfig.isConnected()) {
                var params = '?q=' + encodeURIComponent(query);
                if (filters) {
                    if (filters.types) params += '&types=' + filters.types.join(',');
                    if (filters.location) params += '&location=' + filters.location;
                    if (filters.minPrice) params += '&minPrice=' + filters.minPrice;
                    if (filters.maxPrice) params += '&maxPrice=' + filters.maxPrice;
                }
                return this.fetchFromAPI('/search' + params);
            }
            
            return this._searchLocal(query, filters);
        },

        _searchLocal: function(query, filters) {
            var self = this;
            var q = query.toLowerCase().trim();
            
            return Promise.all([
                this._searchHotels(q, filters),
                this._searchDestinations(q, filters),
                this._searchTours(q, filters),
                this._searchPackages(q, filters),
                this._searchBlogPosts(q, filters)
            ]).then(function(results) {
                var combined = results.reduce(function(acc, r) {
                    return acc.concat(r);
                }, []);
                
                combined.sort(function(a, b) {
                    return (b.score || 0) - (a.score || 0);
                });
                
                self._lastResults = combined;
                self._addToHistory(query, combined.length);
                
                return combined;
            });
        },

        // ============ HOTELS ============
        _searchHotels: function(query, filters) {
            var self = this;
            return window.MutsHotelsService.getAll().then(function(hotels) {
                return hotels.filter(function(h) {
                    var match = h.name.toLowerCase().indexOf(query) !== -1 ||
                                h.description.toLowerCase().indexOf(query) !== -1 ||
                                h.locationName.toLowerCase().indexOf(query) !== -1;
                    
                    if (!match) return false;
                    if (filters && filters.tier && h.tier !== filters.tier) return false;
                    if (filters && filters.minPrice && h.price < filters.minPrice) return false;
                    if (filters && filters.maxPrice && h.price > filters.maxPrice) return false;
                    
                    return true;
                }).map(function(h) {
                    return {
                        type: 'hotel',
                        id: h.id,
                        title: h.name,
                        subtitle: h.locationName + ' - ' + h.badge,
                        description: h.description,
                        price: h.price,
                        image: h.image,
                        link: h.link,
                        score: self._calculateScore(query, [h.name, h.description, h.locationName])
                    };
                });
            });
        },

        // ============ DESTINATIONS ============
        _searchDestinations: function(query, filters) {
            var self = this;
            return window.MutsDestinationsService.getAll().then(function(destinations) {
                return destinations.filter(function(d) {
                    var match = d.name.toLowerCase().indexOf(query) !== -1 ||
                                d.description.toLowerCase().indexOf(query) !== -1 ||
                                d.region.toLowerCase().indexOf(query) !== -1;
                    
                    if (!match) return false;
                    if (filters && filters.type && d.type !== filters.type) return false;
                    
                    return true;
                }).map(function(d) {
                    return {
                        type: 'destination',
                        id: d.id,
                        title: d.name,
                        subtitle: d.region + ' | ' + d.duration,
                        description: d.description,
                        price: d.priceFrom,
                        image: d.image,
                        link: d.link,
                        score: self._calculateScore(query, [d.name, d.description, d.region])
                    };
                });
            });
        },

        // ============ TOURS ============
        _searchTours: function(query, filters) {
            var self = this;
            return window.MutsListingsService.getByCategory('tours').then(function(tours) {
                return tours.filter(function(t) {
                    var match = t.name.toLowerCase().indexOf(query) !== -1 ||
                                t.description.toLowerCase().indexOf(query) !== -1;
                    
                    if (!match) return false;
                    return true;
                }).map(function(t) {
                    return {
                        type: 'tour',
                        id: t.id,
                        title: t.name,
                        subtitle: t.badge + ' | ' + t.duration,
                        description: t.description,
                        image: t.image,
                        link: t.link,
                        score: self._calculateScore(query, [t.name, t.description])
                    };
                });
            });
        },

        // ============ PACKAGES ============
        _searchPackages: function(query, filters) {
            var self = this;
            return window.MutsListingsService.getByCategory('packages').then(function(packages) {
                return packages.filter(function(p) {
                    var match = p.name.toLowerCase().indexOf(query) !== -1 ||
                                p.description.toLowerCase().indexOf(query) !== -1;
                    
                    if (!match) return false;
                    if (filters && filters.type) {
                        if (p.badge && p.badge.toLowerCase() !== filters.type.toLowerCase()) return false;
                    }
                    
                    return true;
                }).map(function(p) {
                    return {
                        type: 'package',
                        id: p.id,
                        title: p.name,
                        subtitle: p.badge + ' | ' + (p.duration || ''),
                        description: p.description,
                        image: p.image,
                        link: p.link,
                        score: self._calculateScore(query, [p.name, p.description])
                    };
                });
            });
        },

        // ============ BLOG POSTS ============
        _searchBlogPosts: function(query, filters) {
            var self = this;
            return window.MutsBlog.getAllPosts().then(function(posts) {
                return posts.filter(function(p) {
                    return p.title.toLowerCase().indexOf(query) !== -1 ||
                           (p.excerpt && p.excerpt.toLowerCase().indexOf(query) !== -1) ||
                           (p.category && p.category.toLowerCase().indexOf(query) !== -1);
                }).map(function(p) {
                    return {
                        type: 'blog',
                        id: p.id,
                        title: p.title,
                        subtitle: p.category || '',
                        description: p.excerpt,
                        image: p.image,
                        link: 'pages/blog/article.html?id=' + p.id,
                        score: self._calculateScore(query, [p.title, p.excerpt, p.category])
                    };
                });
            });
        },

        // ============ SCORING ============
        _calculateScore: function(query, fields) {
            var score = 0;
            var q = query.toLowerCase();
            
            fields.forEach(function(field, index) {
                if (!field) return;
                var f = field.toLowerCase();
                
                if (f.indexOf(q) !== -1) {
                    if (f === q) score += 100;
                    else if (f.indexOf(q) === 0) score += 50;
                    else score += 20;
                    
                    score -= index * 2;
                }
            });
            
            return Math.max(0, score);
        },

        // ============ AUTOCOMPLETE ============
        getSuggestions: function(query, limit) {
            limit = limit || 5;
            
            if (!query || query.trim().length < 2) {
                return Promise.resolve([]);
            }
            
            if (window.MutsAPIConfig && window.MutsAPIConfig.isConnected()) {
                return this.fetchFromAPI('/search/suggestions?q=' + encodeURIComponent(query) + '&limit=' + limit);
            }
            
            var self = this;
            return this.search(query).then(function(results) {
                return results.slice(0, limit).map(function(r) {
                    return {
                        text: r.title,
                        type: r.type,
                        link: r.link
                    };
                });
            });
        },

        // ============ POPULAR SEARCHES ============
        getPopularSearches: function() {
            return Promise.resolve([
                'Maasai Mara',
                'Diani Beach',
                'Amboseli',
                'Luxury Safari',
                'Family Safari',
                'Honeymoon',
                'Kenyan Beads',
                'Big Five'
            ]);
        },

        // ============ RECENT SEARCHES ============
        getRecentSearches: function() {
            return Promise.resolve(this._history.slice());
        },

        _addToHistory: function(query, resultCount) {
            var exists = this._history.findIndex(function(h) { return h.query === query; });
            
            if (exists !== -1) {
                this._history[exists].timestamp = Date.now();
                this._history[exists].results = resultCount;
            } else {
                this._history.unshift({
                    query: query,
                    timestamp: Date.now(),
                    results: resultCount
                });
                
                if (this._history.length > this._maxHistory) {
                    this._history.pop();
                }
            }
            
            try {
                localStorage.setItem('muts_search_history', JSON.stringify(this._history));
            } catch (e) {}
        },

        clearHistory: function() {
            this._history = [];
            localStorage.removeItem('muts_search_history');
        },

        // ============ FILTERS ============
        getFilterOptions: function() {
            return Promise.resolve({
                types: [
                    { value: 'hotel', label: 'Hotels' },
                    { value: 'destination', label: 'Destinations' },
                    { value: 'tour', label: 'Tours' },
                    { value: 'package', label: 'Packages' },
                    { value: 'blog', label: 'Blog Posts' }
                ],
                tiers: [
                    { value: 'luxury', label: 'Luxury' },
                    { value: 'mid-range', label: 'Mid-Range' },
                    { value: 'eco-budget', label: 'Eco-Budget' }
                ],
                priceRanges: [
                    { min: 0, max: 150, label: 'Under $150' },
                    { min: 150, max: 300, label: '$150 - $300' },
                    { min: 300, max: 500, label: '$300 - $500' },
                    { min: 500, max: null, label: '$500+' }
                ]
            });
        },

        // ============ API ============
        fetchFromAPI: function(endpoint, options) {
            var baseURL = (window.MutsAPIConfig && window.MutsAPIConfig.getBaseURL) 
                ? window.MutsAPIConfig.getBaseURL() 
                : '/api';
            
            var fetchOptions = Object.assign({
                headers: { 'Content-Type': 'application/json' }
            }, options);
            
            return fetch(baseURL + endpoint, fetchOptions)
                .then(function(response) {
                    if (!response.ok) throw new Error('API error: ' + response.status);
                    return response.json();
                })
                .catch(function(err) {
                    console.warn('[SearchService] API unavailable:', err.message);
return [];
                });
        },
        
        // ============ SMART SEARCH (Phase 9) ============
        
        /**
         * Smart search with NLP - interprets natural language queries
         * @param {string} query - Natural language query like "luxury camp near mara under 500"
         * @param {number} page - Page number
         * @param {number} limit - Results per page
         * @returns {Promise} - Smart search response with interpreted query
         */
        smartSearch: function(query, page, limit) {
            page = page || 1;
            limit = limit || 20;
            
            var params = '?q=' + encodeURIComponent(query) + '&page=' + page + '&limit=' + limit;
            var baseURL = (window.MutsAPIConfig && window.MutsAPIConfig.getBaseURL) 
                ? window.MutsAPIConfig.getBaseURL() 
                : '/api';
            
            return fetch(baseURL + '/search' + params, {
                headers: { 'Content-Type': 'application/json' }
            })
            .then(function(response) {
                if (!response.ok) throw new Error('API error: ' + response.status);
                return response.json();
            })
            .then(function(data) {
                // Store interpretation for UI display
                SearchService._lastInterpreted = data.interpreted;
                SearchService._lastQuery = query;
                SearchService._addToHistory(query, data.total);
                
                return data;
            })
            .catch(function(err) {
                console.warn('[SearchService] Smart search unavailable:', err.message);
                // Fallback to local search
                return SearchService._searchLocal(query, {});
            });
        },
        
        /**
         * Get search suggestions for autocomplete
         * @param {string} query - Partial query
         * @returns {Promise} - List of suggestions
         */
        getSuggestions: function(query) {
            var baseURL = (window.MutsAPIConfig && window.MutsAPIConfig.getBaseURL) 
                ? window.MutsAPIConfig.getBaseURL() 
                : '/api';
            
            return fetch(baseURL + '/search/suggestions?q=' + encodeURIComponent(query), {
                headers: { 'Content-Type': 'application/json' }
            })
            .then(function(response) {
                if (!response.ok) throw new Error('API error: ' + response.status);
                return response.json();
            })
            .then(function(data) {
                return data.suggestions || [];
            })
            .catch(function() {
                return [];
            });
        },
        
        /**
         * Get the last interpreted query (for displaying search interpretation)
         * @returns {Object|null} - Interpreted query object
         */
        getLastInterpreted: function() {
            return SearchService._lastInterpreted || null;
        },
        
        /**
         * Parse a query without executing search (for debugging)
         * @param {string} query - Query to interpret
         * @returns {Promise} - Interpreted query object
         */
        interpretQuery: function(query) {
            var baseURL = (window.MutsAPIConfig && window.MutsAPIConfig.getBaseURL) 
                ? window.MutsAPIConfig.getBaseURL() 
                : '/api';
            
            return fetch(baseURL + '/search/interpret?q=' + encodeURIComponent(query), {
                headers: { 'Content-Type': 'application/json' }
            })
            .then(function(response) {
                if (!response.ok) throw new Error('API error: ' + response.status);
                return response.json();
});
        },

        // ============ API CONTROL ============
        enableAPI: function() {
            console.log('[SearchService] API mode enabled');
        },

        disableAPI: function() {
            console.log('[SearchService] API mode disabled');
        },

        isAPILive: function() {
            return window.MutsAPIConfig && window.MutsAPIConfig.isConnected();
        }
    };

    window.MutsSearchService = SearchService;
    
    try {
        var saved = localStorage.getItem('muts_search_history');
        if (saved) SearchService._history = JSON.parse(saved);
    } catch (e) {}

})(window);
// ES6 module export (for bundlers)
export default window.searchService || window.searchService;
