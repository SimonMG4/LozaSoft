<?php
session_start();
include('../../config/modelo.php'); 
header('Content-Type: application/json');

if (isset($_REQUEST['accion'])) { 
    $accion = $_REQUEST['accion'];

    switch($accion){
        case 'tablaProductos':
            //Ejecutamos la funcion que nos devuelve todos los productos activos
            $sesion = tablaProductos();

            echo json_encode($sesion);
        break;

        case 'agregarVenta':

            //Valor del iva aplicado a la empresa, este valor se cambia segun cuanto iva sea
            $iva = 0.19;
            $fecha = $_POST['fechaAgregarVenta'];
            $descuento= $_POST['descuentoAgregarVenta'];
            //Validamos que hayan productos, para una venta minimo debe haber 1 producto
            if (isset($_POST['productos'])) {
                $productos = $_POST['productos'];
        
                $totalVenta = 0;

        
                foreach ($productos as $producto) {
                    // Validar si el producto tiene un ID válido es decir que exista
                    if (!isset($producto['id']) || empty($producto['id'])) {
                        echo json_encode(['status' => 'productoInvalido']);
                        return; // Detiene completamente el flujo
                    }
        
                    // Si el producto es válido, calcular total
                    $id = $producto['id'];
                    $cantidad = $producto['cantidad'];

                    //Ejecutamos funcion para traer el precio de cada producto
                    $precio = obtenerPrecio($id);
                    //Ejecutamos funcion para obtener el stock de cada producto
                    $stockProducto = obtenerStock($id);
                    //Validamos que haya suficiente stock de los productos para la cantidad seleccionada
                    if($stockProducto-$cantidad < 0){
                        echo json_encode(['status'=>'noStock']);
                        return;
                    }
                    //Calculamos el total de cada producto y de la venta
                    if ($precio !== false) {
                        $total = $precio * $cantidad;
                        $totalVenta += $total;
                    }
                }
                $totalVenta= $totalVenta-$descuento;
                $totalNeto = ($totalVenta)-($totalVenta * $iva);
        
                //Agregamos una venta
                $sesion1 = agregarVenta($fecha, $totalNeto,$totalVenta,$descuento);
                if ($sesion1) {
                    $sesion2 = true;
        
                    //Agregamos los productos a detalleVenta
                    foreach ($productos as $producto) {
                        $id = $producto['id'];
                        $cantidad = $producto['cantidad'];
                        $precio = obtenerPrecio($id);
        
                        $total = $cantidad * $precio;
                        $stock= obtenerStock($id);
                        $stockRestado= $stock - $cantidad;
        
                        $detalle = agregarDetalleVenta($sesion1, $id, $cantidad, $total);
                        $detalle2 = restarStock($stockRestado,$id);

                        //Comprobamos que no haya error al agregar a detalleVenta o restar el Stock
                        if (!$detalle || !$detalle2) {
                            $sesion2 = false;
                            break;
                        }
                    }
        
                    if ($sesion2) {
                        echo json_encode(['status' => 'true']);
                    }else{
                        echo json_encode(['status'=>'false']);
                    }
                } else {
                    echo json_encode(['status' => 'false']);
                }
            } else {
                echo json_encode(['status' => '0articulo']);
            }
            break;
        
        case 'eliminarVenta':
            if(!isset($_SESSION['id']) || $_SESSION['id']!=1){
                echo json_encode(['status' => 'noPermisos']);

            }else{
                $id = $_POST['id'];
    
                //Ejecutamos la funcion de eliminar Venta
                $sesion= eliminarVenta($id);
                
                echo json_encode($sesion);
            }
    
            break;
        case 'obtenerVenta':
            $id=$_POST['id'];

            //Ejecutamos funcion que retorna la fecha de la venta y los detallesventa relacionados
            $sesion = obtenerVenta($id);

            echo json_encode($sesion);
            break;
        case 'editarVenta':
            $fecha = $_POST['fechaEditarVenta'];
            //Ids que se van a eliminar
            $idsEliminar = $_POST['idsParaEliminar'];
            //Id de la Venta
            $idVenta = $_POST['idVenta'];
            //Comprobamos que haya minimo un producto

            $descuento = $_POST['descuentoEditarVenta'];

            $iva= 0.19;
            if(isset($_POST['productos'])){
                $productos = $_POST['productos'];

                //Creamos 2 arrays, los productos a actualizar y los que son a agregar
                $actualizarProductos = [];
                $nuevosProductos = [];
                $totalVenta = 0;
                $totalNeto = 0;

                //Creamos un array asociativo para actualizar la compra
                $actualizarVenta = [
                    'idVenta' => $idVenta,
                    'fecha' => $fecha,
                    'totalNeto' => 0 ,
                    'totalVenta'=> 0,
                    'descuento'=> $descuento
                ];
    
                foreach($productos as $producto){
                    
                    if (!isset($producto['id']) || empty($producto['id'])) {
                        echo json_encode(['status' => 'productoInvalido']);
                        return; // Detiene completamente el flujo
                    }
                    
                    $idProducto = $producto['id'];
                    $cantidad = $producto['cantidad'];
                    $precio = obtenerPrecio($idProducto);

                    $stockProducto = obtenerStock($idProducto);
                    //Validamos que haya suficiente stock de los productos para la cantidad seleccionada
                    if($stockProducto-$cantidad < 0){
                        echo json_encode(['status'=>'noStock']);
                        return;
                    }
                    $stockRestado= $stockProducto - $cantidad;

                    $detalle2 = restarStock($stockRestado,$idProducto);

                    //Calculamos total de cada detalleCompra
                    $totalProducto = $cantidad * $precio;
                    //Calculamos el total de toda la compra
                    $totalVenta += $totalProducto;
                    //Almacenamos el total de la compra en nuestro array asociativo de actualizar compra


                    //Si el producto trae el campo id, es porque es para actualizar
                    //Si no lo trae es para agregar, aqui comprobamos si tiene o no
                    //para saber a que array agregarlo
                    if (isset($producto['detalleventa-id']) && !empty($producto['detalleventa-id'])) {
                        //Si tiene id, el producto ya existe en la base de datos
                        //se agrega al array de actualizar
                        $actualizarProductos[] = [
                            'idDetalleVenta' => $producto['detalleventa-id'],
                            'idProducto'=>$idProducto,
                            'cantidad' => $cantidad,
                            'total' => $totalProducto
                        ];
                    } else {
                        // Si no tiene, es nuevo, no existe en la base de datos
                        //Se agrega al array de agregar detalleCompra
                        $nuevosProductos[] = [
                            'idVenta' => $idVenta,
                            'idProducto'=>$idProducto,
                            'cantidad' => $cantidad,
                            'total' => $totalProducto
                        ];
                    }
                }
                $totalVenta=$totalVenta-$descuento;
                $actualizarVenta['totalVenta'] = $totalVenta;
                $totalNeto = ($totalVenta)-($totalVenta * $iva);
                $actualizarVenta['totalNeto'] = $totalNeto;
                //Ejecutamos la function de editar compra con todos los arreglos
                $sesion = editarVenta($actualizarVenta,$actualizarProductos,$nuevosProductos,$idsEliminar);

                //El $sesion retorna un arreglo con 4 datos, uno por cada arreglo que le enviamos
                if (in_array(false, $sesion)) {
                    // Si algún resultado es false, retornar un error
                    echo json_encode(['status' => 'error']);
                } else {
                    // Si todos son true, retornar éxito
                    echo json_encode(['status' => 'success']);
                }



            }else{
                //Si no se ingreso ningun producto, retorna una alerta
                //"Debes ingresar minimo un producto"
                echo json_encode(['status' => '0articulo']);
            }
            break;
    }
        
    }
?>