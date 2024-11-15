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

    let contador = 0;

    const idsParaEliminar = [];

    abrirModal.forEach(button => {
        button.addEventListener('click', function() {
            contador = 0;
            

            const url = this.getAttribute('data-url');

            fetch(url)
                .then(response => response.text())
                .then(data => {
                    modalContent.innerHTML = data;
                    modal.classList.add('modal--show');

                    const add_button = document.querySelector('.add-button');
                    const contenedor = document.querySelector('.contenedor-art');

                    if(add_button){
                        const inputContador = document.createElement('input');
                        inputContador.type = 'hidden';
                        inputContador.name = 'contador';
                        inputContador.value = contador;
                        contenedor.appendChild(inputContador);
                        add_button.addEventListener('click', function(){

                            const nuevaFila = `
                            <div class="articulo-fila">
                            <button type="button" class="eliminarFila">X</button>
                              <input type="text" name="articulos[${contador}][nombre]" placeholder="Nombre del Artículo" required>
                              <input type="number" name="articulos[${contador}][cantidad]" placeholder="Cantidad" min="1" required>
                              <input type="number" name="articulos[${contador}][precio]" placeholder="Precio Unitario" min="0" step="0.01" required>
                            </div>
                          `;

                          contenedor.insertAdjacentHTML('beforeend', nuevaFila);

                          contador++;
                          inputContador.value = contador;
                        })

                        contenedor.addEventListener('click',function(event){
                            if(event.target.classList.contains('eliminarFila')){
                                const fila = event.target.closest('.articulo-fila');
                                if(fila){
                                    fila.remove();
                                    contador--;
                                    actualizarIndices();
                                }
                            }
                        })
                        function actualizarIndices() {
                            const filas = document.querySelectorAll('.articulo-fila');
                            filas.forEach((fila, index) => {
                                // Actualizamos los nombres de los inputs con el índice correcto
                                fila.querySelector('input[name*="[nombre]"]').setAttribute('name', `articulos[${index}][nombre]`);
                                fila.querySelector('input[name*="[cantidad]"]').setAttribute('name', `articulos[${index}][cantidad]`);
                                fila.querySelector('input[name*="[precio]"]').setAttribute('name', `articulos[${index}][precio]`);
                            });
                        
                            contador = filas.length;
                        }
                    }

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
                                }else if(data.status == '0articulo'){
                                    Swal.fire({
                                        icon: "error",
                                        title: "Error",
                                        text: "Debes de ingresar minimo un articulo"
                                    });

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
            
            contador = 0;
            idsParaEliminar.length = 0;

            
            const url = this.getAttribute('data-url');
            const id = this.getAttribute('data-id');
            const accion1 = this.getAttribute('data-accion1');
            const accion2 = this.getAttribute('data-accion2');
            
            if(accion2=='editarProducto'){

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
                                document.querySelector('.inputId').value = data.data.id;
                            }
                        })
                        if(form){
                            form.addEventListener('submit', async (e)=>{
                                e.preventDefault();
    
                                const formData = new FormData(form);
                                const action = form.getAttribute('action');
    
                                try{
                                    const response = await fetch(action, {
                                        method: 'POST',
                                        body: formData,
                                        headers: {
                                            'X-Requested-With': 'XMLHttpRequest',
                                        }
                                    });
                                    const data = await response.json();
                                    if(data.status == 'success'){
                                        Swal.fire({
                                            position: "top-end",
                                            icon: "success",
                                            title: "Datos actualizados exitosamente",
                                            showConfirmButton: false,
                                            timer: 1000
                                        });
                                        setTimeout(() => {
                                            modal.classList.remove('modal--show'); 
                                            modalContent.innerHTML = '';  
                                            window.location.reload(); 
                                        }, 1000); 
    
                                    }else{
                                        Swal.fire({
                                            icon: "error",
                                            title: "Error",
                                            text: "Ha habido un error al crear el registro"
                                        });
                                    }
    
                                }catch (error){
                                    console.error('Error en el envío del formulario:', error);
                                    Toast.fire({
                                        icon: 'error',
                                        title: 'Hubo un problema al procesar la solicitud.'
                                    });
                                }
    
                            })
                        }
    
    
    
    
                        // Añadir evento para cerrar el modal
                        const closeModalButton = document.querySelector('#cerrarModal');
                        closeModalButton.addEventListener('click', function() {
                                modal.classList.remove('modal--show');
                                modalContent.innerHTML = ''; // Limpiar el contenido del modal
                        });
    
    
                    })
            }else if(accion2=='editarCompra'){
                fetch(url)
                .then(response => response.text())
                    .then(data => {
                        modalContent.innerHTML = data;
                        modal.classList.add('modal--show');

                        const form = document.querySelector('.form');
                        const action = form.getAttribute('action');

                        fetch(action,{
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded'
                            },
                            body: `accion=${accion1}&id=${id}`
                        }).then(response=>response.json())
                        .then(data=>{
                            if(data){
                                const contenedor = document.querySelector('.contenedor-art');
                                const fecha = document.getElementById('fecha');
                                const inputID = document.querySelector('.inputIdModulo');

                                inputID.value = id;

                                fecha.value = data.fecha;


                                for (let count = 0; count < data.detalles.length; count++) {
                                    const nuevaFila = `
                                        <div class="articulo-fila">
                                            <button type="button" class="eliminarFila">X</button>
                                           <input type="hidden" name="articulos[${contador}][id]">
                                            <input type="text" name="articulos[${count}][nombre]" placeholder="Nombre del Artículo" required>
                                            <input type="number" name="articulos[${count}][cantidad]" placeholder="Cantidad" min="1" required>
                                            <input type="number" name="articulos[${count}][precio]" placeholder="Precio Unitario" min="0" step="0.01" required>
                                        </div>
                                    `;
                                    
                                    contenedor.insertAdjacentHTML('beforeend', nuevaFila);  
                                    
                                    const id = document.querySelector(`[name="articulos[${count}][id]"]`)
                                    const nombre = document.querySelector(`[name="articulos[${count}][nombre]"]`);
                                    const cantidad = document.querySelector(`[name="articulos[${count}][cantidad]"]`);
                                    const precio = document.querySelector(`[name="articulos[${count}][precio]"]`);
                                    
                                    id.value = data.detalles[count].id_detalle_compra;
                                    nombre.value = data.detalles[count].nombre_articulo;
                                    cantidad.value = data.detalles[count].cantidad;
                                    precio.value = data.detalles[count].precio_unitario;

                                    contador++;
                                }
                                const add_button = document.querySelector('.add-button');
                                if(add_button){
                                    add_button.addEventListener('click', function(){
                                        

                                        const nuevaFila = `
                                        <div class="articulo-fila">
                                        <button type="button" class="eliminarFila">X</button>
                                          <input type="text" name="articulos[${contador}][nombre]" placeholder="Nombre del Artículo" required>
                                          <input type="number" name="articulos[${contador}][cantidad]" placeholder="Cantidad" min="1" required>
                                          <input type="number" name="articulos[${contador}][precio]" placeholder="Precio Unitario" min="0" step="0.01" required>
                                        </div>
                                      `;

                                      contenedor.insertAdjacentHTML('beforeend', nuevaFila);

                                      contador++;
            
                                    })

                                }
                                contenedor.addEventListener('click',function(event){
                                    if(event.target.classList.contains('eliminarFila')){
                                        Swal.fire({ 
                                            title: "Eliminar Articulo", 
                                            text: "¿Estás seguro que deseas eliminar este articulo?", 
                                            icon: "warning", showCancelButton: true, 
                                            confirmButtonColor: "#3085d6", 
                                            cancelButtonColor: "#d33", 
                                            confirmButtonText: "Sí, eliminar", 
                                            cancelButtonText: "Cancelar"
                                        }).then(result=>{
                                            if(result.isConfirmed){
                                                const fila = event.target.closest('.articulo-fila');
                                                if(fila){

                                                    const inputId = fila.querySelector('input[type="hidden"]');
                                                    const idArticulo = inputId.value;

                                                    if (idArticulo) {
                                                        idsParaEliminar.push(idArticulo);
                                                    }
                                                    inputId.remove();

                                                    document.getElementById('idsParaEliminar').value = JSON.stringify(idsParaEliminar);

                                                    fila.remove();
                                                    contador--;
                                                    actualizarIndices();
                                                }
                                            }
                                        })
                                    }
                                })
                                function actualizarIndices() {
                                    const filas = document.querySelectorAll('.articulo-fila');
                                    filas.forEach((fila, index) => {
                                        // Actualizamos los nombres de los inputs con el índice correcto
                                        fila.querySelector('input[type="hidden"]').setAttribute('name', `articulos[${index}][id]`);
                                        fila.querySelector('input[name*="[nombre]"]').setAttribute('name', `articulos[${index}][nombre]`);
                                        fila.querySelector('input[name*="[cantidad]"]').setAttribute('name', `articulos[${index}][cantidad]`);
                                        fila.querySelector('input[name*="[precio]"]').setAttribute('name', `articulos[${index}][precio]`);
                                    });
                                
                                    contador = filas.length;
                                }
                                if(form){
                                    form.addEventListener('submit', async (e)=>{
                                        e.preventDefault();
            
                                        const formData = new FormData(form);
                                        const action = form.getAttribute('action');
            
                                        try{
                                            const response = await fetch(action, {
                                                method: 'POST',
                                                body: formData,
                                                headers: {
                                                    'X-Requested-With': 'XMLHttpRequest',
                                                }
                                            });
                                            const data = await response.json();
                                            if(data.status == 'success'){
                                                Swal.fire({
                                                    position: "top-end",
                                                    icon: "success",
                                                    title: "Datos actualizados exitosamente",
                                                    showConfirmButton: false,
                                                    timer: 1500
                                                });
                                                setTimeout(() => {
                                                    modal.classList.remove('modal--show'); 
                                                    modalContent.innerHTML = '';  
                                                    window.location.reload(); 
                                                }, 1500); 
            
                                            }else if(data.status == '0articulo'){
                                                Swal.fire({
                                                    icon: "error",
                                                    title: "Error",
                                                    text: "Debes de tener minimo un articulo",
                                                    showConfirmButton: false,
                                                    timer: 1000
                                                });
                                                setTimeout(() => {
                                                    modal.classList.remove('modal--show'); 
                                                    modalContent.innerHTML = '';  
                                                    window.location.reload(); 
                                                }, 1000); 

            
                                            }else{
                                                Swal.fire({
                                                    icon: "error",
                                                    title: "Error",
                                                    text: "Ha habido un error al crear el registro"
                                                });
                                            }
            
                                        }catch (error){
                                            console.error('Error en el envío del formulario:', error);
                                            Toast.fire({
                                                icon: 'error',
                                                title: 'Hubo un problema al procesar la solicitud.'
                                            });
                                        }
            
                                    })
                                }
                                

 
                              



                                

                            }
                        })





                        const closeModalButton = document.querySelector('#cerrarModal');
                        closeModalButton.addEventListener('click', function() {
                                modal.classList.remove('modal--show');
                                modalContent.innerHTML = ''; 
                        });
                    })
                
            }


                

        })
    })
});
