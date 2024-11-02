<?php
include ('../../dev/config/modelo.php');

if (isset($_REQUEST['accion'])) { 
    $accion = $_REQUEST['accion'];

    switch ($accion){
        case 'cerrarSesion':
          $sesion = cerrarSesion();
        break;
        
    }
    }
?>