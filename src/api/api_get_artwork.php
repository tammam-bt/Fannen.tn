<?php
// api_get_artwork.php — Returns a single artwork by ID
// Usage: ?id=1

require_once __DIR__ . '/config.php';
header('Content-Type: application/json');

$id = $_GET['id'] ?? '';

if (!$id) {
    http_response_code(400);
    echo json_encode(['error' => 'Artwork ID required']);
    exit;
}

$stmt = $pdo->prepare("
    SELECT artworks.*, users.full_name AS artisanName, users.username AS artisanUsername, users.image_url AS artisanImage
    FROM artworks
    JOIN users ON artworks.artisan_id = users.id
    WHERE artworks.id = ?
");
$stmt->execute([$id]);
$a = $stmt->fetch();

if (!$a) {
    http_response_code(404);
    echo json_encode(['error' => 'Artwork not found']);
    exit;
}

echo json_encode([
    'id'          => $a['id'],
    'title'       => $a['title'],
    'artisanId'   => $a['artisan_id'],
    'artisanName' => $a['artisanName'],
    'artisanImage'=> $a['artisanImage'],
    'category'    => $a['category'],
    'description' => $a['description'],
    'image'       => $a['image_path'],
    'kudos'       => ['count' => 0, 'badges' => []],
    'timestamp'   => $a['created_at']
]);
