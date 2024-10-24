<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$json = file_get_contents('php://input');
$data = json_decode($json, true);

if (is_null($data) || !isset($data['id'])) {
    echo json_encode(['success' => false, 'message' => 'Invalid JSON input or missing user ID']);
    exit;
}

$id = $data['id'];

$servername = "localhost";
$username = "root";
$password = "root";
$dbname = "webapp";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Connection failed: ' . $conn->connect_error]);
    exit;
}

$sql = "DELETE FROM users WHERE id = '$id'";
if ($conn->query($sql) === TRUE) {
    echo json_encode(['success' => true, 'message' => 'User deleted successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'Error deleting user: ' . $conn->error]);
}

$conn->close();
?>