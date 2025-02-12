document.addEventListener("DOMContentLoaded", async () => {
    const tableBody = document.getElementById("instanciasTableBody");

    if (!tableBody) {
        console.error("Error: No se encontró el elemento instanciasTableBody en el DOM.");
        return;
    }

    try {
        const response = await fetch("../dataInstancias.json");
        const data = await response.json();
        const instancias = data.Instancias;

        let filas = "";

        instancias.forEach(instancia => {
            const fechaVencimiento = new Date(instancia.Vencimiento);
            const hoy = new Date();
            const diferenciaDias = Math.ceil((fechaVencimiento - hoy) / (1000 * 60 * 60 * 24));
            const alerta = diferenciaDias <= 5 ? "⚠️" : "";

            filas += `
                <tr class="odd:bg-white even:bg-gray-100 hover:bg-gray-200">
                    <td class='border p-2'>${instancia.Motivo}</td>
                    <td class='border p-2'>
                        <a href="${instancia.Instancia}" target="_blank" class="text-blue-500 underline">${instancia.Instancia}</a>
                    </td>
                    <td class='border p-2'>${instancia.Extensiones}</td>
                    <td class='border p-2'>${instancia.Tipo}</td>
                    <td class='border p-2'>${instancia.Vencimiento}</td>
                    <td class='border p-2'>${instancia.Usuario}</td>
                    <td class='border p-2'>${instancia.Clave}</td>
                    <td class='border p-2 text-center text-red-500 font-bold'>${alerta}</td>
                </tr>`;
        });

        tableBody.innerHTML = filas;

        // Inicializar DataTables con Tailwind
        $("#instanciasTable").DataTable({
            destroy: true, // Evita conflictos al recargar la tabla
            responsive: true,
            pageLength: 10,
            columns: [
                { width: "20%" }, // Ancho para la columna "Motivo"
                { width: "30%" }, // Ancho para la columna "Instancia"
                // ... define anchos para las demás columnas ...
                { width: "15%" },  // Ancho para la columna "Usuario"
                { width: "20%" }, // Ancho para la columna "Motivo"
                { width: "30%" },
                { width: "20%" }, // Ancho para la columna "Motivo"
                { width: "30%" },
                { width: "30%" }
              ],
            dom: '<"flex justify-between items-center px-4 pt-4"lf>t<"flex justify-between items-center px-4 pb-4"ip>',
            language: {
                search: "🔍 Buscar:",
                lengthMenu: "Mostrar _MENU_ registros",
                info: "Mostrando _START_ a _END_ de _TOTAL_ registros",
                paginate: {
                    first: "⏮ Primero",
                    last: "⏭ Último",
                    next: "⏩ Siguiente",
                    previous: "⏪ Anterior"
                }
            },
            classes: {
                table: "min-w-full border border-gray-300 text-sm stripe hover",
                processing: "text-center p-4 text-gray-600",
                pagination: {
                    ul: "flex gap-2 mt-4",
                    li: "border px-3 py-1 rounded-md hover:bg-gray-300 cursor-pointer"
                }
            }
        });
    } catch (error) {
        console.error("Error al cargar los datos:", error);
    }
});
