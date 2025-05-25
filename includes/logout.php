<?php
session_start();
session_unset(); // Elimina todas las variables de sesión
session_destroy(); // Destruye la sesión

// Elimina cookies si usas cookies personalizadas
if (isset($_COOKIE["user"])) {
    setcookie("user", "", time() - 3600, "/");
}

header("Location: ../../../pages/login.php");
exit();
?>
