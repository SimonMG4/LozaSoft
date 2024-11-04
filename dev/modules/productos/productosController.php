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
        $img = $_POST['imgAgregarProducto'];

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