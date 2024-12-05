<?php

include('../../library/fpdf/fpdf.php');
header('Content-Type: application/json');

session_start();

if (!isset($_SESSION['id'])) {
    header("location: /lozasoft/index.html");
}
if (!isset($_REQUEST['informeData'])) {
    header("location: ../../views/informes.php");

}else{
    $informeData = json_decode($_POST['informeData'], true);
    $ventas = $informeData['ventas'];
    $compras = $informeData['compras'];
    $totalGanancia = $informeData['totalGanancia'];
    $fecha = $informeData['fecha'];
    class PDF extends FPDF{
        function Header()
        {
            // Logo
            $this->SetFont('Arial','B',15);
            $this->Cell(10);

            $this->SetTextColor(128,128,128);
            $this->Cell(30,10,'Fecha de informe:',0,0,'C');
            $this->Ln(8);
            $this->Cell(10);
            $this->Cell(30,10,$this->fechaInforme,0,0,'C');

            $this->Cell(42.5);
            $this->SetTextColor(0,0,0);
            $this->SetFontSize(25);

            $this->Cell(30,10,'ARTE Y LOZA',0,0,'C');
            $this->Cell(35);

            $this->Image('../../../public/assets/favicon2.png',160,4,33);
            $this->SetFontSize(15); 
            $this->Ln(30);
            $this->Cell(83);
            $this->Cell(30,10,"Total Ganancia:   ".$this->totalGanancia." COP",0,0,'C');
            $this->Ln(40);


            
        }
        function TableVentas($header, $data) {
            $this->SetDrawColor(0, 0, 0);
            $this->SetLineWidth(0.3);
            $this->SetFont('Arial','B');
            
            // Encabezado
            $this->SetFontSize(20);
            $this->Cell(10);
            $this->Cell(30,10,'Ventas: ',0,0,'C');
            $this->Cell(70);
            $this->SetTextColor(12, 98, 197);
            $this->Cell(30,10,'Principal ',0,0,'C');
            $this->Cell(10);
            $this->SetTextColor(33, 199, 63);
            $this->Cell(30,10,'Detalles ',0,0,'C');
            $this->SetFillColor(23, 41, 92);
            $this->SetTextColor(255);
            $this->Ln(20);
            $this->SetFontSize(11);
            $w = array(20, 56, 57,57); // Anchos de las columnas
            for ($i = 0; $i < count($header); $i++) {
                $this->Cell($w[$i], 7, $header[$i], 1, 0, 'C', true);
            }
            $this->Ln();
            $this->SetFillColor(240, 248, 255);
            $this->SetTextColor(0);

            // Datos
            $this->SetFont('');
            foreach ($data as $row) {
                $this->SetFillColor(199, 224, 246);
                $this->Cell($w[0], 6, $row['id'], 'TLR', 0, 'C', true); // ID
                $this->Cell($w[1], 6, $row['fecha'], 'TLR', 0, 'C', true); // Fecha
                $this->Cell($w[2], 6, $row['totalNeto']." COP", 'TLR', 0, 'C', true);
                $this->Cell($w[2], 6, $row['totalBruto']." COP", 'TLR', 0, 'C', true);
                $this->Ln();

                if (isset($row['detalles']) && is_array($row['detalles'])) {
                    $this->SetFont('', 'B');
                    $this->SetFillColor(33, 199, 63);
                    $this->SetTextColor(255);
                    $wDetalles = array(20, 22, 50, 49, 49, 49 ); // Anchos de las columnas de detalles
                    $this->Cell($wDetalles[0], 7, 'idDetalle', 1, 0, 'C', true);
                    $this->Cell($wDetalles[1], 7, 'idProducto', 1, 0, 'C', true);
                    $this->Cell($wDetalles[2], 7, 'Nombre ', 1, 0, 'C', true);
                    $this->Cell($wDetalles[3], 7, 'Cantidad', 1, 0, 'C', true);
                    $this->Cell($wDetalles[4], 7, 'Total', 1, 0, 'C', true);
                    $this->Ln();
                    $this->SetFont('');
                    $this->SetFillColor(240, 248, 255);
                    $this->SetTextColor(0);

                    foreach ($row['detalles'] as $detalle) {
                        $this->SetFillColor(230, 255, 239);
                        // Mostrar cada detalle
                        $this->Cell($wDetalles[0], 6, $detalle['idDetalleVenta'], 'LR', 0, 'C', true); 
                        $this->Cell($wDetalles[1], 6, $detalle['idProducto'], 'LR', 0, 'C', true); 
                        $textoTotal = $detalle['nombreProducto'];
                        $textoTotal = reducirTexto($textoTotal,20);
                        $this->Cell($wDetalles[2], 6, $textoTotal, 'LR', 0, 'C', true); 
                        $this->Cell($wDetalles[3], 6, $detalle['cantidad'], 'LR', 0, 'C', true); 
                        $this->Cell($wDetalles[4], 6, $detalle['total'] . " COP", 'LR', 0, 'C', true); 
                        $this->Ln();
                        $this->SetFillColor(240, 248, 255);
                    }
                }
            }
            $this->Cell(array_sum($w), 0, '', 'T'); // Línea horizontal
            $this->Ln(20);
        }
        function TableCompras($header, $data) {
            $this->SetDrawColor(0, 0, 0);
            $this->SetLineWidth(0.3);
            $this->SetFont('Arial','B');
            
            // Encabezado
            $this->SetFontSize(20);
            $this->Cell(10);
            $this->Cell(30,10,'Compras: ',0,0,'C');
            $this->SetFillColor(23, 41, 92);
            $this->SetTextColor(255);
            $this->Ln(20);
            $this->SetFontSize(11);
            $w = array(20, 85, 85); // Anchos de las columnas
            for ($i = 0; $i < count($header); $i++) {
                $this->Cell($w[$i], 7, $header[$i], 1, 0, 'C', true);
            }
            $this->Ln();
            $this->SetFillColor(240, 248, 255);
            $this->SetTextColor(0);

            // Datos
            $this->SetFont('');
            foreach ($data as $row) {
                $this->SetFillColor(199, 224, 246);
                $this->Cell($w[0], 6, $row['id'], 'TLR', 0, 'C', true); // ID
                $this->Cell($w[1], 6, $row['fecha'], 'TLR', 0, 'C', true); // Fecha
                $this->Cell($w[2], 6, $row['total']." COP", 'TLR', 0, 'C', true);
                $this->Ln();

                if (isset($row['detalles']) && is_array($row['detalles'])) {
                    $this->SetFont('', 'B');
                    $this->SetFillColor(33, 199, 63);
                    $this->SetTextColor(255);
                    $wDetalles = array(20, 50, 20, 50, 50, 50 ); // Anchos de las columnas de detalles
                    $this->Cell($wDetalles[0], 7, 'idDetalle', 1, 0, 'C', true);
                    $this->Cell($wDetalles[1], 7, 'Nombre', 1, 0, 'C', true);
                    $this->Cell($wDetalles[2], 7, 'Cantidad ', 1, 0, 'C', true);
                    $this->Cell($wDetalles[3], 7, 'Precio', 1, 0, 'C', true);
                    $this->Cell($wDetalles[4], 7, 'Total', 1, 0, 'C', true);
                    $this->Ln();
                    $this->SetFont('');
                    $this->SetFillColor(240, 248, 255);
                    $this->SetTextColor(0);

                    foreach ($row['detalles'] as $detalle) {
                        $this->SetFillColor(230, 255, 239);
                        // Mostrar cada detalle
                        $this->Cell($wDetalles[0], 6, $detalle['idDetalleCompra'], 'LR', 0, 'C', true);
                        $textoTotal = $detalle['nombre'];
                        $textoTotal = reducirTexto($textoTotal,20);
                        $this->Cell($wDetalles[1], 6, $textoTotal, 'LR', 0, 'C', true); 
                        $this->Cell($wDetalles[2], 6, $detalle['cantidad'], 'LR', 0, 'C', true); 
                        $this->Cell($wDetalles[3], 6, $detalle['precio'], 'LR', 0, 'C', true); 
                        $this->Cell($wDetalles[4], 6, $detalle['total'] . " COP", 'LR', 0, 'C', true); 
                        $this->Ln();
                        $this->SetFillColor(240, 248, 255);
                    }
                }
            }
            $this->Cell(array_sum($w), 0, '', 'T'); // Línea horizontal
        }

    }
    $pdf = new PDF();
    $pdf->fechaInforme = $fecha;
    $pdf->totalGanancia = $totalGanancia;
    $pdf->AliasNbPages();
    $pdf->AddPage();
    $pdf->SetFont('Times','',12);
    $headerVentas = ['ID', 'Fecha', 'Total Neto','Total Bruto'];
    $headerCompras = ['ID', 'Fecha', 'Total'];

    // Datos de ventas
    $dataVentas = [];
    foreach ($ventas as $venta) {
        $dataVentas[] = array(
            'id' => $venta['id'],
            'fecha' => $venta['fecha'],
            'totalNeto' => $venta['totalNeto'],
            'totalBruto' => $venta['totalBruto'],
            'detalles' => $venta['detalles']
        );
    }
    $dataCompras = [];
    foreach ($compras as $compra) {
        $dataCompras[] = array(
            'id' => $compra['id'],
            'fecha' => $compra['fecha'],
            'total' => $compra['total'],
            'detalles' => $compra['detalles']
        );
    }
    function reducirTexto($texto, $maxLength) {
        if (strlen($texto) > $maxLength) {
            return substr($texto, 0, $maxLength) . '...'; 
        }
        return $texto; 
    }

    $pdf->TableVentas($headerVentas, $dataVentas);
    $pdf->TableCompras($headerCompras,$dataCompras);

    $pdf->Output("informe_$fecha.pdf", 'I'); //Cambiar el valor de I a D para descargar automaticamente
}
?>