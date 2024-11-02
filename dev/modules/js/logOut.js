document.addEventListener('DOMContentLoaded', function () {

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
      
});