// Añade esto arriba del todo
function formatearMesAnio(mesAnio) {
    const meses = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    const [mes, anio] = mesAnio.split("-"); // "01-2024"
    const nombreMes = meses[parseInt(mes, 10) - 1] || "Mes inválido";
    return `${nombreMes} - ${anio}`;
}

function generarRutaDescarga(nomina) {
    return `/assets/uploads/${nomina.nombreArchivo}.pdf`;
}


document.addEventListener("DOMContentLoaded", async () => {
    const listaNominas = document.getElementById("listaNominas");

    function formatearMesAnio(mesAnio) {
        const meses = [
            "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
            "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
        ];
        const [mes, anio] = mesAnio.split("-");
        const nombreMes = meses[parseInt(mes, 10) - 1] || "Mes inválido";
        return `${nombreMes} - ${anio}`;
    }

    try {
        const response = await fetch(`http://localhost:5064/api/Nominas/usuario/${idUsuario}`);
        const nominas = await response.json();

        if (nominas.length === 0) {
            listaNominas.innerHTML = "<p>No hay nóminas disponibles.</p>";
            return;
        }

        nominas.forEach(nomina => {
            const item = document.createElement("div");
            item.className = "nomina-item";
        
            // Contenedor de texto
            const contenido = document.createElement("div");
            contenido.className = "nomina-texto";
        
            const header = document.createElement("div");
            header.className = "nomina-header";
            header.textContent = formatearMesAnio(nomina.mesAnio);
        
            const fecha = document.createElement("div");
            fecha.className = "nomina-fecha";
            const fechaObj = new Date(nomina.fechaSubida);
            fecha.textContent = `Subida el ${fechaObj.toLocaleDateString()}`;
        
            contenido.appendChild(header);
            contenido.appendChild(fecha);
        
            // Ícono
            const icono = document.createElement("a");
            icono.href = generarRutaDescarga(nomina);
            icono.target = "_blank";
            icono.download = `${nomina.nombreArchivo}.pdf`;
            icono.innerHTML = `<i class="bi bi-download"></i>`;
            icono.className = "descarga-icono";
        
            item.appendChild(contenido);
            item.appendChild(icono);
        
            listaNominas.appendChild(item);
        });        
    } catch (error) {
        console.error("Error al cargar las nóminas:", error);
        listaNominas.innerHTML = "<p>Error al cargar las nóminas.</p>";
    }
});
