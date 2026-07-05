<?php
// api_interactions.php — Returns enthusiast interaction data for the dashboard
// GET (no params required)
// Returns: { savedArtworks: [...], following: [...], history: [...] }

require_once __DIR__ . '/config.php';
header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Not authenticated']);
    exit;
}

$userId = intval($_SESSION['user_id']);

// Saved artworks (joined with artisan info)
$stmt = $pdo->prepare("
    SELECT artworks.id, artworks.title, artworks.image_path, artworks.category,
           users.full_name AS artisanName, users.username AS artisanUsername
    FROM saved_artworks
    JOIN artworks ON saved_artworks.artwork_id = artworks.id
    JOIN users ON artworks.artisan_id = users.id
    WHERE saved_artworks.user_id = ?
    ORDER BY saved_artworks.created_at DESC
");
$stmt->execute([$userId]);
$saved = $stmt->fetchAll();

// Followed artisans
$stmt = $pdo->prepare("
    SELECT users.id, users.full_name, users.username, users.image_url
    FROM follows
    JOIN users ON follows.artisan_id = users.id
    WHERE follows.follower_id = ?
    ORDER BY follows.created_at DESC
");
$stmt->execute([$userId]);
$following = $stmt->fetchAll();

// Recent interaction history (messages sent or received)
$stmt = $pdo->prepare("
    SELECT m.id, m.content, m.status, m.created_at,
           CASE WHEN m.sender_id = :uid THEN m.receiver_id ELSE m.sender_id END AS partner_id,
           other.full_name AS partner_name,
           CASE WHEN m.sender_id = :uid THEN 'sent' ELSE 'received' END AS direction
    FROM messages m
    JOIN users other ON other.id = CASE WHEN m.sender_id = :uid THEN m.receiver_id ELSE m.sender_id END
    WHERE m.sender_id = :uid OR m.receiver_id = :uid
    ORDER BY m.created_at DESC
    LIMIT 50
");
$stmt->execute(['uid' => $userId]);
$history = $stmt->fetchAll();

$result = [
    'savedArtworks' => array_map(function ($row) {
        return [
            'id' => $row['id'],
            'title' => $row['title'],
            'image' => $row['image_path'],
            'category' => $row['category'],
            'artisanName' => $row['artisanName'],
            'artisanUsername' => $row['artisanUsername']
        ];
    }, $saved),
    'following' => array_map(function ($row) {
        return [
            'id' => $row['id'],
            'fullName' => $row['full_name'],
            'username' => $row['username'],
            'image' => $row['image_url']
        ];
    }, $following),
    'history' => array_map(function ($row) {
        return [
            'id' => $row['id'],
            'content' => $row['content'],
            'status' => $row['status'],
            'createdAt' => $row['created_at'],
            'direction' => $row['direction'],
            'partnerId' => $row['partner_id'],
            'partnerName' => $row['partner_name']
        ];
    }, $history)
];

echo json_encode($result);
