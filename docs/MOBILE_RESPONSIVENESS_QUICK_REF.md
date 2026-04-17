# Mobile Responsiveness Quick Reference

## Breakpoints Used

| Breakpoint | Device Type | Use Case |
|------------|------------|----------|
| > 1024px | Desktop | Full layout, all features visible |
| 768px - 1024px | Desktop/Large Tablet | Reduced sidebar width (220px) |
| 640px - 768px | Tablet | Single-column stats, full-width inputs |
| < 640px | Mobile | Hidden sidebar, hamburger menu |
| < 480px | Small Phone | Optimized touch, minimal padding |

## Key CSS Classes for Responsiveness

### Mobile Menu (Added Automatically)
```html
<button class="mobile-menu-toggle" id="mobile-menu-toggle">
    <span></span><span></span><span></span>
</button>
<div class="sidebar-overlay" id="sidebar-overlay"></div>
```

**Script Required**: `<script src="../js/mobile-menu.js"></script>`

### Responsive Containers

#### Page Header
```html
<div class="page-header">
    <h1>Page Title</h1>
    <button class="btn btn-primary">Action</button>
</div>
```
- Stacks vertically on mobile (flex-direction: column)
- Buttons become full-width

#### Filter Bar
```html
<div class="filters-bar">
    <input type="text" class="search-input" placeholder="Search...">
    <select class="filter-select">...</select>
</div>
```
- Stacks vertically on mobile
- All inputs are 100% width
- Min height: 44px on mobile for touch

#### Data Table
```html
<div class="data-table-container">
    <table class="data-table">
        ...
    </table>
</div>
```
- Horizontally scrollable on mobile
- Touch-friendly scrolling (-webkit-overflow-scrolling: touch)
- Responsive font sizing

#### Stats Grid
```html
<div class="stats-grid">
    <div class="stat-card">...</div>
</div>
```
- 4 columns on desktop (auto-fit)
- 2 columns on tablet (768px)
- 1 column on mobile (640px)

### Modal Dialogs
```html
<div class="modal-overlay">
    <div class="modal">
        ...
    </div>
</div>
```
- Max 90% width on desktop
- 95vw width on mobile
- Max 85vh height on mobile

## Touch-Friendly Sizing

| Element | Size | Reasoning |
|---------|------|-----------|
| Touch target (button/link) | 44px min | iOS/Android standard |
| Input height | 44px on mobile | Easy to tap |
| Input font | 16px+ on mobile | Prevents iOS auto-zoom |
| Button padding | 10px+ on mobile | Adequate tap area |
| Gap between buttons | 8px+ | Reduces mis-taps |

## Font Sizing by Breakpoint

### Headings
| Level | Desktop | Tablet | Mobile |
|-------|---------|--------|--------|
| Page h1 | 1.8rem | 1.2rem | 1.1rem |
| Modal h2 | 1.3rem | 1rem | 1rem |
| Table th | 0.8rem | 0.7rem | 0.55rem |

### Body Text
| Element | Desktop | Tablet | Mobile |
|---------|---------|--------|--------|
| Nav item | 0.85rem | 0.85rem | 0.85rem |
| Stat card h3 | 0.75rem | 0.8rem | 0.7rem |
| Table td | 0.75rem | 0.7rem | 0.6rem |
| Button text | 0.9rem | 0.9rem | 0.75rem |

## Implementation Checklist

### For New Manager Pages
- [ ] Add `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
- [ ] Include `<script src="../js/mobile-menu.js"></script>` before `</body>`
- [ ] Use responsive container classes:
  - `class="page-header"` for header with title + button
  - `class="filters-bar"` for filter controls
  - `class="data-table-container"` for tables
  - `class="stats-grid"` for stat cards
- [ ] Ensure form inputs have min 44px height on mobile
- [ ] Test at 480px, 640px, 768px, 1024px viewpoints

### For Creating Responsive Layouts
```html
<!-- Page Header -->
<div class="page-header">
    <h1>Title</h1>
    <button class="btn btn-primary">Create</button>
</div>

<!-- Filters -->
<div class="filters-bar">
    <input class="search-input" placeholder="Search...">
    <select class="filter-select"><option>Filter</option></select>
</div>

<!-- Content -->
<div class="data-table-container">
    <table class="data-table">
        <!-- Table content -->
    </table>
</div>

<!-- Stats -->
<div class="stats-grid">
    <div class="stat-card">
        <h3>Metric</h3>
        <div class="value">123</div>
    </div>
</div>
```

## Common Mobile Issues & Solutions

### Issue: Table too wide on mobile
**Solution**: Already implemented
- Container has horizontal scroll
- Touch-friendly scrolling enabled
- Min table width: 600px

### Issue: Buttons overlapping
**Solution**: Already implemented
- Full-width buttons on mobile
- Proper gap spacing (8px+)
- Stacked layout for filter bar

### Issue: Text too small to read
**Solution**: Already implemented
- Min font: 0.6rem (compressed, but readable)
- Touch targets: 44px minimum
- Responsive font sizing per breakpoint

### Issue: Form inputs hard to tap
**Solution**: Already implemented
- Min height: 44px on mobile
- Min font: 16px (prevents iOS zoom)
- Full width on mobile

### Issue: Sidebar blocking content
**Solution**: Already implemented
- Hidden by default on mobile
- Hamburger toggle on tablets/mobile
- Overlay when sidebar is open
- Auto-close on nav click

## JavaScript Helpers

### Mobile Menu (Auto-Initialized)
```javascript
// mobile-menu.js handles:
- Creating hamburger toggle if not present
- Sidebar slide-in/out animation
- Overlay click to close sidebar
- Auto-close on nav link click
- Custom dropdown repositioning for mobile
```

**No additional code needed** - Auto-initialized on page load.

## Testing Tools

### Browser DevTools
1. Chrome DevTools: Ctrl+Shift+J → Click device toggle (top-left)
2. Firefox: Ctrl+Shift+K → Click Responsive Design Mode (Ctrl+Shift+M)
3. Safari: Develop → Enter Responsive Design Mode

### Recommended Test Viewports
- 320px (iPhone SE, old models)
- 375px (iPhone 11, 12, 13)
- 480px (Larger phones)
- 640px (iPad Mini, tablets)
- 768px (iPad, larger tablets)
- 1024px+ (iPad Pro, desktops)

### Real Device Testing
- Physical iPhone/iPad (if available)
- Android device or emulator
- Landscape orientation testing
- Touch interaction testing (not just mouse)

## CSS Media Query Reference

### All Breakpoints in CSS
```css
@media (max-width: 1024px)    /* Large screens */
@media (max-width: 768px)     /* Tablets */
@media (max-width: 640px)     /* Large mobile */
@media (max-width: 480px)     /* Small mobile */
```

### Specific Selectors
- `.mobile-menu-toggle` - Visible only on 768px and below
- `.sidebar-overlay` - Visible only on 768px and below
- `.data-table-container` - Scrollable on 768px and below
- `.filters-bar` - Stacks vertically on 768px and below

---

**Last Updated**: April 17, 2026
**Status**: Implementation Complete

