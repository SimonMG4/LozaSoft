document.addEventListener('DOMContentLoaded', () => {

    //BOTON DE CERRAR SESION
    logOut.addEventListener('click', function(event) {
        Swal.fire({ 
            title: "Salir", 
            text: "¿Estás seguro que deseas salir de la sesión?", 
            icon: "question", showCancelButton: true, 
            confirmButtonColor: "#3085d6", 
            cancelButtonColor: "#d33", 
            confirmButtonText: "Sí, Salir", 
            cancelButtonText: "Cancelar"
        }).then(result => {
            if(result.isConfirmed){
                Swal.fire({
                    title: 'Has cerrado sesion correctamente',
                    text: 'Nos vemos pronto',
                    icon: 'success',
                }).then(result => {
                    if(result.isConfirmed){
                        window.location.href = '../../dev/modules/logOut.php?accion=cerrarSesion';
                    }
                })
            }
        })
        
    });





    const abrirModal = document.querySelectorAll('.btn_agregar'); // Corregir el nombre de la clase
    const modal = document.querySelector('.modal'); // Obtener un único elemento modal
    const modalContent = document.querySelector('.modal_contenedor'); // Obtener un único contenedor modal

    abrirModal.forEach(button => {
        button.addEventListener('click', function() {
            const url = this.getAttribute('data-url');

            fetch(url)
                .then(response => response.text())
                .then(data => {
                    modalContent.innerHTML = data;
                    modal.classList.add('modal--show');
                    
                    // Añadir evento para cerrar el modal
                    const closeModalButton = document.querySelector('#cerrarModal');
                    closeModalButton.addEventListener('click', function() {
                        modal.classList.remove('modal--show');
                        modalContent.innerHTML = ''; // Limpiar el contenido del modal
                    });
                })
                .catch(error => console.error('Error al cargar el modal:', error));
        });
    });
});
