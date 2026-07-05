<?php
// api_kudos.php — Toggle a kudos badge for an artwork
// POST: artwork_id, badge_type (optional, default 'love')
// Returns: { success, isActive, count (total kudos), badgeCount (for this badge type) }

require_once __DIR__ . '/config.php';
header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Not authenticated']);
    exit;
}

$userId = intval($_SESSION['user_id']);
$artworkId = intval($_POST['artwork_id'] ?? 0);
$badgeType = in_array($_POST['badge_type'] ?? '', ['technique', 'love', 'creative', 'inspiring'], true)
    ? $_POST['badge_type']
    : 'love';

if (!$artworkId) {
    http_response_code(400);
    echo json_encode(['error' => 'Artwork ID required']);
    exit;
}

$stmt = $pdo->prepare("SELECT id, artisan_id FROM artworks WHERE id = ?");
$stmt->execute([$artworkId]);
$artwork = $stmt->fetch();

if (!$artwork) {
    http_response_code(404);
    echo json_encode(['error' => 'Artwork not found']);
    exit;
}

// Optional: prevent artisans from kudos'ing their own work
if ($artwork['artisan_id'] == $userId) {
    http_response_code(403);
    echo json_encode(['error' => 'You cannot kudos your own artwork']);
    exit;
}

$stmt = $pdo->prepare("SELECT id FROM kudos WHERE user_id = ? AND artwork_id = ? AND badge_type = ?");
$stmt->execute([$userId, $artworkId, $badgeType]);
$existing = $stmt->fetch();

$isActive = false;

if ($existing) {
    $stmt = $pdo->prepare("DELETE FROM kudos WHERE id = ?");
    $stmt->execute([$existing['id']]);
} else {
    $stmt = $pdo->prepare("INSERT INTO kudos (user_id, artwork_id, badge_type) VALUES (?, ?, ?)");
    $stmt->execute([$userId, $artworkId, $badgeType]);
    $isActive = true;
}

$total = $pdo->prepare("SELECT COUNT(*) FROM kudos WHERE artwork_id = ?");
$total->execute([$artworkId]);
$totalCount = (int) $total->fetchColumn();

$badge = $pdo->prepare("SELECT COUNT(*) FROM kudos WHERE artwork_id = ? AND badge_type = ?");
$badge->execute([$artworkId, $badgeType]);
$badgeCount = (int) $badge->fetchColumn();

echo json_encode([
    'success' => true,
    'isActive' => $isActive,
    'count' => $totalCount,
    'badgeCount' => $badgeCount
]);
