<?php
// api_save_artwork.php — Toggle save/favorite status for an artwork
// POST: artwork_id
// Returns: { success, isSaved }

require_once __DIR__ . '/config.php';
header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Not authenticated']);
    exit;
}

$userId = intval($_SESSION['user_id']);
$artworkId = intval($_POST['artwork_id'] ?? 0);

if (!$artworkId) {
    http_response_code(400);
    echo json_encode(['error' => 'Artwork ID required']);
    exit;
}

$stmt = $pdo->prepare("SELECT id FROM artworks WHERE id = ?");
$stmt->execute([$artworkId]);
if (!$stmt->fetch()) {
    http_response_code(404);
    echo json_encode(['error' => 'Artwork not found']);
    exit;
}

$stmt = $pdo->prepare("SELECT id FROM saved_artworks WHERE user_id = ? AND artwork_id = ?");
$stmt->execute([$userId, $artworkId]);
$existing = $stmt->fetch();

$isSaved = false;

if ($existing) {
    $stmt = $pdo->prepare("DELETE FROM saved_artworks WHERE id = ?");
    $stmt->execute([$existing['id']]);
} else {
    $stmt = $pdo->prepare("INSERT INTO saved_artworks (user_id, artwork_id) VALUES (?, ?)");
    $stmt->execute([$userId, $artworkId]);
    $isSaved = true;
}

echo json_encode([
    'success' => true,
    'isSaved' => $isSaved
]);
