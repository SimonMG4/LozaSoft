<?php

include('../../config/modelo.php'); 
header('Content-Type: application/json');

if (isset($_REQUEST['accion'])) { 
    $accion = $_REQUEST['accion'];

    switch($accion){

        case 'agregarProducto':
            $nombre = $_POST['nombreAgregarProducto'];
            $descripcion = $_POST['descripcionAgregarProducto'];
            $precio = $_POST['precioAgregarProducto'];
            $stock = $_POST['stockAgregarProducto'];
        
            // Ruta del directorio donde se almacenarán las imágenes
            $ruta_directorio = $_SERVER['DOCUMENT_ROOT'] . '/lozasoft/public/assets/images/';
            $img = null;
        
            if (isset($_FILES['imgAgregarProducto'])) {
                $fileTmpPath = $_FILES['imgAgregarProducto']['tmp_name'];
                $fileName = $_FILES['imgAgregarProducto']['name'];
                $fileExtension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
        
                // Extensiones permitidas para imágenes
                $allowedExtensions = ['jpg', 'jpeg', 'png'];
        
                // Validación de tipo de archivo
                if (in_array($fileExtension, $allowedExtensions)) {
                    // Renombrar el archivo con un identificador único
                    $newFileName = uniqid('prod_', true) . '.' . $fileExtension;
                    $ruta_destino = '/public/assets/images/' . $newFileName;
        
                    if (move_uploaded_file($fileTmpPath, $ruta_directorio.$newFileName)) {
                        $img = $ruta_destino; // Guardar la ruta completa en la base de datos
                    }
                }
            }
        
            // Llamada a la función para agregar producto con la imagen
            $sesion = agregarProducto($nombre, $descripcion, $precio, $stock, $img);
            echo json_encode($sesion);
            break;
        
        
    case 'eliminarProducto':
        $id = $_POST['id'];

        $sesion= eliminarProducto($id);
        
        echo json_encode($sesion);

        break;

    case 'obtenerProducto':
        $id = $_POST['id'];

        $sesion = obtenerProducto($id);

        if($sesion){
            echo json_encode([
                'status' => 'success',
                'data' => $sesion
            ]);
        }else{
            echo json_encode([
                'status' => 'error',
                'message' => 'Producto no encontrado o error en la consulta.'
            ]);
        }

        break;
    
    case 'editarProducto':
        $id
        
    }
    }
?>