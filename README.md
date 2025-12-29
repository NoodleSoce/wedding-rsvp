# Zaid & Haya Wedding RSVP

A beautiful, performant wedding RSVP website built with:
- **Astro** - Static site generation with islands architecture
- **Svelte** - Reactive components for interactive elements
- **Tailwind CSS** - Utility-first styling
- **Cloudflare Pages** - Edge hosting (free tier)
- **Cloudflare D1** - Serverless SQLite database (free tier)

## ✨ Features

- 🌐 Bilingual support (English & Arabic with RTL)
- 📱 Mobile-first, responsive design
- ⚡ AVIF images with fetchpriority for fast loading
- 🎉 Confetti animation on success
- 🗺️ Universal map link (works with any maps app)
- 🔄 Native View Transitions API
- 💾 Cloudflare D1 database (SQLite at the edge)
- 🚀 Zero-config deployment to Cloudflare Pages

## 🚀 Quick Start

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

## 📦 Deployment to Cloudflare Pages (Free!)

### Step 1: Create a Cloudflare Account
1. Go to [Cloudflare](https://cloudflare.com) and sign up
2. Navigate to **Workers & Pages** in the dashboard

### Step 2: Create D1 Database
```bash
# Install Wrangler CLI
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Create the database
wrangler d1 create wedding-rsvp

# Copy the database_id from the output and update wrangler.toml
```

### Step 3: Update Configuration
Edit `wrangler.toml` and replace `YOUR_DATABASE_ID_HERE` with your actual database ID.

### Step 4: Initialize Database Schema
```bash
# Apply the schema to production
wrangler d1 execute wedding-rsvp --remote --file=./schema.sql
```

### Step 5: Connect GitHub & Deploy

**Option A: GitHub Integration (Recommended)**
1. Push your code to GitHub
2. In Cloudflare Dashboard → Pages → Create a project
3. Connect your GitHub repository
4. Configure build settings:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Node.js version:** 20
5. Add D1 binding:
   - Go to Settings → Functions → D1 database bindings
   - Variable name: `DB`
   - D1 database: `wedding-rsvp`
6. Deploy!

**Option B: Direct Deploy**
```bash
# Build and deploy
npm run deploy
```

### Step 6: Custom Domain (Optional)
1. In Pages project → Custom domains
2. Add your domain (e.g., `wedding.yourdomain.com`)
3. Follow DNS instructions

## 📊 Viewing RSVP Responses

Query your D1 database to see responses:

```bash
# View all responses
wrangler d1 execute wedding-rsvp --remote --command="SELECT * FROM rsvp_responses ORDER BY created_at DESC"

# Count attendees
wrangler d1 execute wedding-rsvp --remote --command="SELECT attending, COUNT(*) as count, SUM(guests) as total_guests FROM rsvp_responses GROUP BY attending"

# Export to CSV
wrangler d1 execute wedding-rsvp --remote --command="SELECT name, attending, guests, created_at FROM rsvp_responses" --json > responses.json
```

## 🔧 Configuration

### Customizing the Wedding Details

1. **Date & Time:** Edit `src/components/CountdownPage.astro`
   ```javascript
   const targetDate = new Date("2026-03-21T19:00:00+04:00").getTime();
   ```

2. **Location:** Edit `src/components/svelte/LocationCard.svelte`
   ```javascript
   const lat = 25.1972;  // Your venue latitude
   const lng = 55.2744;  // Your venue longitude
   const venueName = encodeURIComponent('Your Venue Name');
   ```

3. **Text/Translations:** Edit `src/i18n/ui.ts`

4. **Colors:** Edit `tailwind.config.mjs` primary colors

5. **Images:** Replace files in `src/assets/`

## 🆚 Why Cloudflare Pages over Vercel?

| Feature | Cloudflare Pages | Vercel Free |
|---------|-----------------|-------------|
| **Bandwidth** | Unlimited | 100 GB/month |
| **Requests** | Unlimited | Limited |
| **Edge Functions** | 100,000/day | 100,000/month |
| **Database** | D1 (5GB free) | None built-in |
| **Global CDN** | ✅ | ✅ |
| **Custom Domains** | Unlimited | Limited |
| **DDoS Protection** | ✅ | ✅ |

## 🗄️ Database Options Comparison

| Database | Free Tier | Speed | Edge Compatible |
|----------|-----------|-------|-----------------|
| **Cloudflare D1** ⭐ | 5GB, 5M reads/day | ⚡ Fastest | ✅ Native |
| Turso | 9GB, 1B reads | ⚡ Fast | ✅ Yes |
| PlanetScale | 1GB | Fast | ✅ Yes |
| Supabase | 500MB | Good | ⚠️ Via API |
| Google Sheets | N/A | Slow | ❌ No |

**We chose D1 because:**
- Native Cloudflare integration (no external calls)
- SQLite = simple, reliable, fast
- Runs at the edge (minimal latency)
- Free tier is generous for wedding sites
- No vendor lock-in (standard SQL)

## 📁 Project Structure

```
├── src/
│   ├── assets/           # Images (auto-converted to AVIF)
│   ├── components/
│   │   ├── svelte/       # Interactive Svelte components
│   │   ├── Header.astro
│   │   ├── LandingPage.astro
│   │   ├── RsvpPage.astro
│   │   └── CountdownPage.astro
│   ├── i18n/             # Translations
│   ├── layouts/          # Base layout
│   ├── pages/            # Routes
│   │   ├── api/          # Server endpoints
│   │   ├── ar/           # Arabic routes
│   │   └── *.astro       # English routes
│   └── styles/           # Global CSS
├── astro.config.mjs      # Astro + integrations
├── tailwind.config.mjs   # Tailwind theme
├── wrangler.toml         # Cloudflare config
└── schema.sql            # D1 database schema
```

## 🔐 Security

- IP addresses are hashed (not stored in plain text)
- No tracking or analytics by default
- CORS configured for API endpoints
- Input validation on all form fields

## 📄 License

MIT License - feel free to use for your own wedding!

---

Made with ❤️ for Zaid & Haya
