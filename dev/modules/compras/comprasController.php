<?php

include('../../config/modelo.php'); 
header('Content-Type: application/json');

if (isset($_REQUEST['accion'])) { 
    $accion = $_REQUEST['accion'];

    switch ($accion) {
        case 'agregarCompra':
            $fecha = $_POST['fechaAgregarCompra'];
            $articulos = $_POST['articulos'];

            $totalCompra= 0;

            foreach($articulos as $articulo){
                $nombre = $articulo['nombre'];
                $cantidad = $articulo['cantidad'];
                $precio = $articulo['precio'];

                $totalArticulo = $cantidad * $precio;

                $totalCompra += $totalArticulo;
            }

            $sesion1= agregarCompra($fecha,$totalCompra);
            if($sesion1){
                $sesion2=true;
                foreach($articulos as $articulo){
                    $nombre = $articulo['nombre'];
                    $cantidad = $articulo['cantidad'];
                    $precio = $articulo['precio'];
    
                    $totalArticulo = $cantidad * $precio;

                    $detalle = agregarDetalleCompra($sesion1,$nombre,$cantidad,$precio,$totalArticulo);

                    if(!$detalle){
                        $sesion2= false;
                        break;
                    }
                }
                if($sesion2){
                    echo json_encode(['status' => 'true']);
                }
                
            }else{
                echo json_encode(['status' => 'false']);
            }

        break;
        case 'eliminarCompra':
            $id = $_POST['id'];
    
            $sesion= eliminarCompra($id);
            
            echo json_encode($sesion);
    
            break;
    }
}

?>