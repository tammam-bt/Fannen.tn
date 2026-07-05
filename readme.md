# 🎨 Fannen.tn

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![PHP](https://img.shields.io/badge/PHP-777BB4?style=for-the-badge&logo=php&logoColor=white)](https://www.php.net/)
[![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)

> 🎓 **Academic Project** | 🖼️ **Artisan Portfolio** | 🇹🇳 **Made in Tunisia**

**Fannen.tn** is a digital portfolio and networking platform designed specifically for Tunisian artisans, such as potters, weavers, and woodworkers. Developed as an academic project for a "Développement Web" course, it aims to provide a modern showcase for physical crafts while omitting standard e-commerce features. The primary objectives are visual showcasing of Tunisian heritage, positive social reinforcement through an appreciation badge system, and direct lead generation via internal messaging.

---

> 🛠️ **Current Status**: The project is fully implemented (Phase 3 complete). It features a Native PHP REST API backend connected to a MySQL database using PDO. The frontend uses Vanilla JS to interface with the backend APIs for dynamic gallery rendering, authentication, profile management, real-time messaging, persisted Kudos, Follow/Save, and live dashboard analytics. A separate static UI preview is maintained for Netlify deployment.

## 📸 Visual Showcase

Fannen.tn is fully implemented — here's a tour of the user journey across the live application:

### 🏠 **Global Feed (index.php)**
*Screenshot placeholder: Index page showing masonry grid of artisan works*

The homepage serves as the global discovery feed, utilizing a masonry-style grid to display uploaded artworks. It features visual category filter buttons that allow users to dynamic filter the feed (e.g., viewing only "Ceramics") without reloading the page.

### 🛡️ **Authentication (signin.php & register.php)**
*Screenshot placeholder: Split-screen login/register form with role selection*

Authentication is split into two dedicated pages with a premium 50/50 split-screen layout. **Sign In** provides email, password, and role selection. **Register** collects full profile details (name, username, age, phone, email, password, role). Users are redirected based on their role — Artisans go to the Dashboard, Enthusiasts go to the Homepage.

### ⭐ **Artwork Showcase (artwork_detail.php)**
*Screenshot placeholder: Detailed view with large image, description, and Kudos badges*

This page provides a detailed view of a specific craft, featuring a large high-resolution image, detailed description, and an artisan profile snippet. It serves as the hub for interaction, hosting the unique "Kudos" badge system and the primary "Send an Inquiry" button.

### 💰 **Kudos & Messaging Flow**
*Screenshot placeholder: Close-up of Kudos badges and the messaging modal interface*

Fannen.tn replaces numerical ratings with specific appreciation badges (e.g., "Incredible Technique", "Creative Idea"). Kudos, Follows, and Saved artworks are persisted in the MySQL database per user. Users can also click "Send an Inquiry" to open a messaging form regarding a specific artwork, facilitating direct inquiries.

### 📋 **Role-Based Dashboard (dashboard.php)**
*Screenshot placeholder: Artisan backend view with upload form and active listings*

The dashboard dynamically adapts based on the user's role. **Artisans** see live analytics stats (Total Kudos, Total Views, Pending Inquiries), a drag-and-drop upload zone, and a portfolio management table. **Enthusiasts** see their profile details, saved/favorite artworks, followed artisans, and interaction history, all fetched from the database. Both roles share a profile card with inline edit functionality. Sidebar links update dynamically: "Dashboard" + "Messaging" for artisans, "Profile" + "Messaging" for enthusiasts.

### 🔍 **Messaging Inbox (inbox.php)**
*Screenshot placeholder: Two-pane communication hub layout*

The communication hub utilizes a classic two-pane layout: a conversation list on the left and the active message thread on the right, displaying inquiries linked to specific artworks.

## ✨ Key Features

- 👥 **Role-Based Dashboard Rendering** — The dashboard dynamically shows/hides sections using `.role-artisan-only` and `.role-enthusiast-only` wrapper classes, toggled via the `.hidden-role` CSS utility.

- 🔐 **Split Authentication Flow** — Dedicated Sign In and Registration pages with full profile data capture on registration, persisted server-side via native PHP `$_SESSION` and a MySQL `users` table (password hashed with `password_hash()`).

- 🖼️ **Portfolio CRUD** — Artisans can manage their digital portfolio with drag-and-drop upload, categorization, and a data table with edit/delete actions, backed by the `api_upload_artwork.php` / `api_delete_artwork.php` endpoints.

- 👤 **Profile Management** — Editable profile card shared by both roles, with inline toggle between display and edit modes that persists changes to the database via the `api_update_profile.php` endpoint.

- ⭐ **Persisted "Kudos" System** — A positive social reinforcement mechanism with multiple appreciation badges (technique, love, creative, inspiring) stored per user/artwork in MySQL.

- 💾 **Follow & Save Artworks** — Enthusiasts can follow artisans and save artworks to a personal favorites list, persisted in the database.

- 📊 **Live Dashboard Analytics** — Artisan dashboard shows real-time totals for Kudos, Views, and Pending Inquiries; enthusiast dashboard shows saved artworks, followed artisans, and interaction history.

- 💬 **Direct Messaging (Inquiry System)** — Private communication channel allowing users to send direct inquiries to Artisans regarding specific artworks.

- 🌀 **Dynamic Gallery** — A masonry-style grid feed with live category filtering via JS DOM manipulation, powered by the `api_get_artworks.php` endpoint (MySQL-backed).

## 🛠️ Tech Stack (Strict Constraints)

This project strictly adheres to a foundational web development stack to demonstrate core competency without external frameworks.

| Technology | Purpose | Constraint |
|------------|---------|------------|
| **HTML5** | Semantic structure | Native, semantic markup |
| **CSS3** | Styling & Layout | Native CSS (Grid, Flexbox, variables, transitions). No frameworks like Tailwind |
| **Vanilla JavaScript** | Frontend Logic | ES6+, DOM manipulation, Event Delegation, Fetch API, localStorage state management |
| **Native PHP** | Backend Logic | API endpoints handling authentication, database operations, and file uploads |
| **SQL (MySQL)** | Database | Normalized relational structure using PDO prepared statements |

## 🌟 Try It Out!

Fannen.tn is fully implemented, backend included. The best way to experience it is to run the real PHP + MySQL application locally — it only takes a few minutes.

### 🚀 Option 1: Run the Full Application Locally (Recommended)
**The real gallery, authentication, role-based dashboard, and live messaging — all backed by MySQL.**

#### Prerequisites
- A local PHP stack such as [XAMPP](https://www.apachefriends.org/), WAMP, or MAMP (PHP 8+, Apache, MySQL/MariaDB).
- A modern web browser (Chrome, Firefox, Edge, Safari).

#### Setup Instructions

1. **Install and start your PHP stack** (e.g., XAMPP), so that Apache and MySQL are both running.

2. **Clone the repository into your server's web root** (`htdocs` for XAMPP, `www` for WAMP):
   ```bash
   cd /path/to/htdocs
   git clone https://github.com/tammam-bt/Fannen.tn.git
   ```

3. **Run the one-time database setup script** by visiting it in your browser:
   ```
   http://localhost/Fannen.tn/src/api/setup_database.php
   ```
   This creates the `fannen_db` database, its tables (`users`, `artworks`, `messages`, `kudos`, `follows`, `saved_artworks`), and seeds a handful of demo artisans, an enthusiast, sample artworks, and sample messages.

4. **Open the app:**
   ```
   http://localhost/Fannen.tn/src/index.php
   ```

5. **Log in with a seeded test account** (all seeded passwords are `fannen123`):

   | Role | Email |
   |------|-------|
   | Artisan | `malek@fannen.tn` |
   | Enthusiast | `ahmed@fannen.tn` |

   Or register your own account via **Join Fannen**.

---

### 🖼️ Option 2: Preview the Static UI Only (No Setup Required)
**A quick, backend-less look at the visual design language.**

- [![Visit Fannen.tn Design Gallery](https://img.shields.io/badge/Visit_Static_Preview-D8603B?style=for-the-badge&logoColor=white)](https://fannentn.netlify.app/)

> ⚠️ This Netlify deployment serves the static HTML/JS preview from `src/` (configured by `netlify.toml`). Netlify cannot run PHP or MySQL, so login, the live database-backed gallery, messaging, and persisted Kudos/Follow/Save do not work there. The static preview uses `localStorage` and sample JSON data for a UI-only experience. Use Option 1 above to try the real application.

### 📁 Project Structure
Fannen.tn is organized with a clear separation between raw resources and the main application source code.
```
📦 Fannen.tn/
│
├── 🖼️ Resources/                      # Non-code assets
│   ├── img/                           # placeholder.svg + team headshots + uploaded artwork images
│   ├── logo/                          # Site & brand logo (SVG)
│   └── video/                         # Hero background video
│
├── 💻 src/                            # Application Source Code
│   ├── index.php                      # Global Feed / Discovery page (Level 1)
│   ├── index.html                     # Static home page for the Netlify UI preview
│   │
│   ├── 📄 php/                        # Secondary PHP pages (Level 2)
│   │   ├── signin.php                 # Sign In (split-screen layout)
│   │   ├── register.php               # Registration (full profile form)
│   │   ├── artwork_detail.php         # Detailed Showcase
│   │   ├── dashboard.php              # Role-Based Workspace (Artisan / Enthusiast)
│   │   ├── inbox.php                  # Communication Hub
│   │   └── our_story.php              # Our Story page
│   │
│   ├── 📄 html/                       # Static HTML pages for the Netlify UI preview
│   │   ├── signin.html
│   │   ├── register.html
│   │   ├── artwork_detail.html
│   │   ├── dashboard.html
│   │   ├── inbox.html
│   │   └── our_story.html
│   │
│   ├── 🎨 css/                        # Stylesheets
│   │   └── styles.css                 # Centralized global styles (+.hidden-role utility)
│   │
│   ├── ⚡ js/                         # JavaScript Modules
│   │   ├── main.js                    # Global UI (navbar auth state via API, image fallbacks)
│   │   ├── data/
│   │   │   ├── team.json              # Static team roster for the Our Story page
│   │   │   └── artworks.json          # Sample artwork data for the static preview
│   │   ├── components/                # Live PHP-app page logic
│   │   │   ├── auth.js
│   │   │   ├── gallery.js
│   │   │   ├── dashboard.js
│   │   │   ├── inbox.js
│   │   │   ├── interaction.js
│   │   │   └── about.js
│   │   └── static/                    # Self-contained JS for the Netlify preview
│   │       ├── main.js
│   │       ├── auth.js
│   │       ├── gallery.js
│   │       ├── dashboard.js
│   │       ├── inbox.js
│   │       ├── interaction.js
│   │       └── about.js
│   │
│   └── 🔌 api/                        # PHP JSON API Endpoints
│       ├── config.php                 # PDO database connection (fannen_db)
│       ├── setup_database.php         # One-time DB creation, tables & seed data
│       ├── auth_handler.php           # Register / Login / Logout / session check
│       ├── api_get_artworks.php       # List artworks (supports ?category=, ?mine=1)
│       ├── api_get_artwork.php        # Single artwork by ?id= (increments views)
│       ├── api_upload_artwork.php     # Artisan artwork upload (multipart + image)
│       ├── api_delete_artwork.php     # Artisan artwork deletion
│       ├── api_get_profile.php        # Logged-in user's profile
│       ├── api_update_profile.php     # Update logged-in user's profile
│       ├── api_get_contacts.php       # Conversation list for the inbox
│       ├── api_get_messages.php       # Messages exchanged with a given contact
│       ├── api_send_message.php     # Send a message / inquiry
│       ├── api_kudos.php              # Toggle Kudos badges per artwork
│       ├── api_follow.php             # Toggle follow status for an artisan
│       ├── api_save_artwork.php       # Toggle saved/favorite artwork
│       ├── api_dashboard_stats.php    # Live dashboard stats (artisan + enthusiast)
│       └── api_interactions.php       # Saved artworks, follows, interaction history
│
├── netlify.toml                       # Static preview config (publish = src)
└── 📄 readme.md                       # Project documentation
```
### 🔄 Current Workflow Overview
**`index.php`** → `gallery.js` fetches from `api_get_artworks.php` → Renders masonry grid → Category filtering via event delegation

**`signin.php / register.php`** → `auth.js` calls `auth_handler.php` → Redirects by role

**`artwork_detail.php`** → `interaction.js` fetches `api_get_artwork.php` (which increments views) → Handles Kudos badges via `api_kudos.php`, Follow via `api_follow.php`, Save via `api_save_artwork.php`, and sends inquiries via `api_send_message.php`

**`dashboard.php`** → `dashboard.js` calls `api_get_profile.php` / `api_update_profile.php` for the profile card, `api_get_artworks.php` / `api_upload_artwork.php` / `api_delete_artwork.php` for the artisan portfolio, and `api_dashboard_stats.php` / `api_interactions.php` for live stats and enthusiast sections

**`inbox.php`** → `inbox.js` calls `api_get_contacts.php` + `api_get_messages.php` (polled every few seconds) + `api_send_message.php` → Renders the two-pane chat UI

**`our_story.php`** → `about.js` fetches the static `team.json` → Renders the team grid

**`index.html` (Netlify preview)** → `js/static/gallery.js` fetches `js/data/artworks.json` and uses `localStorage` for auth state, kudos, and messaging mockups.

### 🚀 Skills Developed
This project provides hands-on experience with:

**🏗️ Monolithic Architecture** — Designing a tightly coupled backend/frontend system using native technologies.

**🎨 Component-Based Styling** — Utilizing native CSS variables and utility classes for a cohesive design system without frameworks.

**👥 Role-Based logic** — Structuring user journeys and page access based on distinct user roles.

**🗃️ Normalized DB Design** — Designing relational SQL structures to handle users, artworks, and messages with integrity.

**⚡ Asynchronous UX** — Utilizing Fetch API implementations for features like live filtering and real-time social engagement connected to PHP APIs.

### 🤝 Support & Contribution
We'd love to hear from you! Fannen.tn is an open academic project, and community interaction helps improve the learning experience.

**🌟 Ways to Get Involved:**
⭐ Star this repository if you find the concept or design interesting

🐛 Report design inconsistencies or HTML/CSS bugs by opening an issue on GitHub

💡 Suggest feature enhancements through discussions

📖 Share your experience - let us know if you have tips for native PHP/JS development!

### 📬 Get in Touch
GitHub Issues: For bug reports and technical questions regarding the existing code.

Discussions: For general conversation about the project concept.

### 🎓 Academic Project Notice

This is a non-commercial, educational-focused project built for learning purposes within the context of university coursework. It is not intended for commercial competition or profit generation of any kind.

### 🙏 Special Thanks
This project is guided and inspired by the Tunisian web development community and standard bodies. Thank you for empowering the next generation of Tunisian developers! 🚀
