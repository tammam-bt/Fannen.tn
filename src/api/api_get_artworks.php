<?php
// api_get_artworks.php — Returns all artworks with artisan names
// Optional: ?category=ceramics to filter, ?mine=1 to get current user's artworks only

require_once __DIR__ . '/config.php';
header('Content-Type: application/json');

$category = $_GET['category'] ?? '';
$mine = $_GET['mine'] ?? '';

$sql = "SELECT artworks.*, users.full_name AS artisanName, users.username AS artisanUsername
        FROM artworks
        JOIN users ON artworks.artisan_id = users.id";
$params = [];

if ($mine === '1' && isset($_SESSION['user_id'])) {
    $sql .= " WHERE artworks.artisan_id = ?";
    $params[] = $_SESSION['user_id'];
    if ($category) {
        $sql .= " AND artworks.category = ?";
        $params[] = $category;
    }
} elseif ($category) {
    $sql .= " WHERE artworks.category = ?";
    $params[] = $category;
}

$sql .= " ORDER BY artworks.created_at DESC";

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$artworks = $stmt->fetchAll();

// Format response to match existing JS expectations
$result = [];
foreach ($artworks as $a) {
    $result[] = [
        'id'          => $a['id'],
        'title'       => $a['title'],
        'artisanId'   => $a['artisan_id'],
        'artisanName' => $a['artisanName'],
        'category'    => $a['category'],
        'description' => $a['description'],
        'image'       => $a['image_path'],
        'kudos'       => ['count' => 0, 'badges' => []],
        'status'      => 'Published',
        'views'       => '0',
        'dateAdded'   => date('M d, Y', strtotime($a['created_at'])),
        'timestamp'   => $a['created_at']
    ];
}

echo json_encode($result);
