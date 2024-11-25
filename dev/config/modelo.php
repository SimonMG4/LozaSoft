<?php
$conexion;


function abrirConexion(){
    global $conexion;
    
    $db_host = "localhost";
    $db_name = "lozasoft";
    $db_user = "root";
    $db_pass = "";

    try {
        $conexion = new mysqli($db_host, $db_user, $db_pass, $db_name);
    } catch (\Throwable $th) {
        echo "Error en la conexion: ". $th->getMessage();
        exit();
    }
}
function cerrarConexion(){
    global $conexion;
    $conexion->close();
}

// Insertar Credenciales en la base de datos
function insertarCredenciales(){
    $usuario = 'admin';
    $contraseña = 'arteyloza';
    $contraseña_encriptada = password_hash($contraseña, PASSWORD_BCRYPT);

    abrirConexion();

         global $conexion;
     $query = $conexion->prepare("INSERT INTO admin (usuario, contraseña) VALUES (?, ?)");
     $query->bind_param("ss", $usuario, $contraseña_encriptada);

     if ($query->execute()) {
    echo "Credenciales guardadas correctamente.";
     } else {
    echo "Error al guardar las credenciales: " . $query->error;
     }

     cerrarConexion();
}
function iniciarSesion($usuario, $contraseña) {
    abrirConexion();
    global $conexion;

    $query = $conexion->prepare("SELECT id, usuario, contraseña FROM admin WHERE usuario = ?");
    $query->bind_param("s", $usuario);
    $query->execute();
    $resultado = $query->get_result();

    $response = array();

    if ($resultado->num_rows > 0) {
        $user = $resultado->fetch_assoc();
        if (password_verify($contraseña, $user['contraseña'])) {
            session_start();
            $_SESSION['id'] = $user['id'];
            $_SESSION['usuario'] = $user['usuario'];
            $response['status']= "success";
            cerrarConexion();
        } else {
            $response['status']="error1";
            cerrarConexion();
        }
    } else {
        $response['status']="error2";
        cerrarConexion();
    }
    return $response;

}
function cerrarSesion(){
    
   session_start();
   session_unset();
   session_destroy();
   header("Location: ../../index.html");

}

//PRODUCTOS
function tablaProductos(){
    abrirConexion();
    global $conexion;

    $query = $conexion->prepare("SELECT * FROM productos WHERE activo = 1");
    $query->execute();
    $resultado=$query->get_result();

    if($resultado){
        $filas = []; 
        while ($fila = $resultado->fetch_object()) 
        { $filas[] = $fila;
        }
        return $filas;
    }else {
        return false;
    }
    cerrarConexion();
}
function obtenerProducto($id){
    abrirConexion();
    global $conexion;

    $query = $conexion->prepare("SELECT * FROM productos WHERE id = $id");
    $query ->execute();
    $resultado=$query->get_result();

    if($resultado){
        $producto = $resultado->fetch_assoc();
        return $producto;
    }else{
        return null;
    }
    cerrarConexion();
}
function agregarProducto($nombre,$descripcion,$precio,$stock,$img){
    abrirConexion();
    global $conexion;

    $query = $conexion->prepare("INSERT INTO productos (nombre, descripcion, precio, stock, imagen) VALUES ('$nombre', '$descripcion', $precio, $stock, '$img')");
    $query->execute();

    if ($query) {
        $response['status']= 'true';
        } else {
        $response['status']= 'false';
        }
    return $response;
    cerrarConexion();
}
function editarProducto1($id,$nombre,$descripcion,$precio,$stock,$img){
    abrirConexion();
    global $conexion;

    $query = $conexion->prepare("UPDATE productos SET nombre = '$nombre', descripcion = '$descripcion',
     precio = $precio, stock = $stock, imagen = '$img' WHERE id = $id");
     $query->execute();

     if ($query->execute()) {
        $response['status']= 'success';
         } else {
            $response['status']= 'error';
         }
    return $response;
    cerrarConexion();
}
function editarProducto2($id,$nombre,$descripcion,$precio,$stock){
    abrirConexion();
    global $conexion;

    $query = $conexion->prepare("UPDATE productos SET nombre = '$nombre', descripcion = '$descripcion',
     precio = $precio, stock = $stock  WHERE id = $id");
     $query->execute();

     if ($query->execute()) {
        $response['status']= 'success';
         } else {
            $response['status']= 'error';
         }
    return $response;
    cerrarConexion();
}
function eliminarProducto($id){
    abrirConexion();
    global $conexion;

    $query = $conexion->prepare("UPDATE productos SET activo=0 WHERE id= $id");
    $query->execute();

    if ($query) {
        $response['status']= 'true';
         } else {
        $response['status']= 'false';
         }
    return $response;
    cerrarConexion();
}
function obtenerImagen($id){
    abrirConexion();
    global $conexion;

    $query = $conexion->prepare("SELECT imagen FROM productos WHERE id = $id");
    $query->execute();
    $resultado=$query->get_result();
    if($resultado){
        if($row = $resultado->fetch_assoc()){
            $rutaImagen = $row['imagen'];
            return $rutaImagen;
        }
    }else{
        return null;
    }
    cerrarConexion();
}

//COMPRAS

function tablaCompras(){
    abrirConexion();
    global $conexion;

    $query = $conexion->prepare("SELECT * FROM compras");
    $query->execute();
    $resultado=$query->get_result();

    if($resultado){
        $filas = []; 
        while ($fila = $resultado->fetch_object()) 
        { $filas[] = $fila;
        }
        return $filas;
    }else {
        return false;
    }
    cerrarConexion();

}
function agregarCompra($fecha,$totalCompra){
    abrirConexion();
    global $conexion;

    $query = $conexion->prepare("INSERT INTO compras(fecha,total_perdida) VALUES ('$fecha','$totalCompra')");
    $query->execute();

    if($query){
        $idCompra = $conexion->insert_id;
        cerrarConexion();
        return $idCompra;
    }else{
        cerrarConexion();
        return false;
    }


}
function agregarDetalleCompra($id,$nombre,$cantidad,$precio,$total){
    abrirConexion();
    global $conexion;

    $query = $conexion->prepare("INSERT INTO detallecompra(id_compra,nombre_articulo,cantidad,precio_unitario,total) VALUES ('$id','$nombre','$cantidad','$precio','$total')");
    $query->execute();

    if($query){
        return true;
        
    }else{
        return false;
    }
    
    cerrarConexion();
}
function eliminarCompra($id){
    abrirConexion();
    global $conexion;

    $query = $conexion->prepare("DELETE FROM compras WHERE id= $id");
    $query->execute();

    if ($query) {
        $response['status']= 'true';
         } else {
        $response['status']= 'false';
         }
    return $response;
    cerrarConexion();

}
function obtenerCompra($id){
    abrirConexion();
    global $conexion;

    //Primer query, trae la fecha de compras

    $query1= $conexion->prepare("SELECT fecha FROM compras WHERE id = $id");
    $query1 ->execute();
    $resultado1=$query1->get_result();


    if ($resultado1->num_rows > 0) {
        $compra = $resultado1->fetch_assoc();
        $respuesta['fecha'] = $compra['fecha'];
    }

    //Segundo query, trae los detalles de los productos

    $query2= $conexion->prepare("SELECT * FROM detallecompra WHERE id_compra = $id");
    $query2->execute();
    $resultado2=$query2->get_result();

    $detalles = [];
    while ($detalle = $resultado2->fetch_assoc()) {
        $detalles[] = $detalle;
    }

    $respuesta['detalles'] = $detalles;

    $query1->close();
    $query2->close();
    cerrarConexion();

    return $respuesta;

}
function EditarCompra($actualizarCompra, $actualizarArticulos, $nuevosArticulos, $idsParaEliminar) {
    abrirConexion();
    global $conexion;

    $resultados = [
        'actualizarCompra' => true,
        'actualizarArticulos' => true,
        'nuevosArticulos' => true,
        'idEliminar' => true
    ];

    // 1. Actualizar la compra
    if (isset($actualizarCompra['idCompra']) && isset($actualizarCompra['fecha']) && isset($actualizarCompra['totalCompra'])) {
        $idCompra = $actualizarCompra['idCompra'];
        $fecha = $actualizarCompra['fecha'];
        $totalCompra = $actualizarCompra['totalCompra'];

        // Concatenando directamente los valores en la consulta
        $query1 = "UPDATE compras SET fecha = '$fecha', total_perdida = $totalCompra WHERE id = $idCompra";
        $resultado1 = $conexion->query($query1);

        if (!$resultado1) {
            $resultados['actualizarCompra'] = false;
        }
    }

    // 2. Actualizar los artículos existentes
    if (!empty($actualizarArticulos)) {
        $todosActualizados = true;
        foreach ($actualizarArticulos as $articulo) {
            $idArticulo = $articulo['id'];
            $nombre = $articulo['nombre'];
            $cantidad = $articulo['cantidad'];
            $precio = $articulo['precio'];
            $total = $articulo['total'];

            // Concatenando directamente los valores en la consulta
            $query2 = "UPDATE detallecompra SET nombre_articulo = '$nombre', cantidad = $cantidad, precio_unitario = $precio, total = $total WHERE id_detalle_compra = $idArticulo";
            $resultado2 = $conexion->query($query2);

            if (!$resultado2) {
                $todosActualizados = false;
                break;
            }
        }

        $resultados['actualizarArticulos'] = $todosActualizados ? true : false;
    }

    // 3. Insertar nuevos artículos
    if (!empty($nuevosArticulos)) {
        $todosInsertados = true;
        foreach ($nuevosArticulos as $articulo) {
            $idCompra = $articulo['idCompra'];
            $nombre = $articulo['nombre'];
            $cantidad = $articulo['cantidad'];
            $precio = $articulo['precio'];
            $total = $articulo['total'];

            // Concatenando directamente los valores en la consulta
            $query3 = "INSERT INTO detallecompra (id_compra, nombre_articulo, cantidad, precio_unitario, total) VALUES ($idCompra, '$nombre', $cantidad, $precio, $total)";
            $resultado3 = $conexion->query($query3);

            if (!$resultado3) {
                $todosInsertados = false;
                break;
            }
        }

        $resultados['nuevosArticulos'] = $todosInsertados ? true : false;
    }

    
    // 4. Eliminar artículos
    if (!empty($idsParaEliminar)) {
    // Verificar si idsParaEliminar es una cadena JSON y decodificarla en caso de que lo sea
    if (is_string($idsParaEliminar)) {
        $idsParaEliminar = json_decode($idsParaEliminar, true);  // Decodificar si es un string JSON
    }

    if (is_array($idsParaEliminar)) {
        $todosEliminados = true; 
        foreach ($idsParaEliminar as $id) {


        
            $query4 = "DELETE FROM detallecompra WHERE id_detalle_compra = $id";
            $resultado4 = $conexion->query($query4);

            if (!$resultado4) {
                $todosEliminados = false;
                break;
            }
        }

        $resultados['idEliminar'] = $todosEliminados ? true : false;
    } else {
        // Si no es un array o string JSON válido, marcar como false
        $resultados['idEliminar'] = false;
    }
 }


    cerrarConexion();

    return $resultados;
}

//VENTAS
function tablaVentas(){
    abrirConexion();
    global $conexion;

    $query = $conexion->prepare("SELECT * FROM ventas");
    $query->execute();
    $resultado=$query->get_result();

    if($resultado){
        $filas = []; 
        while ($fila = $resultado->fetch_object()) 
        { $filas[] = $fila;
        }
        return $filas;
    }else {
        return false;
    }
    cerrarConexion();
}
function obtenerPrecio($id){
    abrirConexion();
    global $conexion;

    $query= $conexion->prepare("SELECT precio FROM productos WHERE id=$id");
    $query->execute();

    $result = $query->get_result();

    if ($result->num_rows > 0) {
        
        $row = $result->fetch_assoc();
        $precio = $row['precio'];
    
        
    } else {
        $precio = false;
    }
    
    
    cerrarConexion();
    return $precio;
}
function agregarVenta($fecha,$totalVenta){
    abrirConexion();
    global $conexion;

    $query = $conexion->prepare("INSERT INTO ventas(fecha,total_ganancia) VALUES ('$fecha','$totalVenta')");
    $query->execute();

    if($query){
        $idCompra = $conexion->insert_id;
        cerrarConexion();
        return $idCompra;
    }else{
        cerrarConexion();
        return false;
    }

}
function agregarDetalleVenta($idCompra,$id,$cantidad,$total){
    abrirConexion();
    global $conexion;

    $query = $conexion->prepare("INSERT INTO detalleventa(id_venta,id_producto,cantidad,total) VALUES ('$idCompra','$id','$cantidad','$total')");
    $query->execute();

    if($query){
        return true;
        
    }else{
        return false;
    }
    
    cerrarConexion();

}
function eliminarVenta($id){
    abrirConexion();
    global $conexion;

    $query = $conexion->prepare("DELETE FROM ventas WHERE id= $id");
    $query->execute();

    if ($query) {
        $response['status']= 'true';
         } else {
        $response['status']= 'false';
         }
    return $response;
    cerrarConexion();

}
function obtenerStock($id){
    abrirConexion();
    global $conexion;

    $query= $conexion->prepare("SELECT stock FROM productos WHERE id=$id");
    $query->execute();

    $result = $query->get_result();

    if ($result->num_rows > 0) {
        
        $row = $result->fetch_assoc();
        $stock = $row['stock'];
    
        
    } else {
        $stock = false;
    }
    
    
    cerrarConexion();
    return $stock;

}
function restarStock($stockRestado,$id){
    abrirConexion();
    global $conexion;

    $query=("UPDATE productos SET stock='$stockRestado' WHERE id='$id'");
    $resultado=$conexion->query($query);

    if($resultado){
        return true;
    }else{
        return false;
    }
    cerrarConexion();

}
function obtenerVenta($id){
    abrirConexion();
    global $conexion;

    //Primer query, trae la fecha de compras

    $query1= $conexion->prepare("SELECT fecha FROM ventas WHERE id = $id");
    $query1 ->execute();
    $resultado1=$query1->get_result();


    if ($resultado1->num_rows > 0) {
        $venta = $resultado1->fetch_assoc();
        $respuesta['fecha'] = $venta['fecha'];
    }

    //Segundo query, trae los detalles de los productos

    $query2= $conexion->prepare("SELECT id_detalle_venta,cantidad,nombre FROM detalleventa LEFT JOIN productos ON productos.id = detalleventa.id_producto WHERE id_venta = $id");
    $query2->execute();
    $resultado2=$query2->get_result();

    $detalles = [];
    while ($detalle = $resultado2->fetch_assoc()) {
        $detalles[] = $detalle;
    }

    $respuesta['detalles'] = $detalles;

    $query1->close();
    $query2->close();
    cerrarConexion();

    return $respuesta;
}

