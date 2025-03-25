let tiempoEntrada = null; // Almacena el tiempo de entrada si ha fichado
let tiempoFichaje = 0;  // Contador de tiempo en segundos

// Función para actualizar el contador
function actualizarContador() {
    if (tiempoEntrada !== null) {
        let horas = Math.floor(tiempoFichaje / 3600);
        let minutos = Math.floor((tiempoFichaje % 3600) / 60);
        let segundos = tiempoFichaje % 60;

        // Formateamos el tiempo
        document.getElementById('contador').innerText = 
            `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;
        
        tiempoFichaje++;
    }
}
// Función para fichar entrada
function ficharEntrada(idUsuario) {
    const usuarioId = Number(idUsuario);

    if (!usuarioId) {
        console.error("Error: idUsuario no válido.");
        return;
    }

    fetch(`http://localhost:5064/api/Fichajes/entrada`, { 
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(usuarioId) 
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => { 
                throw new Error(`Error HTTP: ${response.status} - ${err}`); 
            });
        }
        return response.json();
    })
    .then(data => {
        console.log("Respuesta de la API:", data);
        if (data.mensaje === "Entrada fichada correctamente.") {
            // Guardamos el estado en localStorage
            localStorage.setItem("fichajeActivo", "true");

            // Deshabilitamos el botón "Entrar" y habilitamos "Salir"
            document.getElementById("entrarBtn").disabled = true;
            document.getElementById("salirBtn").disabled = false;

            // Activamos el contador
            tiempoEntrada = Date.now();
            tiempoFichaje = 0;
            if (!window.contadorActivo) {
                window.contadorActivo = setInterval(actualizarContador, 1000);
            }
        } else {
            console.error("Error al fichar entrada:", data.mensaje);
        }
    })
    .catch(error => {
        console.error("Error en la solicitud:", error);
    });
}

// Función para fichar salida
function ficharSalida(idUsuario) {
    const usuarioId = Number(idUsuario);

    if (!usuarioId) {
        console.error("Error: idUsuario no válido.");
        return;
    }

    fetch(`http://localhost:5064/api/Fichajes/salida`, { 
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(usuarioId) 
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => { 
                throw new Error(`Error HTTP: ${response.status} - ${err}`); 
            });
        }
        return response.json();
    })
    .then(data => {
        console.log("Respuesta de la API:", data);
        if (data.mensaje === "Salida fichada correctamente.") {
            // Eliminamos el estado de fichaje en localStorage
            localStorage.removeItem("fichajeActivo");

            // Habilitamos "Entrar" y deshabilitamos "Salir"
            document.getElementById("entrarBtn").disabled = false;
            document.getElementById("salirBtn").disabled = true;

            // Detenemos el contador
            clearInterval(window.contadorActivo);
            window.contadorActivo = null;
        } else {
            console.error("Error al fichar salida:", data.mensaje);
        }
    })
    .catch(error => {
        console.error("Error en la solicitud:", error);
    });
}

// Al cargar la página, restaurar estado del botón según el fichaje previo
document.addEventListener("DOMContentLoaded", function () {
    const entrarBtn = document.getElementById("entrarBtn");
    const salirBtn = document.getElementById("salirBtn");
    
    if (localStorage.getItem("fichajeActivo") === "true") {
        // Si ya fichó entrada, deshabilitar "Entrar" y habilitar "Salir"
        entrarBtn.disabled = true;
        salirBtn.disabled = false;
    } else {
        // Si no ha fichado entrada, habilitar "Entrar" y deshabilitar "Salir"
        entrarBtn.disabled = false;
        salirBtn.disabled = true;
    }
});



document.getElementById('salirBtn').addEventListener('click', function() {
    const idUsuario = localStorage.getItem('idUsuario'); // Obtener idUsuario desde localStorage
    if (idUsuario) {
        ficharSalida(idUsuario);
    } else {
        console.error("El idUsuario no está disponible");
    }
});
