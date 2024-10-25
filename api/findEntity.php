<?php

require_once 'PDOConnection.php';

function findEntity($table, $fields = ["*"], $searchCriteria = []) {
    $pdo = getPDOconnection();

    $commaDelimitedFields = implode(", ", $fields);
    $sql = "SELECT $commaDelimitedFields FROM $table WHERE 1=1";

    foreach ($searchCriteria as $criterion) {
        list($key, $comparator, $value) = $criterion;
        $sql .= " AND $key $comparator :$key";
    }

    $stmt = $pdo->prepare($sql);
    foreach ($searchCriteria as $criterion) {
        list($key, $comparator, $value) = $criterion;
        $stmt->bindValue(":$key", $value);
    }

    if ($stmt->execute()) {
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return [
            "result" => "SUCCESS",
            "message" => "Entities fetched successfully",
            "statusCode" => 200,
            "data" => $data
        ];
    } else {
        return ["result" => "ERROR", "message" => "Could not fetch entities", "statusCode" => 500];
    }
}
?>
