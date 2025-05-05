<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if (isset($_SESSION['user']['id'])) {
    $idUsuario = $_SESSION['user']['id'];
} else {
    die("Acceso no autorizado. Usuario no encontrado en la sesión.");
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nóminas del Usuario</title>
    <link rel="stylesheet" href="../assets/css/nominasUser.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css">
</head>
<body>
    <div class="container">
        <h1 class="titulo">Tus Nóminas</h1>
        <div id="listaNominas" class="lista-nominas"></div>
    </div>

    <script>
        const idUsuario = <?= json_encode($idUsuario) ?>;
    </script>
    <script src="../assets/js/nominasUser.js"></script>
</body>
</html>
