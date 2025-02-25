<div class="user-list">
        <?php
        $apiUrl = "http://localhost:5064/api/Usuarios";

        // Inicializa cURL
        $ch = curl_init($apiUrl);

        // Configura opciones de cURL
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);  
        curl_setopt($ch, CURLOPT_HTTPGET, true);         
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); 

        // Ejecuta la petición y guarda la respuesta
        $response = curl_exec($ch);

        // Verifica si hay errores
        if ($response === false) {
            echo "Error en la petición: " . curl_error($ch);
        } else {
            // Decodifica el JSON a un array asociativo
            $usuarios = json_decode($response, true);

            if (!empty($usuarios)) {
                foreach ($usuarios as $usuario) {

                    $nombre = $usuario['nombre'];
                    $apellido = $usuario['apellido'];  

                    echo '<div class="user-item">';
                    echo '  <div class="user-photo">';
                    echo '    <img src="../assets/img/Home/Perfil.webp">';
                    echo '  </div>';
                    echo '  <div class="user-info">';
                    echo '    <span>' . $nombre . ' ' . $apellido . '</span>';
                    echo '  </div>';
                    echo '  <div class="user-actions">';
                    // Icono de la cruz (bi-x)
                    echo '    <button class="btn-delete"><i class="bi bi-x-lg"></i></button>';
                    // Icono de configuración (bi-gear-fill)
                    echo '    <button class="btn-settings"><i class="bi bi-gear-fill"></i></button>';
                    echo '  </div>';
                    echo '</div>';
                }
            } else {
                echo "No hay usuarios disponibles.";
            }
        }

        // Cierra la sesión cURL
        curl_close($ch);
        ?>
    </div>