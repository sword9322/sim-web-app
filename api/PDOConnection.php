<?php
$pdoConnection = null;

define("MODE_DEVELOPMENT", "MODE_DEVELOPMENT");
define("MODE_STAGING", "MODE_STAGING");
define("MODE_PRODUCTION", "MODE_PRODUCTION");

define("APP_MODE", "MODE_DEVELOPMENT");
//define("APP_MODE", "MODE_STAGING");
//define("APP_MODE", "MODE_PRODUCTION");

function getPDOconnection() {
    global $pdoConnection;

    if ($pdoConnection === null) {
        // default is mode_development
        $host = "localhost";
        $port = "8888";
        $dbname = "webapp";
        $username = "root";
        $database_password = "root";
        
        if (APP_MODE === MODE_PRODUCTION) {
            $host = "...";
            $port = "...";
            $dbname = "...";
            $username = "...";
            $database_password = "...";
        }
        
        try {
            $pdoConnection = new PDO("mysql:host=$host;port=$port;dbname=$dbname", $username, $database_password);
            $pdoConnection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $e) {
            die("Database connection failed: " . $e->getMessage());
        }
    }
    return $pdoConnection;
}