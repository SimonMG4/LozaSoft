/**
 * Función para mostrar/ocultar detalles de ventas o compras
 * @param {string} section 
 */
function toggleDetails(section) {
    const details = document.getElementById(section);
    if (details.style.display === "none" || details.style.display === "") {
        details.style.display = "table-row";
    } else {
        details.style.display = "none";
    }
}


//envio al controlador de descargar pdf

const btn_pdf = document.querySelector('.btn-pdf');

if(btn_pdf){
    btn_pdf.addEventListener('click',()=>{
        Swal.fire({
            icon: "question",
            title: "Generar PDF",
            text: "¿Deseas Generar un archivo PDF de este informe ? ",
            showCancelButton: true, 
            confirmButtonColor: "#21c73f", 
            cancelButtonColor: "#d33", 
            confirmButtonText: "Sí, Generar", 
            cancelButtonText: "Cancelar"
        }).then(result=>{
            if(result.isConfirmed){
                if(informeData){
                    
                    const form = document.createElement('form');
                    form.method = 'POST';
                    form.action = '../../dev/modules/informe/downloadInforme.php';
                                
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
}