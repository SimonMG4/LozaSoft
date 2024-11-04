document.addEventListener('DOMContentLoaded', function(){

    if (document.getElementById('loginForm')){
        
        document.getElementById('loginForm').addEventListener('submit', function(event) {
            event.preventDefault();
            
            var formData = new FormData(this);
        
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
                    }).then(result => {
                        if (result.isConfirmed) {
                            window.location.href = 'dev/views/interfaz.php';
                        }
                    });
                } else if(data.status === 'error1'){
                    Swal.fire({
                        title: "Contraseña incorrecta",
                        text: 'Intenta nuevamente',
                        icon: "error"
                    });
        } else{
            Swal.fire({
                title: "Usuario no encontrado",
                text: 'Intenta nuevamente',
                icon: "error"
            })
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
} );
