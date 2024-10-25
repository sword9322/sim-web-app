<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once 'PDOConnection.php';

$pdo = getPDOconnection();

if ($pdo === false) {
    die(json_encode(['success' => false, 'message' => 'Connection failed']));
}

$userId = $_GET['id'] ?? null;

if (!$userId) {
    die(json_encode(['success' => false, 'message' => 'User ID not provided']));
}

// Include password in the query
$sql = "SELECT id, name, email, password, role, address, city, date_of_birth FROM users WHERE id = ?";
$stmt = $pdo->prepare($sql);
$stmt->execute([$userId]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if ($user) {
    echo json_encode(['success' => true, 'user' => $user]);
} else {
    echo json_encode(['success' => false, 'message' => 'User not found']);
}

$pdo = null;
?>
