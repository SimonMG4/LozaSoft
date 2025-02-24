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
    <link rel="stylesheet" href="../../public/css/informes.css">
    <link rel="stylesheet" href="../../public/css/modal.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap" rel="stylesheet">
<title>INFORMES</title>
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
    <main class="informes_main">
        <button class="btn-informe" data-type="dia" data-url="../../dev/modal/informeDia.html">Informe Dia</button>
        <button class="btn-informe" data-type="semana" data-url="../../dev/modal/informeSemana.html"">Informe Semana</button>
        <button class="btn-informe" data-type="semana" data-url="../../dev/modal/informeMes.html"">Informe Mes</button>
        <button class="btn-informe" data-type="año" data-url="../../dev/modal/informeYear.html"">Informe Año</button>
        <button class="btn-informe" data-type="custom" data-url="../../dev/modal/informePersonalizado.html"">Informe Personalizado</button>
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
            
<form action="../../dev/modules/productos/productosController.php" method="POST" class="form" enctype="multipart/form-data">
    <h2>Agregar Producto</h2>
    <input type="text" name="nombreAgregarProducto" placeholder="Nombre:" required>
    <input type="text" name="descripcionAgregarProducto" placeholder="Descripcion:">
    <input type="number" name="precioAgregarProducto" step="0.01" placeholder="Precio:" min="1"  required>
    <input type="number" name="stockAgregarProducto" placeholder="Stock:" min="0"  required>
    <label for="imgAgregarProducto" class="custom-file-upload">
        <span id="file-chosen">Ningún archivo seleccionado
    </label>
    <input type="file" id="imgAgregarProducto" name="imgAgregarProducto" accept="image/*" class="inputImg">
    <div>
        <input type="hidden" name="accion" value="agregarProducto">
        <input type="submit" name="agregarProducto" value="Aceptar">
        <button id="cerrarModal" class="cerrarModal">Cerrar</button>
    </div>
</form>
            
        </div>
    </section>

    <script src="../../public/js/main.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="../../dev/modules/informes/informes.js"></script>

    
</body>
</html>