<?php
$uploadDir = '../assets/uploads/';
$response = [];

ini_set('display_errors', 1);
error_reporting(E_ALL);

if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

if (!empty($_FILES['nominas'])) {
    foreach ($_FILES['nominas']['tmp_name'] as $key => $tmpName) {
        $originalName = $_FILES['nominas']['name'][$key];

        // Validar formato
        if (preg_match('/^[a-zA-Z]+[a-zA-Z]*_[0-9]{1,2}_[0-9]{4}\.pdf$/', $originalName)) {
            $destination = $uploadDir . basename($originalName);

            if (move_uploaded_file($tmpName, $destination)) {
                $response[] = ["file" => $originalName, "status" => "success"];
            } else {
                $response[] = ["file" => $originalName, "status" => "error_guardar"];
            }
        } else {
            $response[] = ["file" => $originalName, "status" => "formato_invalido"];
        }
    }
} else {
    $response[] = ["status" => "no_files_received"];
}

header('Content-Type: application/json');
echo json_encode($response);
?>