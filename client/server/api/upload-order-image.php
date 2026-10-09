<?php

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit;
}



function sendError(int $status, string $message): void {
    http_response_code($status);
    echo json_encode([
        "success" => false,
        "message" => $message
    ]);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    sendError(405, "Endast POST är tillåtet.");
}

if (
    !isset($_FILES["image"]) ||
    !is_array($_FILES["image"]) ||
    $_FILES["image"]["error"] !== UPLOAD_ERR_OK
) {
    sendError(400, "Ingen giltig bild har laddats upp.");
}

$file = $_FILES["image"];

if ($file["size"] <= 0 || $file["size"] > 10 * 1024 * 1024) {
    sendError(400, "Bilden får vara högst 10 MB.");
}

if (!is_uploaded_file($file["tmp_name"])) {
    sendError(400, "Ogiltig uppladdning.");
}

$mime = (new finfo(FILEINFO_MIME_TYPE))
    ->file($file["tmp_name"]);

$allowedTypes = [
    "image/jpeg" => "jpg",
    "image/png" => "png",
    "image/webp" => "webp"
];

if (!isset($allowedTypes[$mime])) {
    sendError(400, "Endast JPG, PNG och WebP är tillåtna.");
}

$uploadDirectory = __DIR__ . "/../../uploads/customerUploads/";

if (
    !is_dir($uploadDirectory) &&
    !mkdir($uploadDirectory, 0755, true)
) {
    sendError(500, "Kunde inte skapa uppladdningsmappen.");
}

$filename = bin2hex(random_bytes(16))
    . "." . $allowedTypes[$mime];

$destination = $uploadDirectory . $filename;

if (!move_uploaded_file($file["tmp_name"], $destination)) {
    sendError(500, "Kunde inte spara bilden.");
}

echo json_encode([
    "success" => true,
    "image_url" => "/uploads/customerUploads/" . $filename
]);
