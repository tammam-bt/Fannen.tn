<?php
// api_upload_artwork.php — Uploads a new artwork (artisan only)
// Session-gated, POST with multipart form data

require_once __DIR__ . '/config.php';
header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

if ($_SESSION['role'] !== 'artisan') {
    http_response_code(403);
    echo json_encode(['error' => 'Only artisans can upload artworks']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'POST required']);
    exit;
}

$title       = trim($_POST['title'] ?? '');
$category    = trim($_POST['category'] ?? '');
$description = trim($_POST['description'] ?? '');

if (!$title) {
    http_response_code(400);
    echo json_encode(['error' => 'Title is required']);
    exit;
}

$imagePath = '';

// Handle file upload
if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
    $uploadDir = realpath(__DIR__ . '/../../Resources/img/artworks');
    if (!$uploadDir) {
        mkdir(__DIR__ . '/../../Resources/img/artworks', 0777, true);
        $uploadDir = realpath(__DIR__ . '/../../Resources/img/artworks');
    }

    $ext = pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
    $filename = 'artwork_' . time() . '_' . rand(1000, 9999) . '.' . $ext;
    $destination = $uploadDir . '/' . $filename;

    if (move_uploaded_file($_FILES['image']['tmp_name'], $destination)) {
        // Store path relative to src/ so it works in <img src="">
        $imagePath = '../Resources/img/artworks/' . $filename;
    }
}

$stmt = $pdo->prepare("
    INSERT INTO artworks (artisan_id, title, category, description, image_path)
    VALUES (?, ?, ?, ?, ?)
");
$stmt->execute([$_SESSION['user_id'], $title, $category, $description, $imagePath]);

echo json_encode([
    'success' => true,
    'id' => $pdo->lastInsertId()
]);
