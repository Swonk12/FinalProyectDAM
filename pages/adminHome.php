<?php
    // Creamos la variable para ir modificando el titulo de la pagina
    $titulo = "Usuarios";
?>

<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Home</title>
    <link rel="stylesheet" href="../assets/css/adminHome.css">
    <script src="../assets/js/adminHome.js" defer></script>
    <!-- Incluir Bootstrap Icons -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet">
</head>
<body>
    <nav class="top-menu">
        <div class="logo">
            <img src="../assets/img/Home/Logo.webp" alt="Logo">
        </div>
        <h1 class="menu-title"><?php echo $titulo; ?></h1>
        <div class="menu-right">
            <button class="btn-new-user">Nuevo Usuario</button>
            <div class="profile-photo">
                <img src="../assets/img/Home/Perfil.webp" alt="Perfil">
            </div>
        </div>
    </nav>

    <!-- Llama a un archivo php que genera todo el listado -->
   <?php include_once "../includes/usersList.php" ?> 

</body>
</html>
