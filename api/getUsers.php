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

  $sql = "SELECT COUNT(*) as total FROM users";
  $totalResult = $conn->query($sql);
  $totalRow = $totalResult->fetch_assoc();
  $total = $totalRow['total'];

  $offset = isset($_GET['offset']) ? intval($_GET['offset']) : 0;
  $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 10;
  $sortField = isset($_GET['sortField']) ? $_GET['sortField'] : '';
  $sortOrder = isset($_GET['sortOrder']) ? $_GET['sortOrder'] : 'ASC';

  // Validate sort order
  $sortOrder = strtoupper($sortOrder) === 'DESC' ? 'DESC' : 'ASC';

  // Build the SQL query
  $sql = "SELECT id, name, email FROM users";

  // Add sorting if a sort field is provided
  if (!empty($sortField)) {
      $sql .= " ORDER BY $sortField $sortOrder";
  }

  $sql .= " LIMIT $limit OFFSET $offset";

  $result = $conn->query($sql);

  $users = array();
  if ($result->num_rows > 0) {
      while($row = $result->fetch_assoc()) {
          $users[] = $row;
      }
  }

  echo json_encode(['users' => $users, 'total' => $total]);

  $conn->close();
  ?>
