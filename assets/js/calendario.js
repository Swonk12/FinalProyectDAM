document.addEventListener('DOMContentLoaded', function () {
    const calendarEl = document.getElementById('calendar');
    let selectedDates = []; // Días seleccionados

    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'es',
        height: 'auto',
        selectable: true,

        select: async function (info) {
            const fecha = info.startStr;
        
            if (!selectedDates.includes(fecha)) {
                selectedDates.push(fecha);
                await guardarVacacion(USER_ID, fecha);  // Esperar a que se guarde
            } else {
                selectedDates = selectedDates.filter(d => d !== fecha);
                await eliminarVacacion(USER_ID, fecha);  // Esperar a que se elimine
            }
        
            actualizarContador();
            calendar.refetchEvents();  // Se ejecuta después de guardar/eliminar
        },

        eventDidMount: function(info) {
            // Añadir clase para estilo personalizado
            info.el.classList.add('evento-vacacion');
        
            // Opcional: modificar el contenido para que no sea solo texto plano
            info.el.innerHTML = `<div class="evento-cuadro" style="background-color:${info.event.backgroundColor}">${info.event.title}</div>`;
        },

        events: function(fetchInfo, successCallback, failureCallback) {
            const mes = fetchInfo.startStr.substring(0, 7); // Extraer mes en formato YYYY-MM
            fetch(`http://localhost:5064/api/vacaciones?mes=${mes}`)
                .then(res => res.json())
                .then(data => {
                    console.log("Respuesta de la API (vacaciones):", data);  // Ver los datos completos
        
                    // Obtener el nombre del usuario para cada vacación
                    const eventos = data.map(v => {
                        // Realizamos una petición para obtener el nombre del usuario
                        return fetch(`http://localhost:5064/api/usuarios/${v.idUsuario}`)
                            .then(resUsuario => resUsuario.json())
                            .then(usuario => {
                                console.log("Usuario obtenido:", usuario);
        
                                // Verificar el valor del título y nombre que se está asignando
                                let titulo = v.idUsuario === USER_ID ? 'Tus vacaciones' : `${usuario.nombre} ${usuario.apellido}`;
                                console.log("Título del evento:", titulo);  // Verificar el título
        
                                return {
                                    title: titulo,  // Asegúrate de que este valor no tiene "0" adelante
                                    start: v.fecha,
                                    color: v.idUsuario === USER_ID ? '#3b82f6' : '#f87171',
                                    description: `${usuario.nombre} ${usuario.apellido}`  // Mostrar el nombre del usuario
                                };
                            });
                    });
        
                    // Esperamos a que todas las peticiones de usuarios terminen antes de actualizar el calendario
                    Promise.all(eventos)
                        .then(eventosConNombre => {
                            successCallback(eventosConNombre);  // Enviamos los eventos con el nombre del usuario
                        })
                        .catch(error => {
                            console.error('Error al obtener el nombre del usuario:', error);
                            failureCallback(error);
                        });
                })
                .catch(error => {
                    console.error('Error al obtener los eventos de vacaciones:', error);
                    failureCallback(error);
                });
        }
        
        
        
    });

    calendar.render();

    function actualizarContador() {
        const diasRestantes = 28 - selectedDates.length;
        document.getElementById('vacation-counter').textContent =
            `Te quedan ${diasRestantes} días de vacaciones.`;
    }

    function guardarVacacion(userId, fecha) {
        const fechaSolo = fecha.split('T')[0];
        return fetch(`http://localhost:5064/api/Vacaciones`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                idUsuario: userId,
                fecha: fechaSolo
            })
        });
    }
    
    function eliminarVacacion(userId, fecha) {
        const fechaSolo = fecha.split('T')[0];
        return fetch(`http://localhost:5064/api/vacaciones?usuario=${userId}&fecha=${fechaSolo}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        });
    }
    
});
