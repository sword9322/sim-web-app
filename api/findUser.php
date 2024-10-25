<?php

require_once 'findEntity.php';

$table = 'users';
$fields = ['id', 'name', 'email', 'address', 'city', 'date_of_birth', 'role'];

$id = isset($_GET['id']) ? $_GET['id'] : null;
$searchCriteria = $id ? [['id', '=', $id]] : [];

$result = findEntity($table, $fields, $searchCriteria);

header('Content-Type: application/json');
http_response_code($result['statusCode']);
echo json_encode($result);

?>
