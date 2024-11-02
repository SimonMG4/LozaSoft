document.addEventListener('DOMContentLoaded', () => {

    const modal = document.querySelectorAll('modal');
    const modal_close = document.querySelectorAll('modal_close');
    const openModal = document.querySelectorAll('btn_agregar');

    if(modal && modal_close && openModal.length > 0){
        // codigo js
        openModal.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();

                const dataForm = button.getAttribute('data-id');

                if (dataForm) {
                    const modalContent = document.querySelector(`#${dataForm}`);

                    if (modalContent) {
                        document.querySelectorAll('modal_form').forEach(form => {
                            form.classList.add('content--show');
                        });
                        // mostar el contenido de la modal
                        modalContent.classList.add('content--show');
                        modal.style.opacity = '1';
                        modal.style.pointerEvents = 'unset';
                        modal.style.transition = 'opacity .3s .5s';
                    } else {
                        console.error(`No se encontro contenido para el formulario: ${dataForm}`)
                    }
                }
            });
        });
    }

});