# Zaid & Haya Wedding RSVP

A beautiful, mobile-first wedding invitation and RSVP website built with Astro.

## 🎊 Features

- **Bilingual Support** - Full English and Arabic (RTL) support with automatic language detection
- **RSVP Form** - Guests can confirm attendance and specify number of attendees
- **Live Countdown** - Real-time countdown to the wedding day
- **Celebratory Confetti** - Animated confetti on the countdown page (only if attending!)
- **Smart Decline Message** - Different messaging for guests who decline
- **Google Sheets Integration** - RSVP submissions saved directly to Google Sheets
- **Mobile-First Design** - Optimized for mobile with keyboard-aware form handling
- **Smooth Animations** - Page transitions and micro-interactions throughout

## 📱 Pages

1. **Landing Page** (`/` or `/ar`)
   - Welcome message and hero image
   - Call-to-action button to RSVP

2. **RSVP Page** (`/rsvp` or `/ar/rsvp`)
   - Name input
   - Accept/Decline attendance
   - Number of invitees (if accepting)
   - Form data persisted in localStorage

3. **Countdown Page** (`/countdown` or `/ar/countdown`)
   - Live countdown timer
   - Location with embedded Google Map
   - Confetti celebration (for accepting guests)
   - "We regret..." message for declining guests

## 🛠️ Tech Stack

- **Framework**: [Astro](https://astro.build/) with View Transitions
- **Styling**: Vanilla CSS with custom design tokens
- **Fonts**: Libre Baskerville (English) + Amiri (Arabic)
- **Animations**: canvas-confetti, CSS keyframes
- **Backend**: Google Apps Script for form submissions
- **Deployment**: Static site (GitHub Pages / Vercel / Netlify)

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
src/
├── assets/           # Images (hero, logo)
├── components/       # Astro components
│   ├── Header.astro
│   ├── LandingPage.astro
│   ├── RsvpPage.astro
│   ├── CountdownPage.astro
│   └── Confetti.astro
├── i18n/             # Translations
│   └── ui.ts
├── layouts/          # Page layouts
│   └── Layout.astro
├── pages/            # Route pages
│   ├── index.astro
│   ├── rsvp.astro
│   ├── countdown.astro
│   └── ar/           # Arabic versions
└── styles/           # Global CSS
    └── global.css
```

## 🎨 Design Features

- **Elegant Color Palette**: Deep burgundy (#4b0101) with white text
- **Glassmorphism Cards**: Frosted glass effect with backdrop blur
- **Fluid Typography**: Responsive text sizing with `clamp()`
- **Touch-Friendly**: Minimum 44px touch targets
- **Keyboard Aware**: Smart scrolling when mobile keyboard opens
- **RTL Support**: Proper right-to-left layout for Arabic

## 📝 Environment

The Google Apps Script endpoint is hardcoded. For your own deployment, update the `API` constant in `RsvpPage.astro`.

## 📄 License

Private project - All rights reserved.

---

Made with ❤️ for Zaid & Haya's special day
