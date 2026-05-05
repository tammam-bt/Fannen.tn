<?php
// api_update_profile.php — Updates the currently logged-in user's profile
// Session-gated, POST only

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

$fullname = trim($_POST['fullname'] ?? '');
$username = trim($_POST['username'] ?? '');
$email    = trim($_POST['email'] ?? '');
$phone    = trim($_POST['phone'] ?? '');
$age      = intval($_POST['age'] ?? 0);

if (!$fullname || !$username || !$email) {
    http_response_code(400);
    echo json_encode(['error' => 'Name, username, and email are required']);
    exit;
}

// Check for duplicate username/email (excluding current user)
$stmt = $pdo->prepare("SELECT id FROM users WHERE (email = ? OR username = ?) AND id != ?");
$stmt->execute([$email, $username, $_SESSION['user_id']]);
if ($stmt->fetch()) {
    http_response_code(409);
    echo json_encode(['error' => 'Email or username already taken']);
    exit;
}

$stmt = $pdo->prepare("
    UPDATE users SET full_name = ?, username = ?, email = ?, phone = ?, age = ?
    WHERE id = ?
");
$stmt->execute([$fullname, $username, $email, $phone, $age, $_SESSION['user_id']]);

echo json_encode(['success' => true]);
