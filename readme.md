# 🎨 Fannen.tn

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![PHP](https://img.shields.io/badge/PHP-777BB4?style=for-the-badge&logo=php&logoColor=white)](https://www.php.net/)
[![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)

> 🎓 **Academic Project** | 🖼️ **Artisan Portfolio** | 🇹🇳 **Made in Tunisia**

**Fannen.tn** is a digital portfolio and networking platform designed specifically for Tunisian artisans, such as potters, weavers, and woodworkers. Developed as an academic project for a "Développement Web" course, it aims to provide a modern showcase for physical crafts while omitting standard e-commerce features. The primary objectives are visual showcasing of Tunisian heritage, positive social reinforcement through an appreciation badge system, and direct lead generation via internal messaging.

---

> 🛠️ **Current Status**: The project is fully implemented (Phase 3 complete). It features a Native PHP REST API backend connected to a MySQL database using PDO. The frontend uses Vanilla JS to interface with the backend APIs for dynamic gallery rendering, authentication, profile management, and real-time messaging.

## 📸 Visual Showcase

Explore the design and user journey envisioned for Fannen.tn through these high-fidelity mockups created during the design phase:

### 🏠 **Global Feed (index.html)**
*Mockup placeholder: Index page showing masonry grid of artisan works*

The homepage serves as the global discovery feed, utilizing a masonry-style grid to display uploaded artworks. It features visual category filter buttons that allow users to dynamic filter the feed (e.g., viewing only "Ceramics") without reloading the page.

### 🛡️ **Authentication (signin.php & register.php)**
*Mockup placeholder: Split-screen login/register form with role selection*

Authentication is split into two dedicated pages with a premium 50/50 split-screen layout. **Sign In** provides email, password, and role selection. **Register** collects full profile details (name, username, age, phone, email, password, role). Users are redirected based on their role — Artisans go to the Dashboard, Enthusiasts go to the Homepage.

### ⭐ **Artwork Showcase (artwork_detail.php)**
*Mockup placeholder: Detailed view with large image, description, and Kudos badges*

This page provides a detailed view of a specific craft, featuring a large high-resolution image, detailed description, and an artisan profile snippet. It serves as the hub for interaction, hosting the unique "Kudos" badge system and the primary "Contact Artisan" button.

### 💰 **Kudos & Messaging Flow**
*Mockup placeholder: Close-up of Kudos badges and the messaging modal interface*

Fannen.tn replaces numerical ratings with specific appreciation badges (e.g., "Incredible Technique", "Creative Idea"). Users can also click "Contact Artisan" to open a messaging form regarding a specific artwork, facilitating direct inquiries.

### 📋 **Role-Based Dashboard (dashboard.php)**
*Mockup placeholder: Artisan backend view with upload form and active listings*

The dashboard dynamically adapts based on the user's role. **Artisans** see analytics stats (Kudos, Views, Inquiries), a drag-and-drop upload zone, and a portfolio management table. **Enthusiasts** see their profile details, saved/favorite artworks, followed artisans, and interaction history. Both roles share a profile card with inline edit functionality. Sidebar links update dynamically: "Dashboard" + "Messaging" for artisans, "Profile" + "Messaging" for enthusiasts.

### 🔍 **Messaging Inbox (inbox.php)**
*Mockup placeholder: Two-pane communication hub layout*

The communication hub utilizes a classic two-pane layout: a conversation list on the left and the active message thread on the right, displaying inquiries linked to specific artworks.

## ✨ Key Features

- 👥 **Role-Based Dashboard Rendering** — The dashboard dynamically shows/hides sections using `.role-artisan-only` and `.role-enthusiast-only` wrapper classes, toggled via the `.hidden-role` CSS utility.

- 🔐 **Split Authentication Flow** — Dedicated Sign In and Registration pages with full profile data capture on registration, persisted via `localStorage`.

- 🖼️ **Portfolio CRUD** — Artisans can manage their digital portfolio with drag-and-drop upload, categorization, and a data table with edit/delete actions.

- 👤 **Profile Management** — Editable profile card shared by both roles, with inline toggle between display and edit modes that persists changes to `localStorage`.

- ⭐ **Asynchronous "Kudos" System** — A positive social reinforcement mechanism utilizing specific appreciation badges instead of 1-5 star ratings.

- 💬 **Direct Messaging (Inquiry System)** — Private communication channel allowing users to send direct inquiries to Artisans regarding specific artworks.

- 🌀 **Dynamic Gallery** — A masonry-style grid feed with live category filtering via JS DOM manipulation, powered by `artworks.json` data.

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

As this is an academic project currently focused on frontend structure and design, a live interactive demo is not yet available. However, you can explore the design language and intended structure:

### 🚀 Option 1: Explore the live demo (Recommended)
**Explore the envisioned user interface immediately!**

- [![Visit Fannen.tn Design Gallery](https://img.shields.io/badge/Visit_Live_URL-D8603B?style=for-the-badge&logoColor=white)](https://roaring-cendol-b1e95b.netlify.app/src/index.html)

---

### 🔧 Option 2: Run Frontend Locally
**Explore the HTML/CSS structure on your local machine.**

#### Prerequisites
- A modern web browser (Chrome, Firefox, Edge, Safari).

#### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone [https://github.com/tammam-bt/fannen.tn.git](https://github.com/tammam-bt/fannen.tn.git)
   cd fannen.tn
   ```
2. **Navigate to the source files**
   ```bash
   cd src
   ```
3. **Open index.html**

   Open `index.html` with a live server (e.g., VS Code Live Server extension) or double-click to open directly in your browser. You can navigate between pages using the header links.

**💡 Development Note**: The backend functionality (PHP/MySQL) has been successfully implemented, and the frontend connects to it via a set of RESTful APIs.

### 📁 Project Structure
Fannen.tn is organized with a clear separation between raw resources and the main application source code.
```
📦 Fannen.tn/
│
├── 🖼️ Resources/                      # Non-code assets
│   ├── img/                           # Placeholder photos & design mockups
│   └── logo/                          # Site & brand logos
│
├── 💻 src/                            # Application Source Code
│   ├── index.php                      # Global Feed / Discovery page (Level 1)
│   │
│   ├── 📄 php/                        # Secondary PHP pages (Level 2)
│   │   ├── signin.php                 # Sign In (split-screen layout)
│   │   ├── register.php               # Registration (full profile form)
│   │   ├── artwork_detail.php         # Detailed Showcase
│   │   ├── dashboard.php              # Role-Based Workspace (Artisan / Enthusiast)
│   │   ├── inbox.php                  # Communication Hub
│   │   └── our_story.php              # Our Story page
│   │
│   ├── 🎨 css/                        # Stylesheets
│   │   └── styles.css                 # Centralized global styles (+.hidden-role utility)
│   │
│   ├── ⚡ js/                         # JavaScript Modules
│   │   ├── main.js                    # Global UI (navbar auth state, image fallbacks)
│   │   └── components/                # Page-specific logic
│   │       ├── auth.js                # Sign in & registration handlers
│   │       ├── gallery.js             # Gallery rendering & category filtering
│   │       ├── dashboard.js           # Role-based rendering, profile management
│   │       ├── inbox.js               # Messaging & conversation management
│   │       └── interaction.js         # Artwork detail, kudos, inquiry modal
│   │
│   └── 🔌 api/                        # PHP API Endpoints
│       ├── config.php                 # Database connection
│       ├── auth_handler.php           # Registration/Login
│       └── setup_database.php         # Database migration & seeder
│
└── 📄 README.md                       # Project documentation
```
### 🔄 Current Workflow Overview
**`index.php`** → `gallery.js` fetches from `api_get_artworks.php` → Renders masonry grid → Category filtering via event delegation

**`signin.php / register.php`** → `auth.js` calls `auth_handler.php` → Redirects by role

**`artwork_detail.php`** → `interaction.js` fetches artwork, handles Kudos badges & inquiry modal

**`dashboard.php`** → `dashboard.js` calls `api_get_profile.php` and `api_get_artworks.php` → Renders profile data and portfolio table

**`inbox.php`** → `inbox.js` calls `api_get_contacts.php` + `api_get_messages.php` → Renders two-pane chat UI

### 🚀 Skills Developed
This project provides hands-on experience with:

**🏗️ Monolithic Architecture** — Designing a tightly coupled backend/frontend system using native technologies.

**🎨 Component-Based Styling** — Utilizing native CSS variables and utility classes for a cohesive design system without frameworks.

**👥 Role-Based logic** — Structuring user journeys and page access based on distinct user roles.

**🗃️ Normalized DB Design** — Planning relational SQL structures to handle users, artworks, kudos, and messages with integrity.

**⚡ Asynchronous UX** — Utilizing Fetch API implementations for features like live filtering and real-time social engagement connected to PHP APIs.

### 🤝 Support & Contribution
We'd love to hear from you! Fannen.tn is an open academic project, and community interaction helps improve the learning experience.

**🌟 Ways to Get Involved:**
⭐ Star this repository if you find the concept or design interesting

🐛 Report design inconsistencies or HTML/CSS bugs by opening an issue on GitHub

💡 Suggest feature enhancements for future PHP/JS implementation through discussions

📖 Share your experience - let us know if you have tips for native PHP/JS development!

### 📬 Get in Touch
GitHub Issues: For bug reports and technical questions regarding the existing code.

Discussions: For general conversation about the project concept.

### 🎓 Academic Project Notice

This is a non-commercial, educational-focused project built for learning purposes within the context of university coursework. It is not intended for commercial competition or profit generation of any kind.

### 🙏 Special Thanks
This project is guided and inspired by the Tunisian web development community and standard bodies. Thank you for empowering the next generation of Tunisian developers! 🚀
