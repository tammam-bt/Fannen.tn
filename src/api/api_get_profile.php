<?php
// api_get_profile.php — Returns the currently logged-in user's profile
// Session-gated

require_once __DIR__ . '/config.php';
header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$stmt = $pdo->prepare("SELECT id, full_name, username, email, phone, age, role, created_at FROM users WHERE id = ?");
$stmt->execute([$_SESSION['user_id']]);
$user = $stmt->fetch();

if (!$user) {
    http_response_code(404);
    echo json_encode(['error' => 'User not found']);
    exit;
}

// Map role for JS
$jsRole = ($user['role'] === 'enthusiast') ? 'user' : $user['role'];

echo json_encode([
    'fullname' => $user['full_name'],
    'username' => $user['username'],
    'email'    => $user['email'],
    'phone'    => $user['phone'],
    'age'      => $user['age'],
    'role'     => $jsRole
]);
