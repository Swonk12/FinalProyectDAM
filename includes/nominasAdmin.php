<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nominas Admin</title>
    <link rel="stylesheet" href="../assets/css/nominasAdmin.css">
</head>
<body>
    <div class="nominas-container">
        <h2>Subir Nóminas</h2>

        <div id="drop-zone" class="drop-zone">
            <p>Arrastra y suelta los archivos aquí o haz clic para seleccionarlos</p>
            <input type="file" id="file-input" multiple hidden>
        </div>

        <ul id="file-list" class="file-list">
            <!-- Aquí se mostrarán los archivos cargados -->
        </ul>

        <button id="upload-button" class="upload-button">Confirmar Envío</button>
        <button>Informacion</button>
    </div>

    <script src="../assets/js/nominasAdmin.js"></script>

</body>
</html>