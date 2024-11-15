<?php

include('../../config/modelo.php'); 
header('Content-Type: application/json');

if (isset($_REQUEST['accion'])) { 
    $accion = $_REQUEST['accion'];

    switch ($accion) {
        case 'agregarCompra':
            $fecha = $_POST['fechaAgregarCompra'];
            if(isset($_POST['articulos'])){
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
            }else{
                echo json_encode(['status' => '0articulo']);
            }
            



        break;
        case 'eliminarCompra':
            $id = $_POST['id'];
    
            $sesion= eliminarCompra($id);
            
            echo json_encode($sesion);
    
            break;

        case 'obtenerCompra':
            $id = $_POST['id'];

            $sesion= obtenerCompra($id);

            echo json_encode($sesion);

            break;
        
        case 'editarCompra':
            $fecha = $_POST['fechaEditarCompra'];
            $idsEliminar = $_POST['idsParaEliminar'];
            $idCompra = $_POST['idCompra'];
            if(isset($_POST['articulos'])){
                $articulos = $_POST['articulos'];

                $actualizarArticulos = [];
                $nuevosArticulos = [];
                $totalCompra = 0;

                $actualizarCompra = [
                    'idCompra' => $idCompra,
                    'fecha' => $fecha,
                    'totalCompra' => 0 
                ];
    
                foreach($articulos as $articulo){
                    $nombre = $articulo['nombre'];
                    $cantidad = $articulo['cantidad'];
                    $precio = $articulo['precio'];
    
                    $totalArticulo = $cantidad * $precio;
    
                    $totalCompra += $totalArticulo;
                    $actualizarCompra['totalCompra'] = $totalCompra;


                    if (isset($articulo['id']) && !empty($articulo['id'])) {
                        // Artículo existente, agregar al array de actualización
                        $actualizarArticulos[] = [
                            'id' => $articulo['id'],
                            'nombre' => $nombre,
                            'cantidad' => $cantidad,
                            'precio' => $precio,
                            'total' => $totalArticulo
                        ];
                    } else {
                        // Artículo nuevo, agregar al array nuevo
                        $nuevosArticulos[] = [
                            'idCompra'=> $idCompra,
                            'nombre' => $nombre,
                            'cantidad' => $cantidad,
                            'precio' => $precio,
                            'total' => $totalArticulo
                        ];
                    }
                }

                $sesion = editarCompra($actualizarCompra,$actualizarArticulos,$nuevosArticulos,$idsEliminar);

                if (in_array(false, $sesion)) {
                    // Si algún resultado es false, retornar un error
                    echo json_encode(['status' => 'error']);
                } else {
                    // Si todos son true, retornar éxito
                    echo json_encode(['status' => 'success']);
                }



            }else{
                echo json_encode(['status' => '0articulo']);
            }

            break;
    }
}

?>