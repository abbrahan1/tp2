<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "sports";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

$data = json_decode(file_get_contents("php://input"), true);

$email = $data['email'];
$score = $data['score'];

$sql = "UPDATE usuarios SET puntos = GREATEST(puntos, ?) WHERE email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("is", $score, $email);

$response = array();

if ($stmt->execute()) {
    $response['status'] = 'success';
} else {
    $response['status'] = 'error';
    $response['message'] = $stmt->error;
}

$stmt->close();
$conn->close();

echo json_encode($response);
?>
