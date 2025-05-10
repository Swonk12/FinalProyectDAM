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
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <!-- calendario.php -->
    <link href="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.10/index.global.min.css" rel="stylesheet" />
    <link rel="stylesheet" href="../assets/css/calendario.css">

    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
    <h1>CALENDARIO</h1>
    <div id="calendar-wrapper">
        <div id="calendar"></div>
    </div>
    <div id="vacation-counter"></div>

    <canvas id="vacation-chart" width="300" height="300"></canvas>

    <script src="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.10/index.global.min.js"></script>
    <script>
    // Pasamos el ID del usuario correctamente desde PHP a JavaScript
    const USER_ID = <?php echo $_SESSION['user']['id']; ?>;
    </script>
    <script src="../assets/js/calendario.js"></script>

</body>
</html>
