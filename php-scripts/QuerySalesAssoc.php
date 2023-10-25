<?php
// Allow requests from any origin
header("Access-Control-Allow-Origin: *");

// Allow these HTTP methods
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Origin, Content-Type, Accept");

// Allow credentials (cookies)
header("Access-Control-Allow-Credentials: true");

header('Content-Type: application/json');

try {
    $conn = new PDO("sqlsrv:server = tcp:csci467.database.windows.net,1433; Database = z1920784", "ledonne", "Aceace10!");
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    if (isset($_GET["Ident"])) {
        $id = $_GET["Ident"];
    }
    else {
        $id = 'null';
    }

    if (isset($_GET["password"])) {
        $pass = $_GET["password"];
    }
    else {
        $pass = 'null';
    }
    // Define your SELECT query
    $sql = "SELECT * FROM SalesAssoc WHERE ID=:id AND Password=:pass";
    // Prepare and execute the query
    $stmt = $conn->prepare($sql, [PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY]);
    $stmt->execute(['id' => $id, 'pass' => $pass]);

    // Fetch data
	$data = [];
    while ($row = $stmt->fetch()) {
		$data[] = $row;
    }
	echo json_encode($data);
}
catch (PDOException $e) {
    print("Error connecting to SQL Server.");
    die(print_r($e));
}

?>