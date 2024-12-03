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
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../../public/css/main.css">
    <link rel="stylesheet" href="../../public/css/informes.css">
    <title>Informe</title>
</head>
<body class="informe_body">
    <!-- Contenido adicional antes de la tabla -->
    <div class="container">
        <h2 class="informe_titulo">Informe de Ventas y Compras</h2>
        <p class="informe_descripcion">A continuación se presenta un desglose de las ventas y compras realizadas, junto con la ganancia total obtenida.</p>
        
        <!-- Tabla de Ventas y Compras -->
        <table class="tabla_informe">
            <thead>
                <tr>
                    <th>Fecha</th>
                    <th>Total Ganancia/Perdida</th>
                    <th>Total Bruto</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                <!-- Ventas -->
                <tr class="titulo-seccion-informe">
                    <td colspan="4"><strong>Ventas:</strong></td>
                </tr>
                <?php foreach ($ventas as $venta): ?>
                    <tr class="detalle-venta">
                        <td><?php echo $venta['fecha']; ?></td>
                        <td><?php echo number_format($venta['totalNeto'], 2); ?> COP</td>
                        <td><?php echo number_format($venta['totalBruto'], 2); ?> COP</td>
                        <td>
                            <button class="btn-detalles" onclick="toggleDetails('venta_<?php echo $venta['id']; ?>')">Ver Detalles</button>
                        </td>
                    </tr>
                    <tr id="venta_<?php echo $venta['id']; ?>" class="details" style="display:none;">
                        <td colspan="4">
                            <table class="tabla-detalle">
                                <thead>
                                    <tr>
                                        <th>ID DetalleVenta</th>
                                        <th>ID Producto</th>
                                        <th>Nombre Producto</th>
                                        <th>Cantidad</th>
                                        <th>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php foreach ($venta['detalles'] as $detalle): ?>
                                        <tr>
                                            <td><?php echo $detalle['idDetalleVenta']; ?></td>
                                            <td><?php echo $detalle['idProducto']; ?></td>
                                            <td><?php echo $detalle['nombreProducto']; ?></td>
                                            <td><?php echo $detalle['cantidad']; ?></td>
                                            <td><?php echo number_format($detalle['total'], 2); ?> COP</td>
                                        </tr>
                                    <?php endforeach; ?>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                <?php endforeach; ?>

                <!-- Compras -->
                <tr class="titulo-seccion-informe">
                    <td colspan="4"><strong>Compras:</strong></td>
                </tr>
                <?php foreach ($compras as $compra): ?>
                    <tr class="detalle-compra">
                        <td><?php echo $compra['fecha']; ?></td>
                        <td><?php echo number_format($compra['total'], 2); ?> COP</td>
                        <td>-</td>
                        <td>
                            <button class="btn-detalles" onclick="toggleDetails('compra_<?php echo $compra['id']; ?>')">Ver Detalles</button>
                        </td>
                    </tr>
                    <tr id="compra_<?php echo $compra['id']; ?>" class="details" style="display:none;">
                        <td colspan="4">
                            <table class="tabla-detalle">
                                <thead>
                                    <tr>
                                        <th>ID DetalleCompra</th>
                                        <th>Nombre Producto</th>
                                        <th>Precio Unitario</th>
                                        <th>Cantidad</th>
                                        <th>Total Perdida</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php foreach ($compra['detalles'] as $detalle): ?>
                                        <tr>
                                            <td><?php echo $detalle['idDetalleCompra']; ?></td>
                                            <td><?php echo $detalle['nombre']; ?></td>
                                            <td><?php echo $detalle['precio']; ?></td>
                                            <td><?php echo $detalle['cantidad']; ?></td>
                                            <td><?php echo number_format($detalle['total'], 2); ?> COP</td>
                                        </tr>
                                    <?php endforeach; ?>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                <?php endforeach; ?>

                <!-- Total Ganancia -->
                <tr class="informe-total">
                    <td colspan="3" class="text-right"><strong>Total Ganancia:</strong></td>
                    <td><?php echo number_format($totalGanancia, 2); ?> COP</td>
                </tr>
            </tbody>
        </table>
    </div>

    <script>
        function toggleDetails(section) {
            var details = document.getElementById(section);
            if (details.style.display === "none" || details.style.display === "") {
                details.style.display = "table-row"; 
            } else {
                details.style.display = "none"; 
            }
        }
    </script>
</body>
</html>
