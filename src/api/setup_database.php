<?php
// setup_database.php — Run once to create database, tables, and seed data
// Access via: http://localhost/Fannen.tn/src/api/setup_database.php

$host = 'localhost';
$username = 'root';
$password = '';

try {
    // Connect without database to create it
    $pdo = new PDO("mysql:host=$host;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Create database
    $pdo->exec("CREATE DATABASE IF NOT EXISTS fannen_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    $pdo->exec("USE fannen_db");

    echo "<h2>✅ Database 'fannen_db' created.</h2>";

    // Create users table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS users (
            id INT PRIMARY KEY AUTO_INCREMENT,
            full_name VARCHAR(255) NOT NULL,
            username VARCHAR(50) UNIQUE NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            phone VARCHAR(20),
            age INT,
            password_hash VARCHAR(255) NOT NULL,
            role ENUM('artisan', 'enthusiast') NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ");
    echo "<p>✅ Table 'users' created.</p>";

    // Create artworks table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS artworks (
            id INT PRIMARY KEY AUTO_INCREMENT,
            artisan_id INT NOT NULL,
            title VARCHAR(255) NOT NULL,
            category VARCHAR(100),
            description TEXT,
            image_path VARCHAR(500),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (artisan_id) REFERENCES users(id) ON DELETE CASCADE
        )
    ");
    echo "<p>✅ Table 'artworks' created.</p>";

    // Create messages table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS messages (
            id INT PRIMARY KEY AUTO_INCREMENT,
            sender_id INT NOT NULL,
            receiver_id INT NOT NULL,
            content TEXT NOT NULL,
            status ENUM('unread', 'read') DEFAULT 'unread',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
        )
    ");
    echo "<p>✅ Table 'messages' created.</p>";

    // --- SEED DATA ---

    // Default password for all seed users: "fannen123"
    $defaultPass = password_hash('fannen123', PASSWORD_DEFAULT);

    // Seed artisan users
    $artisans = [
        ['Hedi Baklouti',   'hedi_b',     'hedi@fannen.tn',     '22111111', 45, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop'],
        ['Malek Ben Salem', 'malek_bs',   'malek@fannen.tn',    '22222222', 38, 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop'],
        ['Fatma Berriri',   'fatma_b',    'fatma@fannen.tn',    '22333333', 52, 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop'],
        ['Amine Khlif',     'amine_k',    'amine@fannen.tn',    '22444444', 30, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop'],
        ['Yassine Dridi',   'yassine_d',  'yassine@fannen.tn',  '22555555', 41, 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop'],
    ];

    $stmt = $pdo->prepare("
        INSERT IGNORE INTO users (full_name, username, email, phone, age, password_hash, role, image_url)
        VALUES (?, ?, ?, ?, ?, ?, 'artisan', ?)
    ");

    foreach ($artisans as $a) {
        $stmt->execute([$a[0], $a[1], $a[2], $a[3], $a[4], $defaultPass, $a[5]]);
    }
    echo "<p>✅ 5 artisan users seeded (password: fannen123).</p>";

    // Seed one enthusiast user for testing
    $stmt->execute(['Ahmed Tester', 'ahmed_t', 'ahmed@fannen.tn', '22666666', 25, $defaultPass, 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop']);
    $pdo->exec("UPDATE users SET role = 'enthusiast' WHERE username = 'ahmed_t'");
    echo "<p>✅ 1 enthusiast user seeded (ahmed@fannen.tn / fannen123).</p>";

    // Fetch artisan IDs
    $userIds = [];
    $res = $pdo->query("SELECT id, username FROM users WHERE role = 'artisan' ORDER BY id");
    while ($row = $res->fetch()) {
        $userIds[$row['username']] = $row['id'];
    }

    // Seed artworks
    $artworks = [
        [$userIds['hedi_b'],    'Kairouan Blue Amphora',  'ceramics',  'Hand-painted terracotta with traditional indigo pigments.', 'https://images.unsplash.com/photo-1663888672535-956677e08412?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
        [$userIds['malek_bs'],  'Cerulean Oasis Vase',    'ceramics',  'A beautiful vase showcasing the deep blue hues of traditional oasis pottery.', 'https://images.unsplash.com/photo-1631125915902-d8abe9225ff2?q=80&w=687&auto=format&fit=crop'],
        [$userIds['fatma_b'],   'Atlas Wool Kilim',       'textiles',  'Hand-woven rug made from pure Atlas mountain wool.', 'https://images.unsplash.com/photo-1606885118474-c8baf907e998?q=80&w=687&auto=format&fit=crop'],
        [$userIds['amine_k'],   'Nabeul Blue Amphora',    'ceramics',  'A classic amphora painted with Nabeul\'s signature blue and white motifs.', 'https://plus.unsplash.com/premium_photo-1673152979526-98b94a39b6aa?q=80&w=687&auto=format&fit=crop'],
        [$userIds['yassine_d'], 'Olive Wood Serving Bowl','woodwork',  'A uniquely grained serving bowl carved from a single piece of ancient olive wood.', 'https://plus.unsplash.com/premium_photo-1677249227901-38319e9408fd?q=80&w=687&auto=format&fit=crop'],
    ];

    $stmt = $pdo->prepare("
        INSERT INTO artworks (artisan_id, title, category, description, image_path)
        VALUES (?, ?, ?, ?, ?)
    ");
    foreach ($artworks as $a) {
        $stmt->execute($a);
    }
    echo "<p>✅ 5 artworks seeded.</p>";

    // Seed sample messages between enthusiast (ahmed_t) and artisan (malek_bs)
    $ahmadId = $pdo->query("SELECT id FROM users WHERE username = 'ahmed_t'")->fetchColumn();
    $malekId = $userIds['malek_bs'];

    $msgs = [
        [$ahmadId, $malekId, 'Hello! I saw your Cerulean Oasis Vase at the gallery. Is it available?'],
        [$malekId, $ahmadId, 'Hi Ahmed! Thank you for the kind words. It\'s one of my favorite pieces.'],
        [$ahmadId, $malekId, 'I absolutely love the detail on the neck. Is it available for shipping to Sousse?'],
    ];

    $stmt = $pdo->prepare("INSERT INTO messages (sender_id, receiver_id, content, status) VALUES (?, ?, ?, 'read')");
    foreach ($msgs as $m) {
        $stmt->execute($m);
    }
    echo "<p>✅ Sample messages seeded.</p>";

    echo "<hr><h3>🎉 Setup complete! You can now use the platform.</h3>";
    echo "<p><a href='../index.php'>→ Go to Homepage</a></p>";
    echo "<p><strong>Test Accounts:</strong></p>";
    echo "<ul>";
    echo "<li>Artisan: malek@fannen.tn / fannen123</li>";
    echo "<li>Enthusiast: ahmed@fannen.tn / fannen123</li>";
    echo "</ul>";

} catch (PDOException $e) {
    echo "<h2>❌ Error:</h2><pre>" . $e->getMessage() . "</pre>";
}
