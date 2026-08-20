<?php 

$host = "localhost";
$dbname = "cwoirnu2b_bymarceldb";
$username = "cwoirnu2b_bymarceldb";
$password = "By_Marcel_database_2026";

$conn = new mysqli($host, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$conn->set_charset("utf8mb4");