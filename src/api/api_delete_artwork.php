<?php
// api_delete_artwork.php — Deletes an artwork (artisan only, own artworks)
// Session-gated, POST with artwork_id

require_once __DIR__ . '/config.php';
header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

if ($_SESSION['role'] !== 'artisan') {
    http_response_code(403);
    echo json_encode(['error' => 'Only artisans can delete artworks']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'POST required']);
    exit;
}

$artworkId = intval($_POST['artwork_id'] ?? 0);

if (!$artworkId) {
    http_response_code(400);
    echo json_encode(['error' => 'Artwork ID required']);
    exit;
}

// Only delete if it belongs to the current user
$stmt = $pdo->prepare("DELETE FROM artworks WHERE id = ? AND artisan_id = ?");
$stmt->execute([$artworkId, $_SESSION['user_id']]);

if ($stmt->rowCount() === 0) {
    http_response_code(404);
    echo json_encode(['error' => 'Artwork not found or not yours']);
    exit;
}

echo json_encode(['success' => true]);
