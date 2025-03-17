<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nombre = $_POST["nombre"];
    $apellido = $_POST["apellido"];
    $email = $_POST["email"];
    $password = $_POST["password"];

    // Verifica si el checkbox está marcado
    $tipoUsuario = isset($_POST["tipoUsuario"]) && $_POST["tipoUsuario"] === "Admin" ? "Admin" : "Usuario";

    // No enviamos FechaRegistro (lo maneja la base de datos)
    $estado = true; // Usuario activo por defecto

    $data = [
        "Nombre" => $nombre,
        "Apellido" => $apellido,
        "Email" => $email,
        "Contrasena" => $password, // ⚠️ Sería mejor encriptarla antes de enviarla
        "TipoUsuario" => $tipoUsuario,
        "Estado" => $estado
    ];

    $json_data = json_encode($data);

    $url = "http://localhost:5064/api/Usuarios"; // Cambia esto por la URL correcta de tu API
    $ch = curl_init($url);

    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Content-Type: application/json"
    ]);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $json_data);

    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($http_code == 201) {
        echo "<script>alert('Usuario creado correctamente'); window.location.href = '../pages/home.php';</script>";
    } else {
        echo "<script>alert('Error al crear usuario');</script>";
    }
}
?>


<div id="popup-user-creation-tt78" class="popup-box-lk90">
    <div class="popup-inner-vv44">
        <span class="close-popup-btn-xd66">&times;</span>
        <h2>Nuevo Usuario</h2>
        <form action="../includes/newUser.php" method="POST">
            <label for="nombre">Nombre:</label>
            <input type="text" id="nombre" name="nombre" required>

            <label for="apellido">Apellido:</label>
            <input type="text" id="apellido" name="apellido" required>

            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required>

            <label for="password">Contraseña:</label>
            <input type="password" id="password" name="password" required>

            <label>Tipo de Usuario:</label>
            <div class="switch-wrap-zz99">
                <span>Usuario</span>
                <label class="switch-xf77">
                    <input type="checkbox" id="tipoUsuario" name="tipoUsuario" value="Admin">
                    <span class="slider-vg55 round"></span>
                </label>
                <span>Admin</span>
            </div>

            <button type="submit" class="submit-btn-hh23">Guardar Usuario</button>
        </form>

    </div>
</div>
