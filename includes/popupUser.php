<!-- popupUser.php -->
<div id="popupUser" class="popup">
    <div class="popup-content">
        <span class="close" onclick="cerrarPopupUser()">&times;</span>
        <h2>Detalles del Usuario</h2>
        <p><strong>Nombre:</strong> <span id="popup-nombre"></span></p>
        <p><strong>Apellido:</strong> <span id="popup-apellido"></span></p>
        <p><strong>Email:</strong> <span id="popup-email"></span></p>
        
        <label class="switch">
            <input type="checkbox" id="popup-tipoUsuario">
            <span class="slider round"></span>
        </label>
        <p id="popup-tipoTexto">Usuario</p>

        <!-- Botón Guardar -->
        <button id="guardarPopup" onclick="cerrarPopupUser()">Guardar</button>
    </div>
</div>
