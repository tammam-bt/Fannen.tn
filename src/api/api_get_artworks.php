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

// Aggregate kudos counts and user state for the returned artworks
$artworkIds = array_column($artworks, 'id');
$kudosCounts = [];
$myKudos = [];
$mySaved = [];

if (!empty($artworkIds)) {
    $in = implode(',', array_fill(0, count($artworkIds), '?'));

    $countStmt = $pdo->prepare("SELECT artwork_id, COUNT(*) AS c FROM kudos WHERE artwork_id IN ($in) GROUP BY artwork_id");
    $countStmt->execute($artworkIds);
    while ($row = $countStmt->fetch()) {
        $kudosCounts[$row['artwork_id']] = (int) $row['c'];
    }

    if (isset($_SESSION['user_id'])) {
        $userId = $_SESSION['user_id'];

        $kStmt = $pdo->prepare("SELECT artwork_id, badge_type FROM kudos WHERE user_id = ? AND artwork_id IN ($in)");
        $kStmt->execute(array_merge([$userId], $artworkIds));
        while ($row = $kStmt->fetch()) {
            $myKudos[$row['artwork_id']][$row['badge_type']] = true;
        }

        $sStmt = $pdo->prepare("SELECT artwork_id FROM saved_artworks WHERE user_id = ? AND artwork_id IN ($in)");
        $sStmt->execute(array_merge([$userId], $artworkIds));
        while ($row = $sStmt->fetch()) {
            $mySaved[$row['artwork_id']] = true;
        }
    }
}

// Format response to match existing JS expectations
$result = [];
foreach ($artworks as $a) {
    $artworkId = $a['id'];
    $kudosCount = $kudosCounts[$artworkId] ?? 0;
    $isActive = isset($myKudos[$artworkId]['love']);
    $isSaved = isset($mySaved[$artworkId]);

    $result[] = [
        'id'          => $a['id'],
        'title'       => $a['title'],
        'artisanId'   => $a['artisan_id'],
        'artisanName' => $a['artisanName'],
        'category'    => $a['category'],
        'description' => $a['description'],
        'image'       => $a['image_path'],
        'kudos'       => ['count' => $kudosCount, 'isActive' => $isActive],
        'isSaved'     => $isSaved,
        'status'      => 'Published',
        'views'       => (int) ($a['views'] ?? 0),
        'dateAdded'   => date('M d, Y', strtotime($a['created_at'])),
        'timestamp'   => $a['created_at']
    ];
}

echo json_encode($result);
