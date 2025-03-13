function mostrarPopupUser(nombre, apellido, email, tipoUsuario) {
    let nombreElem = document.getElementById("popup-nombre");
    let apellidoElem = document.getElementById("popup-apellido");
    let emailElem = document.getElementById("popup-email");
    let tipoCheckbox = document.getElementById("popup-tipoUsuario");
    let tipoTexto = document.getElementById("popup-tipoTexto");
    let popup = document.getElementById("popupUser");

    if (!nombreElem || !apellidoElem || !emailElem || !tipoCheckbox || !tipoTexto || !popup) {
        console.error("Uno o más elementos no existen en el DOM.");
        return;
    }

    // Asigna los valores correctamente
    nombreElem.textContent = nombre;
    apellidoElem.textContent = apellido;
    emailElem.textContent = email;

    console.log("Tipo de usuario recibido:", tipoUsuario); // Debugging

    // Verifica si el usuario es "admin" o no
    if (tipoUsuario.trim().toLowerCase() === "admin") {
        tipoCheckbox.checked = true;
        tipoTexto.textContent = "Admin";
    } else {
        tipoCheckbox.checked = false;
        tipoTexto.textContent = "Usuario";
    }

    // Muestra el popup
    popup.style.display = "block";
}
function cerrarPopupUser() {
    document.getElementById("popupUser").style.display = "none";
}