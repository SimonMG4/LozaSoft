<?php
session_start();
include('../../config/modelo.php'); 
header('Content-Type: application/json');

date_default_timezone_set('America/Bogota');
if (isset($_REQUEST['accion'])) { 
    $accion = $_REQUEST['accion'];

    switch($accion){

        case "informeDia":
            if(isset($_POST['informeDiaP'])){
                $date = $_POST['informeDiaP'];
                if(empty($date)){
                    echo json_encode(['status' => 'noInfo']);
                }else{
                    $sesion = informeDia($date);

                    if (isset($sesion['totalGanancia']) && $sesion['totalGanancia'] == '0') {
                        $response = ["status" => "false"];
                    } else {
                        $response = [
                            "status" => "true",
                            "data" => $sesion
                        ];
                    }
                    
                    echo json_encode($response);

                }
            }
            else{
                $date = new DateTime();
                $date = $date->format("Y-m-d");
                $sesion = informeDia($date);

                if (isset($sesion['totalGanancia']) && $sesion['totalGanancia'] == '0') {
                    $response = ["status" => "false"];
                } else {
                    $response = [
                        "status" => "true",
                        "data" => $sesion
                    ];
                }
                
                echo json_encode($response);
            }
            break;
        case "informeSemana":
            if(isset($_POST['informeSemP'])){
                //Si el usuario desea una actualizacion de semana personalizada contacte los desarrolladores
            }else{
                $date = new DateTime();
                $numeroDiaSemana = $date->format('N'); //Obtiene el numero de dia (1=lunes...7=domingo etc)
                $x = $numeroDiaSemana - 1; 

                $date1 = $date->modify("-$x day")->format("Y-m-d");
                
                $date2 = $date->modify("+6  day")->format("Y-m-d"); 

                $sesion= informeSem($date1,$date2);

                if (isset($sesion['totalGanancia']) && $sesion['totalGanancia'] == '0') {
                    $response = ["status" => "false"];
                } else {
                    $response = [
                        "status" => "true",
                        "data" => $sesion
                    ];
                }
                
                echo json_encode($response);
            }

            break;
        case "informeMes":
            if(isset($_POST['informeMesP'])){

                $mes = $_POST['informeMesP'];
                if(empty($mes)){
                    echo json_encode(['status' => 'noInfo']);
                }else{
                    $date = new DateTime();
                    $año = $date->format('Y');
                    $date1 = new DateTime("$año-$mes-01");
                    
                    $date2 = clone $date1; 
                    $date2->modify('last day of this month');

                    $date1 = $date1->format("Y-m-d");
                    $date2 = $date2->format("Y-m-d");

                    $sesion = informeMes($date1,$date2);

                    if (isset($sesion['totalGanancia']) && $sesion['totalGanancia'] == '0') {
                        $response = ["status" => "false"];
                    } else {
                        $response = [
                            "status" => "true",
                            "data" => $sesion
                        ];
                    }
                    
                    echo json_encode($response);

                }


            }else{
                $date = new DateTime();
                $date = $date->format('Y-m');
                $date1 = new DateTime("$date-01");

                $date2 = clone $date1; 
                $date2->modify('last day of this month');

                $date1 = $date1->format("Y-m-d");
                $date2 = $date2->format("Y-m-d");

                $sesion = informeMes($date1,$date2);

                if (isset($sesion['totalGanancia']) && $sesion['totalGanancia'] == '0') {
                    $response = ["status" => "false"];
                } else {
                    $response = [
                        "status" => "true",
                        "data" => $sesion
                    ];
                }
                
                echo json_encode($response);
            }
            break;
        case "informeYear":
            if(isset($_POST['informeYearP'])){
                $year = $_POST['informeYearP'];
                if(empty($year)){
                    echo json_encode(['status' => 'noInfo']);
                }else{
                    $date = new DateTime("$year-01-01");
    
                    $date = $date->format("Y");

                    $sesion = informeYear($date);
                    
                    if (isset($sesion['totalGanancia']) && $sesion['totalGanancia'] == '0') {
                        $response = ["status" => "false"];
                    } else {
                        $response = [
                            "status" => "true",
                            "data" => $sesion
                        ];
                    }
                    
                    echo json_encode($response);
                    
                }


            }else{
                $date = new DateTime();
                $date= $date->format('Y');

                $sesion = informeYear($date);

                if (isset($sesion['totalGanancia']) && $sesion['totalGanancia'] == '0') {
                    $response = ["status" => "false"];
                } else {
                    $response = [
                        "status" => "true",
                        "data" => $sesion
                    ];
                }
                
                echo json_encode($response);

            }
            break;
        case "informePersonalizado":
            $fecha1 = $_POST["date1"];
            $fecha2 = $_POST["date2"];

            if(empty($fecha1)|| empty($fecha2)){
                echo json_encode(['status' => 'noInfo']);
                
            }else{
                if ($fecha1>$fecha2){
                    echo json_encode(['status' => 'fecha>']);
                }else{
                    $date1 = new DateTime("$fecha1");
                    $date2 = new DateTime("$fecha2");
                    $date1=$date1->format("Y-m-d");
                    $date2=$date2->format("Y-m-d");

                    $sesion = informePer($date1, $date2);

                    if (isset($sesion['totalGanancia']) && $sesion['totalGanancia'] == '0') {
                        $response = ["status" => "false"];
                    } else {
                        $response = [
                            "status" => "true",
                            "data" => $sesion
                        ];
                    }
                    
                    echo json_encode($response);
                    
                    

                }


            }
            break;
    }
}

?>
