<?php

// Allow requests from any origin
header("Access-Control-Allow-Origin: *");

// Allow these HTTP methods
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");

// Allow these HTTP headers
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

// Allow credentials (cookies)
header("Access-Control-Allow-Credentials: true");

header('Content-Type: application/json');

// Database connection parameters
$dbHost = "blitz.cs.niu.edu"; 
$dbUser = "student"; 
$dbPass = "student"; 
$dbName = "csci467"; 
$dbPort = 3306;

// Create a connection
$conn = new mysqli($dbHost, $dbUser, $dbPass, $dbName, $dbPort);

// Check the connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} else {
	 
	// SQL query to select data from a table
    $sql = "SELECT * FROM customers";

    // Execute the query
    $result = $conn->query($sql);

    // Check for errors
    if (!$result) {
        die("Query failed: " . $conn->error);
    }

    // Fetch data
	$data = [];
    while ($row = $result->fetch_assoc()) {
		$data[] = $row;
    }
	echo json_encode($data);
}



// Close the connection when done
$conn->close();
?>