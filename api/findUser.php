<?php

require_once 'findEntity.php';

$table = 'users';
$fields = ['id', 'name', 'email', 'address', 'city', 'date_of_birth', 'role'];

$id = isset($_GET['id']) ? $_GET['id'] : null;


$result = findEntity($table, $fields, ["id" => ["=", $id, PDO::PARAM_INT]]);

header('Content-Type: application/json');
http_response_code($result['statusCode']);
echo json_encode($result);

?>
