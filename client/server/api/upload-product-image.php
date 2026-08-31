<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode([
        "message" => "Endast POST är tillåtet"
    ]);
    exit;
}

if (!isset($_FILES["image"])) {
    http_response_code(400);
    echo json_encode([
        "message" => "Ingen bild skickades"
    ]);
    exit;
}

$file = $_FILES["image"];

if ($file["error"] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode([
        "message" => "Något gick fel vid uppladdningen"
    ]);
    exit;
}

/*
 * Maxstorlek: 10 MB
 */
$maxSize = 10 * 1024 * 1024;

if ($file["size"] > $maxSize) {
    http_response_code(400);
    echo json_encode([
        "message" => "Bilden får vara högst 10 MB"
    ]);
    exit;
}

/*
 * Kontrollera den verkliga filtypen.
 */
$finfo = new finfo(FILEINFO_MIME_TYPE);
$mimeType = $finfo->file($file["tmp_name"]);

$allowedTypes = [
    "image/jpeg" => "jpg",
    "image/png"  => "png",
    "image/webp" => "webp"
];

if (!isset($allowedTypes[$mimeType])) {
    http_response_code(400);
    echo json_encode([
        "message" => "Endast JPG, PNG och WebP är tillåtna"
    ]);
    exit;
}

$extension = $allowedTypes[$mimeType];

/*
 * Skapa ett unikt filnamn.
 * Vi använder alltså inte användarens ursprungliga filnamn.
 */
$fileName = "product-" . bin2hex(random_bytes(8)) . "." . $extension;

/*
 * upload-product-image.php ligger i:
 * /Server/api/
 *
 * ../../ tar oss tillbaka till webbplatsens rot.
 * Därifrån går vi till:
 * /uploads/products/
 */
$uploadDirectory = __DIR__ . "/../../uploads/products/";

if (!is_dir($uploadDirectory)) {
    http_response_code(500);
    echo json_encode([
        "message" => "Bildmappen kunde inte hittas"
    ]);
    exit;
}

$destination = $uploadDirectory . $fileName;

if (!move_uploaded_file($file["tmp_name"], $destination)) {
    http_response_code(500);
    echo json_encode([
        "message" => "Bilden kunde inte sparas"
    ]);
    exit;
}

/*
 * Detta är sökvägen vi senare sparar i databasen.
 */
$imagePath = "/uploads/products/" . $fileName;

echo json_encode([
    "success" => true,
    "message" => "Bilden laddades upp",
    "path" => $imagePath
]);