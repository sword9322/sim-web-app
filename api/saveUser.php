<?php
    // Add CORS headers
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");

    // Handle preflight requests
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        header("HTTP/1.1 200 OK");
        exit();
    }


    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    if (is_null($data)) {
        die("Invalid JSON input");
    }

    $name = $data['name'];
    $email = $data['email'];
    $password = $data['password'];
    $role = $data['role'];
    $address = $data['address'];
    $city = $data['city'];
    $dateOfBirth = $data['dateOfBirth'];

    require_once 'PDOConnection.php';

    $pdo = getPDOconnection();

    if($name && $email && $password && $role && $address && $city && $dateOfBirth){
        $sql = "INSERT INTO users (name, email, password, role, address, city, date_of_birth) VALUES (?, ?, ?, ?, ?, ?, ?)";
        $stmt = $pdo->prepare($sql);
        if ($stmt->execute([$name, $email, $password, $role, $address, $city, $dateOfBirth])) {
            echo "User data saved successfully";
        } else {
            echo "Failed to save user data";
        }
    } else {
        echo "All fields are required";
    }

?>
