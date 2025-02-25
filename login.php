<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <link rel="stylesheet" href="./css/login.css">
    <script src="./js/login.js" defer></script>
</head>
<body>
    <div class="login-container">
        <form action="login.php" method="post" class="login-form">
            <div class="logo-container">
                <img src="./img/Logos/Logo.webp" alt="Logo">
            </div>
            <div class="input-container">
                <img src="./img/Login/mail.webp" alt="Mail Icon">
                <input type="email" name="email" required placeholder="Email">
            </div>
            <div class="input-container">
                <img src="./img/Login/candado.webp" alt="Lock Icon">
                <input type="password" name="password" required placeholder="Password">
            </div>
            <a href="#" class="forgot-password">Forgot password?</a>
            <input type="submit" name="Login" value="Login" class="login-button">
        </form>
    </div>
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
        if ($user_data["tipoUsuario"] == "Admin") {
            header("Location: adminHome.php");
            exit();
        } else {
            header("Location: userHome.php");
            exit();
        }
        header("Location: adminUser.php"); 
        exit();
    } else {
        echo "<script>alert('Credenciales incorrectas');</script>";
    }
}
?>
