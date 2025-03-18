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


// Función para eliminar un usuario
async function eliminarUsuario(id) {
    if (!confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
        return;
    }

    try {

        const response = await fetch(`http://localhost:5064/api/Usuarios/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        console.log(`Respuesta del servidor: ${response.status}`);
        
        if (response.ok) {
            console.log(`Intentando eliminar usuario con ID: ${id}`);
            document.querySelector(`button[data-id='${id}']`)?.closest('.user-item')?.remove();
        } else if (response.status === 404) {
            alert('Error: El usuario no fue encontrado.');
        } else {
            const errorMessage = await response.text();
            alert('Error al eliminar el usuario: ' + errorMessage);
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
        alert('Hubo un error en la solicitud: ' + error.message);
    }
}

