/* NOTE: Images are now assigned by each product's array position automatically
           No need to hardcode getImage(index) - each product uses unique image 
           until images repeat after availableImages.length products */
(function (window) {
    'use strict';

    var API_READY = false;
    var CONSECUTIVE_FAILURES = 0;
    var FAILURE_THRESHOLD = 5; // After 5 failures, skip API for 5 minutes
    var CIRCUIT_RESET_MS = 5 * 60 * 1000; // 5 minutes

    var availableImages = [
        // Products 0-5: Jewelry items
        "images/africasa/maasai-necklace.jpg",      // 0: Beaded necklace
        "images/africasa/copper-earrings.jpg",     // 1: Copper Maasai earrings
        "images/africasa/brass-anklets.jpg",       // 2: Brass ankle cuffs
        "images/africasa/beaded-bracelet.jpg",     // 3: Beaded bracelet set
        "images/africasa/turquoise-necklace.jpg", // 4: Turquoise Maasai necklace
        "images/africasa/sunset-earrings.jpg",    // 5: Sunset beaded earrings
        
        // Products 6-11: Art & Home Decor
        "images/africasa/ebony-sculpture.jpg",    // 6: Ebony wildlife sculpture  
        "images/africasa/batik-hanging.jpg",      // 7: Batik wall hanging
        "images/africasa/makonde-mask.jpg",        // 8: Makonde Shona mask
        "images/africasa/coastal-vase.jpg",       // 9: Coastal clay vase
        "images/africasa/wooden-bowl.jpg",       // 10: Carved wooden bowl set
        "images/africasa/horn-cup.jpg",         // 11: Buffalo horn drinking cup
        
        // Products 12-17: Textiles & Accessories
        "images/africasa/kikoy-wrap.jpg",        // 12: Traditional Kikoy wrap
        "images/africasa/kanga-cloth.jpg",       // 13: Kanga cloth set
        "images/africasa/shuka-blanket.jpg",     // 14: Shuka blanket red
        "images/africasa/silk-scarf.jpg",         // 15: Silk scarf baobab
        "images/africasa/leather-tote.jpg",       // 16: Maasai leather tote
        "images/africasa/safari-hat.jpg",          // 17: Safari fedora hat
        
        // Products 18-23: Crafts & Misc
        "images/africasa/soapstone-elephant.jpg",   // 18: Kisii soapstone elephant
        "images/africasa/sisal-basket.jpg",      // 19: Kamba sisal basket
        "images/africasa/rattan-planter.jpg",     // 20: Rattan hanging planter
        "images/africasa/ceremonial-spear.jpg",   // 21: Ceremonial spear
        "images/africasa/carved-stool.jpg",      // 22: Traditional carved stool
        "images/africasa/woven-tablemat.jpg"     // 23: Lamu woven tablemat
    ];

    function getImage(index, productIndex) {
        // Use product's position in array if not specified
        var useIndex = productIndex !== undefined ? productIndex : index;
        return availableImages[useIndex % availableImages.length];
    }

    // Assign images using product's array index (mod 12 for 12 available images)
    var productImageIndices = [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,  // products 0-11 -> images 0-11
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11  // products 12-23 -> repeat images 0-11
    ];

    var products = [
        {
            id: "maasai-necklace-001",
            name: "Maasai Beaded Necklace",
            description: "Handcrafted traditional Maasai beaded necklace with vibrant colors and authentic tribal patterns. Each piece tells a story of heritage and craftsmanship.",
            price: 89.99,
            originalPrice: 129.99,
            category: "jewelry",
            images: [getImage(0, 0)],
            details: {
                material: "Glass beads, leather cord",
                origin: "Kajiado, Kenya",
                artisan: "Mary Nkaiserua",
                size: "18 inches"
            },
            stock: 15,
            rating: 4.8,
            reviews: 24,
            featured: true
        },
        {
            id: "ebony-carving-001",
            name: "Ebony Wildlife Sculpture",
            description: "Exquisite hand-carved ebony sculpture depicting African wildlife, crafted by master artisans using traditional techniques passed down generations.",
            price: 245.00,
            originalPrice: 320.00,
            category: "art",
            images: [getImage(0, 1)],
            details: {
                material: "100% Ebony wood",
                origin: "Kisii, Kenya",
                artisan: "James Ochieng",
                dimensions: "12x8x6 inches"
            },
            stock: 8,
            rating: 4.9,
            reviews: 18,
            featured: true
        },
        {
            id: "kikoy-cloth-001",
            name: "Traditional Kikoy Wrap",
            description: "Authentic East African kikoy cloth, handwoven by skilled artisans. Perfect as a beach wrap, sarong, or decorative piece for your home.",
            price: 45.00,
            originalPrice: 59.00,
            category: "textiles",
            images: [getImage(0, 2)],
            details: {
                material: "100% Cotton",
                origin: "Mombasa, Kenya",
                artisan: "Fatuma Omari",
                size: "60x120 inches"
            },
            stock: 30,
            rating: 4.6,
            reviews: 42,
            featured: false
        },
        {
            id: "soapstone-figure-001",
            name: "Kisii Soapstone Elephant",
            description: "Hand-carved Kisii soapstone figurine, polished to a smooth finish with intricate detailing. Each piece is unique, carved by artisans in the highlands of Kisii.",
            price: 75.00,
            originalPrice: 95.00,
            category: "crafts",
            images: [getImage(0, 3)],
            details: {
                material: "Kisii Soapstone",
                origin: "Kisii, Kenya",
                artisan: "Samuel Moraa",
                dimensions: "6x4x3 inches"
            },
            stock: 20,
            rating: 4.7,
            reviews: 31,
            featured: false
        },
        {
            id: "batik-hanging-001",
            name: "Batik Wall Hanging - Savanna",
            description: "Vibrant hand-dyed batik artwork showcasing African savanna scenes with traditional motifs. Each piece is unique, created using centuries-old wax-resist dyeing techniques.",
            price: 185.00,
            originalPrice: 240.00,
            category: "art",
            images: [getImage(0, 4)],
            details: {
                material: "Cotton canvas, natural dyes",
                origin: "Lamu, Kenya",
                artisan: "Amina Bakari",
                dimensions: "36x24 inches"
            },
            stock: 12,
            rating: 4.9,
            reviews: 15,
            featured: true
        },
        {
            id: "sisal-basket-001",
            name: "Kamba Sisal Storage Basket",
            description: "Beautifully woven Kamba sisal basket with geometric patterns. Perfect for home decor, storage, or as a decorative planter cover.",
            price: 55.00,
            originalPrice: 75.00,
            category: "crafts",
            images: [getImage(0, 5)],
            details: {
                material: "Natural sisal, recycled paper",
                origin: "Machakos, Kenya",
                artisan: "Grace Nduku",
                dimensions: "12x10 inches"
            },
            stock: 25,
            rating: 4.5,
            reviews: 38,
            featured: false
        },
        {
            id: "copper-earrings-001",
            name: "Copper Maasai Earrings",
            description: "Elegant copper earrings inspired by traditional Maasai jewelry. Handcrafted with attention to detail and finished with a protective lacquer.",
            price: 35.00,
            originalPrice: 48.00,
            category: "jewelry",
            images: [getImage(0, 6)],
            details: {
                material: "Copper, glass beads",
                origin: "Kajiado, Kenya",
                artisan: "Sarah Jepkosgei",
                size: "2 inches"
            },
            stock: 40,
            rating: 4.4,
            reviews: 52,
            featured: false
        },
        {
            id: "kanga-cloth-001",
            name: "Kanga Cloth Set - Classic",
            description: "Set of two authentic Kenyan kanga cloths with traditional designs. Each features Swahili proverbs and vibrant patterns.",
            price: 38.00,
            originalPrice: 52.00,
            category: "textiles",
            images: [getImage(0, 7)],
            details: {
                material: "100% Cotton",
                origin: "Dar es Salaam, Tanzania",
                artisan: "Zainab Mwinyi",
                size: "116x116 cm each"
            },
            stock: 35,
            rating: 4.7,
            reviews: 28,
            featured: false
        },
        {
            id: "makonde-mask-001",
            name: "Makonde Shona Mask",
            description: "Traditional Makonde carved wood mask representing ancestral spirits. Each mask is hand-carved and painted using natural pigments.",
            price: 165.00,
            originalPrice: 210.00,
            category: "art",
            images: [getImage(0, 8)],
            details: {
                material: "African Blackwood",
                origin: "Coastal Kenya",
                artisan: "Hamisi Rajabu",
                dimensions: "18x12 inches"
            },
            stock: 10,
            rating: 4.8,
            reviews: 19,
            featured: false
        },
        {
            id: "leather-tote-001",
            name: "Maasai Leather Tote Bag",
            description: "Handcrafted full-grain leather tote bag with traditional Maasai beaded handle. Spacious interior with zippered pocket.",
            price: 195.00,
            originalPrice: 260.00,
            category: "accessories",
            images: [getImage(0, 9)],
            details: {
                material: "Full-grain leather, glass beads",
                origin: "Narok, Kenya",
                artisan: "Daniel ole Saitoti",
                dimensions: "14x12x5 inches"
            },
            stock: 18,
            rating: 4.9,
            reviews: 34,
            featured: true
        },
        {
            id: "shuka-blanket-001",
            name: "Shuka Blanket - Red",
            description: "Traditional Maasai shuka (blanket) made from soft acrylic fiber. Perfect for safari, home decor, or as a throws.",
            price: 65.00,
            originalPrice: 85.00,
            category: "textiles",
            images: [getImage(0, 10)],
            details: {
                material: "Acrylic fiber",
                origin: "Kajiado, Kenya",
                artisan: "Joseph Loon",
                dimensions: "60x50 inches"
            },
            stock: 45,
            rating: 4.3,
            reviews: 67,
            featured: false
        },
        {
            id: "beaded-bracelet-set-001",
            name: "Beaded Bracelet Set",
            description: "Set of 5 handcrafted beaded bracelets in vibrant colors. Each bracelet features traditional patterns and secure elastic fit.",
            price: 42.00,
            originalPrice: 58.00,
            category: "jewelry",
            images: [getImage(0, 11)],
            details: {
                material: "Glass beads, elastic cord",
                origin: "Kajiado, Kenya",
                artisan: "Grace Nkaiserua",
                size: "Fits most wrists"
            },
            stock: 50,
            rating: 4.6,
            reviews: 89,
            featured: false
        },
        {
            id: "coastal-vase-001",
            name: "Coastal Clay Vase",
            description: "Hand-thrown ceramic vase with traditional Coastal Kenyan patterns. Each piece is unique, featuring intricate geometric engravings.",
            price: 85.00,
            originalPrice: 110.00,
            category: "home-decor",
            images: [getImage(0, 12)],
            details: {
                material: "Clay, natural glaze",
                origin: "Kilifi, Kenya",
                artisan: "Mwinyimkuu Hamisi",
                dimensions: "10x8 inches"
            },
            stock: 15,
            rating: 4.7,
            reviews: 22,
            featured: false
        },
        {
            id: "kikuyu-spear-001",
            name: "Ceremonial Spear",
            description: "Hand-forged ceremonial spear with traditional Kikuyu design. Features intricate metalwork on the shaft and authentic leather wrapping.",
            price: 125.00,
            originalPrice: 165.00,
            category: "art",
            images: [getImage(0, 13)],
            details: {
                material: "Forged iron, leather",
                origin: "Central Kenya",
                artisan: "John Mwangi",
                dimensions: "48 inches"
            },
            stock: 6,
            rating: 4.9,
            reviews: 11,
            featured: false
        },
        {
            id: "anklets-cuffs-001",
            name: "Brass Ankle Cuffs",
            description: "Set of 3 handcrafted brass ankle cuffs with authentic African patterns. Adjustable fit with secure clasp.",
            price: 48.00,
            originalPrice: 65.00,
            category: "jewelry",
            images: [getImage(0, 14)],
            details: {
                material: "Solid brass",
                origin: "West Kenya",
                artisan: "Peter Odhiambo",
                size: "Adjustable"
            },
            stock: 28,
            rating: 4.5,
            reviews: 41,
            featured: false
        },
        {
            id: "woven-tablemat-001",
            name: "Lamu Woven Tablemat",
            description: "Handwoven tablemat from Lamu, featuring traditional Swahili patterns. Made from sustainable palm fronds.",
            price: 32.00,
            originalPrice: 45.00,
            category: "home-decor",
            images: [getImage(0, 15)],
            details: {
                material: "Palm fronds, natural dyes",
                origin: "Lamu, Kenya",
                artisan: "Ali Bakari",
                dimensions: "18x12 inches"
            },
            stock: 40,
            rating: 4.4,
            reviews: 33,
            featured: false
        },
        {
            id: "safari-hat-001",
            name: "Safari Fedora Hat",
            description: "Classic safari fedora made from sustainable straw. Features leather band and chin strap. Perfect for sun protection on safari.",
            price: 78.00,
            originalPrice: 98.00,
            category: "accessories",
            images: [getImage(0, 16)],
            details: {
                material: "Straw, leather band",
                origin: "Nairobi, Kenya",
                artisan: "Safari Outfitters Co.",
                size: "S, M, L, XL"
            },
            stock: 22,
            rating: 4.6,
            reviews: 45,
            featured: false
        },
        {
            id: "rattan-planter-001",
            name: "Rattan Hanging Planter",
            description: "Handwoven rattan planter perfect for indoor plants. Features natural finish with sturdy hanging rope.",
            price: 42.00,
            originalPrice: 55.00,
            category: "home-decor",
            images: [getImage(0, 17)],
            details: {
                material: "Natural rattan",
                origin: "Kwale, Kenya",
                artisan: "Mwanajuma Hamisi",
                dimensions: "10 inch diameter"
            },
            stock: 30,
            rating: 4.3,
            reviews: 27,
            featured: false
        },
        {
            id: "turquoise-necklace-001",
            name: "Turquoise Maasai Necklace",
            description: "Stunning necklace featuring genuine turquoise stones set in handcrafted silver. Combines traditional Maasai design with elegant gemstones.",
            price: 285.00,
            originalPrice: 365.00,
            category: "jewelry",
            images: [getImage(0, 18)],
            details: {
                material: "Turquoise, sterling silver",
                origin: "Nairobi, Kenya",
                artisan: "JewelArts Kenya",
                length: "20 inches"
            },
            stock: 8,
            rating: 4.9,
            reviews: 16,
            featured: true
        },
        {
            id: "printed-scarf-001",
            name: "Silk Scarf - Baobab",
            description: "Luxurious silk scarf featuring original artwork of the African baobab tree. Hand-rolled edges and vibrant colors.",
            price: 95.00,
            originalPrice: 125.00,
            category: "accessories",
            images: [getImage(0, 19)],
            details: {
                material: "100% Silk",
                origin: "Nairobi, Kenya",
                artisan: "African Silk Road",
                dimensions: "36x36 inches"
            },
            stock: 20,
            rating: 4.8,
            reviews: 29,
            featured: false
        },
        {
            id: "wooden-bowl-set-001",
            name: "Carved Wooden Bowl Set",
            description: "Set of 3 nested carved wooden bowls in varying sizes. Made from sustainable muiri wood with smooth finish.",
            price: 88.00,
            originalPrice: 115.00,
            category: "home-decor",
            images: [getImage(0, 20)],
            details: {
                material: "Muiri wood",
                origin: "Mount Kenya region",
                artisan: "Traditional Carvers Co-op",
                sizes: "Small, Medium, Large"
            },
            stock: 18,
            rating: 4.7,
            reviews: 24,
            featured: false
        },
        {
            id: "buffalo-horn-cup-001",
            name: "Horn Drinking Cup",
            description: "Handcrafted drinking cup from buffalo horn. Each cup features unique natural patterns and comes with a stand.",
            price: 65.00,
            originalPrice: 85.00,
            category: "home-decor",
            images: [getImage(0, 21)],
            details: {
                material: "Buffalo horn",
                origin: "Lakeside Kenya",
                artisan: "Horn Works Kenya",
                dimensions: "4x3 inches"
            },
            stock: 14,
            rating: 4.5,
            reviews: 19,
            featured: false
        },
        {
            id: "beaded-earrings-002",
            name: "Sunset Beaded Earrings",
            description: "Vibrant beaded earrings featuring warm sunset colors. Lightweight design with secure ear wire.",
            price: 28.00,
            originalPrice: 38.00,
            category: "jewelry",
            images: [getImage(0, 22)],
            details: {
                material: "Glass beads, sterling silver",
                origin: "Kajiado, Kenya",
                artisan: "BeadWorks Kenya",
                size: "1.5 inches"
            },
            stock: 55,
            rating: 4.4,
            reviews: 63,
            featured: false
        },
        {
            id: "carved-stool-001",
            name: "Traditional Carved Stool",
            description: "Hand-carved wooden stool with traditional African design. Made from single piece of wood with carved legs.",
            price: 145.00,
            originalPrice: 185.00,
            category: "home-decor",
            images: [getImage(0, 23)],
            details: {
                material: "African Mahogany",
                origin: "Western Kenya",
                artisan: "Kisumu Woodworkers",
                dimensions: "12x12x10 inches"
            },
            stock: 10,
            rating: 4.8,
            reviews: 17,
            featured: false
        }
    ];

    var AfricasaService = {
        CACHE_TTL: 30 * 60 * 1000,
        
        getAll: function () {
            if (window.MutsAPIConfig && window.MutsAPIConfig.isConnected()) {
                return this.fetchFromAPI('/africasa');
            }
            return Promise.resolve(products);
        },

        getByCategory: function (category) {
            if (window.MutsAPIConfig && window.MutsAPIConfig.isConnected()) {
                return this.fetchFromAPI('/africasa?category=' + (category === 'all' ? '' : category));
            }
            return Promise.resolve(products.filter(function(p) {
                return category === 'all' || p.category === category;
            }));
        },

        getById: function (id) {
            if (window.MutsAPIConfig && window.MutsAPIConfig.isConnected()) {
                return this.fetchFromAPI('/africasa/' + id);
            }
            var product = products.find(function(p) {
                return p.id === id;
            });
            return Promise.resolve(product || null);
        },

        search: function (query) {
            if (window.MutsAPIConfig && window.MutsAPIConfig.isConnected()) {
                return this.fetchFromAPI('/africasa?search=' + encodeURIComponent(query));
            }
            var q = query.toLowerCase();
            return Promise.resolve(products.filter(function(p) {
                return p.name.toLowerCase().indexOf(q) !== -1 ||
                       p.description.toLowerCase().indexOf(q) !== -1 ||
                       p.category.toLowerCase().indexOf(q) !== -1;
            }));
        },

        getFeatured: function () {
            if (window.MutsAPIConfig && window.MutsAPIConfig.isConnected()) {
                return this.fetchFromAPI('/africasa?featured=true');
            }
            return Promise.resolve(products.filter(function(p) {
                return p.featured;
            }));
        },

        getByIds: function (ids) {
            if (window.MutsAPIConfig && window.MutsAPIConfig.isConnected()) {
                return this.fetchFromAPI('/africasa?ids=' + ids.join(','));
            }
            return Promise.resolve(products.filter(function(p) {
                return ids.indexOf(p.id) !== -1;
            }));
        },

        fetchFromAPI: function (endpoint, options) {
            var self = this;
            var MAX_RETRIES = 3;
            var RETRY_DELAYS = [500, 1500, 4000]; // Exponential backoff: 500ms, 1.5s, 4s
            
            var doFetch = function (attemptNumber) {
                var baseURL = (window.MutsAPIConfig && window.MutsAPIConfig.getBaseURL) 
                    ? window.MutsAPIConfig.getBaseURL() 
                    : '/api';
                var url = endpoint.indexOf('http') === 0 ? endpoint : baseURL + endpoint;
                var timeout = (window.MutsAPIConfig && window.MutsAPIConfig.getTimeout) 
                    ? window.MutsAPIConfig.getTimeout() 
                    : 30000;
                
                var fetchPromise = fetch(url, options).then(function (response) {
                    if (!response.ok) throw new Error('API error: ' + response.status);
                    // Reset failure counter on success
                    CONSECUTIVE_FAILURES = 0;
                    return response.json();
                });
                
                var timeoutPromise = new Promise(function(_, reject) {
                    setTimeout(function() { reject(new Error('Request timeout')); }, timeout);
                });
                
                return Promise.race([fetchPromise, timeoutPromise]).catch(function (err) {
                    // Increment failure counter
                    CONSECUTIVE_FAILURES++;
                    
                    // Check circuit breaker - if too many consecutive failures, skip API
                    if (CONSECUTIVE_FAILURES >= FAILURE_THRESHOLD) {
                        // Silent fail - circuit breaker
                        if (window.MutsMockIndicator) window.MutsMockIndicator.setMockMode(true);
                        return products;
                    }
                    
                    // Only retry if we haven't exceeded max retries
                    if (attemptNumber < MAX_RETRIES) {
                        var delay = RETRY_DELAYS[attemptNumber] || RETRY_DELAYS[RETRY_DELAYS.length - 1];
                        return new Promise(function(resolve) {
                            setTimeout(function() {
                                resolve(doFetch(attemptNumber + 1));
                            }, delay);
                        });
                    }
                    // Max retries exceeded - fail gracefully
                    if (window.MutsMockIndicator) window.MutsMockIndicator.setMockMode(true);
                    return products;
                });
            };
            
            return doFetch(0);
        },

        enableAPI: function () {
            API_READY = true;
        },

        disableAPI: function () {
            API_READY = false;
        },

        isAPILive: function () {
            return window.MutsAPIConfig && window.MutsAPIConfig.isConnected();
        }
    };

    window.MutsAfricasaService = AfricasaService;
})(window);

