let tiempoEntrada = null;
let tiempoFichaje = 0;
let enProceso = false;
let contadorActivo = null;

// Función para actualizar el contador
function actualizarContador() {
    let tiempoMostrar = Math.floor(tiempoFichaje); // Redondear tiempo total a segundos

    if (tiempoEntrada !== null) {
        tiempoMostrar += Math.floor((Date.now() - tiempoEntrada) / 1000);
    }

    let horas = Math.floor(tiempoMostrar / 3600);
    let minutos = Math.floor((tiempoMostrar % 3600) / 60);
    let segundos = Math.floor(tiempoMostrar % 60); // Eliminar decimales

    document.getElementById('contador').innerText =
        `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;
}


// Función para fichar entrada
function ficharEntrada(idUsuario) {
    if (enProceso) return;
    enProceso = true;

    console.log("🔹 Intentando fichar entrada", idUsuario);
    const usuarioId = Number(idUsuario);
    if (!usuarioId) {
        console.error("❌ ID de usuario inválido.");
        enProceso = false;
        return;
    }

    fetch(`http://localhost:5064/api/Fichajes/entrada`, { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(usuarioId) 
    })
    .then(response => response.json())
    .then(data => {
        console.log("✅ Respuesta API:", data);
        if (data.mensaje === "Entrada fichada correctamente.") {
            localStorage.setItem("fichajeActivo", "true");
            document.getElementById("entrarBtn").disabled = true;
            document.getElementById("salirBtn").disabled = false;
            
            tiempoEntrada = Date.now();
            localStorage.setItem("tiempoEntrada", tiempoEntrada);
            
            // 🔹 No reiniciar, sino seguir con el tiempo acumulado
            let tiempoGuardado = parseInt(localStorage.getItem("tiempoFichaje")) || 0;
            tiempoFichaje = tiempoGuardado; // Recupera tiempo trabajado antes

            if (!window.contadorActivo) {
                window.contadorActivo = setInterval(actualizarContador, 1000);
            }
        }
    })
    .catch(error => console.error("❌ Error en la API:", error))
    .finally(() => enProceso = false);
}


// Función para fichar salida
function ficharSalida(idUsuario) {
    console.log("🔹 Intentando fichar salida", idUsuario);
    const usuarioId = Number(idUsuario);
    if (!usuarioId) {
        console.error("❌ ID de usuario inválido.");
        return;
    }

    fetch(`http://localhost:5064/api/Fichajes/salida`, { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(usuarioId) 
    })
    .then(response => response.json())
    .then(data => {
        console.log("✅ Respuesta API:", data);
        if (data.mensaje === "Salida fichada correctamente.") {
            localStorage.setItem("fichajeActivo", "false");
            document.getElementById("entrarBtn").disabled = false;
            document.getElementById("salirBtn").disabled = true;

            clearInterval(contadorActivo);
            contadorActivo = null;

            // Guardar tiempo total trabajado en localStorage
            tiempoFichaje = tiempoFichaje + Math.floor((Date.now() - tiempoEntrada) / 1000);
            localStorage.setItem("tiempoFichaje", tiempoFichaje);
            tiempoEntrada = null; // Se resetea la entrada
        }
    })
    .catch(error => console.error("❌ Error en la API:", error));
}

// Restaurar estado al cargar la página
document.addEventListener("DOMContentLoaded", async function () {
    console.log("🚀 Cargando datos del usuario...");

    const idUsuario = localStorage.getItem("idUsuario");
    const fechaHoy = new Date().toISOString().split('T')[0];

    if (!idUsuario) {
        console.error("❌ No se encontró ID de usuario en localStorage.");
        return;
    }

    try {
        const response = await fetch(`http://localhost:5064/api/Fichajes/${idUsuario}/${fechaHoy}`);
        const fichajes = await response.json();
        console.log("✅ Datos de fichajes obtenidos:", fichajes);

        if (!Array.isArray(fichajes) || fichajes.length === 0) {
            console.warn("⚠️ No hay registros de fichaje para hoy.");
            return;
        }

        let tiempoTotalSegundos = 0;
        let ultimoFichajeActivo = null;

        fichajes.forEach(fichaje => {
            const horaEntrada = new Date(fichaje.horaEntrada).getTime();
            const horaSalida = fichaje.horaSalida ? new Date(fichaje.horaSalida).getTime() : null;

            if (horaSalida) {
                tiempoTotalSegundos += (horaSalida - horaEntrada) / 1000;
            } else {
                ultimoFichajeActivo = horaEntrada;
            }
        });

        tiempoFichaje = tiempoTotalSegundos;
        localStorage.setItem("tiempoFichaje", tiempoFichaje);

        if (ultimoFichajeActivo) {
            tiempoEntrada = ultimoFichajeActivo;
            localStorage.setItem("tiempoEntrada", tiempoEntrada);
        }

        actualizarContador();

        if (ultimoFichajeActivo) {
            console.log("⏳ El usuario sigue trabajando. Iniciando contador...");
            contadorActivo = setInterval(actualizarContador, 1000);
        } else {
            console.log("✅ Usuario ya ha terminado su jornada.");
        }

    } catch (error) {
        console.error("❌ Error al obtener los fichajes:", error);
    }
});
