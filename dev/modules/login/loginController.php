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
        break;

    case 'recuperarCredenciales':
        $respuesta = $_POST['respuesta'];
        if($respuesta=='1966'){
            $sesion = recuperarCredenciales();

            echo json_encode($sesion);

        }else{
            echo json_encode(['status' => 'false']);
        }

        break;
    case 'actualizarContraseña':
        $contraseña=$_POST['contraseña'];

        $sesion= actualizarContraseña($contraseña);

        echo json_encode($sesion);
        break;
        
    }
    }
?>