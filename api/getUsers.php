<?php
  header("Access-Control-Allow-Origin: *");
  header("Content-Type: application/json; charset=UTF-8");

  require_once 'PDOConnection.php';

  $pdo = getPDOconnection();

  if ($pdo === false) {
      die("Connection failed: " . $pdo->connect_error);
  }

  $sql = "SELECT COUNT(*) as total FROM users";
  $totalResult = $pdo->query($sql);
  $totalRow = $totalResult->fetch(PDO::FETCH_ASSOC);
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

  $stmt = $pdo->prepare($sql);
  $stmt->execute();

  $users = array();
  while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
      $users[] = $row;
  }

  echo json_encode(['users' => $users, 'total' => $total]);

  $pdo = null;
  ?>
