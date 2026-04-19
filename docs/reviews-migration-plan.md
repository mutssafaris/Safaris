# Hotel Reviews Widget Migration Plan

## Overview
Migrate hotel detail pages from static/manual review implementations to unified reviews-widget.js

## Current State
- **19 hotel detail pages** with manual review implementations
- Static HTML review listings with hardcoded counts
- Manual JavaScript for rating/review submission
- Data stored in page-specific inline JS (var hotelId, var reviewCount, etc.)

## Target State
- Use unified `reviews-service.js` for data
- Use `reviews-widget.js` for UI
- Consistent with tour pages

## Migration Steps

### Phase 1: Extract Mock Data to reviews-service.js
Add hotel mock reviews using existing IDs from pages:

| Page | Hotel ID | Current Count |
|------|----------|---------------|
| laikipia-community-camp.html | h13 | 78 |
| amboseli-conservation-camp.html | h11 | 89 |
| tsavo-eco-lodge.html | h12 | 145 |
| mara-budget-camp.html | h4 | 312 |
| nakuru-eco-lodge.html | h10 | 112 |
| mombasa-budget-guesthouse.html | h20 | 89 |
| **Luxury** | | |
| maasai-mara-lodge.html | h1 | (see page) |
| amboseli-lodge.html | h2 | (see page) |
| kicheche-laikipia.html | h3 | (see page) |
| diani-resort.html | h5 | (see page) |
| tsavo-river-lodge.html | h6 | (see page) |
| samburu-lodge.html | h15 | (see page) |
| norfolk-hotel.html | h16 | (see page) |
| lake-nakuru-lodge.html | h17 | (see page) |
| samburu-serena.html | h18 | (see page) |
| mara-serena.html | h19 | (see page) |
| diani-resort.html | h5 | (see page) |
| matteos-italian-restaurant.html | h21 | (see page) |
| tsavo-lodge.html | h22 | (see page) |

### Phase 2: Update Each Hotel Page
Per hotel detail page:
1. Read existing review HTML and extract sample reviews
2. Add mock data to reviews-service.js (hotels: { hotelId: [...] })
3. Remove static review HTML (lines 46-84 in laikipia-community-camp.html)
4. Remove inline JS (lines 85-129)
5. Add widget container div
6. Add script includes and widget init call

### Phase 3: Migration Template
```html
<!-- Replace static reviews section with: -->
<div id="hotel-reviews-widget" class="reviews-widget" style="margin-top:3rem;padding-top:2rem;border-top:1px solid var(--border-glow);">
</div>

<!-- Replace inline JS with: -->
<script src="../../../js/services/reviews-service.js"></script>
<script src="../../../js/reviews-widget.js"></script>
<script>
    document.addEventListener('DOMContentLoaded', function() {
        var widgetContainer = document.getElementById('hotel-reviews-widget');
        if (widgetContainer && window.MutsReviewsWidget) {
            window.MutsReviewsWidget.init({
                itemType: 'hotels',
                itemId: 'h13',  // Update per hotel
                containerId: 'hotel-reviews-widget'
            });
        }
    });
</script>
```

### File Changes
- **Modify**: js/services/reviews-service.js - Add hotel mock data
- **Modify**: 19 hotel HTML files - Replace review sections

## Effort Estimate
- ~5 min per hotel page (extract data + update HTML)
- Total: ~1.5-2 hours for all 19 pages