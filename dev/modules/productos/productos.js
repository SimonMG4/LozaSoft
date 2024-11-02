document.addEventListener('DOMContentLoaded', function() {
    const buscarInput = document.getElementById('buscar');
    const tabla = document.getElementById('tablaProductos').getElementsByTagName('tbody')[0];



    // Filtrar en tiempo real mientras se escribe
    buscarInput.addEventListener('keyup', function() {
        filterTable();
    });

    function filterTable() {
        const filter = buscarInput.value.toLowerCase();
        const rows = tabla.getElementsByTagName('tr');
        
        for (let i = 0; i < rows.length; i++) {
            const cells = rows[i].getElementsByTagName('td');
            let match = false;
            for (let j = 0; j < cells.length; j++) {
                if (cells[j].innerText.toLowerCase().startsWith(filter)) {
                    match = true;
                    break;
                }
            }
            rows[i].style.display = match ? '' : 'none';
        }
    }

    const agregarProducto = document.getElementById('btn_agregar');
});
