# Punjab Tour Guide 🌾 — The Smart Travel Companion

A production-grade, portfolio-quality smart tourism platform built as a full-stack monorepo. It features visual analytics charts, interactive itinerary planning, Web Audio traditional beat synthesis, progress tracking, Progressive Web App (PWA) cache registrations, and comprehensive keyboard-focus accessibility overrides.

---

## 🚀 Key Features

- **Full-Stack Monorepo**: Vite + React frontend coupled with an Express.js backend and local SQLite relational storage.
- **Dynamic Analytics Dashboard**: Inline custom SVG Line and Bar graphs visualizing weekly revenue trends and destination popularities dynamically.
- **Relational DB Operations**: Complete administrative CRUD interfaces (Users, Roles, Destinations, Hotels, Restaurants, Bookings) with dynamic JSON Backup & Restore capabilities.
- **Smart Itinerary Planner**: Core rule vectors matching budget, days, kids/seniors, and travel styles to render day-by-day itineraries, packing lists, and distance estimates.
- **Progressive Web App (PWA)**: Registering service workers (`sw.js`) with stale-while-revalidate caching and manifest overrides for fully installable offline maps and guides.
- **Web Audio API Beat Synthesizer**: Custom real-time drum oscillator and pluck synthesizer looping traditional instrument patterns (Dhol, Tumbi, Algoza) with HTML5 Canvas visualizers.
- **Voice-Assisted AI Chatbot**: Conversational local concierge integrating browser Speech Recognition to answer travelers' dress code, food, and SOS inquiries instantly.
- **Digital Travel Pass**: Responsive SVG ticket card compiler and builder that passengers can customize and download.
- **Phrasebook & Gamified Quizzes**: Vocal Web Speech synthesis playbacks of Punjabi terms, combined with scoring quizzes rewarding user loyalty points (+20 pts).
- **Accessibility & Performance**: Enforced skip-to-content links, heading hierarchies, outline focus indicators, and `@media (prefers-reduced-motion)` constraints.

---

## 🛠️ Technology Stack

- **Frontend**: React, Vite, Leaflet.js (OpenStreetMap vector tiles mapping), Lucide Icons, Vanilla CSS Variables.
- **Backend**: Express.js REST API, Helmet security headers, CORS origins, Express Rate Limit constraints.
- **Database**: Relational SQLite3, schema migrations configuration, transaction seeds data.
- **Web APIs**: Web Audio API (Oscillators, Analysers), Web Speech API (SpeechSynthesis), Web Speech Recognition API (SpeechRecognition).
- **Tooling**: Concurrent task managers, Vite bundling code-splitters.

---

## 📂 Folder Structure

```text
/home/pratham-singla/Documents/Punjab Tour Guide
├── package.json                    # Monorepo concurrent startup script
├── README.md                       # Repository guide
├── backend/
│   ├── package.json
│   ├── server.js                   # REST Express Gateway
│   ├── config/
│   │   └── database.js             # SQLite initialization & migrations runner
│   ├── database/
│   │   ├── migrations.sql          # Relational tables schema
│   │   ├── seeds.sql               # Starter datasets
│   │   └── punjab_tour.db          # SQLite Database File
│   └── routes/
│       ├── auth.js                 # Auth controls (JWT, Password hashes)
│       ├── destinations.js         # Cities and Traveler reviews posting
│       ├── planner.js              # Rules-engine itinerary creator
│       ├── bookings.js             # Hotel reservations loggers
│       └── admin.js                # System analytics & database backups
└── frontend/
    ├── package.json
    ├── index.html                  # Core viewport header & A11y skip-links
    ├── public/
    │   ├── manifest.json           # PWA standalone manifest parameters
    │   └── sw.js                   # Offline caching service worker
    └── src/
        ├── main.jsx                # PWA worker initiator
        ├── App.jsx                 # Lazy route splitter & Suspense spinners
        ├── index.css               # Design tokens, themes, & A11y outlines
        ├── context/
        │   ├── AuthContext.jsx
        │   ├── LanguageContext.jsx # EN, HI, PB translation hooks
        │   ├── ThemeContext.jsx    # Light, Dark, Heritage, Baisakhi themes
        │   └── NotificationContext.jsx # Alert queues
        ├── pages/
        │   ├── Home.jsx            # Cloud particle hero parallax & beats visualizer
        │   ├── Destinations.jsx    # Fuzzy search, voice recognition, filters
        │   ├── DestinationDetails.jsx # Star reviews submitter & interactive leaflet map
        │   ├── AdminDashboard.jsx  # SVG analytics, CRUD tabs, backup uploads
        │   ├── ErrorPages.jsx      # 401, 403, 404, 500 status indicators
        │   └── Utilities.jsx       # Quiz panel, travel pass SVG, Open-Meteo weather
        └── components/
            ├── Common/             # NotificationToast & Footer
            ├── Navbar/             # Shrinking frosted-glass header with language select
            └── Onboarding/         # OnboardingTour popup wizard
```

---

## ⚙️ Installation & Startup

### Prerequisites
- Node.js (v18+) and npm installed.

### 1. Install Dependencies
Execute the monorepo audit installer from the root directory:
```bash
npm run install:all
```

### 2. Launch Development Servers
Start both backend (Port 5000) and frontend (Port 5173) concurrently:
```bash
npm run dev
```

### 3. Build for Production
Precompile and optimize assets using Vite:
```bash
npm run build:frontend
```

---

## 📡 Core API Endpoints

### Authentication
- `POST /api/auth/register` - Create tourist profile.
- `POST /api/auth/login` - Sign in user (retrieves JWT token).
- `GET /api/auth/profile` - Retrieves active user session.

### Travel Core
- `GET /api/destinations` - Fuzzy search & filter locations.
- `GET /api/destinations/:id` - Fetch city, hotels, and restaurants.
- `POST /api/destinations/:id/reviews` - Post traveller review (Pending approval).
- `POST /api/planner/generate` - Generate structured itinerary timelines.

### Super Admin Controls (Requires Admin privileges)
- `GET /api/admin/stats` - Retrieve numerical dashboard summaries.
- `GET /api/admin/analytics` - Process statistics arrays for SVG graphs.
- `GET /api/admin/users` - Fetch user registration list.
- `PUT /api/admin/users/:id/role` - Update account role flags.
- `GET /api/admin/reviews` - Fetch pending reviews moderation queue.
- `POST /api/admin/reviews/:id/approve` - Publish review and reward loyalty points.
- `GET /api/admin/logs` - Query database system audit logs.
- `GET /api/admin/backup` - Download SQLite tables serialized as JSON.
- `POST /api/admin/restore` - Overwrite database using backup JSON.

---

## 🎨 UI/UX Design System Guidelines

- **Typography**: Display serif header font Playfair Display paired with Outfit body font scale.
- **Glassmorphism**: Border grids utilizing `backdrop-filter: blur(20px)` and transcluent overlays.
- **CSS Color Tokens**: Pure primary variables with Mustard (`#FFB800`), Green (`#0A6E3F`), and Phulkari Pink (`#C2185B`) accents.

---

## 🤝 Verification Protocols

1. **Accessibility (A11y)**: Press `Tab` on load to verify the skip-to-content focus box. Verify focus traps inside settings/login pages.
2. **PWA Check**: Inspect Chrome DevTools Application tab to verify that `sw.js` registers successfully and caches pages.
3. **Backup Integration**: Download backup JSON inside the admin Settings tab, add a new user, upload the backup string, and verify that user lists are correctly restored.
# Punjab-Tour-Guide
