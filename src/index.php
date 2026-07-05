<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fannen.tn - Artisan Crafts</title>
    <link rel="stylesheet" href="css/styles.css">
    <meta name="description"
        content="Fannen connects global collectors directly to the vanishing artisan craft of the Maghreb.">
</head>

<body>
    <!-- Navbar -->
    <header class="navbar">
        <a href="#">
            <div class="navbar-logo">
                <img src="../Resources/logo/logo.svg" alt="Fannen.tn Logo">
            </div>
        </a>
        <div class="navbar-search">
            <svg viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clip-rule="evenodd" />
            </svg>
            <input type="text" placeholder="Search ceramics, textiles...">
        </div>
        <nav class="navbar-nav">
            <a href="index.php">Explore</a>
            <a href="php/our_story.php">Our Story</a>
            <a href="php/signin.php" class="btn btn-ghost" style="margin-left: 1rem;">Login</a>
            <a href="php/register.php" class="btn btn-primary">Join Fannen</a>
        </nav>
    </header>

    <main>
        <!-- Hero Section -->
        <section class="hero-section">
            <video class="hero-video" autoplay muted loop playsinline preload="auto">
                <source src="../Resources/video/hero.mp4" type="video/mp4">
                Your browser does not support the video tag.
            </video>
            <div class="hero-overlay"></div>
            <div class="container">
                <h1>Preserving the Sacred Hand-Craft of the Maghreb.</h1>
                <p>Fannen connects global collectors directly to the vanishing artisan craft of the Maghreb. Timeless.
                    Authentic. One piece at a time.</p>
                <div class="flex justify-center gap-sm">
                    <a href="#gallery" class="btn btn-primary">Explore Vault</a>
                    <a href="php/register.php" class="btn btn-outline" style="background:#fff;">Join as
                        Artisan</a>
                </div>
            </div>
        </section>

        <!-- Gallery Section -->
        <section id="gallery" class="container" style="padding-top: var(--spacing-xxl);">
            <div class="flex justify-between items-center" style="margin-bottom: var(--spacing-lg);">
                <h2 style="font-size: 2rem;">The Artisan Vault</h2>

                <!-- Sub nav Categories -->
                <nav class="flex gap-md" id="category-filters">
                    <button class="btn btn-ghost font-bold text-terracotta" id="btn-all">All Works</button>
                    <button class="btn btn-ghost" id="btn-ceramics">Ceramics</button>
                    <button class="btn btn-ghost" id="btn-textiles">Textiles</button>
                    <button class="btn btn-ghost" id="btn-jewelry">Jewelry</button>
                </nav>
            </div>

            <!-- CSS Grid Gallery -->
            <div class="gallery-grid">
                <!-- Dynamically populated by gallery.js -->
            </div>

            <div class="text-center" style="margin-top: var(--spacing-xl);">
                <button class="btn btn-outline" id="load-more-btn"
                    style="padding: 1rem 3rem; border-radius: var(--radius-full); margin-bottom: var(--spacing-lg);">Discover
                    More Pieces</button>
            </div>
        </section>
    </main>

    <!-- Footer -->
    <footer class="site-footer">
        <div class="container">
            <div class="footer-main">
                <div class="footer-brand">
                    <h2>Fannen.tn</h2>
                    <p style="max-width: 300px;">The premier digital gallery bringing Tunisian craftsmanship directly
                        from master hands to global collectors and connoisseurs.</p>
                </div>
                <div class="footer-col">
                    <h3>Explore</h3>
                    <ul>
                        <li><a href="#">Ceramics</a></li>
                        <li><a href="#">Textiles & Rugs</a></li>
                        <li><a href="#">Olive Woodwork</a></li>
                        <li><a href="#">Artisan Jewelry</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h3>Company</h3>
                    <ul>
                        <li><a href="php/our_story.php">Our Story</a></li>
                        <li><a href="#">Meet the Artisans</a></li>
                        <li><a href="#">Authenticity Guarantee</a></li>
                        <li><a href="#">Press & Media</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h3>Support</h3>
                    <ul>
                        <li><a href="#">Shipping & Returns</a></li>
                        <li><a href="#">Care Guides</a></li>
                        <li><a href="#">Contact Us</a></li>
                        <li><a href="#">FAQ</a></li>
                    </ul>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2024 Fannen.tn. Supporting Tunisian craftsmanship.</p>
                <div class="flex gap-sm">
                    <a href="#">Privacy Policy</a>
                    <a href="#">Terms of Service</a>
                </div>
            </div>
        </div>
    </footer>

    <script src="js/main.js"></script>
    <script src="js/components/gallery.js"></script>
</body>

</html>
