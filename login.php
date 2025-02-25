<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href=".\css\login.css">
    <title>Login</title>
</head>

<body>
    <form class="login-form" action="login.php" method="post">
    <p class="login-text">
        <span class="fa-stack fa-lg">
            <i class="fa fa-circle fa-stack-2x"></i>
            <i class="fa fa-lock fa-stack-1x"></i>
        </span>
    </p>
    <input type="email" name="email" class="login-username" required="true" placeholder="Email" />
    <input type="password" name="password" class="login-password" required="true" placeholder="Password" />
    <input type="submit" name="Login" value="Login" class="login-submit" />
    </form>
    <a href="#" class="login-forgot-pass">forgot password?</a>
    <div class="underlay-photo"></div>
    <div class="underlay-black"></div> 
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
