<?php
// api_follow.php — Toggle follow status for an artisan
// POST: artisan_id
// Returns: { success, isFollowing }

require_once __DIR__ . '/config.php';
header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Not authenticated']);
    exit;
}

$userId = intval($_SESSION['user_id']);
$artisanId = intval($_POST['artisan_id'] ?? 0);

if (!$artisanId) {
    http_response_code(400);
    echo json_encode(['error' => 'Artisan ID required']);
    exit;
}

if ($artisanId === $userId) {
    http_response_code(400);
    echo json_encode(['error' => 'Cannot follow yourself']);
    exit;
}

$stmt = $pdo->prepare("SELECT id FROM users WHERE id = ? AND role = 'artisan'");
$stmt->execute([$artisanId]);
if (!$stmt->fetch()) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid artisan']);
    exit;
}

$stmt = $pdo->prepare("SELECT id FROM follows WHERE follower_id = ? AND artisan_id = ?");
$stmt->execute([$userId, $artisanId]);
$existing = $stmt->fetch();

$isFollowing = false;

if ($existing) {
    $stmt = $pdo->prepare("DELETE FROM follows WHERE id = ?");
    $stmt->execute([$existing['id']]);
} else {
    $stmt = $pdo->prepare("INSERT INTO follows (follower_id, artisan_id) VALUES (?, ?)");
    $stmt->execute([$userId, $artisanId]);
    $isFollowing = true;
}

echo json_encode([
    'success' => true,
    'isFollowing' => $isFollowing
]);
