<?php
// api_dashboard_stats.php — Returns live stats for the logged-in user
// Artisan: totalKudos, totalViews, pendingInquiries
// Enthusiast: savedCount, followingCount, conversationCount

require_once __DIR__ . '/config.php';
header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Not authenticated']);
    exit;
}

$userId = intval($_SESSION['user_id']);
$role = $_SESSION['role'] ?? 'enthusiast';

if ($role === 'artisan') {
    // Total kudos received across all artworks by this artisan
    $stmt = $pdo->prepare("
        SELECT COUNT(*) FROM kudos
        WHERE artwork_id IN (SELECT id FROM artworks WHERE artisan_id = ?)
    ");
    $stmt->execute([$userId]);
    $totalKudos = (int) $stmt->fetchColumn();

    // Total views across all artworks by this artisan
    $stmt = $pdo->prepare("SELECT COALESCE(SUM(views), 0) FROM artworks WHERE artisan_id = ?");
    $stmt->execute([$userId]);
    $totalViews = (int) $stmt->fetchColumn();

    // Unread messages received by this artisan
    $stmt = $pdo->prepare("
        SELECT COUNT(*) FROM messages
        WHERE receiver_id = ? AND status = 'unread'
    ");
    $stmt->execute([$userId]);
    $pendingInquiries = (int) $stmt->fetchColumn();

    echo json_encode([
        'success' => true,
        'role' => 'artisan',
        'totalKudos' => $totalKudos,
        'totalViews' => $totalViews,
        'pendingInquiries' => $pendingInquiries
    ]);
} else {
    // Enthusiast stats
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM saved_artworks WHERE user_id = ?");
    $stmt->execute([$userId]);
    $savedCount = (int) $stmt->fetchColumn();

    $stmt = $pdo->prepare("SELECT COUNT(*) FROM follows WHERE follower_id = ?");
    $stmt->execute([$userId]);
    $followingCount = (int) $stmt->fetchColumn();

    $stmt = $pdo->prepare("SELECT COUNT(*) FROM messages WHERE sender_id = ? OR receiver_id = ?");
    $stmt->execute([$userId, $userId]);
    $conversationCount = (int) $stmt->fetchColumn();

    echo json_encode([
        'success' => true,
        'role' => 'enthusiast',
        'savedCount' => $savedCount,
        'followingCount' => $followingCount,
        'conversationCount' => $conversationCount
    ]);
}
