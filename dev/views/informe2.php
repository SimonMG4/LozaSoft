<?php
session_start();

if (!isset($_SESSION['id'])) {
    header("location: /lozasoft/index.html");
}

if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['informeData'])) {
    $informeData = json_decode($_POST['informeData'], true);

    $ventas = $informeData['ventas'];
    $compras = $informeData['compras'];
    $totalGanancia = $informeData['totalGanancia'];
    if(isset($informeData['fecha1'])){
        $fecha1 = $informeData['fecha1'];
        $fecha2 = $informeData['fecha2'];
    }else{
        $fecha = $informeData['fecha'];

    }
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../../public/css/main.css">
    <link rel="stylesheet" href="../../public/css/informes.css">
    <link rel="shortcut icon" href="../../public/assets/favicon.png" type="image/x-icon">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <title>Informe</title>
</head>
<body class="informe_body">
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
    <div class="container_header">
        <h2 class="informe_titulo">Informe de Ventas y Compras</h2>
        <p class="informe_descripcion"><?php if(isset($fecha)){echo $fecha;}else{echo $fecha1. "  Hasta  ". $fecha2;} ?></p>
        <button class="btn-pdf" pdf="2"><img class="btn-pdf-img" src="../../public/assets/pdf.svg" alt=""></button>
    </div>
    <div class="container">
        <table class="tabla_informe">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Fecha</th>
                    <th>Total Ganancia/Perdida</th>
                    <th>Total Bruto</th>
                </tr>
            </thead>
            <tbody>
                <tr class="titulo-seccion-informe">
                    <td colspan="3"><strong>Ventas:</strong></td>
                </tr>
                <?php foreach ($ventas as $venta): ?>
                    <tr class="detalle-venta">
                        <td><?php echo $venta['id']; ?></td>
                        <td><?php echo $venta['fecha']; ?></td>
                        <td><?php echo number_format($venta['total_ganancia'], 2); ?> COP</td>
                        <td><?php echo number_format($venta['total_bruto'], 2); ?> COP</td>
                    </tr>
                <?php endforeach; ?>

                <tr class="titulo-seccion-informe">
                    <td colspan="3"><strong>Compras:</strong></td>
                </tr>
                <?php foreach ($compras as $compra): ?>
                    <tr class="detalle-compra">
                        <td><?php echo $compra['id']; ?></td>
                        <td><?php echo $compra['fecha']; ?></td>
                        <td><?php echo number_format($compra['total_perdida'], 2); ?> COP</td>
                        <td>-</td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>
    <div class="informe-total">
        <td><strong>Total Ganancia:</strong></td>
        <td><?php echo number_format($totalGanancia, 2); ?> COP</td>
    </div>
    <script>
        var informeData = <?php echo json_encode($informeData); ?>;
    </script>

    <script src="../../public/js/main.js"></script>
    <script src="../../dev/modules/informe/informe.js"></script>
</body>
</html>
