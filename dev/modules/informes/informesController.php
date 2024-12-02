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

                }
            }
            else{
                $date = new DateTime();
                $date = $date->format("Y-m-d");
                $sesion = informeDia($date);
                echo json_encode($sesion);
            }
            break;
        case "informeSemana":
            if(isset($_POST['informeSemP'])){
                //Si el usuario desea una actualizacion de semana personalizada contacte los desarrolladores
            }else{
                $date = new DateTime();
                $numeroDiaSemana = $date->format('N'); //Obtiene el numero de dia (1=lunes...7=domingo etc)
                $x = $numeroDiaSemana - 1; 
                $y = 7 - $numeroDiaSemana;

                $finSemana = $date->modify("+$y day")->format("Y-m-d"); 
                $inicioSemana = $date->modify("-$x day")->format("Y-m-d");


                echo $inicioSemana," ", $finSemana;
                //REVISAR BIEN LA LOGICA, NO ME CONVENCE                


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
                    $fecha = new DateTime("$año-$mes-01");
    
                    echo $fecha->format('Y-m-d');
                }


            }else{
                $date = new DateTime();
                $date = $date->format('Y-m');

                echo $date;
            }
            break;
        case "informeYear":
            if(isset($_POST['informeYearP'])){
                $year = $_POST['informeYearP'];
                if(empty($year)){
                    echo json_encode(['status' => 'noInfo']);
                }else{
                    $fecha = new DateTime("$year-01-01");
    
                    $fecha = $fecha->format("Y-m-d");
    
                    echo $fecha;
                }


            }else{
                $date = new DateTime();
                $date= $date->format('Y');

                echo $date;

            }
            break;
        case "informePersonalizado":
            $date1 = $_POST["date1"];
            $date2 = $_POST["date2"];

            if(empty($date1)|| empty($date2)){
                echo json_encode(['status' => 'noInfo']);
            }else{

            }
            break;
    }
}

?>
