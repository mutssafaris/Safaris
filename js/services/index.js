/**
 * Services Index - Muts Safaris
 * ES6 module re-exports for all services
 * 
 * Usage:
 *   import { DestinationsService, HotelsService } from './services/index.js';
 * 
 * Or continue using window globals for backward compatibility:
 *   MutsDestinationsService.getAll()
 */

// Re-export all services from individual files
// These must be loaded before this file

// Destinations Service
export var DestinationsService = window.MutsDestinationsService || window.DestinationsService;

// Hotels Service  
export var HotelsService = window.MutsHotelsService || window.HotelsService;

// Tours Service
export var ToursService = window.MutsToursService || window.ToursService;

// Bookings Service
export var BookingsService = window.MutsBookingsService || window.BookingsService;

// Messages Service
export var MessagesService = window.MutsMessagesService || window.MessagesService;

// Transactions Service
export var TransactionsService = window.MutsTransactionsService || window.TransactionsService;

// Search Service
export var SearchService = window.MutsSearchService || window.SearchService;

// Listings Service
export var ListingsService = window.MutsListingsService || window.ListingsService;

// Experiences Service
export var ExperiencesService = window.MutsExperiencesService || window.ExperiencesService;

// Reviews Service
export var ReviewsService = window.MutsReviewsService || window.ReviewsService;

// Payment Service
export var PaymentService = window.MutsPaymentService || window.PaymentService;

// Africasa Service
export var AfricasaService = window.MutsAfricasaService || window.AfricasaService;

/**
 * Initialize all services with API configuration
 * @param {object} config - API configuration options
 */
export function initServices(config) {
    var services = [
        DestinationsService,
        HotelsService,
        ToursService,
        BookingsService,
        MessagesService,
        TransactionsService,
        SearchService,
        ListingsService,
        ExperiencesService,
        ReviewsService,
        PaymentService,
        AfricasaService
    ];
    
    services.forEach(function(service) {
        if (service && typeof service.enableAPI === 'function') {
            service.enableAPI(config);
        }
    });
}

/**
 * Get service by name
 * @param {string} name - Service name (e.g., 'destinations')
 * @returns {object|null}
 */
export function getService(name) {
    var map = {
        'destinations': DestinationsService,
        'hotels': HotelsService,
        'tours': ToursService,
        'bookings': BookingsService,
        'messages': MessagesService,
        'transactions': TransactionsService,
        'search': SearchService,
        'listings': ListingsService,
        'experiences': ExperiencesService,
        'reviews': ReviewsService,
        'payment': PaymentService,
        'africasa': AfricasaService
    };
    return map[name] || null;
}

// Default export for convenience
export default {
    DestinationsService,
    HotelsService,
    ToursService,
    BookingsService,
    MessagesService,
    TransactionsService,
    SearchService,
    ListingsService,
    ExperiencesService,
    ReviewsService,
    PaymentService,
    AfricasaService,
    initServices,
    getService
};
