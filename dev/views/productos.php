<?php
session_start();

if(!isset($_SESSION['id'])){
    header("location: /lozasoft/index.html");
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="shortcut icon" href="../../public/assets/favicon.png" type="image/x-icon">
    <link rel="stylesheet" href="../../public/css/main.css">
    <link rel="stylesheet" href="../../public/css/productos.css">
    <link rel="stylesheet" href="../../public/css/modal.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap" rel="stylesheet">
<title>PRODUCTOS</title>
</head>
<body class="body">
    <header class="interfaz_header header">
        <div>
            <div class="div1">
                <img src="../../public/assets/favicon.png" alt="">
                <p>ARTE Y LOZA</p>
            </div>
            <div class="div2">
                <a href="productos.php">PRODUCTOS</a>
                <a href="ventas.php">VENTAS</a>
                <a href="compras.php">COMPRAS</a>
                <a href="informes.php">INFORMES</a>
            </div>

            <button id="logOut" class="logOut">CERRAR SESION</button>
        </div>
    </header>
    <main class="productos_main">
        <div>
            <div>
                <button class="btn_agregar" data-url="../../dev/modal/agregarProducto.html">Agregar</button>
                <a href="../../dev/views/productosInactivos.php">Ver Inactivos</a>
                <a href="../../dev/views/productosNoStock.php">Ver sin Stock</a>
            </div>


            
            <input  class="buscar" type="text" id="buscar" placeholder="Buscar...">
            
        </div>
        <table id="tabla" class="tabla">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Descripcion</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Imagen</th>
                    <th>Acciones</th>
                    
                </tr>
                <tbody>
                    <?php
                    include('../../dev/config/modelo.php');
                    
                    $filas = tablaProductos();
                    
                    foreach ($filas as $fila):
                        ?>
                    <tr>
                        <td><?php echo $fila->id; ?></td>
                        <td class="td-nombre"><?php echo $fila->nombre; ?></td>
                        <td class="td-descripcion"><?php echo $fila->descripcion; ?></td>
                        <td>$<?php echo $fila->precio; ?></td>
                        <td><?php echo $fila->stock; ?></td>
                        <td><img class="imgTabla" src="http://localhost/lozasoft<?php echo $fila->imagen; ?>"</td>
                        <td><button class="btn_eliminar" data-id="<?php echo $fila->id?>" data-accion="eliminarProducto" data-controller='../../dev/modules/productos/productosController.php'>Desactivar</button>
                        <button class="btn_editar" data-id="<?php echo $fila->id?>" data-accion1="obtenerProducto"data-accion2="editarProducto" data-url="../../dev/modal/editarProducto.html">Editar</button>
                        <button class="btn_ver" data-id="<?php echo $fila->id?>" data-accion="obtenerProducto" data-url="../../dev/modal/verProducto.html"">Ver</button></td>
                    </tr>
                    <?php endforeach;?>
                </tbody>

            </thead>
            
        </table>

    </main>
    
    
    <footer class="footer">
        <div class="div1">
            <img src="../../public/assets/favicon2.png" alt="">
            <div>
                <h2>DESARROLLADORES:</h2>
                <p>- Simon Muñoz Guarin</p>
                <p>- Andres Felipe Botero</p>
                <p>- Juan Pablo Gonzales</p>
            </div>
            <div>
                <h2>CONTACTO:</h2>
                <p>- simonusuario82@gmail.com - 313 6028348</p>
                <p>- pipebg03@gmail.com - 311 4227954</p>
                <p>- jpablogo17@gmail.com - 310 5315207</p>
            </div>
        </div>
        <div class="div2">
            <p>&copy; 2024 <b>LozaSoft</b> - Todos los Derechos Reservados.</p>
        </div>
    </footer>
    

    <!-- conteedor de las modales -->
    <section class="modal">
        <div class="modal_contenedor">
        </div>
    </section>

    <script src="../../public/js/main.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    
</body>
</html>