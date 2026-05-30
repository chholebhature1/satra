# Satrangi Designer Studio — Project Context

> **Last updated:** 21 May 2026 — Shopify Storefront Integration complete  
> **For:** Handoff to GitHub Copilot / VS Code session

---

## Project Overview

A React + Vite single-page application for **Satrangi Designer Studio**, a Delhi-based boutique selling and renting Indian ethnic wear (bridal lehengas, sarees, suits, jewellery). The site is being converted from a static/hardcoded showcase into a **fully functional Shopify e-commerce storefront**.

---

## Tech Stack

| Tool | Version |
|------|---------|
| React | 19.2.5 |
| Vite | 8.0.10 |
| lucide-react | 1.14.0 (icons) |
| Swiper.js | 11.0.5 (loaded via CDN in ShopTheLookCarousel) |
| Shopify Web Components | CDN: `https://cdn.shopify.com/storefront/web-components.js` |

**No TypeScript, no routing library, no CSS framework.** Pure React + plain CSS.

---

## Shopify Credentials

```
Store domain:           satrangi-boutique-2.myshopify.com
Public access token:    set via VITE_SHOPIFY_PUBLIC_ACCESS_TOKEN
Country:                IN
Language:               en
```

> ✅ Configure the public Storefront API token through an environment variable for local builds and deployment.

---

## Design System (CSS Variables — `src/index.css`)

```css
--bg-primary:       #fffdf8   /* warm off-white */
--bg-secondary:     #f3eddf
--surface-beige:    #fbf6eb
--text-primary:     #16362b   /* dark forest green — used for buttons */
--text-secondary:   #4f695e
--text-muted:       #7a8d83
--accent-gold:      #0f8f64   /* actually a medium green */
--accent-gold-dark: #096c4b
--border-soft:      rgba(15,143,100,0.16)
--font-heading:     'Cinzel', serif
--font-body:        'Inter', sans-serif
```

ShopTheLookCarousel has its **own embedded CSS** (`STL_CSS` const) with separate font imports (Cormorant Garamond + DM Sans via CDN).

---

## File Structure

```
satrangi/
├── index.html                          ← Shopify script tag added here
├── package.json
└── src/
    ├── App.jsx                         ← shopify-store + shopify-cart added
    ├── App.css                         ← mobile-carousel-section (mobile-only)
    ├── index.css                       ← global design system / CSS variables
    ├── main.jsx
    └── components/
        ├── Navbar.jsx                  ← search, scroll, cart icon
        ├── Navbar.css                  ← shopify-cart sidebar drawer styles
        ├── Hero.jsx / Hero.css
        ├── ShopTheLookCarousel.jsx     ← Swiper coverflow carousel (Shopify integrated)
        ├── ServicesSection.jsx / .css
        ├── About.jsx / About.css
        ├── ProductGallery.jsx          ← Shopify live products (MAIN INTEGRATION)
        ├── ProductGallery.css          ← includes modal styles (.spm-*)
        ├── VideoHighlights.jsx / .css
        ├── TestimonialsSection.jsx / .css
        ├── ContactSection.jsx / .css
        ├── Footer.jsx / Footer.css
        ├── WhatsAppButton.jsx
        ├── ScrollToTop.jsx
        ├── PageLoader.jsx
        └── HeroBackgroundVideo.jsx
```

---

## What Has Been Implemented (Shopify Integration)

### ✅ Done

**1. `index.html`**
- Added `<script type="module" src="https://cdn.shopify.com/storefront/web-components.js">` in `<head>`
- Updated title to "Satrangi Designer Studio"

**2. `src/App.jsx`**
- Added `<shopify-store store-domain="..." public-access-token="..." country="IN" language="en">` before `<PageLoader>` (at root level, outside app-container)
- Added `<shopify-cart id="main-cart">` with custom empty-state slot and checkout button label inside app-container

**3. `src/components/Navbar.jsx` + `Navbar.css`**
- Imported `ShoppingBag` from lucide-react
- Added cart icon button (class `nav-cart-btn`) visible on all screen sizes
- On click: `document.getElementById('main-cart').showModal()`
- `Navbar.css` additions:
  - `shopify-cart::part(dialog)` — fixed right-side sidebar (420px wide, 100vh, slide-in animation)
  - `shopify-cart::part(primary-button)` — forest green checkout button
  - `shopify-cart::part(secondary-button)` — cream/bordered secondary
  - `shopify-cart::part(line-heading/line-price)` — brand fonts

**4. `src/components/ProductGallery.jsx`** ← Major rewrite
- Removed all hardcoded product data
- `COLLECTION_MAP` object maps filter tabs → Shopify collection handles:
  ```js
  'All'             → handle: null,              isRental: false
  'Bridal'          → handle: 'bridal',          isRental: false
  'Lehenga on Rent' → handle: 'lehenga-on-rent', isRental: true   ← WhatsApp only
  'Sarees'          → handle: 'sarees',          isRental: false
  'Suits & Sets'    → handle: 'suits',           isRental: false
  ```
- Product grid injected via `gridRef.current.innerHTML` when filter changes
- Uses `<shopify-list-context type="product" ... first="12">` with `<template>` for cards
- Card template uses: `<shopify-media>`, `<shopify-data>`, `<shopify-money>`
- **Rental collections** → "Enquire on WhatsApp" link (`https://wa.me/919876543210`)
- **Buy collections** → "View Details" button → triggers product detail modal
- Scroll animations reattached via `shopify-list-context-update` event + IntersectionObserver
- Loading state: 6 skeleton shimmer cards (`.product-card-skeleton`)
- Product detail modal injected once on mount via `modalRef.current.innerHTML`:
  - `<dialog id="product-detail-modal">` with `<shopify-context id="product-modal-ctx" wait-for-update>`
  - Layout: image (48%) + details panel (52%)
  - Components: `<shopify-media>`, `<shopify-data>` (vendor + title), `<shopify-money>`, `<shopify-variant-selector>`
  - "Add to Cart" → `getElementById('main-cart').addLine(event).showModal()`
  - "Buy Now" → `document.querySelector('shopify-store').buyNow(event)`

**5. `src/components/ProductGallery.css`**
- `shopify-list-context { display: contents }` inside `.product-grid` so cards flow into CSS grid
- `shopify-media` fill styles (width/height 100%, object-fit cover)
- `.product-card-skeleton` shimmer animation
- Full `.spm-*` modal styles (dialog, backdrop blur, image/details layout, buttons)
- `shopify-variant-selector::part(...)` brand styling
- `.gallery-loading-grid` spans all columns while loading

**6. `src/components/ShopTheLookCarousel.jsx`** ← Swiper + Shopify
- Removed static `products` array
- Added `wrapperRef`, `swiperReadyRef`, `slidesReadyRef` refs
- `useEffect` now:
  1. Injects `<shopify-list-context type="product" query="products" first="9">` with template into `.swiper-wrapper` via `wrapperRef.current.innerHTML`
  2. Listens for `shopify-list-context-update`: moves `.swiper-slide` elements from list context → `.swiper-wrapper`, removes list context, sets `slidesReadyRef = true`
  3. Swiper init is decoupled: fires only when BOTH Swiper JS loaded AND slides ready (`swiperReadyRef` + `slidesReadyRef`)
- STL_CSS additions: `shopify-media` fill styles, `.stl-view-link` button reset, loading placeholder
- "View Details" button in slide → opens product modal via same pattern

**7. `src/components/ServicesSection.jsx` & `Footer.jsx`** ← Instagram QR Upgrade
- Replaced basic static text list with beautiful interactive desktop hover animations.
- Hovering `QR Insta ID` reveals the real `@satrangi-qr.png` beautifully inside the services grid.
- Replaced the boring static newsletter subscription form in the footer with a luxurious, high-converting "Instagram Studio" QR module featuring direct deep-link CTA support on mobile.

---

## Key Patterns Used

### Why `innerHTML` + `useEffect` instead of JSX for Shopify elements?
React 19 has custom element support but `<template>` children inside custom elements are rendered eagerly (React doesn't understand template semantics). Using `ref.current.innerHTML = ...` lets the browser parse and upgrade custom elements correctly including their `<template>` children.

### How Shopify Web Components work in this project
- `<shopify-store>` — root config (credentials, country). Must be in DOM before contexts.
- `<shopify-list-context>` — fetches a list of products and stamps the `<template>` for each
- `<shopify-context>` — fetches a single product (used in detail modal with `wait-for-update`)
- `<shopify-media>` — renders product image (wraps `<img>` or `<unpic-img>`)
- `<shopify-data>` — outputs text from a product field (has `display: contents`)
- `<shopify-money>` — formats price with currency
- `<shopify-variant-selector>` — renders size/color options
- `<shopify-cart>` — full cart dialog (styled via `::part()`)
- All events: `shopify-list-context-update` (products loaded), custom `onclick` for cart/checkout

---

## Pending / Future Work

- [ ] **Verify collection handles** — Update `COLLECTION_MAP` in `ProductGallery.jsx` if actual Shopify handles differ from `bridal`, `sarees`, `lehenga-on-rent`, `suits`
- [ ] **Add cart item count badge** on the navbar cart icon (requires listening to Shopify cart state events)
- [ ] **Live search** — Connect navbar search to Storefront API instead of hardcoded `searchableItems` array in `Navbar.jsx` (lines 7–27)
- [ ] **Announcement bar** — `AnnouncementBar.jsx` exists but is not rendered in `App.jsx`
- [ ] **Rotate Shopify token** before production launch
- [ ] **Production build** — run `npm run build` (outputs to `dist/`)

---

## Dev Commands

```bash
# Install dependencies
npm install

# Start dev server (usually port 5173, may increment if occupied)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

---

## WhatsApp Integration

WhatsApp link: `https://wa.me/919876543210`  
Used in: `Navbar.jsx` (desktop WA icon), `ProductGallery.jsx` (rental enquiry CTA), `ContactSection.jsx`, `WhatsAppButton.jsx` (floating button)

---

## Mobile Layout Notes

- Navbar breakpoint: `900px` — two-row desktop → flex mobile (logo left, search center, hamburger right)
- `ShopTheLookCarousel` is rendered twice: inside Hero (desktop overlay) and as a standalone section (`mobile-carousel-section` — visible only `< 900px`, see `App.css`)
- Mobile card height: `calc(100svh - 230px)` for the carousel
- Hero: `height: auto` on mobile to avoid empty space

---

## Shopify Collections Setup

### Required Collections (Match to Filter Tabs)

| Filter Tab | Collection Handle | Shopify Title | Setup Notes |
|------------|------------------|---------------|-------------|
| **All** | — | — | Shows all products, no collection needed |
| **Bridal** | `bridal` | Bridal | Wedding lehengas, heavy bridal sets |
| **Lehenga on Rent** | `lehenga-on-rent` | Lehenga on Rent | Rentals only → WhatsApp enquiry CTA |
| **Sarees** | `sarees` | Sarees | All saree types |
| **Suits & Sets** | `suits` | Suits & Sets | Anarkalis, shararas, coord sets |

### Creating Collections

1. **Shopify Admin** → `admin.shopify.com/store/satrangi-boutique-2`
2. **Products → Collections → Create collection**
3. Set **Title** (e.g., "Sarees")
4. Collection will auto-generate handle from title (lowercase, spaces→hyphens)
5. Add products:
   - Manual selection, OR
   - Automated conditions (by tag: `type:saree`, `type:bridal`, etc.)
6. **Save**
7. **Critical** → Click **"Manage"** on collection page → Check **"Headless"** channel
8. **For products** → Products → Select All → More Actions → **"Make available on Headless"**

### If Shopify Auto-Generates Different Handles

Edit handle manually:
- Collection → Three dots menu → **"Edit website SEO"** → change URL handle

Or update code at `ProductGallery.jsx:7-13`:
```js
const COLLECTION_MAP = {
  'All':             { handle: null,              isRental: false },
  'Bridal':          { handle: 'bridal',          isRental: false },
  'Lehenga on Rent': { handle: 'lehenga-on-rent', isRental: true  },
  'Sarees':          { handle: 'sarees',          isRental: false },
  'Suits & Sets':    { handle: 'suits',           isRental: false },
};
```

---

## Git Status

All changes committed up to the search bar implementation. The Shopify integration changes have NOT been committed yet. Run:
```bash
git add -A
git commit -m "feat: Shopify Storefront Web Components integration"
```
