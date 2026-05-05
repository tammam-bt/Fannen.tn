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
        INSERT INTO artworks (artisan_id, title, category, description, image_path)
        VALUES (?, ?, ?, ?, ?)
    ");
    foreach ($artisans as $a) {
        $stmt->execute($a);
    }
    echo "<p>✅ 5 artists seeded.</p>";



} catch (PDOException $e) {
    echo "<h2>❌ Error:</h2><pre>" . $e->getMessage() . "</pre>";
}
