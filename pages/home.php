<?php
session_start(); // Iniciar la sesión

// Verificar si hay un usuario en la sesión
if (!isset($_SESSION["user"])) {
    header("Location: ../index.php");
    exit();
}

// Obtener los datos del usuario
$user_data = $_SESSION["user"];

if ($user_data["tipoUsuario"] == "Admin") {
    // Creamos la variable para ir modificando el titulo de la pagina
    $titulo = "Usuarios";
    $rol = "Admin";
} else {
    $titulo = "Fichaje";
    $rol = "User";
}
?>

<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Home</title>
    <link rel="stylesheet" href="../assets/css/home.css">
    <link rel="stylesheet" href="../assets/css/userList.css">
    <link rel="stylesheet" href="../assets/css/newUser.css">
    <!-- Incluir Bootstrap Icons -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet">
</head>
<body>
    <!-- NAV DEL HOME -->
    <nav class="top-menu">
        <div class="logo">
            <img src="../assets/img/Home/Logo.webp" alt="Logo">
        </div>
        <h1 class="menu-title"><?php echo $titulo; ?></h1>
        <div class="menu-right">
            <?php if ($rol == "Admin"): ?>
                <button class="btn-create-user-hg45">Nuevo Usuario</button>
            <?php endif; ?>
            <div class="profile-photo">
                <img src="../assets/img/Home/Perfil.webp" alt="Perfil">
            </div>
        </div>
    </nav>

    <main class="home-container">
        <section class="left-panel">
            <?php if ($rol == "Admin") { ?>
                <button class='action-btn' data-page="usersList.php">Gestion Usuarios</button>
            <?php } ?>
            
            <button class="action-btn" data-page="fichaje.php">Fichaje</button>
            <button class="action-btn" data-page="nominas.php">Nominas</button>
            <button class="action-btn" data-page="calendario.php">Calendario</button>
        </section>
        <section class="right-panel" id="content-panel">
            <?php
                if ($rol == "Admin") {
                    include_once "../includes/usersList.php";
                } elseif ($rol == "User") {
                    include_once "../includes/fichaje.php";
                }
            ?>
        </section>
    </main>

    <?php if ($rol == "Admin"): ?>
        <?php include "../includes/newUser.php"; ?>
    <?php endif; ?>

    <script src="../assets/js/newUser.js"></script>

    <script>
        document.addEventListener("DOMContentLoaded", function () {
            // Cargar contenido con AJAX cuando se hace clic en los botones
            document.querySelectorAll(".action-btn").forEach(button => {
                button.addEventListener("click", function () {
                    const page = this.getAttribute("data-page"); // Obtiene el nombre del archivo PHP
                    const panel = document.getElementById("content-panel");

                    // Hacemos la petición AJAX
                    fetch(`../includes/${page}`)
                        .then(response => response.text())
                        .then(html => {
                            panel.innerHTML = html; // Insertamos el contenido en el panel derecho
                        })
                        .catch(error => console.error("Error al cargar el contenido:", error));
                });
            });
        });
    </script>

</body>
</html>
