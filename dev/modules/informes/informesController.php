<?php
session_start();
include('../../config/modelo.php'); 
header('Content-Type: application/json');

if (isset($_REQUEST['accion'])) { 
    $accion = $_REQUEST['accion'];

    switch($accion){

        case "informeDia":
            if(isset($_POST['informeDiaP'])){
                $date = $_POST['informeDiaP'];
                echo $date;
            }
            else{
                $date = new DateTime();
                $date = $date->format("Y-m-d");
                echo $date;
            }
            break;
    }
}

?>
