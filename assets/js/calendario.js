document.addEventListener('DOMContentLoaded', function () {
    const calendarEl = document.getElementById('calendar');
    let selectedDates = []; // Días seleccionados
    let vacationChart; // Referencia al gráfico

    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'es',
        height: 'auto',
        selectable: true,

        select: async function (info) {
            const fecha = info.startStr;

            // Verificar si ya está seleccionada
            if (!selectedDates.includes(fecha)) {
                // Comprobar límite de 28 días
                const response = await fetch(`http://localhost:5064/api/Vacaciones/usuario/${USER_ID}`);
                const vacaciones = await response.json();
                if (vacaciones.length >= 28) {
                    alert("Ya has utilizado los 28 días de vacaciones.");
                    return;
                }

                selectedDates.push(fecha);
                await guardarVacacion(USER_ID, fecha);
            } else {
                selectedDates = selectedDates.filter(d => d !== fecha);
                await eliminarVacacion(USER_ID, fecha);
            }

            calendar.refetchEvents();  // Refrescar eventos en el calendario
            await actualizarGraficoVacaciones();  // Actualizar gráfico y contador
        },

        eventDidMount: function (info) {
            info.el.classList.add('evento-vacacion');
            info.el.innerHTML = `<div class="evento-cuadro" style="background-color:${info.event.backgroundColor}">${info.event.title}</div>`;
        },

        events: function (fetchInfo, successCallback, failureCallback) {
            const mes = fetchInfo.startStr.substring(0, 7);
            fetch(`http://localhost:5064/api/vacaciones?mes=${mes}`)
                .then(res => res.json())
                .then(data => {
                    const eventos = data.map(v => {
                        return fetch(`http://localhost:5064/api/usuarios/${v.idUsuario}`)
                            .then(resUsuario => resUsuario.json())
                            .then(usuario => {
                                let titulo = v.idUsuario === USER_ID ? 'Tus vacaciones' : `${usuario.nombre} ${usuario.apellido}`;
                                return {
                                    title: titulo,
                                    start: v.fecha,
                                    color: v.idUsuario === USER_ID ? '#3b82f6' : '#f87171',
                                    description: `${usuario.nombre} ${usuario.apellido}`
                                };
                            });
                    });

                    Promise.all(eventos)
                        .then(eventosConNombre => successCallback(eventosConNombre))
                        .catch(error => {
                            console.error('Error al obtener nombres de usuario:', error);
                            failureCallback(error);
                        });
                })
                .catch(error => {
                    console.error('Error al obtener eventos:', error);
                    failureCallback(error);
                });
        }
    });

    calendar.render();
    actualizarGraficoVacaciones(); // Inicial al cargar

    // Función para actualizar contador + gráfico
    async function actualizarGraficoVacaciones() {
        try {
            const res = await fetch(`http://localhost:5064/api/Vacaciones/usuario/${USER_ID}`);
            const data = await res.json();
            const usados = data.length;
            const restantes = 28 - usados;

            // Actualizar texto
            document.getElementById('vacation-counter').textContent =
                `Te quedan ${restantes} días de vacaciones.`;

            const ctx = document.getElementById('vacation-chart').getContext('2d');
            const chartData = {
                labels: ['Usados', 'Restantes'],
                datasets: [{
                    data: [usados, restantes],
                    backgroundColor: ['#3b82f6', '#e5e7eb'],
                    borderWidth: 1
                }]
            };

            const config = {
                type: 'doughnut',
                data: chartData,
                options: {
                    cutout: '70%',
                    plugins: {
                        legend: {
                            display: true,
                            position: 'bottom'
                        }
                    }
                }
            };

            if (vacationChart) {
                vacationChart.data = chartData;
                vacationChart.update();
            } else {
                vacationChart = new Chart(ctx, config);
            }
        } catch (error) {
            console.error("Error al actualizar gráfico de vacaciones:", error);
        }
    }

    function guardarVacacion(userId, fecha) {
        const fechaSolo = fecha.split('T')[0];
        return fetch(`http://localhost:5064/api/Vacaciones`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idUsuario: userId, fecha: fechaSolo })
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
