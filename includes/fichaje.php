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

<link rel="stylesheet" href="../assets/css/fichages.css">

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

    <div id="registros" class="registro-lista">
        <h3>Registros de Hoy</h3>
        <div id="listaFichajes"></div>
    </div>
</div>

<script>
    const idUsuario = <?php echo json_encode($idUsuario); ?>;
    console.log("ID de usuario:", idUsuario);

    if (idUsuario) {
        localStorage.setItem("idUsuario", idUsuario);
    } else {
        console.error("Error: idUsuario no disponible.");
    }

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

        cargarFichajes(idUsuario);
    });
</script>

<script src="../assets/js/fichages.js"></script>
