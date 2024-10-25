<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once 'PDOConnection.php';

$pdo = getPDOconnection();

$sql = "SELECT COUNT(*) as total FROM users";
$stmt = $pdo->query($sql);
$row = $stmt->fetch(PDO::FETCH_ASSOC);

if ($row) {
    echo json_encode(['success' => true, 'total' => $row['total']]);
} else {
    echo json_encode(['success' => false, 'message' => 'No users found']);
}
