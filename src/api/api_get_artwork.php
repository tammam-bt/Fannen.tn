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

// Increment view count before returning the artwork
$update = $pdo->prepare("UPDATE artworks SET views = views + 1 WHERE id = ?");
$update->execute([$id]);

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

// Per-badge kudos counts
$badgeStmt = $pdo->prepare("SELECT badge_type, COUNT(*) AS c FROM kudos WHERE artwork_id = ? GROUP BY badge_type");
$badgeStmt->execute([$id]);
$badgeCounts = [];
while ($row = $badgeStmt->fetch()) {
    $badgeCounts[$row['badge_type']] = (int) $row['c'];
}
$totalKudos = array_sum($badgeCounts);

// User-specific flags
$myBadges = [];
$isSaved = false;
$isFollowing = false;
if (isset($_SESSION['user_id'])) {
    $userId = $_SESSION['user_id'];

    $kStmt = $pdo->prepare("SELECT badge_type FROM kudos WHERE user_id = ? AND artwork_id = ?");
    $kStmt->execute([$userId, $id]);
    while ($row = $kStmt->fetch()) {
        $myBadges[$row['badge_type']] = true;
    }

    $sStmt = $pdo->prepare("SELECT 1 FROM saved_artworks WHERE user_id = ? AND artwork_id = ?");
    $sStmt->execute([$userId, $id]);
    $isSaved = (bool) $sStmt->fetch();

    $fStmt = $pdo->prepare("SELECT 1 FROM follows WHERE follower_id = ? AND artisan_id = ?");
    $fStmt->execute([$userId, $a['artisan_id']]);
    $isFollowing = (bool) $fStmt->fetch();
}

echo json_encode([
    'id'          => $a['id'],
    'title'       => $a['title'],
    'artisanId'   => $a['artisan_id'],
    'artisanName' => $a['artisanName'],
    'artisanUsername' => $a['artisanUsername'],
    'artisanImage'=> $a['artisanImage'],
    'category'    => $a['category'],
    'description' => $a['description'],
    'image'       => $a['image_path'],
    'views'       => (int) $a['views'],
    'kudos'       => [
        'count' => $totalKudos,
        'badges' => [
            'technique' => $badgeCounts['technique'] ?? 0,
            'love'      => $badgeCounts['love'] ?? 0,
            'creative'  => $badgeCounts['creative'] ?? 0,
            'inspiring' => $badgeCounts['inspiring'] ?? 0
        ],
        'myBadges' => array_keys($myBadges)
    ],
    'isSaved'     => $isSaved,
    'isFollowing' => $isFollowing,
    'timestamp'   => $a['created_at']
]);
