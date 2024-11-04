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
function tablaProductos(){
    abrirConexion();
    global $conexion;

    $query = $conexion->prepare("SELECT * FROM productos");
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

function editarProducto($id,$nombre,$descripcion,$precio,$stock,$img){
    abrirConexion();
    global $conexion;

    $query = $conexion->prepare("UPDATE productos SET nombre = $nombre, descripcion = $descripcion,
     precio = $precio, stock = $stock, img = $img WHERE id = $id");
     $query->execute();

     if ($query->execute()) {
        return true;
         } else {
        return false;
         }
    cerrarConexion();
}
function eliminarProducto($id){
    abrirConexion();
    global $conexion;

    $query = $conexion->prepare("DELETE FROM productos WHERE id= $id");
    $query->execute();

    if ($query) {
        $response['status']= 'true';
         } else {
        $response['status']= 'false';
         }
    return $response;
    cerrarConexion();
}