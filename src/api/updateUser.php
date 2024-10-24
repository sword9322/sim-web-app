<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$json = file_get_contents('php://input');
$data = json_decode($json, true);

if (is_null($data) || !isset($data['name']) || !isset($data['email']) || !isset($data['password'])) {
    die(json_encode(['success' => false, 'message' => 'Invalid input']));
}

$name = $data['name'];
$email = $data['email'];
$password = $data['password'];

$servername = "localhost";
$username = "root";
$password = "root";
$dbname = "webapp";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => 'Connection failed: ' . $conn->connect_error]));
}

// Assuming you have a way to identify the current user, e.g., session or token
$userId = 1; // Replace with actual user ID

$sql = "UPDATE users SET name = '$name', email = '$email', password = '$password' WHERE id = $userId";
if ($conn->query($sql) === TRUE) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Error updating user: ' . $conn->error]);
}

$conn->close();
?>