document.addEventListener("DOMContentLoaded", async () => {
    const btnAgregarMacro = document.getElementById("btnAgregarMacro");
    const btnCerrarMacro = document.getElementById("btnCerrarMacro");
    const modalMacro = document.getElementById("modalMacro");
    const macroTableBody = document.getElementById("macroTableBody");

    async function cargarMacros() {
        try {
            const response = await fetch("../data.json");
            if (!response.ok) throw new Error("No se pudo cargar el archivo");
            const data = await response.json();
            actualizarTablaMacro(data.ObjetivosMacro);
        } catch (error) {
            console.error("Error al cargar los datos:", error);
        }
    }

    function actualizarTablaMacro(macros) {
        macroTableBody.innerHTML = "";
        macros.forEach(macro => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td class='border p-2'>${macro.Id}</td>
                <td class='border p-2'>${macro.Nombre}</td>
                <td class='border p-2'>${macro.Peso}%</td>
                <td class='border p-2'>${macro.FechaDesde}</td>
                <td class='border p-2'>${macro.FechaHasta}</td>
                <td class='border p-2'>
                    <button class='bg-yellow-500 text-white px-2 py-1 rounded'>✏️</button>
                    <button class='bg-red-500 text-white px-2 py-1 rounded'>🗑️</button>
                </td>
            `;
            macroTableBody.appendChild(row);
        });
    }

    btnAgregarMacro.addEventListener("click", () => {
        modalMacro.classList.remove("hidden");
    });

    btnCerrarMacro.addEventListener("click", () => {
        modalMacro.classList.add("hidden");
    });

    cargarMacros();
});
