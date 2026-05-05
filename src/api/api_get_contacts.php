<?php
// api_get_contacts.php — Returns conversation list for the logged-in user
// Session-gated

require_once __DIR__ . '/config.php';
header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$userId = $_SESSION['user_id'];

// Find all users who have exchanged messages with the current user
$stmt = $pdo->prepare("
    SELECT DISTINCT
        CASE
            WHEN sender_id = ? THEN receiver_id
            ELSE sender_id
        END AS contact_id
    FROM messages
    WHERE sender_id = ? OR receiver_id = ?
");
$stmt->execute([$userId, $userId, $userId]);
$contactIds = $stmt->fetchAll(PDO::FETCH_COLUMN);

if (empty($contactIds)) {
    echo json_encode([]);
    exit;
}

$contacts = [];
foreach ($contactIds as $contactId) {
    // Get contact info
    $stmt = $pdo->prepare("SELECT id, full_name, username, image_url FROM users WHERE id = ?");
    $stmt->execute([$contactId]);
    $contact = $stmt->fetch();
    if (!$contact) continue;

    // Get last message
    $stmt = $pdo->prepare("
        SELECT content, created_at FROM messages
        WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)
        ORDER BY created_at DESC LIMIT 1
    ");
    $stmt->execute([$userId, $contactId, $contactId, $userId]);
    $lastMsg = $stmt->fetch();

    // Count unread messages from this contact
    $stmt = $pdo->prepare("
        SELECT COUNT(*) FROM messages
        WHERE sender_id = ? AND receiver_id = ? AND status = 'unread'
    ");
    $stmt->execute([$contactId, $userId]);
    $unreadCount = $stmt->fetchColumn();

    // Format timestamp
    $timestamp = '';
    if ($lastMsg) {
        $diff = time() - strtotime($lastMsg['created_at']);
        if ($diff < 60) $timestamp = 'Just now';
        elseif ($diff < 3600) $timestamp = floor($diff / 60) . ' min ago';
        elseif ($diff < 86400) $timestamp = floor($diff / 3600) . ' hour ago';
        else $timestamp = date('M d', strtotime($lastMsg['created_at']));
    }
    
    $avatarUrl = $contact['image_url'] ?: 'https://ui-avatars.com/api/?name=' . urlencode($contact['full_name']) . '&background=D8603B&color=fff&size=100';

    $contacts[] = [
        'id'          => 'contact-' . $contact['id'],
        'contactId'   => $contact['id'],
        'partnerName' => $contact['full_name'],
        'avatar'      => $avatarUrl,
        'lastMessage' => $lastMsg ? $lastMsg['content'] : '',
        'timestamp'   => $timestamp,
        'unreadCount' => (int)$unreadCount,
        'isActive'    => false
    ];
}

// Sort by most recent message
echo json_encode($contacts);
