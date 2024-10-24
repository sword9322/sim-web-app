<?php
  header("Access-Control-Allow-Origin: *");
  header("Content-Type: application/json; charset=UTF-8");

  $servername = "localhost";
  $username = "root";
  $password = "root";
  $dbname = "webapp";

  $conn = new mysqli($servername, $username, $password, $dbname);

  if ($conn->connect_error) {
      die("Connection failed: " . $conn->connect_error);
  }

  $sql = "SELECT id, name, email FROM users";
  $result = $conn->query($sql);

  $users = array();
  if ($result->num_rows > 0) {
      while($row = $result->fetch_assoc()) {
          $users[] = $row;
      }
  }

  echo json_encode($users);

  $conn->close();
  ?>