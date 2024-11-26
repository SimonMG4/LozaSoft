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
            //dejamos por defecto la imagen como null por si el usuario no ingreso imagen
            $img = null;

            //Comprobamos si el usuario ingreso imagen
            if (isset($_FILES['imgAgregarProducto'])) {
                $fileTmpPath = $_FILES['imgAgregarProducto']['tmp_name'];
                //Obtenemos el nombre original
                $fileName = $_FILES['imgAgregarProducto']['name'];
                //Obtenemos el formato del archivo
                $fileExtension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
        
                // Extensiones permitidas para imágenes, se puede agregar a preferencia
                $allowedExtensions = ['jpg', 'jpeg', 'png'];
        
                // Validación de tipo de archivo
                if (in_array($fileExtension, $allowedExtensions)) {
                    // Renombrar el archivo con un identificador único
                    $newFileName = uniqid('prod_', true) . '.' . $fileExtension;
                    $ruta_destino = '/public/assets/images/' . $newFileName;

                    //Movemos el archivo al directorio de imagenes
                    if (move_uploaded_file($fileTmpPath, $ruta_directorio.$newFileName)) {
                        $img = $ruta_destino; // Guardamos la ruta de la imagen en la variable
                    }
                }
            }
        
            // Llamada a la función para agregar producto con la imagen
            $sesion = agregarProducto($nombre, $descripcion, $precio, $stock, $img);
            echo json_encode($sesion);
            break;
        
        
    case 'eliminarProducto':
        $id = $_POST['id'];

        //funcion Para obtener la imagen de cada producto
        $sesion1= obtenerImagen($id);
        //Comprobamos que el producto tenga imagen
        if($sesion1 != null){
            //Definimos la ruta del archivo
            $ruta = $_SERVER['DOCUMENT_ROOT'] . '/lozasoft' . $sesion1;
            //Si el archivo existe entonces lo elimina del directorio de imagenes
            if(file_exists($ruta)){
                unlink($ruta);
            }
        }
        //funcion para eliminar el producto en la base de datos
        $sesion2= eliminarProducto($id);
        
        echo json_encode($sesion2);

        break;

    case 'obtenerProducto':
        $id = $_POST['id'];

        //funcion para obtener un producto individual
        //Se utiliza para realizar el fetch cuando el usuario desea editar
        $sesion = obtenerProducto($id);

        if($sesion){
            //retornamos los datos del producto por medio de un json_encode
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
        $id = $_POST['idEditarProducto'];
        $nombre = $_POST['nombreEditarProducto'];
        $descripcion = $_POST['descripcionEditarProducto'];
        $precio = $_POST['precioEditarProducto'];
        $stock = $_POST['stockEditarProducto'];

        //definimos nuevamente la ruta de las imagenes

        $ruta_directorio = $_SERVER['DOCUMENT_ROOT'] . '/lozasoft/public/assets/images/';
        //La imagen por defecto la dejamos en null
        $img = null;

        //Comprobamos si el usuario actualizo la imagen
        if(isset($_FILES['imgEditarProducto']) && $_FILES['imgEditarProducto']['tmp_name'] !== ""){

            //Eliminamos la imagen del directorio de imagenes
            $sesion1 = obtenerImagen($id);
            if($sesion1 != null){
                $ruta = $_SERVER['DOCUMENT_ROOT'] . '/lozasoft' . $sesion1;
                if(file_exists($ruta)){
                    unlink($ruta);
                }
            }

            //Repetimos mismo proceso de agregarProducto
            $fileTmpPath = $_FILES['imgEditarProducto']['tmp_name'];
            $fileName = $_FILES['imgEditarProducto']['name'];
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
            //Ejecutamos el query que cambia la imagen
            $sesion2 = editarProducto1($id,$nombre,$descripcion,$precio,$stock,$img);
        }else{
            //Si el usuario no actualizo la imagen ejecutamos el query que no cambia nada de la imagen
            $sesion2 = editarProducto2($id,$nombre,$descripcion,$precio,$stock);
        }

        
        echo json_encode($sesion2);
        

        break;

        case 'activarProducto':

            $id = $_POST['id'];

            $sesion = activarProducto($id);
            echo json_encode($sesion);

            break;
        
    }
    }
?>