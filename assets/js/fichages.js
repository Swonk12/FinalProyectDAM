let tiempoEntrada = null;
let tiempoFichaje = 0;
let enProceso = false;

// Función para actualizar el contador
function actualizarContador() {
    if (tiempoEntrada !== null) {
        let horas = Math.floor(tiempoFichaje / 3600);
        let minutos = Math.floor((tiempoFichaje % 3600) / 60);
        let segundos = tiempoFichaje % 60;

        document.getElementById('contador').innerText = 
            `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;
        
        tiempoFichaje++;
        localStorage.setItem("tiempoFichaje", tiempoFichaje);
    }   
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
            
            // Si la tabla estaba vacía, aseguramos iniciar desde 0
            tiempoFichaje = parseInt(localStorage.getItem("tiempoFichaje")) || 0;
            
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

            clearInterval(window.contadorActivo);
            window.contadorActivo = null;

            localStorage.setItem("tiempoFichaje", tiempoFichaje);
        }
    })
    .catch(error => console.error("❌ Error en la API:", error));
}

// Restaurar estado al cargar la página
document.addEventListener("DOMContentLoaded", function () {
    console.log("🚀 Script ejecutado correctamente");

    const entrarBtn = document.getElementById("entrarBtn");
    const salirBtn = document.getElementById("salirBtn");

    const fichajeActivo = localStorage.getItem("fichajeActivo") === "true";
    const tiempoGuardado = localStorage.getItem("tiempoEntrada");
    let tiempoPrevio = parseInt(localStorage.getItem("tiempoFichaje")) || 0;
    
    if (!tiempoGuardado) {
        console.warn("⚠️ No hay datos previos de fichaje. La base de datos puede estar vacía.");
        tiempoFichaje = 0;
        localStorage.setItem("tiempoFichaje", "0");
    }

    if (fichajeActivo) {
        entrarBtn.disabled = true;
        salirBtn.disabled = false;

        if (tiempoGuardado) {
            tiempoEntrada = parseInt(tiempoGuardado, 10);
            tiempoFichaje = Math.floor((Date.now() - tiempoEntrada) / 1000) + tiempoPrevio;
        }

        if (!window.contadorActivo) {
            window.contadorActivo = setInterval(actualizarContador, 1000);
        }
    } else {
        entrarBtn.disabled = false;
        salirBtn.disabled = true;
        
        // Mostrar el último tiempo fichado si no está trabajando
        let horas = Math.floor(tiempoPrevio / 3600);
        let minutos = Math.floor((tiempoPrevio % 3600) / 60);
        let segundos = tiempoPrevio % 60;
        document.getElementById('contador').innerText = 
            `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;
    }

    entrarBtn.addEventListener("click", () => ficharEntrada(idUsuario));
    salirBtn.addEventListener("click", () => ficharSalida(idUsuario));

    console.log("🔍 Intervalo activo:", window.contadorActivo);
});
