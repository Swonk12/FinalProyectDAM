<?php
session_start();
if (!isset($_SESSION["user"])) {
    header("Location: ../index.php");
    exit();
}

$user_data = $_SESSION["user"];
$rol = $user_data["tipoUsuario"];
$titulo = ($rol == "Admin") ? "Usuarios" : "Fichaje";
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Home</title>
    <link rel="stylesheet" href="../assets/css/home.css">
    <link rel="stylesheet" href="../assets/css/userList.css">
    <link rel="stylesheet" href="../assets/css/newUser.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet">
</head>
<body>

    <!-- NAV -->
    <nav class="top-menu">
        <div class="logo">
            <img src="../assets/img/Home/Logo.webp" alt="Logo">
        </div>
        <h1 class="menu-title"><?= $titulo ?></h1>
        <div class="menu-right">
            <?php if ($rol == "Admin"): ?>
                <button class="btn-create-user-hg45">Nuevo Usuario</button>
            <?php endif; ?>
            <div class="profile-photo">
                <img src="../assets/img/Home/Perfil.webp" alt="Perfil">
            </div>
        </div>
    </nav>

    <!-- MAIN -->
    <main class="home-container">
        <section class="left-panel">
            <?php if ($rol == "Admin"): ?>
                <button class='action-btn' data-page="usersList.php">Gestion Usuarios</button>
            <?php endif; ?>
            <button class="action-btn" data-page="fichaje.php">Fichaje</button>
            <button class="action-btn" data-page="nominas.php">Nominas</button>
            <button class="action-btn" data-page="calendario.php">Calendario</button>
        </section>

        <section class="right-panel" id="content-panel">
            <?php
                if ($rol == "Admin") {
                    include_once "../includes/usersList.php";
                } else {
                    include_once "../includes/fichaje.php";
                }
            ?>
        </section>
    </main>

    <?php if ($rol == "Admin") {
        include "../includes/newUser.php";
    } ?>

    <!-- SCRIPTS -->
    <script src="../assets/js/newUser.js"></script>
    <script>
        document.addEventListener("DOMContentLoaded", function () {
            const panel = document.getElementById("content-panel");

            // Cargar contenido dinámico
            document.querySelectorAll(".action-btn").forEach(button => {
                button.addEventListener("click", function () {
                    const page = this.getAttribute("data-page");

                    fetch(`../includes/${page}`)
                        .then(response => {
                            if (!response.ok) throw new Error("HTTP error " + response.status);
                            return response.text();
                        })
                        .then(html => {
                            panel.innerHTML = html;
                            reinitializeScripts(page); // Reiniciar scripts tras cargar el contenido
                        })
                        .catch(error => console.error("Error al cargar el contenido:", error));
                });
            });

            // Función que vuelve a ejecutar JS dependiendo de la página
            function reinitializeScripts(page) {
                switch (page) {
                    case "fichaje.php":
                        loadScript("../assets/js/fichages.js");
                        break;
                    case "usersList.php":
                        loadScript("../assets/js/usersList.js");
                        break;
                    case "nominas.php":
                        loadScript("../assets/js/nominas.js");
                        break;
                    case "calendario.php":
                        loadScript("../assets/js/calendario.js");
                        break;
                }
            }

            function loadScript(src) {
                if (document.querySelector(`script[src="${src}"]`)) {
                    console.log(`${src} ya fue cargado.`);
                    return; // Evita recargarlo
                }

                const script = document.createElement("script");
                script.src = src;
                script.defer = true;
                document.body.appendChild(script);
            }

        });
    </script>
</body>
</html>
