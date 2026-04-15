# Login Page Theme Documentation

## Overview
Theme applied to the login/landing page and dashboard featuring a sci-fi HUD aesthetic with deep purple/neon color scheme.

## Applying to Dashboard

To apply this theme to any dashboard page, add this to the page or create a new CSS file:

```css
/* Apply gradient background to dashboard main content */
.dashboard-main {
    background: linear-gradient(90deg, #09001a 0%, #1a0033 30%, #3a0050 60%, #ff2e88 100%) !important;
}

/* Ensure text is readable on dark gradient */
.dashboard-main {
    --text-primary: #ffffff;
    --text-secondary: rgba(255, 255, 255, 0.7);
}
```

---

# Login Page Theme Documentation

## 1. Background Gradient

### Main Hero Background
```css
.landing-hero {
    background: linear-gradient(90deg, #09001a 0%, #1a0033 30%, #3a0050 60%, #ff2e88 100%);
}
```
- **Direction**: Left to right (90deg)
- **Colors**:
  - 0%: `#09001a` (Deep dark blue)
  - 30%: `#1a0033` (Dark purple)
  - 60%: `#3a0050` (Medium purple)
  - 100%: `#ff2e88` (Neon pink/magenta)

---

## 2. Image Container

### Container Styling
```css
.hero-image-container {
    position: absolute;
    right: 0;
    top: 12.5%;
    bottom: 12.5%;
    width: 50%;
    background-image: url('/images/hero/safari-guide.jpg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    z-index: 2;
}
```

### Image Glow Effect
```css
.hero-image-container {
    box-shadow: 
        -20px 0 40px rgba(120, 0, 180, 0.3),  /* Left purple glow */
        0 0 30px rgba(255, 0, 120, 0.4);       /* Front pink glow */
    animation: imageGlow 4s ease-in-out infinite alternate;
}

@keyframes imageGlow {
    0% {
        box-shadow: 
            0 0 30px rgba(255, 0, 120, 0.5),
            0 0 60px rgba(120, 0, 180, 0.4),
            inset 0 0 30px rgba(255, 0, 120, 0.1);
    }
    100% {
        box-shadow: 
            0 0 40px rgba(255, 0, 120, 0.7),
            0 0 80px rgba(120, 0, 180, 0.6),
            inset 0 0 40px rgba(120, 0, 180, 0.15);
    }
}
```

---

## 3. Typography

### Hero Badge (Don't be a tourist, be a Traveller)
```css
.hero-badge {
    display: inline-block;
    font-size: 0.9rem;
    color: #ffffff;
    letter-spacing: 2px;
    margin-bottom: 2rem;
    padding: 0.6rem 0;
    border: none;
    background: transparent;
    font-family: 'Share Tech Mono', monospace;
    font-weight: 500;
    text-transform: capitalize;
}
```

### Hero Title (EXPEDITION)
```css
.hero-glitch {
    font-family: var(--font-family-heading);
    font-size: clamp(2.25rem, 8.1vw, 4.5rem);
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: clamp(6px, 3vw, 30px);
    color: #ffffff;
    position: relative;
    margin: 0;
    line-height: 1;
    text-shadow: 0 0 40px var(--accent-glow);
}

/* Glitch pseudo-elements */
.hero-glitch::before {
    color: var(--auth-cyan);
    z-index: -1;
    animation: glitch 3s infinite;
    clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
}

.hero-glitch::after {
    color: var(--auth-magenta);
    z-index: -2;
    animation: glitch 2.5s infinite reverse;
    clip-path: polygon(0 55%, 100% 55%, 100% 100%, 0 100%);
}
```

### Hero Tagline
```css
.hero-tagline {
    font-size: 0.85rem;
    color: #ffffff;
    margin-top: 1.5rem;
    letter-spacing: 2px;
}
```

---

## 4. Buttons

### Primary Button (INITIALIZE_EXPEDITION)
```css
.btn-primary {
    background: linear-gradient(90deg, #ff2e88 0%, #3b82f6 50%, #ff2e88 100%);
    background-size: 200% 100%;
    border: 2px solid #ff2e88;
    padding: 0.9rem 2.5rem;
    border-radius: 30px;
    color: #ffffff;
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    box-shadow: 0 0 30px var(--accent-glow);
    animation: gradientShift 3s ease infinite;
}

.btn-primary:hover {
    background: transparent;
    color: #ffb800;
    border-color: #ffb800;
    box-shadow: 0 0 20px rgba(255, 184, 0, 0.5), inset 0 0 10px rgba(255, 184, 0, 0.1);
    animation: none;
}

@keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}
```

### Secondary Button (LEARN MORE)
```css
.btn-outline {
    background: transparent !important;
    color: #ffffff !important;
    border: none !important;
    padding: 0.9rem 1.5rem;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    transition: all 0.3s ease;
}

.btn-outline:hover {
    color: #ffb800 !important;
    text-shadow: 0 0 10px rgba(255, 184, 0, 0.5);
}
```

### Navbar Connect Button
```css
.nav-login-btn {
    background: linear-gradient(135deg, #ff2e88, #cc0066);
    color: #ffffff;
    border: 2px solid #ff2e88;
    padding: 0.7rem 2rem;
    border-radius: 30px;
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    box-shadow: 0 0 20px var(--accent-glow);
}

.nav-login-btn:hover {
    background: transparent;
    color: #ffb800;
    border-color: #ffb800;
    box-shadow: 0 0 20px rgba(255, 184, 0, 0.5), inset 0 0 10px rgba(255, 184, 0, 0.1);
}
```

---

## 5. Stat Cards

### Stat Box Container
```css
.stat-box {
    background: transparent;
    border: 1px solid rgba(255, 220, 100, 0.4);
    padding: 0.8rem 1.2rem;
    border-radius: 4px;
    box-shadow: 
        0 0 5px rgba(255, 220, 100, 0.6),
        0 0 15px rgba(255, 220, 100, 0.4),
        0 0 30px rgba(255, 220, 100, 0.2),
        inset 0 0 20px rgba(255, 220, 100, 0.08);
}
```

### Stat Value
```css
.stat-value {
    font-size: 1.5rem;
    font-weight: bold;
    color: #ffffff;
}
```

### Stat Label
```css
.stat-label {
    font-size: 0.55rem;
    letter-spacing: 2px;
    color: rgba(255, 255, 255, 0.7);
    text-transform: uppercase;
}
```

---

## 6. Floating Stats (MAASAI MARA, EXPLORE NOW)

### Container
```css
.floating-stat {
    position: absolute;
    background: transparent;
    border: 1px solid rgba(255, 220, 100, 0.4);
    padding: 0.6rem 1rem;
    font-size: 0.6rem;
    letter-spacing: 1.5px;
    color: #ffffff;
    z-index: 3;
    animation: float 6s ease-in-out infinite;
}

/* Positions */
.floating-stat.top-right {
    top: 10%;
    right: 15%;
}

.floating-stat.bottom-left {
    bottom: 15%;
    right: 20%;
    animation-delay: 2s;
}

@keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
}
```

---

## 7. Navigation

### Navbar
```css
.auth-navbar {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    padding: 1.5rem 6%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 1000;
}
```

### Logo
```css
.auth-logo {
    font-family: var(--font-family-heading);
    font-size: 1.3rem;
    letter-spacing: 3px;
    font-weight: 700;
    color: #ffb800;
    transition: all 0.3s ease;
}

.auth-logo:hover {
    color: #ffffff;
}
```

### Nav Links
```css
.nav-link {
    color: #ffffff;
    font-family: var(--font-family-heading);
    font-size: 0.75rem;
    letter-spacing: 1.5px;
    text-transform: capitalize;
    transition: all 0.3s ease;
    opacity: 0.9;
}

.nav-link:hover {
    color: #ffb800;
    opacity: 1;
}
```

---

## 8. Color Palette Reference

| Color Name | Hex Code | Usage |
|------------|----------|-------|
| Deep Dark Blue | `#09001a` | Gradient start |
| Dark Purple | `#1a0033` | Gradient mid |
| Medium Purple | `#3a0050` | Gradient mid |
| Neon Pink | `#ff2e88` | Gradient end, accents, buttons |
| Neon Yellow | `#ffb800` | Hover states, borders |
| White | `#ffffff` | Primary text |
| Cyan (accent) | `#00e5ff` | Glitch effect |
| Magenta (accent) | `#ff0088` | Glitch effect |

---

## 9. Z-Index Layering

| Layer | z-index | Content |
|-------|---------|---------|
| Background | 0 | Gradient |
| Image | 2 | hero-image-container |
| Content | 3 | hero-text-panel, floating-stats, navbar |

---

## 10. Key CSS Variables Used

```css
--font-family-heading: /* Custom heading font */
--accent-glow: rgba(255, 46, 136, 0.5);
--auth-cyan: #00e5ff;
--auth-magenta: #ff0088;
```

---

## Usage Notes

1. The gradient requires `!important` on `.landing-hero` to override any theme-switcher styles
2. The image glow animation adds a subtle pulsing effect - remove `animation` property for static glow
3. The glitch effect on the hero title uses CSS clip-path animations
4. Button gradient animation can be removed by removing `animation` property
5. All hex colors can be easily replaced to create variations of this theme