<?php
session_start();

if(!isset($_SESSION['id'])){
    header("location: index.html");
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../../public/css/main.css">
    <link rel="stylesheet" href="../../public/css/interfaz.css">
    <link rel="shortcut icon" href="../../public/assets/favicon.png" type="image/x-icon">
    <link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <title>INTERFAZ</title>
</head>
<body class="interfaz_body">
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
        <h1>¡Bienvenido! ¿Que te gustaria ver hoy ?</h1>
    </header>
    <main class="interfaz_main">
        <div class="cards">
            <a href="productos.php" class="card">
                <div class="card_content">
                    <h1 class="card_tittle">PRODUCTOS</h1>
                    <img src="../../public/assets/productos.svg" alt="">
                </div>
             <div class="card__content">
               <p class="card_description">Podras ver tus productos con sus existencias, agregar, editar y eliminarlos.</p>
             </div>
            </a>
            <a href="" class="card">
                <div class="card_content">
                    <h1 class="card_tittle">VENTAS</h1>
                    <img src="../../public/assets/ventas.svg" alt="">
                </div>
             <div class="card__content">
               <p class="card_description">Podras ver las ventas realizadas por la empresa, agregar, editar y eliminarlas.</p>
             </div>
            </a>
            <a href="" class="card">
                <div class="card_content">
                    <h1 class="card_tittle">COMPRAS</h1>
                    <img src="../../public/assets/compras.svg" alt="">
                </div>
             <div class="card__content">
               <p class="card_description">Podras ver las compras realizadas por la empresa, agregar, editar y eliminarlas.</p>
             </div>
            </a>
            <a href="" class="card">
                <div class="card_content">
                    <h1 class="card_tittle">INFORMES</h1>
                    <img src="../../public/assets/informes.svg" alt="">
                </div>
             <div class="card__content">
               <p class="card_description">Podras ver un informe de tus ganancias en dia, semana, mes, año o en el lapso de tiempo que desees.</p>
             </div>
            </a>
        </div>
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
                <p>- andres@gmail.com - 311 4227954</p>
                <p>- jpablogo17@gmail.com - 310 5315207</p>
            </div>
        </div>
        <div class="div2">
            <p>&copy; 2024 <b>LozaSoft</b> - Todos los Derechos Reservados.</p>
        </div>
    </footer>
<script src="../../dev/modules/js/logOut.js"></script>
</body>
</html>