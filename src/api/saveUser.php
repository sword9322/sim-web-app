<?php
    // Add CORS headers
    header("Access-Control-Allow-Origin: http://localhost:3000");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Allow-Headers: Content-Type");

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

    $servername = "localhost";
    $username = "root";
    $password = "root";
    $dbname = "webapp";

    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    if($name && $email && $password && $role && $address && $city && $dateOfBirth){
        $sql = "INSERT INTO users (name, email, password, role, address, city, date_of_birth) VALUES ('$name', '$email', '$password', '$role', '$address', '$city', '$dateOfBirth')";
        if(mysqli_query($conn, $sql)){
            echo "User data saved successfully";
        } else {
            echo "Failed to save user data: " . mysqli_error($conn);
        }
    } else {
        echo "All fields are required";
    }

    $conn->close();
?>