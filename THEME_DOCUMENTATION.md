# Muts Safaris Theme Documentation

## Overview
Comprehensive theme system covering login, explore, and dashboard pages. 4 themes:
- `dark` - Sci-Fi Dark (purple/magenta HUD)
- `light` - Crisp Futuristic White/Blue
- `corporate-light` - Professional Clean (blue accents)
- `corporate-dark` - Professional Dark (blue accents)

## Theme Variables by Theme

### Dark Theme (Sci-Fi HUD)
```css
[data-theme="dark"] {
    --bg-primary: #050510;
    --bg-secondary: #080820;
    --bg-dark: #030308;
    --bg-card: rgba(255, 184, 0, 0.03);
    --bg-sidebar: #080818;
    --bg-input: rgba(255, 184, 0, 0.04);
    --bg-hover: rgba(255, 184, 0, 0.1);

    --text-primary: #e0dcd0;
    --text-secondary: #8a8570;
    --text-muted: #ffffff;
    --text-white: #ffffff;
    --text-black: #000000;
    --text-high-contrast: #ffffff;
    --text-on-image: #ffffff;

    --explore-text: var(--text-primary);
    --explore-text-muted: var(--text-muted);
    --explore-accent: #ffb800;

    --accent: #ffb800;
    --accent-dark: #cc9300;
    --accent-light: #ffd54f;
    --accent-glow: rgba(255, 184, 0, 0.35);
    --accent-glow-strong: rgba(255, 184, 0, 0.55);
    --accent-secondary: #ff8f1f;
    --accent-secondary-dark: #b56b00;

    --border: rgba(255, 184, 0, 0.1);
    --border-glow: rgba(255, 184, 0, 0.25);

    --glass-bg: rgba(255, 184, 0, 0.02);
    --glass-border: rgba(255, 184, 0, 0.1);

    --shadow: rgba(0, 0, 0, 0.5);
    --shadow-glow: rgba(255, 184, 0, 0.2);

    --success: #00ff88;
    --warning: #ffaa00;
    --danger: #ff4466;
    --info: #4fc3f7;

    --gold: #ffd700;
    --theme-browser-color: #050510;

    --body-bg: linear-gradient(135deg, #09001a 0%, #1a002e 50%, #3a0050 100%);
    --html-bg: linear-gradient(135deg, #09001a 0%, #1a002e 50%, #3a0050 100%);
    --auth-bg: linear-gradient(135deg, #09001a 0%, #1a002e 50%, #3a0050 100%);
}
```

### Light Theme
```css
[data-theme="light"] {
    --bg-primary: #f5f9fd;
    --bg-secondary: #e8f1fb;
    --bg-dark: #dde7f3;
    --bg-card: rgba(255, 255, 255, 0.96);

    --text-primary: #0f172a;
    --text-secondary: #334155;
    --text-muted: #475569;
    --text-white: #ffffff;
    --text-black: #0f172a;
    --text-high-contrast: #000000;
    --text-on-image: #ffffff;

    --explore-text: var(--text-primary);
    --explore-text-muted: var(--text-secondary);
    --explore-accent: #2563eb;

    --accent: #2563eb;
    --accent-dark: #1d4ed8;
    --accent-glow: rgba(37, 99, 235, 0.18);

    --border: rgba(148, 163, 184, 0.32);

    --gold: #d97706;
}
```

### Corporate Light Theme
```css
[data-theme="corporate-light"] {
    --bg-primary: #ffffff;
    --bg-secondary: #f8fafc;
    --bg-dark: #e2e8f0;
    --bg-card: rgba(255, 255, 255, 0.98);

    --text-primary: #1e293b;
    --text-secondary: #475569;
    --text-muted: #64748b;
    --text-white: #ffffff;
    --text-black: #1e293b;
    --text-high-contrast: #000000;
    --text-on-image: #ffffff;

    --explore-text: var(--text-primary);
    --explore-text-muted: var(--text-muted);
    --explore-accent: #3b82f6;

    --accent: #3b82f6;
    --accent-dark: #2563eb;
    --accent-light: #dbeafe;
    --accent-glow: rgba(59, 130, 246, 0.15);
    --accent-glow-strong: rgba(59, 130, 246, 0.25);
    --accent-secondary: #06b6d4;

    --border: rgba(148, 163, 184, 0.2);
    --border-glow: rgba(59, 130, 246, 0.3);

    --glass-bg: rgba(255, 255, 255, 0.95);
    --glass-border: rgba(59, 130, 246, 0.1);

    --shadow: rgba(15, 23, 42, 0.08);
    --shadow-glow: rgba(59, 130, 246, 0.12);

    --gold: #d97706;
    --theme-browser-color: #ffffff;

    --body-bg: linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #e2e8f0 100%);
    --html-bg: linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #e2e8f0 100%);
    --auth-bg: linear-gradient(135deg, #f5f9fd 0%, #e8f1fb 50%, #dbeafe 100%);
}
```

### Corporate Dark Theme
```css
[data-theme="corporate-dark"] {
    --bg-primary: #0f172a;
    --bg-secondary: #1e293b;
    --bg-dark: #0f172a;
    --bg-card: rgba(30, 41, 59, 0.8);

    --text-primary: #f1f5f9;
    --text-secondary: #cbd5e1;
    --text-muted: #94a3b8;
    --text-white: #ffffff;
    --text-black: #0f172a;
    --text-high-contrast: #ffffff;
    --text-on-image: #ffffff;

    --explore-text: var(--text-primary);
    --explore-text-muted: var(--text-muted);
    --explore-accent: #3b82f6;

    --accent: #3b82f6;
    --accent-dark: #2563eb;
    --accent-glow: rgba(59, 130, 246, 0.25);

    --border: rgba(71, 85, 105, 0.3);
    --border-glow: rgba(59, 130, 246, 0.4);

    --gold: #d97706;

    --body-bg: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
    --html-bg: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
    --auth-bg: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
}
```

## Components

### Cards (All Themes)
- Border: 2px solid accent color (theme-specific)
- Hover: Animated top gradient bar expands (CSS ::before pseudo-element)
- Background: var(--bg-card)
- Shadow on hover: theme-specific glow

### Buttons (.btn-primary)
- Border: 2px solid accent
- Box-shadow: accent glow
- Hover: Intensified border + stronger glow
- Animation: gradient shift (where applicable)

### Labels (form labels)
- Corporate themes: 3px left border in accent color

### Inputs
- Border: 2px solid var(--border)
- Focus: accent border + glow

### Destination Cards (Explore Pages)
```css
.destination-card {
    aspect-ratio: 4/3;
    overflow: hidden;
    border-radius: var(--explore-radius);
}

.destination-info {
    position: absolute;
    bottom: 0;
    padding: 0.75rem 1.5rem;
    background: linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.5) 30%, transparent);
    color: #ffffff;
}
```

### Hero Sections
- Text color: var(--text-on-image) = #ffffff for all themes
- Subtitle: #ffffff (pure white for dark theme)

### Theme Switcher UI
- Container: var(--bg-card)
- Buttons: transparent (active = accent background)
- Icons: theme-appropriate

## Login Page Specific
- Background: var(--auth-bg)
- Accent colors theme-specific (blue for corporate, magenta for sci-fi)
- HUD overlay effects for dark theme only

## Explore Pages Specific
```css
body {
    background: var(--auth-bg);
}
```

### Corporate-Light Card Text Area Fix
```css
[data-theme="corporate-light"] .destination-info {
    background: #052e16;
    color: #f0fdf4;
}

[data-theme="corporate-light"] .destination-info h3 {
    color: #dcfce7;
}

[data-theme="corporate-light"] .destination-info p {
    color: #bbf7d0;
}

[data-theme="corporate-light"] .destination-price,
[data-theme="corporate-light"] .destination-cta {
    color: #ec4899;
}
```

## Files Reference

### Main Theme Files
- `/css/themes.css` - Core theme variables + overrides
- `/css/login-landing.css` - Login page specific (extends themes)
- `/css/dashboard-theme.css` - Dashboard (html/body backgrounds)
- `/explore/css/landing.css` - Explore pages

### Key CSS Variables by Purpose
| Purpose | Variable |
|---------|----------|
| Page background | --auth-bg, --body-bg |
| Text primary | --text-primary |
| Text muted | --text-muted |
| Accent | --accent |
| Card background | --bg-card |
| Borders | --border |
| Glow | --accent-glow |
| On-image text | --text-on-image |

## /pages Directory Notes
- Uses dashboard-theme.css which sets html/body backgrounds with !important
- All theme-specific overrides should be in themes.css
- Cards use var(--bg-card) for backgrounds
- Buttons use var(--accent) for colors
- Labels/form elements need theme-specific colored borders

## Animations

### Card Hover Animation (Corporate Themes)
```css
/* Applied to: .card, .listing-card, .destination-card, .experience-card */
.card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background: linear-gradient(90deg, var(--accent), var(--accent-secondary), var(--accent));
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s ease;
}

.card:hover::before {
    transform: scaleX(1);
}
```

### Button Animation
```css
.btn-primary {
    background: linear-gradient(90deg, var(--accent-secondary), var(--accent), var(--accent-secondary));
    background-size: 200% 100%;
    animation: gradientShift 3s ease infinite;
}

@keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}
```

### Image Hover Scale
```css
.destination-card img {
    transition: transform 0.5s ease;
}

.destination-card:hover img {
    transform: scale(1.1);
}
```

### Theme Transitions (Global)
```css
* {
    transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
}
```