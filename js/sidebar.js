document.addEventListener("DOMContentLoaded", () => {
    fetch("../partials/sidebar.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("sidebarContainer").innerHTML = data;

            // Agregar funcionalidad de colapso del menú
            const adminMenu = document.getElementById("adminMenu");
            const subMenu = document.getElementById("subAdminMenu");

            adminMenu.addEventListener("click", () => {
                subMenu.classList.toggle("hidden");
            });
        })
        .catch(error => console.error("Error al cargar el sidebar:", error));
});
