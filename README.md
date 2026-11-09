# ARENA AUCTIONS
### College Sports Tournament Registration & Player Management Platform
**Cricket • Volleyball • Kabaddi**

A high-performance, modern brutalist sports tournament registration and auction roster platform designed for college sports organizers. Features automated 1080×1350 px diamond-framed sports poster generation, duplicate USN protection, zero-collision unique registration links, and bulk ZIP roster exports.

---

## ⚡ Core Concept & Workflow

The platform strictly separates the two user personas:

### 1. Organizer (Admin Portal)
- **Secure Authentication**: Protected dashboard via email/password (`organizer@arena.edu` / `Admin@123`).
- **Tournament Creation**:
  - Configure tournament name, sport (**Cricket**, **Volleyball**, or **Kabaddi**), tournament date, registration deadline, location, and description.
  - Generates zero-collision unique public registration links (e.g. `/register/cricket-inter-collegiate-2026-x9z2`).
  - One-click **Copy Link** and native device **Share** actions.
  - Toggle tournament status between **Active**, **Closed**, and **Completed**.
- **Real Database Roster Management**:
  - Live search by player name, USN, or phone number.
  - Filter players by sport-specific playing role.
  - 3D interactive tilt preview modal for individual player cards.
  - **Download Player Card**: Direct 1080×1350 high-resolution PNG export.
  - **Download All Player Cards**: Batch generates all registered players in the tournament into an organized `.zip` file with real-time packaging progress.

### 2. Player (Public Self-Registration)
- **Zero-Login Frictionless Intake**: Players open the tournament registration link.
- **Automatic Sport Recognition**: The form identifies the sport from the URL and presents *only* the relevant roles (Cricket, Volleyball, or Kabaddi). No sport re-selection.
- **Five Mandatory Fields**:
  1. **Player Photograph** (JPG, PNG, WEBP with diamond alignment preview, replace/remove action, and file validation).
  2. **Full Name**.
  3. **Class / Department**.
  4. **USN (University Serial Number)** — strictly enforced anti-duplicate validation within the tournament.
  5. **Phone Number**.
  6. **Sport-Specific Playing Role**:
     - *Cricket*: Batsman, All-rounder, Bowler
     - *Volleyball*: Setter, Spiker, Libero, Blocker, All-rounder
     - *Kabaddi*: Raider, Defender, All-rounder
- **Strict Role Permissions**: **Players do NOT have any player card download option**. All cards are generated exclusively for the organizers.
- **Confirmation Screen**: Official receipt confirmation with celebratory athletic confetti.

---

## 🎨 Design System: Modern Brutalism × Sports Editorial

Engineered to evoke the physical intensity of athletic competition, following the design principles of ThreeUI and 21st.dev:

- **Color Palette**:
  - Primary Surface: Warm Cream (`#F1EFE8`)
  - Primary Ink & Boundaries: Near-Black (`#17191A`)
  - Primary Action Accent: Bright Athletic Orange (`#E66A32`)
  - Verification & Badges: Pale Yellow (`#F4D85A`)
  - Court / Technical: Cobalt Blue (`#315BD6`)
  - Active State / Success: Deep Green (`#236B45`)
  - Errors & Sports Geometry: Brick Red (`#B43C32`)
- **Typography**:
  - Headings: `Archivo Black` (punchy, high-impact athletic display)
  - Interface: `IBM Plex Sans` (clarity in forms and data tables)
  - Identifiers & Metrics: `Space Mono` (technical badges, USN codes, and IDs)
  - Player Card Signature: `Caveat` (expressive handwritten signature font)
- **Interactive 3D**:
  - Three.js interactive arena dome wireframe on the landing page hero with mouse tracking parallax and spark particles.
  - 3D tilt interaction on player card preview modals.
- **Iconography**:
  - Custom geometric SVG icons crafted to adhere strictly to brutalist aesthetics without generic icon libraries.

---

## 🏆 Player Card Poster Specification (1080 × 1350 px)

The downloaded player card matches the reference athletic auction poster composition:
- **Aspect Ratio**: 4:5 portrait format (1080 × 1350 pixels).
- **Background**: Distressed concrete grey with procedural grit, brush scratches, and athletic vignette shadows.
- **Geometry**: Heavy brick red (`#B43C32`) and crisp white diagonal cuts and corner brackets.
- **Central Focus**: Massive diamond-clipped player photograph with dual-layer white and red framing borders.
- **Player Name**: Rendered at the top in handwritten signature style with a 3.5° energetic tilt and dark stroke shadow.
- **Information Strip**: Angled brick-red ribbon across the lower third displaying:
  1. **Selected Playing Role** (e.g. `ALL-ROUNDER`, `SPIKER`, `RAIDER`).
  2. **Contact Number**.
- **Sport-Specific Background Elements**:
  - *Cricket*: Ball arcs, dashed seam contours, cricket pitch crease lines, and subtle bat silhouette.
  - *Volleyball*: Court net grid textures, volleyball rotation curves, and attack lines.
  - *Kabaddi*: Baulk line, bonus line, midline, and high-energy court diagonal cuts.
- **Content Restriction**: Displays *only* the actual photo, name, role, and phone number. No clutter, no fake stats.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS
- **3D & Visuals**: Three.js, Canvas 2D API, Canvas Confetti
- **Packaging & Archives**: JSZip
- **Database & Storage**: Supabase (PostgreSQL, Storage, Auth) + Zero-Config LocalDB (IndexedDB fallback)
- **Fonts**: Archivo Black, IBM Plex Sans, Space Mono, Caveat

---

## 🗄️ Database Architecture

The SQL schema is located in [`supabase/schema.sql`](file:///supabase/schema.sql):

- `tournaments`: `id`, `slug`, `tournament_name`, `sport_type`, `tournament_date`, `registration_deadline`, `location`, `description`, `registration_status`, `created_at`.
- `players`: `id`, `tournament_id` (FK), `full_name`, `class`, `usn`, `phone_number`, `profile_image_url`, `playing_role`, `created_at`. Constraint: `UNIQUE(tournament_id, usn)`.
- `profiles`: `id` (FK to auth.users), `email`, `role`, `created_at`.

### Setup with Supabase:
1. Create a Supabase project at [supabase.com](https://supabase.com).
2. Copy SQL from `supabase/schema.sql` into the Supabase SQL Editor and execute.
3. In Supabase Storage, ensure the `player-photos` bucket is created.
4. Copy `.env.example` to `.env` and fill in:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```
5. If `.env` is omitted or left empty, ARENA AUCTIONS automatically operates in **high-performance local database mode** powered by IndexedDB!

---

## 🚀 Running the Project

### Development:
```bash
npm install
npm run dev
```

### Production Build:
```bash
npm run build
npm run preview
```

### Default Organizer Login:
- **Email**: `organizer@arena.edu`
- **Password**: `Admin@123`
