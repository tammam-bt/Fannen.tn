<?php
// api_send_message.php — Sends a message from the logged-in user
// Session-gated, POST with receiver_id and content

require_once __DIR__ . '/config.php';
header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'POST required']);
    exit;
}

// Accept both form data and JSON body
$contentType = $_SERVER['CONTENT_TYPE'] ?? '';
if (strpos($contentType, 'application/json') !== false) {
    $input = json_decode(file_get_contents('php://input'), true);
    $receiverId = intval($input['receiver_id'] ?? 0);
    $content    = trim($input['content'] ?? '');
} else {
    $receiverId = intval($_POST['receiver_id'] ?? 0);
    $content    = trim($_POST['content'] ?? '');
}

if (!$receiverId || !$content) {
    http_response_code(400);
    echo json_encode(['error' => 'receiver_id and content required']);
    exit;
}

$stmt = $pdo->prepare("
    INSERT INTO messages (sender_id, receiver_id, content, status)
    VALUES (?, ?, ?, 'unread')
");
$stmt->execute([$_SESSION['user_id'], $receiverId, $content]);

echo json_encode([
    'success' => true,
    'id'      => $pdo->lastInsertId()
]);
