document.addEventListener('DOMContentLoaded', function () {
    const calendarEl = document.getElementById('calendar');
    let selectedDates = []; // Días seleccionados

    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'es',
        height: 'auto',
        selectable: true,

        select: function (info) {
            const fecha = info.startStr; // Fecha seleccionada
            // Si no está en la lista de días seleccionados, se agrega
            if (!selectedDates.includes(fecha)) {
                selectedDates.push(fecha);
                guardarVacacion(USER_ID, fecha);  // Guardar vacación en la base de datos
            } else { // Si ya está seleccionado, se elimina
                selectedDates = selectedDates.filter(d => d !== fecha);
                eliminarVacacion(USER_ID, fecha);  // Eliminar vacación de la base de datos
            }
            actualizarContador();  // Actualiza el contador de días restantes
            calendar.refetchEvents();  // Refresca el calendario con los eventos actualizados
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
        const fechaSolo = fecha.split('T')[0];  // Esto deja solo la parte de la fecha: "YYYY-MM-DD"
    
        // Actualiza la URL para apuntar al puerto correcto (5064 en lugar de 3000)
        fetch(`http://localhost:5064/api/Vacaciones`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                idUsuario: userId,  // ID del usuario
                fecha: fechaSolo     // Fecha sin hora
            })
        })
        .then(response => {
            if (response.ok) {
                console.log('Vacación agregada con éxito');
            } else {
                console.error('Error al agregar la vacación');
            }
        })
        .catch(error => console.error('Error al hacer el POST:', error));
    }

    function eliminarVacacion(userId, fecha) {
        // Para eliminar, necesitamos enviar la fecha exacta, ya que no estamos trabajando con ID de vacación
        const fechaSolo = fecha.split('T')[0];  // Solo la fecha (YYYY-MM-DD)
        
        fetch(`http://localhost:5064/api/vacaciones?usuario=${userId}&fecha=${fechaSolo}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        })
        .then(response => {
            if (response.ok) {
                console.log('Vacación eliminada correctamente');
            } else {
                console.error('Error al eliminar la vacación');
            }
        })
        .catch(error => console.error('Error al eliminar la vacación:', error));
    }
});
