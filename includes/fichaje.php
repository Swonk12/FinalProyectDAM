<?php
// Iniciar sesión solo si no está activa
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Verificar que la sesión esté activa y que la clave 'user' exista
if (isset($_SESSION['user']['id'])) {
    $idUsuario = $_SESSION['user']['id'];
} else {
    die("Acceso no autorizado. Usuario no encontrado en la sesión.");
}

// El endpoint base de la API
$apiUrl = "http://localhost:5064/api/Fichajes";  // Cambia esta URL por la URL de tu API real
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fichajes</title>
    <link rel="stylesheet" href="../assets/css/fichages.css">
</head>
<body>
    <div class="container">
        <div class="icon-container">
            <img src="../assets/img/Home/Perfil.webp" alt="Icono Persona" class="persona-icon">
        </div>

        <div id="contador" class="contador">
            00:00:00
        </div>

        <div class="botones">
            <button id="entrarBtn" class="btn verde">Entrar</button>
            <button id="salirBtn" class="btn rojo">Salir</button>
        </div>
    </div>

    <script src="../assets/js/fichages.js"></script>

    <script>
        // Pasar el idUsuario desde PHP a JavaScript y asegurarnos de que se almacene en localStorage
        const idUsuario = <?php echo json_encode($idUsuario); ?>;

        if (idUsuario) {
            localStorage.setItem("idUsuario", idUsuario);  // Guardar en localStorage
        } else {
            console.error("Error: idUsuario no disponible.");
        }

        // Añadir los event listeners para los botones solo si idUsuario es válido
        document.addEventListener("DOMContentLoaded", function () {
            const entrarBtn = document.getElementById("entrarBtn");
            const salirBtn = document.getElementById("salirBtn");

            if (entrarBtn && idUsuario) {
                entrarBtn.addEventListener("click", function () {
                    ficharEntrada(idUsuario);
                });
            }

            if (salirBtn && idUsuario) {
                salirBtn.addEventListener("click", function () {
                    ficharSalida(idUsuario);
                });
            }
        });
    </script>
</body>
</html>
