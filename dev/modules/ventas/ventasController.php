<?php

include('../../config/modelo.php'); 
header('Content-Type: application/json');

if (isset($_REQUEST['accion'])) { 
    $accion = $_REQUEST['accion'];

    switch($accion){
        case 'tablaProductos':
            $sesion = tablaProductos();

            echo json_encode($sesion);
        break;

        case 'agregarVenta':
            $fecha = $_POST['fechaAgregarVenta'];
            if (isset($_POST['productos'])) {
                $productos = $_POST['productos'];
        
                $totalVenta = 0;
        
                foreach ($productos as $producto) {
                    // Validar si el producto tiene un ID válido
                    if (!isset($producto['id']) || empty($producto['id'])) {
                        echo json_encode(['status' => 'productoInvalido']);
                        return; // Detiene completamente el flujo del case
                    }
        
                    // Si el producto es válido, calcular total
                    $id = $producto['id'];
                    $cantidad = $producto['cantidad'];
        
                    $precio = obtenerPrecio($id);
                    $stockProducto = obtenerStock($id);
                    if($stockProducto-$cantidad < 0){
                        echo json_encode(['status'=>'noStock']);
                        return;
                    }
                    if ($precio !== false) {
                        $total = $precio * $cantidad;
                        $totalVenta += $total;
                    }
                }
        
                // Insertar venta principal
                $sesion1 = agregarVenta($fecha, $totalVenta);
                if ($sesion1) {
                    $sesion2 = true;
        
                    // Insertar detalles de la venta
                    foreach ($productos as $producto) {
                        $id = $producto['id'];
                        $cantidad = $producto['cantidad'];
                        $precio = obtenerPrecio($id);
        
                        $total = $cantidad * $precio;
        
                        $detalle = agregarDetalleVenta($sesion1, $id, $cantidad, $total);
        
                        if (!$detalle) {
                            $sesion2 = false;
                            break;
                        }
                    }
        
                    if ($sesion2) {
                        echo json_encode(['status' => 'true']);
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
    
            $sesion= eliminarVenta($id);
            
            echo json_encode($sesion);
    
            break;
    }
        
    }
?>