/* Muts Safaris — Map Configuration */
/* Replace YOUR_API_KEY with your Google Maps API key */
/* Get a free key at: https://console.cloud.google.com/ */
var MUTS_MAP_CONFIG = {
    apiKey: 'YOUR_API_KEY',
    center: { lat: -1.29, lng: 36.82 },
    zoom: 6,
    style: [
        { elementType: 'geometry', stylers: [{ color: '#1a1a2e' }] },
        { elementType: 'labels.text.stroke', stylers: [{ color: '#0a0a1a' }] },
        { elementType: 'labels.text.fill', stylers: [{ color: '#555245' }] },
        { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0a0a1a' }] },
        { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#555245' }] },
        { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1e1e3a' }] },
        { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#2a2a4a' }] },
        { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#555245' }] },
        { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#12122a' }] },
        { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#555245' }] },
        { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#12122a' }] },
        { featureType: 'landscape', elementType: 'geometry', stylers: [{ color: '#12122a' }] },
        { featureType: 'landscape.natural', elementType: 'geometry', stylers: [{ color: '#0f0f2a' }] },
        { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: '#333366' }] }
    ],
    markers: [
        { lat: -1.5, lng: 35.1, name: 'Maasai Mara', type: 'park', desc: 'Home of the Great Migration', link: 'tours/maasai-mara.html' },
        { lat: -2.65, lng: 37.26, name: 'Amboseli', type: 'park', desc: 'Elephants with Kilimanjaro views', link: 'tours/amboseli.html' },
        { lat: -2.95, lng: 38.75, name: 'Tsavo East', type: 'park', desc: 'Red elephants and vast wilderness', link: 'tours/tsavo.html' },
        { lat: -2.95, lng: 38.0, name: 'Tsavo West', type: 'park', desc: 'Volcanic landscapes and Mzima Springs', link: 'tours/tsavo.html' },
        { lat: 0.6, lng: 37.5, name: 'Samburu', type: 'park', desc: 'Unique northern species', link: 'tours/samburu.html' },
        { lat: -1.32, lng: 36.85, name: 'Nairobi National Park', type: 'park', desc: 'Urban safari, 7km from CBD', link: 'tours/nairobi-np.html' },
        { lat: -0.37, lng: 36.08, name: 'Lake Nakuru', type: 'park', desc: 'Millions of flamingos', link: 'tours/lake-nakuru.html' },
        { lat: -0.9, lng: 36.35, name: "Hell's Gate", type: 'park', desc: 'Walk and cycle among wildlife', link: 'tours/hells-gate.html' },
        { lat: -0.15, lng: 37.3, name: 'Mount Kenya', type: 'park', desc: "Africa's second-highest peak", link: 'tours/mount-kenya.html' },
        { lat: -4.3, lng: 39.59, name: 'Diani Beach', type: 'beach', desc: '20km white sand paradise', link: 'beaches/diani.html' },
        { lat: -3.35, lng: 40.02, name: 'Watamu', type: 'beach', desc: 'Marine conservation haven', link: 'beaches/watamu.html' },
        { lat: -2.27, lng: 40.9, name: 'Lamu Island', type: 'beach', desc: 'UNESCO car-free island', link: 'beaches/lamu.html' },
        { lat: -3.22, lng: 40.12, name: 'Malindi', type: 'beach', desc: 'Portuguese history meets beaches', link: 'beaches/malindi.html' },
        { lat: -4.05, lng: 39.67, name: 'Mombasa', type: 'beach', desc: 'Fort Jesus and spice markets', link: 'beaches/mombasa.html' },
        { lat: -4.03, lng: 39.7, name: 'Nyali Beach', type: 'beach', desc: 'Family-friendly Mombasa beach', link: 'beaches/nyali.html' },
        { lat: -1.4, lng: 35.13, name: "Governors' Camp", type: 'hotel', desc: '$1,200/night - Maasai Mara', link: 'hotels/luxury/maasai-mara-lodge.html' },
        { lat: -2.64, lng: 37.25, name: 'Tortilis Camp', type: 'hotel', desc: '$950/night - Amboseli', link: 'hotels/luxury/amboseli-lodge.html' },
        { lat: -1.28, lng: 36.82, name: 'The Norfolk Hotel', type: 'hotel', desc: '$400/night - Nairobi', link: 'hotels/luxury/norfolk-hotel.html' },
        { lat: 0.58, lng: 37.52, name: 'Samburu Sanctuary', type: 'hotel', desc: '$780/night - Samburu', link: 'hotels/luxury/samburu-lodge.html' },
        { lat: -4.31, lng: 39.59, name: 'Diani Beach Resort', type: 'hotel', desc: '$520/night - Diani', link: 'hotels/luxury/diani-resort.html' },
        { lat: 0.45, lng: 37.15, name: 'Laikipia', type: 'attraction', desc: 'Conservation plateau', link: 'tours/samburu.html' },
        { lat: 0.25, lng: 36.1, name: 'Lake Bogoria', type: 'attraction', desc: 'Hot springs and flamingos', link: 'tours/lake-nakuru.html' },
        { lat: -3.33, lng: 39.98, name: 'Gede Ruins', type: 'attraction', desc: '13th-century Swahili city', link: 'beaches/watamu.html' },
        { lat: -3.35, lng: 40.0, name: 'Mida Creek', type: 'attraction', desc: 'Mangrove kayaking', link: 'beaches/watamu.html' },
        { lat: -1.29, lng: 36.82, name: 'Nairobi', type: 'attraction', desc: 'Starting point for all safaris', link: 'index.html' }
    ]
};
