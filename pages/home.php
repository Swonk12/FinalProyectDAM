<?php
session_start();
if (!isset($_SESSION["user"])) {
    header("Location: ../index.php");
    exit();
}

$user_data = $_SESSION["user"];
$rol = $user_data["tipoUsuario"];
$nombre = $user_data["nombre"];
$apellido = $user_data["apellido"];

// Definimos página por defecto según el rol
$defaultPage = ($rol == "Admin") ? "usersList.php" : "fichaje.php";

// Páginas permitidas por rol
$pagesByRole = [
    "Admin" => ["usersList.php", "fichaje.php", "nominasAdmin.php", "calendario.php"],
    "Usuario" => ["fichaje.php", "nominasUser.php", "calendario.php"]
];

$allowedPages = $pagesByRole[$rol] ?? [];
$page = isset($_GET["page"]) && in_array($_GET["page"], $allowedPages) ? $_GET["page"] : $defaultPage;

// Asignar título según la página activa
$titulosPorPagina = [
    "usersList.php"     => "Usuarios",
    "fichaje.php"       => "Fichaje",
    "nominasAdmin.php"  => "Subir Nóminas",
    "nominasUser.php"   => "Consultar Nóminas",
    "calendario.php"    => "Calendario"
];

$titulo = $titulosPorPagina[$page] ?? "Inicio";
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
            <?php
                echo "<p>" . $nombre . " " . $apellido . "</p>"; 
                if ($rol == "Admin" && $page === "usersList.php"): ?>
                    <button class="btn-create-user-hg45">Nuevo Usuario</button>
            <?php endif; ?>
            <div class="profile-photo">
                <img src="../assets/img/Home/Perfil.webp" alt="Perfil">
            </div>
            <form action="../includes/logout.php" method="post" style="margin-left: 15px;">
                <button type="submit" class="btn-logout" title="Cerrar sesión">
                    <i class="bi bi-box-arrow-right"></i> Logout
                </button>
            </form>
        </div>

    </nav>

    <!-- MAIN -->
    <main class="home-container">
        <section class="left-panel">
            <?php if ($rol == "Admin"): ?>
                <button class='action-btn' data-page="usersList.php">Gestion Usuarios</button>
            <?php endif; ?>

            <button class="action-btn" data-page="fichaje.php">Fichaje</button>

            <?php if ($rol == "Usuario"): ?>
                <button class='action-btn' data-page="nominasUser.php">Consultar Nominas</button>
            <?php endif; ?>

            <?php if ($rol == "Admin"): ?>
                <button class='action-btn' data-page="nominasAdmin.php">Subir Nominas</button>
            <?php endif; ?>

            <button class="action-btn" data-page="calendario.php">Calendario</button>
        </section>

        <section class="right-panel" id="content-panel">
            <?php include_once "../includes/" . $page; ?>
        </section>
    </main>

    <?php if ($rol == "Admin") {
        include "../includes/newUser.php";
    } ?>

    <!-- SCRIPTS -->
    <script src="../assets/js/newUser.js"></script>
    <script>
        document.addEventListener("DOMContentLoaded", function () {
            document.querySelectorAll(".action-btn").forEach(button => {
                button.addEventListener("click", function () {
                    const page = this.getAttribute("data-page");
                    window.location.href = `home.php?page=${page}`;
                });
            });
        });
    </script>
</body>
</html>
