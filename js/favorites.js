/* Favorites JS - Muts Safaris */
(function() {
    if (window.favoritesInitialized) return;
    window.favoritesInitialized = true;

var FAVORITES_KEY = 'muts_favorites';
    var DESTINATIONS_KEY = 'muts_destinations_cache';
    var API_BASE = window.API_BASE || '/api';
    
    // Store favorites from API
    var apiFavorites = [];

    var destinationsData = null;

    function getBasePath() {
        var path = window.location.pathname;
        if (path.indexOf('/pages/dashboard/') !== -1) return '../../';
        return './';
    }

    // Try to sync with backend API
    function syncWithAPI() {
        // First get favorites from API
        var xhr = new XMLHttpRequest();
        xhr.open('GET', API_BASE + '/favorites', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        
        // Include auth token if available
        var session = localStorage.getItem('muts_user_session');
        if (session) {
            try {
                var sessionObj = JSON.parse(session);
                if (sessionObj.token) {
                    xhr.setRequestHeader('Authorization', 'Bearer ' + sessionObj.token);
                }
            } catch (e) {}
        }
        
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                try {
                    var response = JSON.parse(xhr.responseText);
                    if (response.success && response.favorites) {
                        apiFavorites = response.favorites.map(function(f) { return f.itemId; });
                    }
                } catch (e) {}
            }
        };
        xhr.send();
    }

    // Try to add favorite via API
    function addFavoriteAPI(itemType, itemId) {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', API_BASE + '/favorites', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        
        var session = localStorage.getItem('muts_user_session');
        if (session) {
            try {
                var sessionObj = JSON.parse(session);
                if (sessionObj.token) {
                    xhr.setRequestHeader('Authorization', 'Bearer ' + sessionObj.token);
                }
            } catch (e) {}
        }
        
        xhr.send(JSON.stringify({ itemType: itemType, itemId: itemId }));
    }

    // Try to remove favorite via API
    function removeFavoriteAPI(itemType, itemId) {
        var xhr = new XMLHttpRequest();
        xhr.open('DELETE', API_BASE + '/favorites/' + itemType + '/' + itemId, true);
        
        var session = localStorage.getItem('muts_user_session');
        if (session) {
            try {
                var sessionObj = JSON.parse(session);
                if (sessionObj.token) {
                    xhr.setRequestHeader('Authorization', 'Bearer ' + sessionObj.token);
                }
            } catch (e) {}
        }
        
        xhr.send();
    }

// Initialize - try to sync with API
    syncWithAPI();

    function loadDestinations(callback) {
        if (destinationsData) {
            callback(destinationsData);
            return;
        }
        
        var cached = localStorage.getItem(DESTINATIONS_KEY);
        if (cached) {
            try {
                destinationsData = JSON.parse(cached);
                callback(destinationsData);
                return;
            } catch (e) {}
        }

        var xhr = new XMLHttpRequest();
        xhr.open('GET', getBasePath() + 'data/destinations.json', true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    try {
                        destinationsData = JSON.parse(xhr.responseText);
                        localStorage.setItem(DESTINATIONS_KEY, JSON.stringify(destinationsData));
                        callback(destinationsData);
                    } catch (e) {
                        callback(null);
                    }
                } else {
                    callback(null);
                }
            }
        };
        xhr.send();
    }

    function getFavorites() {
        return JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]');
    }

    function isFavorite(destinationId) {
        var favs = getFavorites();
        return favs.indexOf(destinationId) !== -1;
    }

    function toggleFavorite(destinationId) {
        var favs = getFavorites();
var index = favs.indexOf(destinationId);
        if (index === -1) {
            favs.push(destinationId);
            addFavoriteAPI('destination', destinationId);
        } else {
            favs.splice(index, 1);
            removeFavoriteAPI('destination', destinationId);
        }
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
        return index === -1;
    }

    function getImagePath(imageName) {
        if (!imageName) return getBasePath() + 'images/hero/kenya-safari.jpg';
        return getBasePath() + 'images/tours/' + imageName;
    }

    function createDestinationCard(dest) {
        var card = document.createElement('div');
        card.className = 'destination-card';
        card.dataset.id = dest.id;

        var imageError = "this.src='" + getBasePath() + "images/hero/kenya-safari.jpg'";
        var isFav = isFavorite(dest.id);

        card.innerHTML = 
            '<div class="destination-image">' +
                '<img src="' + getImagePath(dest.image) + '" alt="' + dest.name + '" loading="lazy" onerror="' + imageError + '">' +
                '<button class="favorite-btn' + (isFav ? ' active' : '') + '" data-id="' + dest.id + '" title="' + (isFav ? 'Remove from favorites' : 'Add to favorites') + '">' +
                    '<svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>' +
                '</button>' +
            '</div>' +
            '<div class="destination-content">' +
                '<span class="destination-region">' + dest.region + '</span>' +
                '<h3 class="destination-name">' + dest.name + '</h3>' +
                '<p class="destination-desc">' + dest.description + '</p>' +
                '<div class="destination-tags">' +
                    dest.highlights.slice(0, 3).map(function(h) { return '<span class="dest-tag">' + h + '</span>'; }).join('') +
                '</div>' +
                '<div class="destination-meta">' +
                    '<span class="dest-rating"><svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>' + dest.rating + '</span>' +
                    '<span class="dest-price">' + dest.priceRange + '</span>' +
                    '<span class="dest-besttime">' + dest.bestTime + '</span>' +
                '</div>' +
                '<a href="tours.html?destination=' + dest.slug + '" class="btn btn-primary">Explore</a>' +
            '</div>';

        return card;
    }

    function renderFavorites() {
        var container = document.getElementById('favorites-grid');
        var emptyState = document.getElementById('favorites-empty');
        
        if (!container) return;

        var favoriteIds = getFavorites();
        
        if (favoriteIds.length === 0) {
            container.innerHTML = '';
            if (emptyState) emptyState.style.display = 'block';
            return;
        }

        if (emptyState) emptyState.style.display = 'none';

        loadDestinations(function(data) {
            if (!data || !data.destinations) {
                container.innerHTML = '<div class="error-state">Unable to load destinations</div>';
                return;
            }

            var favoriteDests = data.destinations.filter(function(d) {
                return favoriteIds.indexOf(d.id) !== -1;
            });

            container.innerHTML = '';
            
            if (favoriteDests.length === 0) {
                if (emptyState) emptyState.style.display = 'block';
                return;
            }

            favoriteDests.forEach(function(dest) {
                container.appendChild(createDestinationCard(dest));
            });

            initFavoriteActions();
        });
    }

    function initFavoriteActions() {
        document.querySelectorAll('.favorite-btn').forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                var id = parseInt(btn.dataset.id);
                var isNowFavorite = toggleFavorite(id);
                btn.classList.toggle('active', isNowFavorite);
                btn.title = isNowFavorite ? 'Remove from favorites' : 'Add to favorites';
                
                // Remove card if unfavorited
                if (!isNowFavorite) {
                    var card = btn.closest('.destination-card');
                    if (card) {
                        card.style.opacity = '0.5';
                        setTimeout(function() {
                            card.remove();
                            var remaining = document.querySelectorAll('.destination-card');
                            if (remaining.length === 0) {
                                renderFavorites();
                            }
                        }, 300);
                    }
                }
            });
        });
    }

    window.MutsFavorites = {
        getFavorites: getFavorites,
        isFavorite: isFavorite,
        toggleFavorite: toggleFavorite,
        loadDestinations: loadDestinations,
        renderFavorites: renderFavorites,
        syncWithAPI: syncWithAPI
    };

    document.addEventListener('DOMContentLoaded', function() {
        if (document.getElementById('favorites-grid')) {
            renderFavorites();
        }
    });
})();