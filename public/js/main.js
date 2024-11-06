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
    



    //Mostrar modales agregar
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

                    const inputImg = document.querySelector('.inputImg');
                    if(inputImg){
                        inputImg.addEventListener('change', function(event){
                            const fileName = inputImg.files[0].name;

                            document.getElementById('file-chosen').textContent = fileName;

                        })
                    }
                    
                    

                    const form = document.querySelector('.form');
                    if(form){
                        form.addEventListener('submit', async (e)=>{
                            e.preventDefault();
    
                            const formData = new FormData(form);
                            const action = form.getAttribute('action');
    
                            try {
                                const response = await fetch(action, {
                                    method: 'POST',
                                    body: formData,
                                    headers: {
                                        'X-Requested-With': 'XMLHttpRequest',
                                    }
                                });
                                const data = await response.json();
                                if (data.status == 'true') {
                                    Swal.fire({
                                        position: "top-end",
                                        icon: "success",
                                        title: "Registro creado exitosamente",
                                        showConfirmButton: false,
                                        timer: 1000
                                    });
                                    setTimeout(() => {
                                        modal.classList.remove('modal--show'); // Cerrar el modal
                                        modalContent.innerHTML = '';  // Limpiar el contenido del modal
                                        window.location.reload(); //Recarga pagina para mostrar en la tabla
                                    }, 1000); // El mismo tiempo que el timer de la alerta
                                } else {
                                    Swal.fire({
                                        icon: "error",
                                        title: "Error",
                                        text: "Ha habido un error al crear el registro"
                                    });
                                }
                            } catch (error) {
                                console.error('Error en el envío del formulario:', error);
                                Toast.fire({
                                    icon: 'error',
                                    title: 'Hubo un problema al procesar la solicitud.'
                                });
                            }

                    }

                    );
                    };

                    
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


    //ELIMINAR REGISTROS
    const eliminarRegistro = document.querySelectorAll('.btn_eliminar');

    eliminarRegistro.forEach(button =>{
        button.addEventListener('click', function(){
            const id = this.getAttribute('data-id');
            const accion = this.getAttribute('data-accion');
            const controller = this.getAttribute('data-controller');

            Swal.fire({ 
                title: "¿Estas seguro de eliminar este registro?", 
                text: "Esta accion es irreversible", 
                icon: "warning", showCancelButton: true, 
                confirmButtonColor: "#3085d6", 
                cancelButtonColor: "#d33", 
                confirmButtonText: "Sí, Eliminar", 
                cancelButtonText: "Cancelar"
            }).then(result => {
                if (result.isConfirmed){
                    fetch(controller,{
                        method: 'POST',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        body: new URLSearchParams({ 'accion': accion, 'id': id })
                    })
                    .then(response=>response.json())
                    .then(data=>{
                        if(data.status == 'true'){
                            Swal.fire({
                                position: "top-end",
                                icon: "success",
                                timer: 500 ,
                                timerProgressBar: true,
                                title: "Registro eliminado correctamente",
                                showConfirmButton: false,
        
                            }).then(() => { 
                                window.location.reload(); // Refresca la página automáticamente 
                                });
                        }else{
                            Swal.fire({
                                icon: "error",
                                title: "Error",
                                text: "Ha habido un error al eliminar el registro"
                            });
                        }
                    })
                }
            })

            

        });
    });

    //Mostrar modal editar

    const abrirModal2 = document.querySelectorAll('.btn_editar');

    abrirModal2.forEach(button =>{
        button.addEventListener('click', function(){
            
            const url = this.getAttribute('data-url');
            const id = this.getAttribute('data-id');
            const accion1 = this.getAttribute('data-accion1');
            const accion2 = this.getAttribute('data-accion2');

            fetch(url)
            .then(response => response.text())
                .then(data => {
                    modalContent.innerHTML = data;
                    modal.classList.add('modal--show');

                    const inputImg = document.querySelector('.inputImg');
                    if(inputImg){
                        inputImg.addEventListener('change', function(event){
                            const fileName = inputImg.files[0].name;

                            document.getElementById('file-chosen').textContent = fileName;

                        })
                    }

                    const form = document.querySelector('.form');
                    const action = form.getAttribute('action');
                    
                    fetch(action,{
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        body: `accion=${accion1}&id=${id}`
                    })
                    .then(response=>response.json())
                    .then(data=>{
                        if(data.status == 'success'){
                            document.querySelector('.inputNombre').value = data.data.nombre;
                            document.querySelector('.inputDescripcion').value = data.data.descripcion;
                            document.querySelector('.inputPrecio').value = data.data.precio;
                            document.querySelector('.inputStock').value = data.data.stock;
                        }
                    })


                    // Añadir evento para cerrar el modal
                    const closeModalButton = document.querySelector('#cerrarModal');
                    closeModalButton.addEventListener('click', function() {
                            modal.classList.remove('modal--show');
                            modalContent.innerHTML = ''; // Limpiar el contenido del modal
                    });


                })


                

        })
    })
});
