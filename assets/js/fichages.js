let tiempoEntrada = null;
let tiempoFichaje = 0;
let enProceso = false;
let contadorActivo = null;


// Función para actualizar el contador general
function actualizarContador() {
    let tiempoMostrar = Math.floor(tiempoFichaje);

    if (tiempoEntrada !== null) {
        tiempoMostrar += Math.floor((Date.now() - tiempoEntrada) / 1000);
    }

    let horas = Math.floor(tiempoMostrar / 3600);
    let minutos = Math.floor((tiempoMostrar % 3600) / 60);
    let segundos = Math.floor(tiempoMostrar % 60);

    document.getElementById('contador').innerText =
        `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;

    actualizarTiempoCursado();
}

// Función para cargar los fichajes y mostrar el tiempo cursado
async function cargarFichajes(idUsuario) {
    const fechaHoy = new Date().toISOString().split('T')[0];
    const listaFichajes = document.getElementById("listaFichajes");

    try {
        const response = await fetch(`http://localhost:5064/api/Fichajes/${idUsuario}/${fechaHoy}`);
        const fichajes = await response.json();
        console.log("✅ Datos de fichajes obtenidos:", fichajes);

        if (!Array.isArray(fichajes) || fichajes.length === 0) {
            listaFichajes.innerHTML = "<p>No hay registros para hoy.</p>";
            return;
        }

        listaFichajes.innerHTML = "";

        fichajes.forEach(fichaje => {
            const registro = document.createElement("div");
            registro.classList.add("registro");

            let tiempoCursado = calcularTiempoCursado(fichaje.horaEntrada, fichaje.horaSalida);

            if (fichaje.horaEntrada && !fichaje.horaSalida) {
                registro.classList.add("entrada");
                registro.innerHTML = `Entrada ➝ ${formatearHora(fichaje.horaEntrada)} <span class="tiempo-cursado">${tiempoCursado}</span>`;
                registro.setAttribute("data-hora-entrada", fichaje.horaEntrada);
                registro.setAttribute("data-tipo", "entrada");
            } else if (fichaje.horaEntrada && fichaje.horaSalida) {
                const entrada = document.createElement("div");
                entrada.classList.add("registro", "entrada");
                entrada.innerHTML = `Entrada ➝ ${formatearHora(fichaje.horaEntrada)} <span class="tiempo-cursado">${tiempoCursado}</span>`;

                const salida = document.createElement("div");
                salida.classList.add("registro", "salida");
                salida.innerHTML = `Salida ➝ ${formatearHora(fichaje.horaSalida)} <span class="tiempo-cursado">${tiempoCursado}</span>`;

                listaFichajes.appendChild(entrada);
                listaFichajes.appendChild(salida);
                return;
            }

            listaFichajes.appendChild(registro);
        });

        setInterval(actualizarTiempoCursado, 1000);

    } catch (error) {
        console.error("❌ Error al obtener los fichajes:", error);
    }
}

// Función para calcular tiempo cursado
function calcularTiempoCursado(horaEntrada, horaSalida) {
    const inicio = new Date(horaEntrada).getTime();
    const fin = horaSalida ? new Date(horaSalida).getTime() : Date.now();
    let tiempoTranscurrido = Math.floor((fin - inicio) / 1000);

    let horas = Math.floor(tiempoTranscurrido / 3600);
    let minutos = Math.floor((tiempoTranscurrido % 3600) / 60);
    let segundos = Math.floor(tiempoTranscurrido % 60);

    return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;
}

// Función para formatear la hora (HH:MM:SS)
function formatearHora(fechaISO) {
    const fecha = new Date(fechaISO);
    const horas = String(fecha.getHours()).padStart(2, "0");
    const minutos = String(fecha.getMinutes()).padStart(2, "0");
    const segundos = String(fecha.getSeconds()).padStart(2, "0");
    return `${horas}:${minutos}:${segundos}`;
}

// Función para actualizar dinámicamente el tiempo cursado en fichajes abiertos
function actualizarTiempoCursado() {
    document.querySelectorAll(".registro[data-tipo='entrada']").forEach(registro => {
        const horaEntrada = registro.getAttribute("data-hora-entrada");
        const tiempoCursado = calcularTiempoCursado(horaEntrada, null);
        registro.querySelector(".tiempo-cursado").innerText = tiempoCursado;
    });
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
            
            let tiempoGuardado = parseInt(localStorage.getItem("tiempoFichaje")) || 0;
            tiempoFichaje = tiempoGuardado; 

            if (!window.contadorActivo) {
                window.contadorActivo = setInterval(actualizarContador, 1000);
            }

            // 🔹 Recargar la lista de fichajes
            cargarFichajes(idUsuario);
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

            tiempoFichaje = tiempoFichaje + Math.floor((Date.now() - tiempoEntrada) / 1000);
            localStorage.setItem("tiempoFichaje", tiempoFichaje);
            tiempoEntrada = null;

            // 🔹 Recargar la lista de fichajes
            cargarFichajes(idUsuario);
        }
    })
    .catch(error => console.error("❌ Error en la API:", error));
}

// 🔹 Restaurar estado al cargar la página con todo integrado
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
            contadorActivo = setInterval(actualizarContador, 1000);
        }

        // 🔹 Cargar la lista de fichajes con tiempos cursados
        cargarFichajes(idUsuario);

    } catch (error) {
        console.error("❌ Error al obtener los fichajes:", error);
    }
});
