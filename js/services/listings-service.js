/* Listings Service — Muts Safaris */
/* Provides mock data for tabbed dashboard listings. Replace with API calls when backend is ready. */
(function (window) {
    'use strict';

    var API_READY = false;
    var CACHE_TTL = 30 * 60 * 1000; // 30 min

    var mockData = {
        tours: [
            { id: 't1', name: 'Maasai Mara', badge: 'Most Popular', description: 'Home to the Great Migration and the Big Five.', duration: '3-7 Days', image: 'images/tours/maasai-mara-hero.jpg', link: 'tours/maasai-mara.html' },
            { id: 't2', name: 'Amboseli', badge: 'Elephant Paradise', description: 'Elephants with Kilimanjaro backdrop.', duration: '2-3 Days', image: 'images/tours/amboseli-hero.jpg', link: 'tours/amboseli.html' },
            { id: 't3', name: 'Tsavo', badge: 'Red Elephant', description: "Kenya's largest national park.", duration: '3-5 Days', image: 'images/tours/tsavo-hero.jpg', link: 'tours/tsavo.html' },
            { id: 't4', name: 'Samburu', badge: 'Unique Wildlife', description: "Grevy's zebra, reticulated giraffe, and more.", duration: '3-4 Days', image: 'images/tours/samburu-hero.jpg', link: 'tours/samburu.html' },
            { id: 't5', name: 'Lake Nakuru', badge: 'Birdwatching', description: 'Flamingo spectacle and rhino sanctuary.', duration: '1-2 Days', image: 'images/tours/nakuru-hero.jpg', link: 'tours/lake-nakuru.html' },
            { id: 't6', name: "Hell's Gate", badge: 'Adventure', description: 'Walk or cycle among wildlife in dramatic gorges.', duration: '1 Day', image: 'images/tours/hells-gate-hero.jpg', link: 'tours/hells-gate.html' },
            { id: 't7', name: 'Mount Kenya', badge: 'Trekking', description: "Africa's second-highest peak through bamboo forests.", duration: '4-6 Days', image: 'images/tours/mount-kenya-hero.jpg', link: 'tours/mount-kenya.html' },
            { id: 't8', name: 'Nairobi National Park', badge: 'City Safari', description: 'Wildlife park within a capital city skyline.', duration: '1 Day', image: 'images/tours/nairobi-np-hero.jpg', link: 'tours/nairobi-np.html' }
        ],
        packages: [
            { id: 'p1', name: 'Safari Honeymoon', badge: 'Romantic', description: 'Romantic lodges, private game drives, intimate bush meals.', image: 'images/packages/honeymoon.jpg', link: 'packages/honeymoon.html',
                hero: 'images/packages/honeymoon-hero.jpg', duration: '5-10 Nights', overview: 'Crafted for newlyweds seeking romance and adventure — stay in exclusive lodge suites or private villas, enjoy sunset drives, spa treatments, and gourmet meals beneath the African sky.',
                highlights: [
                    { title: 'Private Game Drives', desc: 'Sunrise and sunset drives exclusively for couples' },
                    { title: 'Couples Spa & Dining', desc: 'Spa treatments and private candlelit dinners' },
                    { title: 'Luxury Accommodations', desc: 'Exclusive suites with breathtaking views' },
                    { title: 'Beach Extension', desc: 'Optional coastal relaxation after safari' }
                ],
                includes: ['Luxury lodge accommodation', 'All meals & drinks', 'Private game drives', 'Airport transfers', 'Spa treatment', 'Beach extension option'] },
            { id: 'p2', name: 'Photography Tour', badge: 'Workshops', description: 'Prime photo opportunities with expert guides.', image: 'images/packages/photography.jpg', link: 'packages/photography.html',
                hero: 'images/packages/photography-hero.jpg', duration: '7-12 Days', overview: 'Capture Kenya\'s stunning wildlife and landscapes with professional photography guides. From the big five to bird species, learn techniques to get the perfect shot.',
                highlights: [
                    { title: 'Pro Photography Guides', desc: 'Expert guidance on wildlife photography' },
                    { title: 'Golden Hour Sessions', desc: 'Sunrise and sunset photo sessions' },
                    { title: 'Post-Processing Training', desc: 'Learn editing techniques from professionals' }
                ],
                includes: ['Professional photographer guide', 'Camera equipment rental', 'All park fees', 'Luxury accommodation', 'Meals included'] },
            { id: 'p3', name: 'Family Adventure', badge: 'All Ages', description: 'Kid-friendly lodges and fun activities for all ages.', image: 'images/packages/family.jpg', link: 'packages/family.html',
                hero: 'images/packages/family.jpg', duration: '5-8 Days', overview: 'A family-friendly safari with activities for children of all ages. From game drives to cultural visits, create unforgettable memories together.',
                highlights: [
                    { title: 'Kid-Friendly Activities', desc: 'Bush walks, cooking classes, junior ranger programs' },
                    { title: 'Safe & Comfortable', desc: 'Family suites and child-appropriate meals' },
                    { title: 'Educational Elements', desc: 'Learn about wildlife conservation together' }
                ],
                includes: ['Family accommodations', 'Children\'s activities', 'Dedicated guide', 'All meals', 'Park fees'] },
            { id: 'p4', name: 'Cultural Immersion', badge: 'Authentic', description: 'Live with local communities and learn traditions.', image: 'images/packages/cultural.jpg', link: 'packages/cultural.html',
                hero: 'images/packages/cultural-hero.jpg', duration: '6-10 Days', overview: 'Immerse yourself in Kenya\'s rich cultural heritage. Visit Maasai villages, learn traditional crafts, and experience authentic African hospitality.',
                highlights: [
                    { title: 'Village Homestays', desc: 'Stay with local families and learn their way of life' },
                    { title: 'Traditional Crafts', desc: 'Learn beadwork, dancing, and cooking' },
                    { title: 'Historic Sites', desc: 'Visit ancient settlements and cultural landmarks' }
                ],
                includes: ['Homestay accommodation', 'Cultural guide', 'All meals', 'Craft workshops', 'Community contributions'] },
            { id: 'p5', name: 'Birdwatching Safari', badge: 'Specialty', description: 'Over 1,100 bird species across diverse habitats.', image: 'images/packages/birdwatching.jpg', link: 'packages/birdwatching.html',
                hero: 'images/packages/birdwatching.jpg', duration: '5-7 Days', overview: 'Explore Kenya\'s diverse ecosystems with expert ornithologists. From flamingos at Lake Nakuru to endemic species in Aberdare.',
                highlights: [
                    { title: 'Expert Ornithologists', desc: 'Guided by birding experts' },
                    { title: 'Diverse Habitats', desc: 'Lakes, forests, savannas, and mountains' },
                    { title: 'Rare Species', desc: 'Spot endemic and endangered birds' }
                ],
                includes: ['Expert birding guide', 'Binoculars provided', 'All park fees', 'Comfortable lodges', 'Meals included'] },
            { id: 'p6', name: 'Luxury Camp Experience', badge: 'Premium', description: 'Glamping under the stars with five-star service.', image: 'images/packages/luxury-camp.jpg', link: 'packages/luxury-camp.html',
                hero: 'images/packages/luxury-camp.jpg', duration: '4-7 Days', overview: 'Experience the ultimate in luxury camping — elegant tents with en-suite bathrooms, gourmet cuisine, and unparalleled wildlife viewing.',
                highlights: [
                    { title: 'Luxury Tents', desc: 'Private decks, en-suite facilities, and premium amenities' },
                    { title: 'Gourmet Dining', desc: 'Chef-prepared meals and fine wines' },
                    { title: 'Exclusive Camps', desc: 'Limited to small groups for intimate experience' }
                ],
                includes: ['Luxury camp accommodation', 'All meals & premium drinks', 'Private game drives', 'Spa treatments', 'Airport transfers'] },
            { id: 'p7', name: 'Farm to Table', badge: 'Culinary', description: 'Taste Kenya from local farms to your safari plate.', image: 'images/packages/cultural-hero.jpg', link: 'packages/farm-to-table.html',
                hero: 'images/packages/cultural-hero.jpg', duration: '5-8 Days', overview: 'A culinary journey through Kenya — visit local farms, learn traditional cooking, and enjoy farm-fresh meals throughout your safari.',
                highlights: [
                    { title: 'Farm Visits', desc: 'Visit organic farms and coffee plantations' },
                    { title: 'Cooking Classes', desc: 'Learn Swahili and international dishes' },
                    { title: 'Wine Pairing', desc: 'Kenyan wine and craft beer tastings' }
                ],
                includes: ['Boutique lodge stay', 'Cooking classes', 'Farm visits', 'All meals', 'Market tours'] },
            { id: 'p8', name: 'Migration Safari', badge: 'Seasonal', description: 'Time your visit to witness the great wildebeest crossing.', image: 'images/packages/honeymoon-hero.jpg', link: 'packages/migration-safari.html',
                hero: 'images/packages/honeymoon-hero.jpg', duration: '7-10 Days', overview: 'Witness one of nature\'s most spectacular events — the Great Migration. Watch river crossings and predator action.',
                highlights: [
                    { title: 'River Crossings', desc: 'Witness dramatic Mara River crossings' },
                    { title: 'Predator Action', desc: 'Lions, cheetahs, and crocodiles in action' },
                    { title: 'Balloon option', desc: 'Aerial views of the migration' }
                ],
                includes: ['Prime camp location', 'All meals', 'Game drives', 'Park fees', 'Optional hot air balloon'] }
        ],
        beaches: [
            { id: 'b1', name: 'Diani Beach', badge: 'Most Popular', description: '20km of pristine white sand and world-class resorts.', image: 'images/beaches/diani-beach.jpg', link: 'beaches/diani.html', 
                hero: 'images/beaches/diani-hero.jpg', bestTime: 'December - April', overview: "Kenya's most popular coastal destination with 20 kilometers of pristine white-sand beach backed by swaying palms and luxury resorts. Located south of Mombasa, Diani combines world-class beach facilities with authentic Swahili culture and incredible marine biodiversity at Kisite-Mpunguti Marine National Park.",
                highlights: [
                    { title: 'Pristine Beaches', desc: '20km white sand, calm shallow waters perfect for swimming' },
                    { title: 'Marine Parks', desc: 'Kisite-Mpunguti with vibrant coral reefs and 600+ fish species' },
                    { title: 'Water Sports', desc: 'Snorkeling, diving, parasailing, jet skiing' },
                    { title: 'Golf & Leisure', desc: 'Championship golf courses, world-class spas' }
                ],
                activities: ['Snorkeling & Diving', 'Water Sports', 'Golf', 'Cultural Experiences', 'Wildlife & Nature', 'Spa & Relaxation'] },
            { id: 'b2', name: 'Watamu', badge: 'Marine Life', description: 'Coral reefs, turtle nesting sites, eco-friendly resorts.', image: 'images/beaches/watamu.jpg', link: 'beaches/watamu.html',
                hero: 'images/beaches/watamu-hero.jpg', bestTime: 'October - March', overview: 'A marine conservation paradise within the Watamu-Malindi Marine National Park, a UNESCO Biosphere Reserve. The area combines pristine beaches with world-class snorkeling, turtle conservation at Mida Creek Sanctuary, and ancient Swahili history at Gede Ruins.',
                highlights: [
                    { title: 'Marine Reserve', desc: 'UNESCO Biosphere with pristine coral gardens' },
                    { title: 'Turtle Sanctuary', desc: 'Nesting grounds for green and hawksbill turtles' },
                    { title: 'Snorkeling', desc: 'Crystal clear waters with 600+ fish species' },
                    { title: 'Ancient Ruins', desc: 'Gede Ruins - mysterious 13th century Swahili settlement' }
                ],
                activities: ['Snorkeling', 'Diving', 'Turtle Watching', 'Cultural Tours', 'Kayaking', 'Bird Watching'] },
            { id: 'b3', name: 'Lamu Island', badge: 'UNESCO Site', description: 'Car-free streets, ancient Swahili architecture.', image: 'images/beaches/lamu.jpg', link: 'beaches/lamu.html',
                hero: 'images/beaches/lamu.jpg', bestTime: 'November - March', overview: 'UNESCO World Heritage Site preserving the authentic Swahili way of life unchanged for centuries. Car-free island with narrow alleyways, ancient coral stone architecture dating to the 14th century, and pristine secluded beaches.',
                highlights: [
                    { title: 'UNESCO Heritage', desc: 'Perfectly preserved Swahili architecture' },
                    { title: 'Car-free Streets', desc: 'Donkeys and dhows as main transport' },
                    { title: 'Dhow Safaris', desc: 'Traditional sailing to remote islands' },
                    { title: 'Cultural Authenticity', desc: 'Living Arab-Persian-African heritage' }
                ],
                activities: ['Dhow Sailing', 'Swahili Cooking', 'Donkey Tours', 'Historic Walks', 'Fishing', 'Island Hopping'] },
            { id: 'b4', name: 'Malindi', badge: 'Historic', description: 'Vasco da Gama pillar and golden beaches.', image: 'images/beaches/malindi.jpg', link: 'beaches/malindi.html',
                hero: 'images/beaches/malindi.jpg', bestTime: 'December - April', overview: 'Ancient Swahili town with a rich maritime history dating to the 14th century. Famous for the Portuguese explorer Vasco da Gama\'s landmark pillar and golden sandy beaches along the Indian Ocean.',
                highlights: [
                    { title: 'Vasco da Gama Pillar', desc: '500-year old Portuguese navigational marker' },
                    { title: 'Old Town', desc: 'Narrow streets with ancient mosques and houses' },
                    { title: 'Marine Park', desc: 'Protected coral reef with excellent diving' },
                    { title: 'Jumba La Malindi', desc: 'Historical Swahili house museum' }
                ],
                activities: ['Historical Tours', 'Snorkeling', 'Deep Sea Fishing', 'Diving', 'Cultural Visits', 'Sunset Cruises'] },
            { id: 'b5', name: 'Nyali Beach', badge: 'City Beach', description: 'Vibrant beach life near Mombasa city center.', image: 'images/beaches/nyali.jpg', link: 'beaches/nyali.html',
                hero: 'images/beaches/nyali.jpg', bestTime: 'Year-Round', overview: 'Family-friendly beach suburb of Mombasa with calm waters, resorts, and easy access to city amenities. Offers a perfect blend of beach relaxation and urban convenience.',
                highlights: [
                    { title: 'Family Friendly', desc: 'Calm, shallow waters safe for children' },
                    { title: 'City Access', desc: 'Close to Mombasa shopping and dining' },
                    { title: 'Haller Park', desc: 'Wildlife sanctuary with giraffes and hippos' },
                    { title: 'Adventure Parks', desc: 'Water parks and go-karting nearby' }
                ],
                activities: ['Swimming', 'Beach Sports', 'Wildlife Tours', 'Water Parks', 'Shopping', 'Nightlife'] },
            { id: 'b6', name: 'Mombasa Beach', badge: 'Coastal', description: 'Historic port city with Swahili culture and ocean breeze.', image: 'images/beaches/mombasa.jpg', link: 'beaches/mombasa.html',
                hero: 'images/beaches/mombasa.jpg', bestTime: 'December - April', overview: "Kenya's second-largest city and coastal capital, blending historic Portuguese architecture with modern beach resorts. Home to Fort Jesus, bustling markets, and beautiful Indian Ocean beaches.",
                highlights: [
                    { title: 'Fort Jesus', desc: 'UNESCO World Heritage 16th century fortress' },
                    { title: 'Old Town', desc: 'Arab and European architectural blend' },
                    { title: 'Spice Markets', desc: 'Colorful markets with exotic fragrances' },
                    { title: 'Coastal Cuisine', desc: 'Fresh seafood and Swahili dishes' }
                ],
                activities: ['Historical Tours', 'Market Visits', 'Snorkeling', 'Diving', 'City Tours', 'Cultural Shows'] },
            { id: 'b7', name: 'Diani South', badge: 'Quiet', description: 'Secluded southern stretch of Diani with private coves.', image: 'images/beaches/diani-hero.jpg', link: 'beaches/diani.html',
                hero: 'images/beaches/diani-hero.jpg', bestTime: 'December - April', overview: 'The quieter, more secluded southern stretch of Diani Beach offering private coves, boutique resorts, and uncrowded stretches of pristine white sand.',
                highlights: [
                    { title: 'Seclusion', desc: 'Less crowded than central Diani' },
                    { title: 'Private Coves', desc: 'Intimate beaches hidden from main resort areas' },
                    { title: 'Boutique Stays', desc: 'Intimate eco-lodges and villas' },
                    { title: 'Nature Walks', desc: 'Coastal forests with Colobus monkeys' }
                ],
                activities: ['Beach Walks', 'Nature Treks', 'Kayaking', 'Sunset Viewing', 'Yoga', 'Meditation'] },
            { id: 'b8', name: 'Watamu Bay', badge: 'Snorkeling', description: 'Crystal clear waters and vibrant coral gardens.', image: 'images/beaches/watamu-hero.jpg', link: 'beaches/watamu.html',
                hero: 'images/beaches/watamu-hero.jpg', bestTime: 'October - March', overview: 'Crystal clear waters and vibrant coral gardens in the heart of Watamu Marine National Park. Known for its exceptional visibility and diverse marine life.',
                highlights: [
                    { title: 'Coral Gardens', desc: 'Protected reef with colorful formations' },
                    { title: 'Clear Waters', desc: 'Up to 30m visibility for snorkeling' },
                    { title: 'Diving Sites', desc: 'PADI certified dive centers available' },
                    { title: 'Turtle Waves', desc: 'Regular turtle sightings in season' }
                ],
                activities: ['Snorkeling', 'Scuba Diving', 'Glass Bottom Boats', 'Turtle Watching', 'Island Picnics', 'Fishing'] }
        ],
        hotels: [
            { id: 'h1', name: "Governors' Camp", badge: 'Luxury', description: 'Exceptional Big Five viewing in Maasai Mara.', location: 'Maasai Mara', image: 'images/hotels/governors-camp.jpg', link: 'hotels/luxury/maasai-mara-lodge.html' },
            { id: 'h2', name: 'Tortilis Camp', badge: 'Luxury', description: 'Stunning Kilimanjaro views in Amboseli.', location: 'Amboseli', image: 'images/hotels/tortilis-camp.jpg', link: 'hotels/luxury/amboseli-lodge.html' },
            { id: 'h3', name: 'Kicheche Laikipia', badge: 'Mid-Range', description: 'Excellent wildlife viewing and Maasai cultural experiences.', location: 'Laikipia', image: 'images/hotels/kicheche-lodge.jpg', link: 'hotels/mid-range/kicheche-laikipia.html' },
            { id: 'h4', name: 'Diani Beach Villa', badge: 'Luxury', description: 'Oceanfront luxury with private beach access.', location: 'Diani', image: 'images/hotels/diani-beach-villa.jpg', link: 'hotels/luxury/diani-resort.html' },
            { id: 'h5', name: 'Tsavo River Lodge', badge: 'Mid-Range', description: 'Riverside safari lodge in Tsavo wilderness.', location: 'Tsavo', image: 'images/hotels/tsavo-lodge.jpg', link: 'hotels/mid-range/tsavo-river-lodge.html' },
            { id: 'h6', name: 'Diani Luxury Resort', badge: 'Premium', description: 'Five-star beachfront resort with infinity pool.', location: 'Diani', image: 'images/hotels/diani-luxury-resort.jpg', link: 'hotels/luxury/diani-resort.html' },
            { id: 'h7', name: 'Diani Boutique Hotel', badge: 'Boutique', description: 'Intimate coastal retreat with personalized service.', location: 'Diani', image: 'images/hotels/diani-boutique-hotel.jpg', link: 'hotels/mid-range/kicheche-laikipia.html' },
            { id: 'h8', name: 'Mara Budget Camp', badge: 'Budget', description: 'Affordable safari experience without compromising adventure.', location: 'Maasai Mara', image: 'images/hotels/budget-camp.jpg', link: 'hotels/eco-budget/mara-budget-camp.html' }
        ],
        experiences: [
            { id: 'e1', name: 'Hot Air Balloon Safari', badge: 'Aerial', description: 'Drift over the Mara at dawn, spotting wildlife from above.', image: 'images/experiences/hot-air-balloon.jpg', link: 'experiences/hot-air-balloon.html' },
            { id: 'e2', name: 'Maasai Cultural Village', badge: 'Cultural', description: 'Learn about Maasai rituals, crafts, and way of life.', image: 'images/experiences/maasai-village.jpg', link: 'experiences/maasai-village.html' },
            { id: 'e3', name: 'Camel Safari', badge: 'Adventure', description: 'Traverse semi-arid landscapes on camelback.', image: 'images/experiences/camel-safari.jpg', link: 'experiences/camel-safari.html' },
            { id: 'e4', name: 'Kenyan Cooking Class', badge: 'Culinary', description: 'Learn to prepare authentic Swahili dishes.', image: 'images/experiences/cooking-class.jpg', link: 'experiences/cooking-class.html' },
            { id: 'e5', name: 'Photo Workshop', badge: 'Creative', description: 'Master wildlife photography with pro guides.', image: 'images/experiences/photo-workshop.jpg', link: 'experiences/photo-workshop.html' },
            { id: 'e6', name: 'Migration Balloon Ride', badge: 'Premium', description: 'Fly over the great migration river crossings.', image: 'images/experiences/migration-balloon.jpg', link: 'experiences/migration-balloon.html' },
            { id: 'e7', name: 'Sunset Bush Walk', badge: 'Walking', description: 'Guided walk through the savanna as the sun sets.', image: 'images/experiences/camel-safari.jpg', link: 'experiences/camel-safari.html' },
            { id: 'e8', name: 'Night Game Drive', badge: 'Nocturnal', description: 'Spot leopards and hyenas under the African stars.', image: 'images/experiences/hot-air-balloon.jpg', link: 'experiences/hot-air-balloon.html' }
        ]
    };

    var ListingsService = {
        getByCategory: function (category) {
            if (window.MutsAPIConfig && window.MutsAPIConfig.isConnected()) {
                return this.fetchFromAPI('/listings/' + category);
            }
            var items = mockData[category] || [];
            return Promise.resolve(items.slice(0, 8));
        },

        getById: function (category, id) {
            if (window.MutsAPIConfig && window.MutsAPIConfig.isConnected()) {
                return this.fetchFromAPI('/listings/' + category + '/' + id);
            }
            var items = mockData[category] || [];
            for (var i = 0; i < items.length; i++) {
                if (items[i].id === id) {
                    return Promise.resolve(items[i]);
                }
            }
            return Promise.resolve(null);
        },

        getBeachByName: function (name) {
            if (window.MutsAPIConfig && window.MutsAPIConfig.isConnected()) {
                return this.fetchFromAPI('/listings/beaches?name=' + encodeURIComponent(name));
            }
            var beaches = mockData.beaches || [];
            var slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
            for (var i = 0; i < beaches.length; i++) {
                var beachName = beaches[i].name.toLowerCase().replace(/[^a-z0-9]/g, '-');
                if (beachName === slug || (beaches[i].link && beaches[i].link.indexOf(slug + '.html') !== -1)) {
                    return Promise.resolve(beaches[i]);
                }
            }
            return Promise.resolve(null);
        },

        getPackageByName: function (name) {
            if (window.MutsAPIConfig && window.MutsAPIConfig.isConnected()) {
                return this.fetchFromAPI('/listings/packages?name=' + encodeURIComponent(name));
            }
            var packages = mockData.packages || [];
            var slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
            for (var i = 0; i < packages.length; i++) {
                var pkgName = packages[i].name.toLowerCase().replace(/[^a-z0-9]/g, '-');
                if (pkgName === slug || (packages[i].link && packages[i].link.indexOf(slug + '.html') !== -1)) {
                    return Promise.resolve(packages[i]);
                }
            }
            return Promise.resolve(null);
        },

        getAll: function () {
            if (window.MutsAPIConfig && window.MutsAPIConfig.isConnected()) {
                return this.fetchFromAPI('/listings');
            }
            return Promise.resolve(JSON.parse(JSON.stringify(mockData)));
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
                console.warn('[ListingsService] API unavailable, using mock data:', err.message);
                if (endpoint.indexOf('tours') !== -1) return mockData.tours;
                if (endpoint.indexOf('packages') !== -1) return mockData.packages;
                if (endpoint.indexOf('beaches') !== -1) return mockData.beaches;
                if (endpoint.indexOf('hotels') !== -1) return mockData.hotels;
                if (endpoint.indexOf('experiences') !== -1) return mockData.experiences;
                return mockData;
            });
            
            var timeoutPromise = new Promise(function(_, reject) {
                setTimeout(function() { reject(new Error('Request timeout')); }, timeout);
            });
            
            return Promise.race([fetchPromise, timeoutPromise]).catch(function() {
                return mockData;
            });
        },

        enableAPI: function () {
            API_READY = true;
            console.log('[ListingsService] API mode enabled');
        },

        disableAPI: function () {
            API_READY = false;
            console.log('[ListingsService] API mode disabled');
        },

        isAPILive: function () {
            return window.MutsAPIConfig && window.MutsAPIConfig.isConnected();
        }
    };

    window.MutsListingsService = ListingsService;
})(window);

// ES6 module export (for bundlers)
export default window.listingsService || window.listingsService;
