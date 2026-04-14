/* Search UI Component - Muts Safaris */
/* Smart search input with autocomplete and interpretation display */
(function() {
    if (window.MutsSearchUI) return;
    
    var SearchUI = {
        inputElement: null,
        suggestionsContainer: null,
        interpretationContainer: null,
        currentSuggestions: [],
        selectedIndex: -1,
        
        /**
         * Initialize the search UI
         * @param {string} inputId - ID of the search input element
         * @param {Object} options - Configuration options
         */
        init: function(inputId, options) {
            var self = this;
            options = options || {};
            
            this.inputElement = document.getElementById(inputId);
            if (!this.inputElement) {
                console.error('[SearchUI] Input element not found:', inputId);
                return;
            }
            
            // Create suggestions container
            this.suggestionsContainer = document.createElement('div');
            this.suggestionsContainer.className = 'search-suggestions';
            this.suggestionsContainer.style.display = 'none';
            this.inputElement.parentNode.appendChild(this.suggestionsContainer);
            
            // Create interpretation display
            if (options.showInterpretation) {
                this.interpretationContainer = document.createElement('div');
                this.interpretationContainer.className = 'search-interpretation';
                this.interpretationContainer.style.display = 'none';
                this.inputElement.parentNode.appendChild(this.interpretationContainer);
            }
            
            // Event listeners
            this.inputElement.addEventListener('input', function(e) {
                self._onInput(e.target.value);
            });
            
            this.inputElement.addEventListener('keydown', function(e) {
                self._onKeyDown(e);
            });
            
            this.inputElement.addEventListener('focus', function() {
                if (self.inputElement.value.length > 0) {
                    self._showSuggestions();
                }
            });
            
            // Close suggestions on outside click
            document.addEventListener('click', function(e) {
                if (!self.inputElement.contains(e.target) && 
                    !self.suggestionsContainer.contains(e.target)) {
                    self._hideSuggestions();
                }
            });
        },
        
        /**
         * Handle input changes
         */
        _onInput: function(value) {
            var self = this;
            
            if (value.length < 2) {
                this._hideSuggestions();
                return;
            }
            
            // Debounce API calls
            clearTimeout(this._debounceTimer);
            this._debounceTimer = setTimeout(function() {
                self._fetchSuggestions(value);
            }, 300);
        },
        
        /**
         * Fetch suggestions from API
         */
        _fetchSuggestions: function(query) {
            var self = this;
            
            if (window.MutsSearchService && window.MutsSearchService.getSuggestions) {
                window.MutsSearchService.getSuggestions(query).then(function(suggestions) {
                    self.currentSuggestions = suggestions;
                    self._renderSuggestions(suggestions);
                });
            } else {
                // Local suggestions
                this._getLocalSuggestions(query);
            }
        },
        
        /**
         * Get local suggestions as fallback
         */
        _getLocalSuggestions: function(query) {
            var suggestions = [
                query + ' safari',
                query + ' hotel',
                query + ' resort',
                query + ' tour',
                query + ' package'
            ];
            
            this.currentSuggestions = suggestions;
            this._renderSuggestions(suggestions);
        },
        
        /**
         * Render suggestions dropdown
         */
        _renderSuggestions: function(suggestions) {
            var self = this;
            
            if (suggestions.length === 0) {
                this._hideSuggestions();
                return;
            }
            
            this.suggestionsContainer.innerHTML = '';
            this.suggestionsContainer.style.display = 'block';
            
            suggestions.forEach(function(suggestion, index) {
                var item = document.createElement('div');
                item.className = 'suggestion-item';
                item.textContent = suggestion;
                item.dataset.index = index;
                
                item.addEventListener('click', function() {
                    self._selectSuggestion(suggestion);
                });
                
                self.suggestionsContainer.appendChild(item);
            });
            
            this.selectedIndex = -1;
        },
        
        /**
         * Handle keyboard navigation
         */
        _onKeyDown: function(e) {
            var items = this.suggestionsContainer.querySelectorAll('.suggestion-item');
            
            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    this.selectedIndex = Math.min(this.selectedIndex + 1, items.length - 1);
                    this._highlightSuggestion(items);
                    break;
                    
                case 'ArrowUp':
                    e.preventDefault();
                    this.selectedIndex = Math.max(this.selectedIndex - 1, -1);
                    this._highlightSuggestion(items);
                    break;
                    
                case 'Enter':
                    e.preventDefault();
                    if (this.selectedIndex >= 0 && this.currentSuggestions[this.selectedIndex]) {
                        this._selectSuggestion(this.currentSuggestions[this.selectedIndex]);
                    } else {
                        this._executeSearch(this.inputElement.value);
                    }
                    break;
                    
                case 'Escape':
                    this._hideSuggestions();
                    break;
            }
        },
        
        /**
         * Highlight selected suggestion
         */
        _highlightSuggestion: function(items) {
            items.forEach(function(item, index) {
                item.classList.toggle('active', index === this.selectedIndex);
            }.bind(this));
        },
        
        /**
         * Select a suggestion
         */
        _selectSuggestion: function(suggestion) {
            this.inputElement.value = suggestion;
            this._hideSuggestions();
            this._executeSearch(suggestion);
        },
        
        /**
         * Execute search
         */
        _executeSearch: function(query) {
            var self = this;
            
            // Use smart search if available
            if (window.MutsSearchService && window.MutsSearchService.smartSearch) {
                window.MutsSearchService.smartSearch(query).then(function(response) {
                    // Show interpretation if available
                    if (self.interpretationContainer && response.interpreted) {
                        self._showInterpretation(response.interpreted);
                    }
                    
                    // Trigger custom event for results
                    self._dispatchResultsEvent(response);
                });
            } else {
                // Fallback to regular search
                if (window.MutsSearchService) {
                    window.MutsSearchService.search(query).then(function(results) {
                        self._dispatchResultsEvent({ results: results });
                    });
                }
            }
        },
        
        /**
         * Show interpretation of search query
         */
        _showInterpretation: function(interpreted) {
            var html = '<div class="interpretation-label">Understanding your search:</div>';
            html += '<div class="interpretation-items">';
            
            if (interpreted.location) {
                html += '<span class="interp-item"><strong>Location:</strong> ' + interpreted.location + '</span>';
            }
            if (interpreted.type) {
                html += '<span class="interp-item"><strong>Type:</strong> ' + interpreted.type + '</span>';
            }
            if (interpreted.tier) {
                html += '<span class="interp-item"><strong>Level:</strong> ' + interpreted.tier + '</span>';
            }
            if (interpreted.maxPrice) {
                html += '<span class="interp-item"><strong>Max Price:</strong> $' + interpreted.maxPrice + '</span>';
            }
            if (interpreted.minPrice) {
                html += '<span class="interp-item"><strong>Min Price:</strong> $' + interpreted.minPrice + '</span>';
            }
            if (interpreted.amenities && interpreted.amenities.length > 0) {
                html += '<span class="interp-item"><strong>Amenities:</strong> ' + interpreted.amenities.join(', ') + '</span>';
            }
            
            html += '</div>';
            
            this.interpretationContainer.innerHTML = html;
            this.interpretationContainer.style.display = 'block';
        },
        
        /**
         * Hide suggestions
         */
        _hideSuggestions: function() {
            this.suggestionsContainer.style.display = 'none';
        },
        
        /**
         * Show suggestions
         */
        _showSuggestions: function() {
            if (this.currentSuggestions.length > 0) {
                this.suggestionsContainer.style.display = 'block';
            }
        },
        
        /**
         * Dispatch results event
         */
        _dispatchResultsEvent: function(data) {
            var event = new CustomEvent('searchResults', { detail: data });
            window.dispatchEvent(event);
        },
        
        /**
         * Clear search
         */
        clear: function() {
            this.inputElement.value = '';
            this._hideSuggestions();
            if (this.interpretationContainer) {
                this.interpretationContainer.style.display = 'none';
            }
        }
    };
    
    window.MutsSearchUI = SearchUI;
})();