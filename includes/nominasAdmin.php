<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nominas Admin</title>

    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="../assets/css/nominasAdmin.css">
</head>
<body>
    <div class="nominas-container container mt-5">
        <h2>Subir Nóminas</h2>

        <div id="drop-zone" class="drop-zone border p-3 mb-3 text-center">
            <p>Arrastra y suelta los archivos aquí o haz clic para seleccionarlos</p>
            <input type="file" id="file-input" multiple hidden>
        </div>

        <ul id="file-list" class="file-list list-unstyled">
            <!-- Aquí se mostrarán los archivos cargados -->
        </ul>

        <button id="upload-button" class="btn btn-success">Confirmar Envío</button>
        <button type="button" class="btn btn-info" data-toggle="modal" data-target="#exampleModalCenter">
            Información
        </button>
    </div>

    <!-- Modal -->
    <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLongTitle">Información</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Cerrar">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <p>Para subir nóminas, arrastra y suelta los archivos en el área designada o haz clic para seleccionarlos. Luego, haz clic en "Confirmar Envío" para procesar los archivos seleccionados.</p>
            <p>Los archivos tienen que tener un formato .pdf y un nombre con las siguientes pautas:</p>
            <ul>
                <li>Nombre del empleado (Importante que este usuario este Registrado)</li>
                <li>Mes y año de la nómina (ejemplo: "JuanPerez_01_2023.pdf")</li>
            </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Bootstrap JS y dependencias -->
    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/js/bootstrap.bundle.min.js"></script>
    <script src="../assets/js/nominasAdmin.js"></script>
</body>
</html>
