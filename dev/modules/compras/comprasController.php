<?php

include('../../config/modelo.php'); 
header('Content-Type: application/json');

if (isset($_REQUEST['accion'])) { 
    $accion = $_REQUEST['accion'];

    switch ($accion) {
        case 'agregarCompra':
            $fecha = $_POST['fechaAgregarCompra'];
            $contador = $_POST['contador'];
            $articulos = $_POST['articulos'];

            echo json_encode($articulos);
    }

?>