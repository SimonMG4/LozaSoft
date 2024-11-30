document.addEventListener('DOMContentLoaded', function(){

    if (document.getElementById('loginForm')){
        
        document.getElementById('loginForm').addEventListener('submit', function(event) {
            event.preventDefault();
            
            const formData = new FormData(this);
        
            fetch('dev/modules/login/loginController.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    Swal.fire({
                        title: 'Credenciales validas',
                        text: 'Inicio de sesion exitoso',
                        icon: 'success',
                        showCancelButton: false,
                        showConfirmButton: false
                    });
                    setTimeout(() => {
                        window.location.href = 'dev/views/interfaz.php';
                          
                    }, 1500);
                } else{
                    Swal.fire({
                        title: "Credenciales Invalidas",
                        text: 'Intenta nuevamente',
                        icon: "error"
                    });
                 }
    })
    .catch(error => {
        console.error('Error:', error);
        Swal.fire({
            title: "Error",
            text: "Error en el servidor. Inténtelo de nuevo más tarde.",
            icon: "error"
        });
    });
});
};   
 
const credencialesForm = document.getElementById('credencialesForm');

credencialesForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    const controller = credencialesForm.getAttribute('action');
    const formData = new FormData(this);

    try {
        const response = await fetch(controller, {
            method: 'POST',
            body: formData
        });
        const data = await response.json();

        if (data.status === true) {
            const result = await Swal.fire({
                title: 'Credenciales:',
                text: `Usuario: ${data.credenciales.usuario}`,
                icon: 'success',
                showCancelButton: true,
                showConfirmButton: true,
                cancelButtonColor: "#d33",
                confirmButtonText: 'Actualizar Contraseña'
            });

            if (result.isConfirmed) {
                const nuevaContraseña = await Swal.fire({
                    title: `Actualiza la  contraseña:`,
                    input: 'password',
                    inputPlaceholder: 'Ingresa tu nueva contraseña',
                    cancelButtonColor: "#d33",
                    showCancelButton: true,
                    confirmButtonText: 'Actualizar'
                });

                if (nuevaContraseña.isConfirmed && nuevaContraseña.value) {
                    const confirmacion = await Swal.fire({
                        title: `¿Estás seguro que deseas actualizar la contraseña?`,
                        text: `Actualizar la contraseña a: ${nuevaContraseña.value}`,
                        cancelButtonColor: "#d33",
                        confirmButtonColor: "#3085d6",
                        showCancelButton: true,
                        confirmButtonText: 'Actualizar'
                    });

                    if (confirmacion.isConfirmed) {
                        fetch(controller,{
                            method: 'POST',
                            headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                            },
                            body: `accion=actualizarContraseña&contraseña=${nuevaContraseña.value}`
                        }).then(response=>response.json())
                        .then(data=>{
                            if(data.status==true){
                                Swal.fire({
                                    icon: "success",
                                    title: "La contraseña se ha actualizado correctamente.",
                                    showConfirmButton: false,
                                    timer: 1000
                                });
                                setTimeout(() => {
                                    window.location.href = '../../index.html';
                                }, 1000);
                            }else{
                                Swal.fire({
                                    title: 'Error al intentar actualizar contraseña',
                                    text: `Intenta Nuevamente`,
                                    icon: 'error'
                                });
                            }
                        })
                    }
                }
            }
        } else {
            Swal.fire({
                title: 'Respuesta Invalida',
                text: `Intenta Nuevamente`,
                icon: 'error'
            });
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
        Swal.fire({
            title: 'Error',
            text: `Hubo un problema con la solicitud. Por favor intenta más tarde.`,
            icon: 'error'
        });
    }
});

});








      





   

