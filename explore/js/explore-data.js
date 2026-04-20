(function() {
    const CDN = 'https://images.mutssafaris.com';
    const API_BASE = '/api';

    function getImageUrl(path) {
        if (!path) return 'https://images.mutssafaris.com/placeholder.jpg';
        if (path.startsWith('http')) return path;
        return CDN + '/' + path;
    }

    function createCard(item, type) {
        const image = item.image || item.thumbnail || item.coverImage || '';
        const title = item.name || item.title || 'Untitled';
        const desc = item.description || item.shortDescription || item.excerpt || '';
        const price = item.price || item.amount || item.totalPrice || '';
        const id = item.id || '';

        let linkText = 'View Details →';
        let onClick = '';
        
        if (type === 'destination') {
            linkText = 'Explore →';
            onClick = 'redirectToLogin()';
        } else if (type === 'package') {
            linkText = 'View Package →';
            onClick = 'redirectToLogin()';
        } else if (type === 'africasa') {
            linkText = 'View Item →';
            onClick = 'redirectToLogin()';
        } else if (type === 'blog') {
            linkText = 'Read More →';
            onClick = 'redirectToLogin()';
        }

        return `
            <div class="explore-card">
                <img src="${getImageUrl(image)}" alt="${title}" class="explore-card-image" loading="lazy">
                <div class="explore-card-content">
                    <h3 class="explore-card-title">${title}</h3>
                    <p class="explore-card-desc">${desc.substring(0, 100)}${desc.length > 100 ? '...' : ''}</p>
                    <div class="explore-card-meta">
                        ${price ? `<span class="explore-card-price">$${price}</span>` : '<span></span>'}
                        <span class="explore-card-link" onclick="${onClick}">${linkText}</span>
                    </div>
                </div>
            </div>
        `;
    }

    function loadDestinations() {
        const container = document.getElementById('destination-cards');
        if (!container) return;

        fetch(API_BASE + '/destinations')
            .then(res => res.json())
            .then(response => {
                if (response.success && response.data) {
                    const items = response.data.slice(0, 4);
                    container.innerHTML = items.map(item => createCard(item, 'destination')).join('');
                } else {
                    loadFallbackDestinations(container);
                }
            })
            .catch(() => loadFallbackDestinations(container));
    }

    function loadFallbackDestinations(container) {
        const fallback = [
            { id: 1, name: 'Maasai Mara', description: 'Witness the Great Migration and experience ultimate wildlife', image: 'destinations/maasai-mara.jpg', price: 'From $2,500' },
            { id: 2, name: 'Amboseli', description: 'Elephant kingdom with Mount Kilimanjaro views', image: 'destinations/amboseli.jpg', price: 'From $1,800' },
            { id: 3, name: 'Tsavo East & West', description: 'The land of red elephants and vast wilderness', image: 'destinations/tsavo.jpg', price: 'From $1,200' },
            { id: 4, name: 'Samburu', description: 'Unique wildlife in Kenya\'s northern frontier', image: 'destinations/samburu.jpg', price: 'From $1,500' }
        ];
        container.innerHTML = fallback.map(item => createCard(item, 'destination')).join('');
    }

    function loadPackages() {
        const container = document.getElementById('package-cards');
        if (!container) return;

        fetch(API_BASE + '/packages')
            .then(res => res.json())
            .then(response => {
                if (response.success && response.data) {
                    const items = response.data.slice(0, 4);
                    container.innerHTML = items.map(item => createCard(item, 'package')).join('');
                } else {
                    loadFallbackPackages(container);
                }
            })
            .catch(() => loadFallbackPackages(container));
    }

    function loadFallbackPackages(container) {
        const fallback = [
            { id: 1, name: 'Classic Safari', description: '5 days exploring the best of Kenya\'s parks', price: '2,500' },
            { id: 2, name: 'Luxury Escape', description: '7 days of premium lodges and exclusive experiences', price: '5,000' },
            { id: 3, name: 'Family Adventure', description: '6 days perfect for the whole family', price: '3,200' },
            { id: 4, name: 'Honeymoon Special', description: 'Romantic getaway in luxury camps', price: '4,500' }
        ];
        container.innerHTML = fallback.map(item => createCard(item, 'package')).join('');
    }

    function loadAfricasa() {
        const container = document.getElementById('africasa-cards');
        if (!container) return;

        fetch(API_BASE + '/listings')
            .then(res => res.json())
            .then(response => {
                if (response.success && response.data) {
                    const items = response.data.slice(0, 4);
                    container.innerHTML = items.map(item => createCard(item, 'africasa')).join('');
                } else {
                    loadFallbackAfricasa(container);
                }
            })
            .catch(() => loadFallbackAfricasa(container));
    }

    function loadFallbackAfricasa(container) {
        const fallback = [
            { id: 1, name: 'Maasai Beads', description: 'Handcrafted traditional jewelry', price: '45' },
            { id: 2, name: 'Wooden Carvings', description: 'Artisan carved sculptures', price: '120' },
            { id: 3, name: 'Kikoi Fabric', description: 'Traditional Kenyan shawl', price: '35' },
            { id: 4, name: 'Safari Hat', description: 'Handwoven straw hat', price: '55' }
        ];
        container.innerHTML = fallback.map(item => createCard(item, 'africasa')).join('');
    }

    function loadGallery() {
        const container = document.getElementById('gallery-preview');
        if (!container) return;

        fetch(API_BASE + '/gallery')
            .then(res => res.json())
            .then(response => {
                if (response.success && response.data) {
                    const items = response.data.slice(0, 4);
                    container.innerHTML = items.map(item => 
                        `<img src="${getImageUrl(item.image || item.url)}" alt="Gallery image" loading="lazy">`
                    ).join('');
                } else {
                    loadFallbackGallery(container);
                }
            })
            .catch(() => loadFallbackGallery(container));
    }

    function loadFallbackGallery(container) {
        const fallback = [
            'https://images.mutssafaris.com/gallery/wildlife/lion.jpg',
            'https://images.mutssafaris.com/gallery/landscapes/sunset.jpg',
            'https://images.mutssafaris.com/gallery/wildlife/elephant.jpg',
            'https://images.mutssafaris.com/gallery/accommodations/camp.jpg'
        ];
        container.innerHTML = fallback.map(src => 
            `<img src="${src}" alt="Gallery image" loading="lazy">`
        ).join('');
    }

    function loadBlog() {
        const container = document.getElementById('blog-cards');
        if (!container) return;

        fetch(API_BASE + '/blogs')
            .then(res => res.json())
            .then(response => {
                if (response.success && response.data) {
                    const items = response.data.slice(0, 4);
                    container.innerHTML = items.map(item => createCard(item, 'blog')).join('');
                } else {
                    loadFallbackBlog(container);
                }
            })
            .catch(() => loadFallbackBlog(container));
    }

    function loadFallbackBlog(container) {
        const fallback = [
            { id: 1, title: 'Best Time to Visit Kenya', description: 'A complete guide to planning your safari timing', image: 'blog/best-time.jpg' },
            { id: 2, title: 'Great Migration Guide', description: 'Everything you need to know about this natural wonder', image: 'blog/migration.jpg' },
            { id: 3, title: 'Family Safari Tips', description: 'How to make the most of your family adventure', image: 'blog/family.jpg' },
            { id: 4, title: 'Maasai Culture', description: 'Understanding the traditions of Kenya\'s indigenous people', image: 'blog/culture.jpg' }
        ];
        container.innerHTML = fallback.map(item => createCard(item, 'blog')).join('');
    }

    document.addEventListener('DOMContentLoaded', function() {
        loadDestinations();
        loadPackages();
        loadAfricasa();
        loadGallery();
        loadBlog();
    });
})();
