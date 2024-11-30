<?php
session_start();
include('../../config/modelo.php'); 
header('Content-Type: application/json');

if (isset($_REQUEST['accion'])) { 
    $accion = $_REQUEST['accion'];

    switch ($accion) {
        case 'agregarCompra':
            $fecha = $_POST['fechaAgregarCompra'];
            //Comprobamos que haya articulos
            if(isset($_POST['articulos'])){
                $articulos = $_POST['articulos'];

                $totalCompra= 0;

                //Calculamos el total de la compra
                foreach($articulos as $articulo){
                    $nombre = $articulo['nombre'];
                    $cantidad = $articulo['cantidad'];
                    $precio = $articulo['precio'];
    
                    $totalArticulo = $cantidad * $precio;
    
                    $totalCompra += $totalArticulo;
                }

                //Agregamos una compra
                $sesion1= agregarCompra($fecha,$totalCompra);
                if($sesion1){
                    $sesion2=true;
                    //Agregamos los articulos a detalleCompra
                    foreach($articulos as $articulo){
                        $nombre = $articulo['nombre'];
                        $cantidad = $articulo['cantidad'];
                        $precio = $articulo['precio'];
        
                        $totalArticulo = $cantidad * $precio;
    
                        $detalle = agregarDetalleCompra($sesion1,$nombre,$cantidad,$precio,$totalArticulo);

                        //Comprobamos que no haya un error al agregar los detalles
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
            if(!isset($_SESSION['id']) || $_SESSION['id']!=2){
                echo json_encode(['status' => 'noPermisos']);

            }else{
                $id = $_POST['id'];
    
                //Ejecutamos la function de eliminar compras
                $sesion= eliminarCompra($id);
                
                echo json_encode($sesion);
            }
            break;

        case 'obtenerCompra':
            $id = $_POST['id'];

            //Ejecutamos function que nos devuelve la fecha de la compra y
            //los detallesCompra relacionados al id de esa compra
            $sesion= obtenerCompra($id);

            echo json_encode($sesion);

            break;
        
        case 'editarCompra':
            $fecha = $_POST['fechaEditarCompra'];
            //Ids que se van a eliminar
            $idsEliminar = $_POST['idsParaEliminar'];
            //Id de la compra
            $idCompra = $_POST['idCompra'];
            //Comprobamos que haya minimo un articulo
            if(isset($_POST['articulos'])){
                $articulos = $_POST['articulos'];

                //Creamos 2 arrays, los articulos a actualizar y los que son a agregar
                $actualizarArticulos = [];
                $nuevosArticulos = [];
                $totalCompra = 0;

                //Creamos un array asociativo para actualizar la compra
                $actualizarCompra = [
                    'idCompra' => $idCompra,
                    'fecha' => $fecha,
                    'totalCompra' => 0 
                ];
    
                foreach($articulos as $articulo){
                    $nombre = $articulo['nombre'];
                    $cantidad = $articulo['cantidad'];
                    $precio = $articulo['precio'];

                    //Calculamos total de cada detalleCompra
                    $totalArticulo = $cantidad * $precio;
                    //Calculamos el total de toda la compra
                    $totalCompra += $totalArticulo;
                    //Almacenamos el total de la compra en nuestro array asociativo de actualizar compra
                    $actualizarCompra['totalCompra'] = $totalCompra;

                    //Si el articulo trae el campo id, es porque es para actualizar
                    //Si no lo trae es para agregar, aqui comprobamos si tiene o no
                    //para saber a que array agregarlo
                    if (isset($articulo['id']) && !empty($articulo['id'])) {
                        //Si tiene id, el articulo ya existe en la base de datos
                        //se agrega al array de actualizar
                        $actualizarArticulos[] = [
                            'id' => $articulo['id'],
                            'nombre' => $nombre,
                            'cantidad' => $cantidad,
                            'precio' => $precio,
                            'total' => $totalArticulo
                        ];
                    } else {
                        // Si no tiene, es nuevo, no existe en la base de datos
                        //Se agrega al array de agregar detalleCompra
                        $nuevosArticulos[] = [
                            'idCompra'=> $idCompra,
                            'nombre' => $nombre,
                            'cantidad' => $cantidad,
                            'precio' => $precio,
                            'total' => $totalArticulo
                        ];
                    }
                }
                //Ejecutamos la function de editar compra con todos los arreglos
                $sesion = editarCompra($actualizarCompra,$actualizarArticulos,$nuevosArticulos,$idsEliminar);

                //El $sesion retorna un arreglo con 4 datos, uno por cada arreglo que le enviamos
                if (in_array(false, $sesion)) {
                    // Si algún resultado es false, retornar un error
                    echo json_encode(['status' => 'error']);
                } else {
                    // Si todos son true, retornar éxito
                    echo json_encode(['status' => 'success']);
                }



            }else{
                //Si no se ingreso ningun articulo, retorna una alerta
                //"Debes ingresar minimo un articulo"
                echo json_encode(['status' => '0articulo']);
            }

            break;
    }
}

?>