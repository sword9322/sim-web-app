<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

require_once 'PDOConnection.php';

$pdo = getPDOconnection();

if ($pdo === false) {
    echo json_encode(['success' => false, 'message' => 'Connection failed']);
    exit;
}

$json = file_get_contents('php://input');
$data = json_decode($json, true);

if (is_null($data)) {
    echo json_encode(['success' => false, 'message' => 'Invalid JSON input']);
    exit;
}

$id = $data['id'];
$name = $data['name'];
$email = $data['email'];
$password = isset($data['password']) ? $data['password'] : null;
$role = $data['role'];
$address = $data['address'];
$city = $data['city'];
$date_of_birth = $data['date_of_birth'];

if (is_null($password)) {
    echo json_encode(['success' => false, 'message' => 'Password is required']);
    exit;
}

// Build the SQL query dynamically
$sql = "UPDATE users SET name = :name, email = :email, role = :role, address = :address, city = :city, date_of_birth = :date_of_birth";
$params = [
    ':name' => $name,
    ':email' => $email,
    ':role' => $role,
    ':address' => $address,
    ':city' => $city,
    ':date_of_birth' => $date_of_birth,
    ':id' => $id
];

if (!is_null($password)) {
    $sql .= ", password = :password";
    $params[':password'] = $password;
}

$sql .= " WHERE id = :id";

try {
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Error updating user: ' . $e->getMessage()]);
}

$pdo = null;
?>
