document.addEventListener('DOMContentLoaded', () => {
    // Seleccionar elementos de la modal y los botones de abrir/cerrar
    const modal = document.querySelector('.modal');
    const modalCloseButtons = document.querySelectorAll('.cerrarModal');
    const openModalButtons = document.querySelectorAll('.btn_agregar');

    if (modal && modalCloseButtons && openModalButtons.length > 0) {
        // Agregar evento de apertura de modal a cada botón
        openModalButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                
                const dataForm = button.getAttribute('data-id'); // Obtener ID del formulario a mostrar
                
                if (dataForm) {
                    const modalContent = document.querySelector(`#${dataForm}`);

                    if (modalContent) {
                        // Ocultar otros formularios abiertos y mostrar el correcto
                        document.querySelectorAll('.modal_form').forEach(form => {
                            form.classList.remove('content--show');
                        });

                        // Mostrar el formulario dinámico y la modal
                        modalContent.classList.add('content--show');
                        modal.classList.add('modal--show');
                    } else {
                        console.error(`No se encontró contenido para el formulario: ${dataForm}`);
                    }
                }
            });
        });

        // Cerrar la modal al hacer clic en cualquier botón de cerrar
        modalCloseButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                modal.classList.remove('modal--show');
                // Ocultar todos los formularios dentro de la modal
                document.querySelectorAll('.modal_form').forEach(form => {
                    form.classList.remove('content--show');
                });
            });
        });
    } else {
        console.error('Uno o más elementos no se encuentran en el DOM o no hay botones para abrir el modal.');
    }

    // Manejo de envíos de formularios dentro de la modal
    const forms = document.querySelectorAll('.formAgregarProducto');

    forms.forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(form);
            const action = form.getAttribute('action');
            const method = form.getAttribute('method') || 'POST';

            try {
                const response = await fetch(action, {
                    method: method.toUpperCase(),
                    body: formData,
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                    }
                });

                if (!response.ok) {
                    const errorData = await response.json();

                    if (response.status === 400) {
                        Toast.fire({
                            icon: 'error',
                            title: 'Hubo un problema con la solicitud, intenta de nuevo'
                        });
                    } else {
                        Toast.fire({
                            icon: 'error',
                            title: errorData.detail || 'Hubo un problema al enviar los datos.'
                        });
                    }
                } else {
                    Swal.fire({
                        title: 'Éxito',
                        text: 'Datos enviados correctamente',
                        icon: 'success',
                        confirmButtonText: 'Entendido',
                        confirmButtonColor: '#13A438',
                    }).then(() => {
                        window.location.reload();
                    });
                }
            } catch (error) {
                console.error('Error en el envío del formulario:', error);
                Toast.fire({
                    icon: 'error',
                    title: 'Hubo un problema al procesar la solicitud.'
                });
            }
        });
    });
});
