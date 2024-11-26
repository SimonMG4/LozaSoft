document.addEventListener('DOMContentLoaded', () => {
   const activarProducto = document.querySelectorAll('.btn_activar');

   activarProducto.forEach(button=>{
    button.addEventListener('click',function(){
        const id = this.getAttribute('data-id');
        const controller = this.getAttribute('data-controller');

        Swal.fire({ 
            title: "¿Deseas activar este producto nuevamente?", 
            icon: "question", showCancelButton: true, 
            confirmButtonColor: "#3085d6", 
            cancelButtonColor: "#d33", 
            confirmButtonText: "Sí, Activar", 
            cancelButtonText: "Cancelar"
        }).then(result => {
            if (result.isConfirmed){
                fetch(controller,{
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams({ 'accion': 'activarProducto', 'id': id })
                })
                .then(response=>response.json())
                .then(data=>{
                    if(data.status == 'true'){
                        Swal.fire({
                            position: "top-end",
                            icon: "success",
                            timer: 500 ,
                            timerProgressBar: true,
                            title: "El producto se ha activado exitosamente.",
                            showConfirmButton: false,
    
                        }).then(() => { 
                            window.location.reload(); 
                            });
                    }else{
                        Swal.fire({
                            icon: "error",
                            title: "Error",
                            text: "Ha habido un error al activar el producto"
                        });
                    }
                })
            }
        })
    })
        

   })
})