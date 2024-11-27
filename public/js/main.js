document.addEventListener('DOMContentLoaded', () => {

    //BOTON DE CERRAR SESION
    logOut.addEventListener('click', function(event) {
        Swal.fire({ 
            title: "Salir", 
            text: "¿Estás seguro de que deseas cerrar sesión?", 
            icon: "question", showCancelButton: true, 
            confirmButtonColor: "#3085d6", 
            cancelButtonColor: "#d33", 
            confirmButtonText: "Sí, Cerrar ", 
            cancelButtonText: "Cancelar"
        }).then(result => {
            if(result.isConfirmed){
                Swal.fire({
                    title: 'Has cerrado sesion correctamente',
                    text: 'Nos vemos pronto',
                    icon: 'success',
                    showCancelButton: false,
                    showConfirmButton: false
                });
                setTimeout(() => {
                    window.location.href = '../../dev/modules/logOut.php?accion=cerrarSesion';
                      
                }, 1500);
            }
        })
        
    });


    //FUNCION DE BUSQUEDA

    const buscarInput = document.getElementById('buscar');
    const tabla = document.getElementById('tabla').getElementsByTagName('tbody')[0];



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



    //Mostrar modales agregar
    const abrirModal = document.querySelectorAll('.btn_agregar'); 
    const modal = document.querySelector('.modal'); 
    const modalContent = document.querySelector('.modal_contenedor'); 

    //Contador nos sirve para los modulos: venta y compras
    let contador = 0;

    abrirModal.forEach(button => {
        button.addEventListener('click', function() {
            //Actualizamos el contador a cero siempre que se abre el modal
            contador = 0;
            
            //data-url es la direccion del modal
            const url = this.getAttribute('data-url');

            //Hacemos un fetch a la url, hacemos un inner, y mostramos el modal
            fetch(url)
                .then(response => response.text())
                .then(data => {
                    modalContent.innerHTML = data;
                    modal.classList.add('modal--show');

                    const add_button = document.querySelector('.add-button');
                    const contenedor = document.querySelector('.contenedor-art');

                    //Add_button lo tiene los modales de compras y ventas
                    if(add_button){
                        //Data add dice que modulo estamos trabajando, puede ser compras o ventas
                        const data = add_button.getAttribute('data-add');
                        
                        if(data == 'compra'){
                            
                            //Agregamos un evento para cada vez que se quiere agregar un articulo
                            add_button.addEventListener('click', function(){

                                const nuevaFila = `
                                <div class="articulo-fila">
                                <button type="button" class="eliminarFila">X</button>
                                  <input type="text" name="articulos[${contador}][nombre]" placeholder="Nombre del Artículo" required>
                                  <input type="number" name="articulos[${contador}][cantidad]" placeholder="Cantidad" min="1" required>
                                  <input type="number" name="articulos[${contador}][precio]" placeholder="Precio Unitario" min="0" step="0.01" required>
                                </div>
                              `;
                              //Agregamos la const fila al contenedor
                              contenedor.insertAdjacentHTML('beforeend', nuevaFila);

                              //Aumentamos en contador para que los nombres no se repitan
                              contador++;
                              
                            })

                            //Agregamos un evento de click al boton de eliminar fila
                            contenedor.addEventListener('click',function(event){
                                if(event.target.classList.contains('eliminarFila')){
                                    const fila = event.target.closest('.articulo-fila');
                                    //Se remueve la fila y se actualizan los indices de los nombres
                                    if(fila){
                                        fila.remove();
                                        contador--;
                                        actualizarIndices();
                                    }
                                }
                            })
                            //Esta es la function que actualiza los indices de los nombres para que al enviarlo si se elimino
                            //Algun indice no se envie  1,3,4 por ejemplo
                            function actualizarIndices() {
                                const filas = document.querySelectorAll('.articulo-fila');
                                filas.forEach((fila, index) => {
                                    // Actualizamos los nombres de los inputs con el índice correcto
                                    fila.querySelector('input[name*="[nombre]"]').setAttribute('name', `articulos[${index}][nombre]`);
                                    fila.querySelector('input[name*="[cantidad]"]').setAttribute('name', `articulos[${index}][cantidad]`);
                                    fila.querySelector('input[name*="[precio]"]').setAttribute('name', `articulos[${index}][precio]`);
                                });
                            
                                //El contador toma el valor del tamaño total de filas
                                contador = filas.length;
                            }

                        }else if (data == 'venta'){
                            //Es practicamente lo mismo que compras, solamente que aqui se utiliza la tabla productos
                            //Por lo que se hace un fetch
                            add_button.addEventListener('click', function(){

                                //La fila que se ingresa cada vez que se agregue otro producto
                                //Se agrega con un ul para mostrar los productos
                                //El product-search funcionara como filtro para mostrar los productos por nombre
                                const nuevaFila = `
                                <div class="producto-fila">
                                <button type="button" class="eliminarFila">X</button>
                                <div>
                                <input type="text" class="product-search" placeholder="Nombre del Producto" required>
                                <ul class="dropdown" style="display: none;"></ul>
                                </div>
                                  <input type="hidden" name="productos[${contador}][id]" class="product-id">
                                  <input type="number" name="productos[${contador}][cantidad]" placeholder="Cantidad" min="1" required>
                                </div>
                              `;
    
                              contenedor.insertAdjacentHTML('beforeend', nuevaFila);
                              contador++;
                            })
                            //Se agrega un evento click cuando se quiere eliminar un producto
                            contenedor.addEventListener('click',function(event){
                                if(event.target.classList.contains('eliminarFila')){
                                    const fila = event.target.closest('.producto-fila');
                                    if(fila){
                                        //Se elimina la fila y se actualizan los indices
                                        fila.remove();
                                        contador--;
                                        actualizarIndices();
                                    }
                                }
                            })
                            function actualizarIndices() {
                                const filas = document.querySelectorAll('.producto-fila');
                                filas.forEach((fila, index) => {
                                    // Actualizamos los nombres de los inputs con el índice correcto
                                    fila.querySelector('input[name*="[id]"]').setAttribute('name', `articulos[${index}][id]`);
                                    fila.querySelector('input[name*="[cantidad]"]').setAttribute('name', `articulos[${index}][cantidad]`);
                                });
                            
                                contador = filas.length;
                            }
                            //Se agrega un evento de click al input que funcionara de filtro
                            contenedor.addEventListener('click', (e)=>{
                                if(e.target.classList.contains('product-search')){
                                    const searchInput = e.target;

                                    const fila = searchInput.closest('.producto-fila');
                                    const dropdown = fila.querySelector('.dropdown');
                                    //Se define la variable que almacenara los productos activos
                                   let productos= [];

                                   //Funcion asyncrona para que la pagina no tenga que esperar
                                   async function obtenerProductos() {
                                    try {
                                        const response = await fetch("../../dev/modules/ventas/ventasController.php", {
                                            method: 'POST',
                                            headers: {
                                                'Content-Type': 'application/x-www-form-urlencoded'
                                            },
                                            body: `accion=tablaProductos`
                                        });
                                
                                        if (!response.ok) {
                                            throw new Error('Error al obtener los productos');
                                        }

                                        //Se almacenan los productos en la variable
                                        productos = await response.json(); 

                                    } catch (error) {
                                        console.error('Error:', error);
                                    }
                                }

                                //Llamamos la funcion
                                obtenerProductos();
                                
                                //Le agregamos un evento de input para que detecte cuando se escribe(Puedes cambiarlo a keyup)
                                //Si lo cambias a keyup no funciona si el usuario pega un texto etc.
                                searchInput.addEventListener('input',()=>{
                                    //Normalizamos lo que el usuario ha escrito
                                    const query = searchInput.value.toLowerCase().trim();
                                    //Limpiamos el contenedor de los productos filtrados
                                    dropdown.innerHTML= '';

                                    //Si no hay nada escrito en el input, se muestran todos los productos
                                    //Si hay algo escrito se filtran los productos
                                    const productosAMostrar = query === '' 
                                    ? productos 
                                    : productos.filter(producto => producto.nombre.toLowerCase().includes(query));

                                    //Se hace un forEach para cada producto a mostrar, se muestra la imagen y el nombre
                                    productosAMostrar.forEach(producto=>{
                                        //Puedes alterar esto para mostrar lo que gustes
                                        const itemList = `
                                        <li class="listItem" data-id="${producto.id}">
                                            <img src="http://localhost/lozasoft${producto.imagen}" >
                                            <p>${producto.nombre}</p>
                                        </li>
                                    `;


                                    dropdown.insertAdjacentHTML('beforeend', itemList);
                                    //Si hay productos a mostrar cambiamos el contenedor de los productos de none a block o viceversa
                                    dropdown.style.display = productosAMostrar.length > 0 ? 'block' : 'none';

                                    //Const con cada producto que se muestra en la lista
                                    const listItems = dropdown.querySelectorAll('.listItem');

                                    //Le agregamos evento de click a cada producto que se muestra
                                    listItems.forEach(item=>{
                                        item.addEventListener('click',()=>{
                                            //Guardamos el id del producto
                                            const selectedId = item.dataset.id;
                                            //Guardamos el nombre del producto
                                            const selectedName = item.querySelector('p').textContent;
                                            //Le cambiamos value al filtrador para que el usuario vea que se escogio correctamente
                                            searchInput.value = selectedName;
                                            //Le agregamos el value del id seleccionado al input product-id de la fila
                                            fila.querySelector('.product-id').value = selectedId;
                                            //Despues de que se clickeo un producto(Se eligio) se deja de mostrar el contenedor 
                                            dropdown.style.display = 'none';
                                        })
                                    })

                            
                                    })

                                })
                                //Esto es para solucionar un error que me salio
                                //Si el usuario seleccionaba un producto, pero se arrepentia
                                //y cambiaba lo que habia en el input pero no seleccionaba un producto valido
                                //El formulario se quedaba con el id, del producto que habia elegido en un inicio

                                //Le agregamos un evento blur para cuando se quite el focus del input
                                searchInput.addEventListener('blur',()=>{
                                    //const del id 
                                    const productIdInput = fila.querySelector('.product-id');
                                    //const de lo que se tiene en el input
                                    const query = searchInput.value.trim().toLowerCase();
                                    //Validamos que el array de productos, tenga un producto con el nombre del query
                                    //Si no lo hay, limpiamos la const del id para que no se envie un producto no seleccionado
                                    if (!productos.some(producto => producto.nombre.toLowerCase() === query)){
                                        productIdInput.value = '';
                                    }
                                })
                              }
                            })
                        }
                    }
                    //Esto es para cambiar el nombre del input de la imagen en productos cuando el usuario ya selecciono la imagen
                    //Se hace esto para que el usuario sepa que la imagen quedo seleccionada
                    const inputImg = document.querySelector('.inputImg');
                    if(inputImg){
                        inputImg.addEventListener('change', function(event){
                            const fileName = inputImg.files[0].name;

                            document.getElementById('file-chosen').textContent = fileName;

                        })
                    }
                    
                    
                    //Envio del formulario
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
                                        title: "El registro se ha creado exitosamente.",
                                        showConfirmButton: false,
                                        timer: 1000
                                    });
                                    setTimeout(() => {
                                        modal.classList.remove('modal--show'); 
                                        modalContent.innerHTML = '';  
                                        window.location.reload(); 
                                    }, 1000); // El mismo tiempo que el timer de la alerta
                                }else if(data.status == '0articulo'){
                                    Swal.fire({
                                        icon: "error",
                                        title: "Error",
                                        text: "Por favor, asegúrate de agregar al menos un artículo antes de proceder."
                                    });

                                }else if(data.status == 'productoInvalido'){
                                    Swal.fire({
                                        icon: "error",
                                        title: "Error",
                                        text: "Por favor, verifica que los productos seleccionados sean válidos."
                                    });

                                } else if(data.status == 'noStock'){
                                    Swal.fire({
                                        icon: "error",
                                        title: "Error",
                                        text: "No hay suficiente stock para uno o más productos seleccionados.",
                                        footer: '<a href="../../dev/views/productos.php">Por favor, verifica las cantidades disponibles e intenta nuevamente.</a>'
                                      });
                                }
                                else {
                                    Swal.fire({
                                        icon: "error",
                                        title: "Error",
                                        text: "Ocurrió un error al intentar crear el registro."
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

            if(accion=='eliminarProducto'){
                Swal.fire({ 
                    title: "¿Estás seguro de que deseas desactivar este producto?", 
                    text: "No podras usar este producto hasta que se active nuevamente",
                    icon: "warning", showCancelButton: true, 
                    confirmButtonColor: "#3085d6", 
                    cancelButtonColor: "#d33", 
                    confirmButtonText: "Sí, Desactivar", 
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
                                    title: "El producto se ha desactivado exitosamente.",
                                    showConfirmButton: false,
            
                                }).then(() => { 
                                    window.location.reload(); 
                                    });
                            }else{
                                Swal.fire({
                                    icon: "error",
                                    title: "Error",
                                    text: "Ha habido un error al desactivar el producto"
                                });
                            }
                        })
                    }
                })
                

            }else{
                
                Swal.fire({ 
                    title: "¿Estás seguro de que deseas eliminar este registro?", 
                    text: "Esta acción no se puede deshacer.", 
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
                                    title: "El registro se ha eliminado exitosamente.",
                                    showConfirmButton: false,
            
                                }).then(() => { 
                                    window.location.reload(); 
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
            }


            

        });
    });

    //Mostrar modal editar

    const abrirModal2 = document.querySelectorAll('.btn_editar');
    //Array para los ids que debemos eliminar
    const idsParaEliminar = [];

    abrirModal2.forEach(button =>{
        button.addEventListener('click', function(){
            
            contador = 0;
            //Al abrir el modal idsParEliminar vuelve a ser cero
            idsParaEliminar.length = 0;

            
            const url = this.getAttribute('data-url');
            const id = this.getAttribute('data-id');
            const accion1 = this.getAttribute('data-accion1');
            const accion2 = this.getAttribute('data-accion2'); //modulo, puede ser editarproducto,editarcompra etc
            
            if(accion2=='editarProducto'){

                //Mostramos el modal haciendo un fetch a la url
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
                        //El acction es obtener compra, nos devuelve todos los campos del producto
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
                                //Agregamos la data del producto al input para que el usuario solo cambie lo que necesita
                                document.querySelector('.inputNombre').value = data.data.nombre;
                                document.querySelector('.inputDescripcion').value = data.data.descripcion;
                                document.querySelector('.inputPrecio').value = data.data.precio;
                                document.querySelector('.inputStock').value = data.data.stock;
                                document.querySelector('.inputId').value = data.data.id;
                            }
                        })
                        if(form){
                            //Envio del formulario
                            form.addEventListener('submit', async (e)=>{
                                e.preventDefault();
    
                                const formData = new FormData(form);
                                const action = form.getAttribute('action'); //Controlador
    
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
                                modalContent.innerHTML = ''; 
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

                        //Hacemos un fetch, esto nos devuelve un array con todos los articulos de la compra
                        fetch(action,{
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded'
                            },
                            body: `accion=${accion1}&id=${id}`
                        }).then(response=>response.json())
                        .then(data=>{
                            if(data){
                                //Contenedor donde se agregan los articulos dinamicamente
                                const contenedor = document.querySelector('.contenedor-art');
                                //input de la fecha
                                const fecha = document.getElementById('fecha');
                                //Id de la compra
                                const inputID = document.querySelector('.inputIdModulo');

                                //Almacenamos en el inputID el id de la compra para saber a que compra hay que actualizar
                                inputID.value = id;

                                //Ponemos en el input de la fecha la fecha que nos devuelve el fetch
                                fecha.value = data.compra[0].fecha;

                                //Se hace un ciclo para insertar una nuevaFila por cada articulo que nos devuelve el fetch
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
                                    
                                    //Las const de los input que nos inserta la const nuevaFila
                                    const id = document.querySelector(`[name="articulos[${count}][id]"]`)
                                    const nombre = document.querySelector(`[name="articulos[${count}][nombre]"]`);
                                    const cantidad = document.querySelector(`[name="articulos[${count}][cantidad]"]`);
                                    const precio = document.querySelector(`[name="articulos[${count}][precio]"]`);
                                    
                                    //Le agregamos a los inputs de cada fila el value que nos devuelve el fetch
                                    id.value = data.detalles[count].id_detalle_compra;
                                    nombre.value = data.detalles[count].nombre_articulo;
                                    cantidad.value = data.detalles[count].cantidad;
                                    precio.value = data.detalles[count].precio_unitario;

                                    contador++;
                                }

                                //Esto es por si el usuario quiso agregar mas productos
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
                                //Si el usuario elimina un articulo en editar
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
                                                //Closest para saber a que fila pertenece el boton de eliminar que se clickeo
                                                const fila = event.target.closest('.articulo-fila');
                                                if(fila){

                                                    //Se almacena en una const el value que tenia el input del id del articulo
                                                    const inputId = fila.querySelector('input[type="hidden"]');
                                                    const idArticulo = inputId.value;

                                                    //Se agrega ese id en el arreglo idsParaEliminar
                                                    if (idArticulo) {
                                                        idsParaEliminar.push(idArticulo);
                                                    }
                                                    inputId.remove(); //Se remueve el inputId del formulario

                                                    //Se actualiza el input de idsParaEliminar
                                                    document.getElementById('idsParaEliminar').value = JSON.stringify(idsParaEliminar); 

                                                    //Se remueve la fila y se actualizan los indices
                                                    fila.remove();
                                                    contador--;
                                                    actualizarIndices();
                                                }
                                            }
                                        })
                                    }
                                })

                                //Actualiza los nombres de los input para que sean secuenciales en caso de que se eliminp
                                // Para que no quede algo como 1,2,4,5
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

                                //Envio del formulario
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

                        //Cierre del modal
                        const closeModalButton = document.querySelector('#cerrarModal');
                        closeModalButton.addEventListener('click', function() {
                                modal.classList.remove('modal--show');
                                modalContent.innerHTML = ''; 
                        });
                    })
                
            }else if(accion2=='editarVenta'){
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
                        }).then(response =>response.json())
                        .then(data =>{
                            if(data){
                                //Contenedor donde se agregan los articulos dinamicamente
                                const contenedor = document.querySelector('.contenedor-art');
                                //input de la fecha
                                const fecha = document.getElementById('fecha');
                                //Id de la compra
                                const inputID = document.querySelector('.inputIdModulo');

                                //Almacenamos en el inputID el id de la compra para saber a que venta hay que actualizar
                                inputID.value = id;

                                //Ponemos en el input de la fecha la fecha que nos devuelve el fetch
                                fecha.value = data.venta[0].fecha;
                                //Se hace un ciclo para insertar una nuevaFila por cada articulo que nos devuelve el fetch
                                for (let count = 0; count < data.detalles.length; count++) {
                                    const nuevaFila = `
                                    <div class="producto-fila">
                                    <button type="button" class="eliminarFila">X</button>
                                    <div>
                                    <input type="text" class="product-search" name="productos[${count}][nombre]" placeholder="Nombre del Producto" required>
                                    <ul class="dropdown" style="display: none;"></ul>
                                    </div>
                                      <input type="hidden" name="productos[${count}][detalleventa-id]" class="detalleventa-id">
                                      <input type="hidden" name="productos[${count}][id]" class="product-id">
                                      <input type="number" name="productos[${count}][cantidad]" placeholder="Cantidad" min="1" required>
                                    </div>
                                  `;
                                    
                                    contenedor.insertAdjacentHTML('beforeend', nuevaFila);  
                                    
                                    //Las const de los input que nos inserta la const nuevaFila
                                    const detalleventaID = document.querySelector(`[name="productos[${count}][detalleventa-id]"]`)
                                    const id = document.querySelector(`[name="productos[${count}][id]"]`)
                                    const nombre = document.querySelector(`[name="productos[${count}][nombre]"]`);
                                    const cantidad = document.querySelector(`[name="productos[${count}][cantidad]"]`);
                                    
                                    //Le agregamos a los inputs de cada fila el value que nos devuelve el fetch
                                    detalleventaID.value = data.detalles[count].id_detalle_venta;
                                    id.value = data.detalles[count].id_producto;
                                    nombre.value = data.detalles[count].nombre;
                                    cantidad.value = data.detalles[count].cantidad;

                                    contador++;
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
                                                //Closest para saber a que fila pertenece el boton de eliminar que se clickeo
                                                const fila = event.target.closest('.producto-fila');
                                                if(fila){

                                                    //Se almacena en una const el value que tenia el input del id del articulo
                                                    const inputId = fila.querySelector('input[type="hidden"]');
                                                    const idProducto = inputId.value;

                                                    //Se agrega ese id en el arreglo idsParaEliminar
                                                    if (idProducto) {
                                                        idsParaEliminar.push(idProducto);
                                                    }
                                                    inputId.remove(); //Se remueve el inputId del formulario

                                                    //Se actualiza el input de idsParaEliminar
                                                    document.getElementById('idsParaEliminar').value = JSON.stringify(idsParaEliminar); 

                                                    //Se remueve la fila y se actualizan los indices
                                                    fila.remove();
                                                    contador--;
                                                    actualizarIndices();
                                                }
                                            }
                                        })
                                    }
                                })
                                //Actualiza los nombres de los input para que sean secuenciales en caso de que se eliminp
                                // Para que no quede algo como 1,2,4,5
                                function actualizarIndices() {
                                    const filas = document.querySelectorAll('.articulo-fila');
                                    filas.forEach((fila, index) => {
                                        // Actualizamos los nombres de los inputs con el índice correcto
                                        fila.querySelector('input[type="hidden"]').setAttribute('name', `productos[${index}][id]`);
                                        fila.querySelector('input[name*="[nombre]"]').setAttribute('name', `productos[${index}][nombre]`);
                                        fila.querySelector('input[name*="[cantidad]"]').setAttribute('name', `productos[${index}][cantidad]`);
                                    });
                                
                                    contador = filas.length;
                                }

                                const add_button = document.querySelector('.add-button');
                                if(add_button){

                                    add_button.addEventListener('click', function(){
    
                                        //La fila que se ingresa cada vez que se agregue otro producto
                                        //Se agrega con un ul para mostrar los productos
                                        //El product-search funcionara como filtro para mostrar los productos por nombre
                                        const nuevaFila = `
                                        <div class="producto-fila">
                                        <button type="button" class="eliminarFila">X</button>
                                        <div>
                                        <input type="text" class="product-search" placeholder="Nombre del Producto" required>
                                        <ul class="dropdown" style="display: none;"></ul>
                                        </div>
                                          <input type="hidden" name="productos[${contador}][id]" class="product-id">
                                          <input type="number" name="productos[${contador}][cantidad]" placeholder="Cantidad" min="1" required>
                                        </div>
                                      `;
            
                                      contenedor.insertAdjacentHTML('beforeend', nuevaFila);
                                      contador++;
                                    })

                                }
                                contenedor.addEventListener('click', (e)=>{
                                    if(e.target.classList.contains('product-search')){
                                        //Se define la variable que almacenara los productos activos
                                       let productos= [];
    
                                       //Funcion asyncrona para que la pagina no tenga que esperar
                                       async function obtenerProductos() {
                                        try {
                                            const response = await fetch("../../dev/modules/ventas/ventasController.php", {
                                                method: 'POST',
                                                headers: {
                                                    'Content-Type': 'application/x-www-form-urlencoded'
                                                },
                                                body: `accion=tablaProductos`
                                            });
                                    
                                            if (!response.ok) {
                                                throw new Error('Error al obtener los productos');
                                            }
    
                                            //Se almacenan los productos en la variable
                                            productos = await response.json(); 
    
                                        } catch (error) {
                                            console.error('Error:', error);
                                        }
                                    }
    
                                    //Llamamos la funcion
                                    obtenerProductos();

                                        const searchInput = e.target;
    
                                        const fila = searchInput.closest('.producto-fila');
                                        const dropdown = fila.querySelector('.dropdown');
                                        //verificamos si el product-id tiene value
                                        const inputHidden = fila.querySelector('.product-id')
                                        if(inputHidden.value){
                                            const eventos=['click','input'];

                                            eventos.forEach(evento=>{
                                                searchInput.addEventListener(evento,()=>{
                                                //Normalizamos lo que el usuario ha escrito
                                                const query = searchInput.value.toLowerCase().trim();

                                                //Limpiamos el contenedor de los productos filtrados
                                                dropdown.innerHTML= '';

                                                //Si no hay nada escrito en el input, se muestran todos los productos
                                                //Si hay algo escrito se filtran los productos
                                                const productosAMostrar = query === '' 
                                                ? productos 
                                                : productos.filter(producto => producto.nombre.toLowerCase().includes(query));

                                                productosAMostrar.forEach(producto=>{
                                                    //Puedes alterar esto para mostrar lo que gustes
                                                    const itemList = `
                                                    <li class="listItem" data-id="${producto.id}">
                                                        <img src="http://localhost/lozasoft${producto.imagen}" >
                                                        <p>${producto.nombre}</p>
                                                    </li>
                                                `;
            
            
                                                dropdown.insertAdjacentHTML('beforeend', itemList);
                                                //Si hay productos a mostrar cambiamos el contenedor de los productos de none a block o viceversa
                                                dropdown.style.display = productosAMostrar.length > 0 ? 'block' : 'none';
            
                                                //Const con cada producto que se muestra en la lista
                                                const listItems = dropdown.querySelectorAll('.listItem');
            
                                                //Le agregamos evento de click a cada producto que se muestra
                                                listItems.forEach(item=>{
                                                    item.addEventListener('click',()=>{
                                                        //Guardamos el id del producto
                                                        const selectedId = item.dataset.id;
                                                        //Guardamos el nombre del producto
                                                        const selectedName = item.querySelector('p').textContent;
                                                        //Le cambiamos value al filtrador para que el usuario vea que se escogio correctamente
                                                        searchInput.value = selectedName;
                                                        //Le agregamos el value del id seleccionado al input product-id de la fila
                                                        fila.querySelector('.product-id').value = selectedId;
                                                        //Despues de que se clickeo un producto(Se eligio) se deja de mostrar el contenedor 
                                                        dropdown.style.display = 'none';
                                                    })
                                                })
            
                                        
                                                })

                                                });
                                            })

                                        }else{
                                            //Le agregamos un evento de input para que detecte cuando se escribe(Puedes cambiarlo a keyup)
                                            //Si lo cambias a keyup no funciona si el usuario pega un texto etc.
                                            searchInput.addEventListener('input',()=>{
                                                //Normalizamos lo que el usuario ha escrito
                                                const query = searchInput.value.toLowerCase().trim();
                                                //Limpiamos el contenedor de los productos filtrados
                                                dropdown.innerHTML= '';
            
                                                //Si no hay nada escrito en el input, se muestran todos los productos
                                                //Si hay algo escrito se filtran los productos
                                                const productosAMostrar = query === '' 
                                                ? productos 
                                                : productos.filter(producto => producto.nombre.toLowerCase().includes(query));
            
                                                //Se hace un forEach para cada producto a mostrar, se muestra la imagen y el nombre
                                                productosAMostrar.forEach(producto=>{
                                                    //Puedes alterar esto para mostrar lo que gustes
                                                    const itemList = `
                                                    <li class="listItem" data-id="${producto.id}">
                                                        <img src="http://localhost/lozasoft${producto.imagen}" >
                                                        <p>${producto.nombre}</p>
                                                    </li>
                                                `;
            
            
                                                dropdown.insertAdjacentHTML('beforeend', itemList);
                                                //Si hay productos a mostrar cambiamos el contenedor de los productos de none a block o viceversa
                                                dropdown.style.display = productosAMostrar.length > 0 ? 'block' : 'none';
            
                                                //Const con cada producto que se muestra en la lista
                                                const listItems = dropdown.querySelectorAll('.listItem');
            
                                                //Le agregamos evento de click a cada producto que se muestra
                                                listItems.forEach(item=>{
                                                    item.addEventListener('click',()=>{
                                                        //Guardamos el id del producto
                                                        const selectedId = item.dataset.id;
                                                        //Guardamos el nombre del producto
                                                        const selectedName = item.querySelector('p').textContent;
                                                        //Le cambiamos value al filtrador para que el usuario vea que se escogio correctamente
                                                        searchInput.value = selectedName;
                                                        //Le agregamos el value del id seleccionado al input product-id de la fila
                                                        fila.querySelector('.product-id').value = selectedId;
                                                        //Despues de que se clickeo un producto(Se eligio) se deja de mostrar el contenedor 
                                                        dropdown.style.display = 'none';
                                                    })
                                                })
            
                                        
                                                })
            
                                            })
                                    }
                                    //Esto es para solucionar un error que me salio
                                    //Si el usuario seleccionaba un producto, pero se arrepentia
                                    //y cambiaba lo que habia en el input pero no seleccionaba un producto valido
                                    //El formulario se quedaba con el id, del producto que habia elegido en un inicio
    
                                    //Le agregamos un evento blur para cuando se quite el focus del input
                                    searchInput.addEventListener('blur',()=>{
                                        //const del id 
                                        const productIdInput = fila.querySelector('.product-id');
                                        //const de lo que se tiene en el input
                                        const query = searchInput.value.trim().toLowerCase();
                                        //Validamos que el array de productos, tenga un producto con el nombre del query
                                        //Si no lo hay, limpiamos la const del id para que no se envie un producto no seleccionado
                                        if (!productos.some(producto => producto.nombre.toLowerCase() === query)){
                                            productIdInput.value = '';
                                        }
                                     })
                                  }
                                })

                                //Envio del formulario
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
                                            if (data.status == 'success') {
                                                Swal.fire({
                                                    position: "top-end",
                                                    icon: "success",
                                                    title: "El registro se ha creado exitosamente.",
                                                    showConfirmButton: false,
                                                    timer: 1000
                                                });
                                                setTimeout(() => {
                                                    modal.classList.remove('modal--show'); 
                                                    modalContent.innerHTML = '';  
                                                    window.location.reload(); 
                                                }, 1000); // El mismo tiempo que el timer de la alerta
                                            }else if(data.status == '0articulo'){
                                                Swal.fire({
                                                    icon: "error",
                                                    title: "Error",
                                                    text: "Por favor, asegúrate de agregar al menos un artículo antes de proceder."
                                                });
            
                                            }else if(data.status == 'productoInvalido'){
                                                Swal.fire({
                                                    icon: "error",
                                                    title: "Error",
                                                    text: "Por favor, verifica que los productos seleccionados sean válidos."
                                                });
            
                                            } else if(data.status == 'noStock'){
                                                Swal.fire({
                                                    icon: "error",
                                                    title: "Error",
                                                    text: "No hay suficiente stock para uno o más productos seleccionados.",
                                                    footer: '<a href="../../dev/views/productos.php">Por favor, verifica las cantidades disponibles e intenta nuevamente.</a>'
                                                  });
                                            }
                                            else {
                                                Swal.fire({
                                                    icon: "error",
                                                    title: "Error",
                                                    text: "Ocurrió un error al intentar crear el registro."
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

    //Ver/Inspeccionar modal

    const abrirModal3 = document.querySelectorAll('.btn_ver');

    abrirModal3.forEach(button=>{
        button.addEventListener('click',function(){
            const url = this.getAttribute('data-url');
            const id = this.getAttribute('data-id');
            const accion = this.getAttribute('data-accion');

            if(accion=='obtenerProducto'){

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
                        body: `accion=${accion}&id=${id}`
                    }).then(response=>response.json())
                    .then(data=>{
                        if(data.status=='success'){
                            const src = "http://localhost/lozasoft"+data.data.imagen;
    
                            document.querySelector('.inputNombre').value = data.data.nombre;
                            document.querySelector('.inputVerDescripcion').innerHTML = data.data.descripcion;
                            document.querySelector('.inputPrecio').value = data.data.precio;
                            document.querySelector('.inputStock').value = data.data.stock;
                            const imgContenedor = document.querySelector('.containerImg');
                            const imagen = `<img src="${src}"></img>`;
    
                            imgContenedor.innerHTML = imagen;
    
    
                            
    
    
                        }
                    })
    
                    
    
    
    
                    const closeModalButton = document.querySelector('#cerrarModal');
                    closeModalButton.addEventListener('click', function() {
                        modal.classList.remove('modal--show');
                            modalContent.innerHTML = ''; 
                    });
    
    
                })
            }else{
                fetch(url)
                .then(response => response.text())
                    .then(data => {
                    modalContent.innerHTML = data;
                    modal.classList.add('modal--show');
    
                    const form = document.querySelector('.form');
                    const action = form.getAttribute('action');

                    const contenedorArt = document.querySelector('.contenedor-art');
    
                    fetch(action,{
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        body: `accion=${accion}&id=${id}`
                    }).then(response=>response.json())
                    .then(data=>{
                        if(data){
                            if(accion=='obtenerCompra'){

                                document.querySelector('.inputId').value = data.compra[0].id;
                                document.querySelector('.inputFecha').value = data.compra[0].fecha;
                                document.querySelector('.inputTotal').value = data.compra[0].total_perdida;
    
                                for (let count = 0; count < data.detalles.length; count++) {
                                    const nuevaFila = `
                                        <div class="articulo-fila">
                                            <span>Nombre:</span>
                                            <input type="text" name="articulos[${count}][nombre]" readonly>
                                            <span>Cantidad:</span>
                                            <input type="number" name="articulos[${count}][cantidad]" readonly>
                                            <span>Precio:</span>
                                            <input type="number" name="articulos[${count}][precio]" step="0.01" readonly>
                                            <span>Total:</span>
                                            <input type="number" name="articulos[${count}][total]" step="0.01" readonly>
                                        </div>
                                    `;
                                    
                                    contenedorArt.insertAdjacentHTML('beforeend', nuevaFila);  
                                    
                                    //Las const de los input que nos inserta la const nuevaFila
                                    const nombre = document.querySelector(`[name="articulos[${count}][nombre]"]`);
                                    const cantidad = document.querySelector(`[name="articulos[${count}][cantidad]"]`);
                                    const precio = document.querySelector(`[name="articulos[${count}][precio]"]`);
                                    const total = document.querySelector(`[name="articulos[${count}][total]"]`);
                                    
                                    //Le agregamos a los inputs de cada fila el value que nos devuelve el fetch
                                    nombre.value = data.detalles[count].nombre_articulo;
                                    cantidad.value = data.detalles[count].cantidad;
                                    precio.value = data.detalles[count].precio_unitario;
                                    total.value = data.detalles[count].total;
                                }
                            }else if(accion =='obtenerVenta'){

                                document.querySelector('.inputId').value = data.venta[0].id;
                                document.querySelector('.inputFecha').value = data.venta[0].fecha;
                                document.querySelector('.inputTotal').value = data.venta[0].total_ganancia;
    
                                for (let count = 0; count < data.detalles.length; count++) {
                                    const nuevaFila = `
                                        <div class="articulo-fila">
                                            <span>Nombre:</span>
                                            <input type="text" name="articulos[${count}][nombre]" readonly>
                                            <span>Cantidad:</span>
                                            <input type="number" name="articulos[${count}][cantidad]" readonly>
                                            <span>Precio:</span>
                                            <input type="number" name="articulos[${count}][precio]" step="0.01" readonly>
                                            <span>Total:</span>
                                            <input type="number" name="articulos[${count}][total]" step="0.01" readonly>
                                            <div class="containerImg containerImg${count}"></div>
                                        </div>
                                    `;
                                    
                                    contenedorArt.insertAdjacentHTML('beforeend', nuevaFila);  
                                    
                                    //Las const de los input que nos inserta la const nuevaFila
                                    const nombre = document.querySelector(`[name="articulos[${count}][nombre]"]`);
                                    const cantidad = document.querySelector(`[name="articulos[${count}][cantidad]"]`);
                                    const precio = document.querySelector(`[name="articulos[${count}][precio]"]`);
                                    const total = document.querySelector(`[name="articulos[${count}][total]"]`);
                                    const imgContenedor = document.querySelector(`.containerImg${count}`);
                                    const src = "http://localhost/lozasoft"+data.detalles[count].imagen;
                                    const imagen = `<img src="${src}"></img>`;
                                    
                                    //Le agregamos a los inputs de cada fila el value que nos devuelve el fetch
                                    nombre.value = data.detalles[count].nombre;
                                    cantidad.value = data.detalles[count].cantidad;
                                    precio.value = data.detalles[count].precio;
                                    total.value = data.detalles[count].total;
                                    imgContenedor.innerHTML = imagen;

                                }

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
