<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "sports";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

$sql = "SELECT nombre, puntos FROM usuarios ORDER BY puntos DESC";
$result = $conn->query($sql);

$ranking = array();

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $ranking[] = $row;
    }
}

echo json_encode($ranking);

$conn->close();
?>
