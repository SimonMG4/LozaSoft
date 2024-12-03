document.addEventListener('DOMContentLoaded', () => {
    const btn_abrirInfo = document.querySelectorAll(".btn-informe");
    const modal = document.querySelector('.modal'); 
    const modalContent = document.querySelector('.modal_contenedor'); 

    btn_abrirInfo.forEach(button=>{
        button.addEventListener('click',function(){
            const url = this.getAttribute('data-url');

            fetch(url)
                .then(response => response.text())
                .then(data => {
                    modalContent.innerHTML = data;
                    modal.classList.add('modal--show');

                    const form = document.querySelector('.form2');
                    const controller = "../../dev/modules/informes/informesController.php";
                    
                    const btn_info = document.querySelectorAll(".btn-info");

                    btn_info.forEach(button=>{
                        button.addEventListener('click',function(){
                            const type = this.getAttribute('id');
                            if(type=="btn-informe-diaP"){
                                const contenedor = document.getElementById('informe-contenedor');

                                const inputs =`
                                    <input type="date" name="informeDiaP" placeholder required>
                                    <input type="submit" class="btn-enviarInfo" value="Generar">
                                `;
                                contenedor.innerHTML=inputs;

                                const botonEnviar = document.querySelector('.btn-enviarInfo');

                                botonEnviar.addEventListener('click',(e)=>{
                                    e.preventDefault();
                                    const formData = new FormData(form);

                                    fetch(controller,{
                                        method: 'POST',
                                        body: formData
                                    }).then(response=>response.json())
                                    .then(data=>{
                                        if(data){
                                            if(data.status == 'noInfo'){
                                                Swal.fire({
                                                    icon: "error",
                                                    title: "Error",
                                                    text: "Por favor, Asegurate de haber ingresado la fecha antes de proceder."
                                                });
                                            }else if(data.status == 'false'){
                                                Swal.fire({
                                                    icon: "warning",
                                                    title: "Registros",
                                                    text: "No hay registros de ventas o compras en la fecha seleccionada."
                                                });

                                            }else if(data.status == 'true'){
                                                const informeData = data.data;

                                                const form = document.createElement('form');
                                                form.method = 'POST';
                                                form.action = '../../dev/views/informe.php';
                                                
                                                const inputData = document.createElement('input');
                                                inputData.type = 'hidden';
                                                inputData.name = 'informeData';
                                                inputData.value = JSON.stringify(informeData); 
                                                form.appendChild(inputData);
                                                
                                                
                                                document.body.appendChild(form);
                                                form.submit();
                                            }
                                        }
                                    })
                                    

                                })
                            }else if(type == 'btn-informe-mesP'){
                                const contenedor = document.getElementById('informe-contenedor');

                                const inputs =`
                                    <select name="informeMesP">
                                        <option value="" selected>Selecciona una opción</option>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                        <option value="6">6</option>
                                        <option value="7">7</option>
                                        <option value="8">8</option>
                                        <option value="9">9</option>
                                        <option value="10">10</option>
                                        <option value="11">11</option>
                                        <option value="12">12</option>
                                    </select>

                                    <input type="submit" class="btn-enviarInfo" value="Generar">
                                `;
                                contenedor.innerHTML=inputs;

                                const botonEnviar = document.querySelector('.btn-enviarInfo');

                                botonEnviar.addEventListener('click',(e)=>{
                                    e.preventDefault();
                                    const formData = new FormData(form);

                                    fetch(controller,{
                                        method: 'POST',
                                        body: formData
                                    }).then(response=>response.json())
                                    .then(data=>{
                                        if(data){
                                            if(data.status == 'noInfo'){
                                                Swal.fire({
                                                    icon: "error",
                                                    title: "Error",
                                                    text: "Por favor, Seleciona una opcion antes de proceder."
                                                });
                                            }else if(data.status == 'false'){
                                                Swal.fire({
                                                    icon: "warning",
                                                    title: "Registros",
                                                    text: "No hay registros de ventas o compras en la fecha seleccionada."
                                                });

                                            }
                                        }
                                    })
                                    

                                })


                            }else if(type == 'btn-informe-yearP'){
                                const contenedor = document.getElementById('informe-contenedor');

                                const inputs =`
                                    <input type="number" name="informeYearP" placeholder="Ingrese el Año" required>
                                    <input type="submit" class="btn-enviarInfo" value="Generar">
                                `;
                                contenedor.innerHTML=inputs;

                                const botonEnviar = document.querySelector('.btn-enviarInfo');

                                botonEnviar.addEventListener('click',(e)=>{
                                    e.preventDefault();
                                    const formData = new FormData(form);

                                    fetch(controller,{
                                        method: 'POST',
                                        body: formData
                                    }).then(response=>response.json())
                                    .then(data=>{
                                        if(data){
                                            if(data.status == 'noInfo'){
                                                Swal.fire({
                                                    icon: "error",
                                                    title: "Error",
                                                    text: "Por favor, Asegurate de haber ingresado el año antes de proceder."
                                                });
                                            }else if(data.status == 'false'){
                                                Swal.fire({
                                                    icon: "warning",
                                                    title: "Registros",
                                                    text: "No hay registros de ventas o compras en la fecha seleccionada."
                                                });

                                            }
                                        }
                                    })
                                    

                                })

                            }else if(type=='btn-informe-dia'|| type=='btn-informe-sem'|| type=='btn-informe-mes' || type=='btn-informe-year') {

                                const formData = new FormData(form);

                                fetch(controller,{
                                    method: 'POST',
                                    body: formData
                                }).then(response=>response.json())
                                .then(data=>{
                                    if(data){
                                        if(data.status == 'false'){
                                            Swal.fire({
                                                icon: "warning",
                                                title: "Registros",
                                                text: "No hay registros de ventas o compras en la fecha seleccionada."
                                            });

                                        }
                                    }
                                })
                                
                                
                            }
                            
                        })
                    })
                    const btn_infoPer = document.querySelector('.btn-enviarInfoP');
                    if(btn_infoPer){
                        btn_infoPer.addEventListener('click',(e)=>{
                            e.preventDefault();

                            const formData = new FormData(form);

                            fetch(controller,{
                                method: 'POST',
                                body: formData
                            }).then(response=>response.json())
                            .then(data=>{
                                if(data){
                                    if(data.status == 'noInfo'){
                                        Swal.fire({
                                            icon: "error",
                                            title: "Error",
                                            text: "Por favor, Asegurate de haber Introducido las fechas antes de proceder."
                                        });
                                    }else if(data.status == 'fecha>'){
                                        Swal.fire({
                                            icon: "error",
                                            title: "Error",
                                            text: "Por favor, Asegurate que la primera fecha no es mayor que la segunda."
                                        });

                                    }else if(data.status == 'false'){
                                        Swal.fire({
                                            icon: "warning",
                                            title: "Registros",
                                            text: "No hay registros de ventas o compras en la fecha seleccionada."
                                        });

                                    }
                                }
                            })
                        })
                    }


                    const closeModalButton = document.querySelector('#cerrarModal');
                    closeModalButton.addEventListener('click', function() {
                            modal.classList.remove('modal--show');
                            modalContent.innerHTML = ''; 
                    });
                })


        })
        
    })

})