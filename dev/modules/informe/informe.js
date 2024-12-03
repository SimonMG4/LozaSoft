/**
 * Función para mostrar/ocultar detalles de ventas o compras
 * @param {string} section 
 */
function toggleDetails(section) {
    const details = document.getElementById(section);
    if (details.style.display === "none" || details.style.display === "") {
        details.style.display = "table-row";
    } else {
        details.style.display = "none";
    }
}
