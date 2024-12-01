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
                                    <input type="date" name="informeDia" placeholder>
                                    <input type="submit" class="btn-enviarInfo" value="Generar">
                                `;
                                contenedor.innerHTML=inputs;

                                const botonEnviar = document.querySelector('.btn-enviarInfo');

                                botonEnviar.addEventListener('click',(e)=>{
                                    e.preventDefault();
                                    const formData = new FormData(form);

                                    fetch(controller,{
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/x-www-form-urlencoded'
                                        },
                                        body: formData
                                    })
                                    

                                })
                            }else if(type=='btn-informe-dia'){
                                
                            }
                            
                        })
                    })


                    const closeModalButton = document.querySelector('#cerrarModal');
                    closeModalButton.addEventListener('click', function() {
                            modal.classList.remove('modal--show');
                            modalContent.innerHTML = ''; 
                    });
                })


        })
        
    })

})