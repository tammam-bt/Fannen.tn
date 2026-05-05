<?php
// api_get_messages.php — Returns messages between the logged-in user and a contact
// Usage: ?contact_id=5
// Session-gated

require_once __DIR__ . '/config.php';
header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$contactId = intval($_GET['contact_id'] ?? 0);

if (!$contactId) {
    http_response_code(400);
    echo json_encode(['error' => 'contact_id required']);
    exit;
}

$userId = $_SESSION['user_id'];

// Fetch messages between the two users
$stmt = $pdo->prepare("
    SELECT * FROM messages
    WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)
    ORDER BY created_at ASC
");
$stmt->execute([$userId, $contactId, $contactId, $userId]);
$messages = $stmt->fetchAll();

// Mark received messages as read
$stmt = $pdo->prepare("
    UPDATE messages SET status = 'read'
    WHERE sender_id = ? AND receiver_id = ? AND status = 'unread'
");
$stmt->execute([$contactId, $userId]);

// Format for JS
$result = [];
foreach ($messages as $msg) {
    $type = ($msg['sender_id'] == $userId) ? 'sent' : 'received';
    $result[] = [
        'id'             => $msg['id'],
        'conversationId' => 'contact-' . $contactId,
        'type'           => $type,
        'content'        => $msg['content'],
        'time'           => date('h:i A', strtotime($msg['created_at'])),
        'status'         => $msg['status']
    ];
}

echo json_encode($result);
