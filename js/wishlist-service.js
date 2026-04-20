/* Wishlist Service - Muts Safaris */
/* Unified wishlist with tabs for different item types, server-first sync */
(function() {
    if (window.MutsWishlistService) return;

    var WISHLIST_KEY = 'muts_wishlist';
    var WISHLIST_REMOVED_KEY = 'muts_wishlist_removed';
    var API_BASE = window.API_BASE || '/api';
    var API_READY = false;

    var wishlist = [];
    var removedItems = [];

    var WishlistService = {
        init: function() {
            loadFromLocal();
            loadRemovedItems();
            if (WishlistService.syncWithAPI) {
                WishlistService.syncWithAPI();
            }
        },

        addItem: function(itemType, itemId) {
            var item = {
                type: itemType,
                id: itemId,
                addedAt: new Date().toISOString()
            };
            wishlist.push(item);
            saveToLocal();
            notifyChange();
            
            if (WishlistService.isAPILive()) {
                addToAPI(itemType, itemId);
            }
            return true;
        },

        removeItem: function(itemType, itemId) {
            var index = findIndex(itemType, itemId);
            if (index !== -1) {
                var removed = wishlist.splice(index, 1)[0];
                removedItems.push({
                    type: itemType,
                    id: itemId,
                    removedAt: new Date().toISOString()
                });
                saveToLocal();
                saveRemovedItems();
                notifyChange();
                
                if (WishlistService.isAPILive()) {
                    removeFromAPI(itemType, itemId);
                }
                return true;
            }
            return false;
        },

        getItems: function(itemType) {
            if (itemType) {
                return wishlist.filter(function(item) {
                    return item.type === itemType;
                });
            }
            return wishlist.slice();
        },

        getItemsByType: function() {
            var grouped = {
                product: [],
                destination: [],
                tour: [],
                hotel: []
            };
            wishlist.forEach(function(item) {
                if (grouped[item.type]) {
                    grouped[item.type].push(item);
                }
            });
            return grouped;
        },

        isInWishlist: function(itemType, itemId) {
            return findIndex(itemType, itemId) !== -1;
        },

        getCount: function(itemType) {
            if (itemType) {
                return wishlist.filter(function(item) {
                    return item.type === itemType;
                }).length;
            }
            return wishlist.length;
        },

        clear: function() {
            wishlist = [];
            saveToLocal();
            notifyChange();
        },

        syncWithAPI: function() {
            if (!isLoggedIn() || !WishlistService.isAPILive()) return;
            fetchFromAPI();
        },

        getFromAPI: function() {
            if (!isLoggedIn()) return Promise.resolve({ success: false, message: 'Not logged in' });
            return new Promise(function(resolve, reject) {
                var xhr = new XMLHttpRequest();
                xhr.open('GET', API_BASE + '/wishlist', true);
                xhr.setRequestHeader('Content-Type', 'application/json');
                addAuthHeader(xhr);
                xhr.onreadystatechange = function() {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200) {
                            try {
                                var response = JSON.parse(xhr.responseText);
                                if (response.success && response.items) {
                                    mergeWithServer(response.items);
                                }
                                resolve(response);
                            } catch (e) {
                                reject(e);
                            }
                        } else {
                            resolve({ success: false, message: 'API error' });
                        }
                    }
                };
                xhr.send();
            });
        },

        enableAPI: function() {
            API_READY = true;
        },

        disableAPI: function() {
            API_READY = false;
        },

        isAPILive: function() {
            return window.MutsAPIConfig && window.MutsAPIConfig.isConnected();
        },

        migrateFavorites: function() {
            var oldFavorites = JSON.parse(localStorage.getItem('muts_favorites') || '[]');
            if (oldFavorites.length > 0) {
                oldFavorites.forEach(function(destId) {
                    if (!WishlistService.isInWishlist('destination', destId)) {
                        WishlistService.addItem('destination', destId);
                    }
                });
                localStorage.removeItem('muts_favorites');
                console.log('[WishlistService] Migrated ' + oldFavorites.length + ' favorites');
            }
        },

        getRemovedItems: function() {
            loadRemovedItems();
            return removedItems;
        },

        isRemoved: function(itemType, itemId) {
            loadRemovedItems();
            for (var i = 0; i < removedItems.length; i++) {
                if (removedItems[i].type === itemType && removedItems[i].id == itemId) {
                    return true;
                }
            }
            return false;
        },

        clearRemovedItems: function() {
            removedItems = [];
            localStorage.removeItem(WISHLIST_REMOVED_KEY);
        },

        setItemDataCache: function(type, id, data) {
            var key = 'muts_wishlist_cache_' + type + '_' + id;
            try {
                localStorage.setItem(key, JSON.stringify(data));
            } catch (e) {
                console.warn('[WishlistService] Cache full, clearing old entries');
            }
        },

        getItemDataCache: function(type, id) {
            var key = 'muts_wishlist_cache_' + type + '_' + id;
            var cached = localStorage.getItem(key);
            if (cached) {
                try {
                    return JSON.parse(cached);
                } catch (e) {
                    return null;
                }
            }
            return null;
        }
    };

    function loadRemovedItems() {
        var saved = localStorage.getItem(WISHLIST_REMOVED_KEY);
        if (saved) {
            try {
                removedItems = JSON.parse(saved);
            } catch (e) {
                removedItems = [];
            }
        }
    }

    function saveRemovedItems() {
        localStorage.setItem(WISHLIST_REMOVED_KEY, JSON.stringify(removedItems));
    }

    function findIndex(itemType, itemId) {
        for (var i = 0; i < wishlist.length; i++) {
            if (wishlist[i].type === itemType && wishlist[i].id == itemId) {
                return i;
            }
        }
        return -1;
    }

    function loadFromLocal() {
        var saved = localStorage.getItem(WISHLIST_KEY);
        if (saved) {
            try {
                wishlist = JSON.parse(saved);
            } catch (e) {
                wishlist = [];
            }
        }
        WishlistService.migrateFavorites();
    }

    function saveToLocal() {
        localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
    }

    function isLoggedIn() {
        var session = localStorage.getItem('muts_user_session');
        if (!session) return false;
        try {
            var sessionObj = JSON.parse(session);
            return !!sessionObj.token;
        } catch (e) {
            return false;
        }
    }

    function addAuthHeader(xhr) {
        var session = localStorage.getItem('muts_user_session');
        if (session) {
            try {
                var sessionObj = JSON.parse(session);
                if (sessionObj.token) {
                    xhr.setRequestHeader('Authorization', 'Bearer ' + sessionObj.token);
                }
            } catch (e) {}
        }
    }

    function fetchFromAPI() {
        if (!isLoggedIn()) return;
        var xhr = new XMLHttpRequest();
        xhr.open('GET', API_BASE + '/wishlist', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        addAuthHeader(xhr);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                try {
                    var response = JSON.parse(xhr.responseText);
                    if (response.success && response.items) {
                        mergeWithServer(response.items);
                    }
                } catch (e) {}
            }
        };
        xhr.send();
    }

    function mergeWithServer(serverItems) {
        if (!serverItems || !serverItems.length) return;
        var merged = [];
        serverItems.forEach(function(serverItem) {
            var localIndex = findIndex(serverItem.type, serverItem.id);
            if (localIndex === -1) {
                wishlist.push(serverItem);
            } else {
                var localItem = wishlist[localIndex];
                var serverTime = new Date(serverItem.addedAt).getTime();
                var localTime = new Date(localItem.addedAt).getTime();
                if (serverTime > localTime) {
                    wishlist[localIndex] = serverItem;
                }
            }
        });
        saveToLocal();
        notifyChange();
    }

    function addToAPI(itemType, itemId) {
        if (!isLoggedIn()) return;
        var xhr = new XMLHttpRequest();
        xhr.open('POST', API_BASE + '/wishlist', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        addAuthHeader(xhr);
        xhr.send(JSON.stringify({ type: itemType, id: itemId }));
    }

    function removeFromAPI(itemType, itemId) {
        if (!isLoggedIn()) return;
        var xhr = new XMLHttpRequest();
        xhr.open('DELETE', API_BASE + '/wishlist/' + itemType + '/' + itemId, true);
        addAuthHeader(xhr);
        xhr.send();
    }

    function notifyChange() {
        window.dispatchEvent(new CustomEvent('wishlist-changed', {
            detail: { count: wishlist.length }
        }));
        updateWishlistBadge();
    }

    function updateWishlistBadge() {
        var badge = document.getElementById('wishlist-count');
        if (badge) {
            badge.textContent = wishlist.length;
            badge.style.display = wishlist.length > 0 ? 'inline' : 'none';
        }
    }

    window.MutsWishlistService = WishlistService;
    window.dispatchEvent(new CustomEvent('wishlist-service-ready'));
})();