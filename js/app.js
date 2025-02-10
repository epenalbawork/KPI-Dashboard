document.addEventListener("DOMContentLoaded", async () => {
    const kpiContainer = document.querySelector("#kpiContainer");
    const detailsContainer = document.querySelector("#detailsContainer");

    try {
        // Cargar los datos desde data.json
        const response = await fetch("data.json");
        const data = await response.json();

        // Obtener tareas totales y completadas por macro
        const resumen = data.ObjetivosMacro.map(objetivo => {
            const tareas = data.DetalleObjetivo.filter(tarea => tarea.ObjetivoMacroId === objetivo.Id);
            const totalTareas = tareas.length;
            const tareasCompletadas = tareas.filter(t => t.Resultado === 1).length;
            const porcentajeAvance = totalTareas > 0 ? (tareasCompletadas / totalTareas) * 100 : 0;
            
            // Validación de colores
            const colores = Array.isArray(objetivo.Colores) && objetivo.Colores.length === 2
                ? objetivo.Colores
                : ["#CCCCCC", "#EEEEEE"]; // Colores por defecto en caso de error

            return { ...objetivo, totalTareas, tareasCompletadas, porcentajeAvance, colores, tareas };
        });

        // Limpiar contenedor antes de agregar elementos dinámicos
        kpiContainer.innerHTML = "";

        // Generar dinámicamente las tarjetas de KPI con diseño circular
        resumen.forEach(objetivo => {
            const card = document.createElement("div");
            card.className = "bg-white p-6 rounded-lg shadow-md cursor-pointer";
            card.dataset.id = objetivo.Id;
            
            card.innerHTML = `
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-bold">${objetivo.Nombre}</h3>
                    <span class="text-gray-500 text-sm">${objetivo.Peso}%</span>
                </div>
                <p class="text-gray-500 text-sm">📅 ${objetivo.FechaDesde} - ${objetivo.FechaHasta}</p>
                <div class="relative w-32 h-32 mx-auto">
                    <canvas id="chart-${objetivo.Id}"></canvas>
                </div>
                <div class="mt-4 border-t pt-2">
                    <div class="flex items-center mb-1">
                        <span class="w-3 h-3 inline-block mr-2 rounded-full" style="background-color: ${objetivo.colores[0]}"></span>
                        <p class="text-gray-600 flex-1">Total de Tareas</p>
                        <p class="font-bold">${objetivo.totalTareas}</p>
                    </div>
                    <div class="flex items-center">
                        <span class="w-3 h-3 inline-block mr-2 rounded-full" style="background-color: ${objetivo.colores[1]}"></span>
                        <p class="text-gray-600 flex-1">Tareas Completadas</p>
                        <p class="font-bold">${objetivo.tareasCompletadas} (${objetivo.porcentajeAvance.toFixed(2)}%)</p>
                    </div>
                </div>
            `;
            
            kpiContainer.appendChild(card);

            // Dibujar el gráfico principal
            setTimeout(() => {
                const ctx = document.getElementById(`chart-${objetivo.Id}`).getContext("2d");
                new Chart(ctx, {
                    type: "doughnut",
                    data: {
                        labels: ["Completado", "Pendiente"],
                        datasets: [{
                            data: [objetivo.tareasCompletadas, objetivo.totalTareas - objetivo.tareasCompletadas],
                            backgroundColor: objetivo.colores,
                        }]
                    },
                    options: {
                        responsive: true,
                        cutout: "70%",
                        plugins: {
                            legend: { display: false }
                        }
                    }
                });
            }, 100);

            // Evento click para mostrar detalles en tabla en el contenedor fijo
            card.addEventListener("click", () => {
                mostrarDetalles(objetivo);
            });
        });

        // Mostrar automáticamente el primer detalle y gráfico al cargar la página
        if (resumen.length > 0) {
            mostrarDetalles(resumen[0]);
        }
    } catch (error) {
        console.error("Error al cargar los datos:", error);
    }

    function mostrarDetalles(objetivo) {
        detailsContainer.innerHTML = `
            <h3 class="text-xl font-bold mb-4">Detalles de ${objetivo.Nombre}</h3>
            <p class="text-gray-500 text-sm mb-4">📅 ${objetivo.FechaDesde} - ${objetivo.FechaHasta}</p>
            <table class="min-w-full border border-gray-300 text-sm">
                <thead class="bg-gray-200">
                    <tr>
                        <th class="border border-gray-300 p-2">Tarea</th>
                        <th class="border border-gray-300 p-2">Descripción</th>
                        <th class="border border-gray-300 p-2">Estado</th>
                    </tr>
                </thead>
                <tbody>
                    ${objetivo.tareas.map(t => `
                        <tr>
                            <td class="border border-gray-300 p-2">${t.Nombre}</td>
                            <td class="border border-gray-300 p-2">${t.Descripcion}</td>
                            <td class="border border-gray-300 p-2 text-center">${t.Resultado ? "✅ Completado" : "❌ Pendiente"}</td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>
        `;
        detailsContainer.classList.remove("hidden");
    }
});
