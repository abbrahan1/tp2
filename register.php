<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "sports";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

$nombre = $_POST['nombre'];
$email = $_POST['email'];
$password = password_hash($_POST['password'], PASSWORD_BCRYPT);

$sql = "SELECT * FROM usuarios WHERE nombre=? OR email=?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $nombre, $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    echo json_encode(["status" => "error", "message" => "El nombre o email ya está en uso."]);
} else {
    $sql = "INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sss", $nombre, $email, $password);
    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Registro exitoso."]);
    } else {
        echo json_encode(["status" => "error", "message" => "Error en el registro."]);
    }
}

$conn->close();
?>
