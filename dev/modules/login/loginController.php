<?php

include('../../config/modelo.php'); 
header('Content-Type: application/json');

if (isset($_REQUEST['accion'])) { 
    $accion = $_REQUEST['accion'];

    switch($accion){

    case 'iniciarSesion':
        $usuario = $_POST['usuario'];
        $contraseña = $_POST['contraseña'];
        $sesion = iniciarSesion($usuario, $contraseña);

        echo json_encode($sesion);
        
    }
    }
?>