<?php
require_once __DIR__ . '/PDOConnection.php';

function findEntity($table, $fields = ["*"], $searchCriteria = [] ){  
    try {
        $pdo = getPDOconnection();

        if ($pdo === false) {
            die(json_encode(['success' => false, 'message' => 'Connection failed']));
        }

        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        $commaDelimitedFields = implode(",", $fields);
        $sql = "SELECT $commaDelimitedFields FROM $table where (true) ";
        
        foreach($searchCriteria as $key => [$comparator, $value, $type]){
            $sql .= " and $key $comparator :$key";
        }

        $stmt = $pdo->prepare($sql);
        foreach($searchCriteria as $key => [$comparator, $value, $type]){
            $stmt->bindParam(":$key", $value, $type);
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

    } catch (PDOException $e) {
        return ["result" => "ERROR", "message" => "Database error: " . $e->getMessage(), "statusCode" => 500];
    }
}
?>
