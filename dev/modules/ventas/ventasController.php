<?php

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
            $fecha = $_POST['fechaAgregarVenta'];
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
        
                //Agregamos una venta
                $sesion1 = agregarVenta($fecha, $totalVenta);
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
            $id = $_POST['id'];

            //Ejecutamos la funcion de eliminar Venta
            $sesion= eliminarVenta($id);
            
            echo json_encode($sesion);
    
            break;
        case 'obtenerVenta':
            $id=$_POST['id'];

            //Ejecutamos funcion que retorna la fecha de la venta y los detallesventa relacionados
            $sesion = obtenerVenta($id);

            echo json_encode($sesion);
            break;
    }
        
    }
?>