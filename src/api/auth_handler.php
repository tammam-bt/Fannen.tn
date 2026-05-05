<?php
// auth_handler.php — Handles register, login, logout, session check
// Usage: auth_handler.php?action=register|login|logout|check

require_once __DIR__ . '/config.php';
header('Content-Type: application/json');

$action = $_GET['action'] ?? '';

// Helper: map DB role to JS role
function roleForJs($dbRole) {
    return ($dbRole === 'enthusiast') ? 'user' : $dbRole;
}

// Helper: map JS role to DB role
function roleForDb($jsRole) {
    return ($jsRole === 'user') ? 'enthusiast' : $jsRole;
}

switch ($action) {

    // ─── REGISTER ────────────────────────────────────────────
    case 'register':
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
        $password = $_POST['password'] ?? '';
        $role     = $_POST['role'] ?? 'user';

        // Basic validation
        if (!$fullname || !$username || !$email || !$password) {
            http_response_code(400);
            echo json_encode(['error' => 'All required fields must be filled']);
            exit;
        }

        // Check for duplicate email or username
        $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ? OR username = ?");
        $stmt->execute([$email, $username]);
        if ($stmt->fetch()) {
            http_response_code(409);
            echo json_encode(['error' => 'Email or username already exists']);
            exit;
        }

        $hash = password_hash($password, PASSWORD_DEFAULT);
        $dbRole = roleForDb($role);

        $stmt = $pdo->prepare("
            INSERT INTO users (full_name, username, email, phone, age, password_hash, role)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([$fullname, $username, $email, $phone, $age, $hash, $dbRole]);

        $userId = $pdo->lastInsertId();

        // Set session
        $_SESSION['user_id'] = $userId;
        $_SESSION['role'] = $dbRole;
        $_SESSION['username'] = $username;

        echo json_encode([
            'success' => true,
            'role' => roleForJs($dbRole),
            'userId' => $userId
        ]);
        break;

    // ─── LOGIN ───────────────────────────────────────────────
    case 'login':
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            http_response_code(405);
            echo json_encode(['error' => 'POST required']);
            exit;
        }

        $email    = trim($_POST['email'] ?? '');
        $password = $_POST['password'] ?? '';

        if (!$email || !$password) {
            http_response_code(400);
            echo json_encode(['error' => 'Email and password required']);
            exit;
        }

        $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        if (!$user || !password_verify($password, $user['password_hash'])) {
            http_response_code(401);
            echo json_encode(['error' => 'Invalid email or password']);
            exit;
        }

        // Set session
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['role'] = $user['role'];
        $_SESSION['username'] = $user['username'];

        echo json_encode([
            'success' => true,
            'role' => roleForJs($user['role']),
            'userId' => $user['id']
        ]);
        break;

    // ─── LOGOUT ──────────────────────────────────────────────
    case 'logout':
        session_destroy();
        echo json_encode(['success' => true]);
        break;

    // ─── CHECK SESSION ───────────────────────────────────────
    case 'check':
        if (isset($_SESSION['user_id'])) {
            echo json_encode([
                'isLoggedIn' => true,
                'role' => roleForJs($_SESSION['role']),
                'userId' => $_SESSION['user_id']
            ]);
        } else {
            echo json_encode([
                'isLoggedIn' => false
            ]);
        }
        break;

    default:
        http_response_code(400);
        echo json_encode(['error' => 'Invalid action']);
        break;
}
