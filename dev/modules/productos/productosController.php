<?php

include('../../config/modelo.php'); 
header('Content-Type: application/json');

if (isset($_REQUEST['accion'])) { 
    $accion = $_REQUEST['accion'];

    switch($accion){

    case 'agregarProducto':
        $nombre = $_POST['nombreAgregarProducto'];
        $descripcion = $_POST['descripcionAgregarProducto'];
        $precio = $_POST['precioAgregarProducto'];
        $stock = $_POST['stockAgregarProducto'];

        if (isset($_FILES['imgAgregarProducto']) && $_FILES['imgAgregarProducto']['error'] == UPLOAD_ERR_OK) {
            $img = $_FILES['imgAgregarProducto']['name']; // Nombre del archivo
            // Aquí deberías mover el archivo a una carpeta adecuada y actualizar $img con la ruta
            $ruta_destino = '../../uploads/' . basename($img);
            move_uploaded_file($_FILES['imgAgregarProducto']['tmp_name'], $ruta_destino);
        } else {
            // Manejar el error o asignar un valor por defecto
            $img = null; // O alguna lógica para manejar la ausencia del archivo
        }
        
    

        $sesion= agregarProducto($nombre, $descripcion, $precio, $stock,$img);

        echo json_encode($sesion);
        break;
        
    case 'eliminarProducto':
        $id = $_POST['id'];

        $sesion= eliminarProducto($id);
        
        echo json_encode($sesion);

        break;
        
    }
    }
?>