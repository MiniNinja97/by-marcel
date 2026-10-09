<?php

$allowedOrigins = [
    "https://www.bymarcel.se",
    "https://bymarcel.se",
    "http://localhost:5173"
];

$origin = $_SERVER["HTTP_ORIGIN"] ?? "";

if (in_array($origin, $allowedOrigins, true)) {
    header("Access-Control-Allow-Origin: " . $origin);
    header("Access-Control-Allow-Credentials: true");
}

header("Vary: Origin");

require_once __DIR__ . "/session.php";

if (empty($_SESSION["admin_user_id"])) {
    http_response_code(401);
    exit("Obehörig åtkomst");
}

$imageName = $_GET["file"] ?? "";

if (
    !is_string($imageName) ||
    $imageName === "" ||
    basename($imageName) !== $imageName
) {
    http_response_code(400);
    exit("Ogiltigt filnamn");
}

$imageDirectory = realpath(
    __DIR__ . "/../../../uploads/customerUploads"
);

if ($imageDirectory === false) {
    http_response_code(500);
    exit("Bildmappen hittades inte");
}

$imagePath = realpath(
    $imageDirectory . "/" . $imageName
);

if (
    $imagePath === false ||
    dirname($imagePath) !== $imageDirectory ||
    !is_file($imagePath)
) {
    http_response_code(404);
    exit("Bilden hittades inte");
}

$imageInfo = getimagesize($imagePath);

$allowedTypes = [
    IMAGETYPE_JPEG => "image/jpeg",
    IMAGETYPE_PNG => "image/png",
    IMAGETYPE_WEBP => "image/webp"
];

if (
    $imageInfo === false ||
    !isset($allowedTypes[$imageInfo[2]])
) {
    http_response_code(415);
    exit("Filformatet stöds inte");
}

header("Content-Type: " . $allowedTypes[$imageInfo[2]]);
header("Content-Disposition: inline");
header("Cache-Control: private, no-store");
header("X-Content-Type-Options: nosniff");

readfile($imagePath);
exit;