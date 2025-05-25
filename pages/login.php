<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <link rel="stylesheet" href="../assets/css/login.css">
    <script src="../assets/js/login.js" defer></script>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <!-- Fondo animado -->
    <div class="animated-bg"></div>
    <div class="animated-bg"></div>
    <div class="animated-bg"></div>

    <div class="login-container">
        <form action="login.php" method="post" class="login-form">
            <div class="logo-container">
                <img src="../assets/img/Logos/Logo.webp" alt="Logo">
            </div>
            <div class="input-container">
                <img src="../assets/img/Login/mail.webp" alt="Mail Icon">
                <input type="email" name="email" required placeholder="Email">
            </div>
            <div class="input-container">
                <img src="../assets/img/Login/candado.webp" alt="Lock Icon">
                <input type="password" name="password" required placeholder="Password">
            </div>
            <input type="submit" name="Login" value="Login" class="login-button">
        </form>
    </div>
    <!-- Modal de credenciales incorrectas -->
    <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="staticBackdropLabel">Error de inicio de sesión</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    Las credenciales ingresadas son incorrectas.
                    Por favor, intente de nuevo.
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Entendido</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>

<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST["email"];
    $password = $_POST["password"];

    $api_url = "http://localhost:5064/api/Usuarios/login";
    $data = json_encode([
        "email" => $email,
        "contrasena" => $password
    ]);

    $ch = curl_init($api_url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Content-Type: application/json"
    ]);

    curl_setopt($ch, CURLOPT_POSTFIELDS, $data); // Peticion POST a la API

    $response = curl_exec($ch); 
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE); // 200 Si funciona
    curl_close($ch);

    if ($http_code == 200) {
        $user_data = json_decode($response, true);
        session_start();
        $_SESSION["user"] = $user_data;
        header("Location: ../pages/home.php");
        exit();
    } else {
        // Mostrar el modal si las credenciales son incorrectas
        echo "<script>
            document.addEventListener('DOMContentLoaded', function() {
                var myModal = new bootstrap.Modal(document.getElementById('staticBackdrop'));
                myModal.show();
            });
        </script>";
    }
}
?>
