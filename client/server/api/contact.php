<?php

header("Content-Type: application/json; charset=UTF-8");

// Tillåt endast POST
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);

    echo json_encode([
        "success" => false,
        "message" => "Method not allowed"
    ]);

    exit;
}


// Hämta formulärdata
$firstName = trim($_POST["firstName"] ?? "");
$lastName = trim($_POST["lastName"] ?? "");
$email = trim($_POST["email"] ?? "");
$subject = trim($_POST["subject"] ?? "");
$message = trim($_POST["message"] ?? "");


// Kontrollera att alla fält finns
if (
    $firstName === "" ||
    $lastName === "" ||
    $email === "" ||
    $subject === "" ||
    $message === ""
) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Alla fält måste fyllas i."
    ]);

    exit;
}


// Kontrollera e-postadressen
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Ogiltig e-postadress."
    ]);

    exit;
}


// Översätt formulärets ämne till något läsbart
$subjectNames = [
    "product" => "Fråga om produkt",
    "custom-order" => "Specialbeställning",
    "order-delivery" => "Order & leverans",
    "other" => "Övrigt"
];


// Kontrollera att ämnet är ett av de tillåtna alternativen
if (!array_key_exists($subject, $subjectNames)) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Ogiltigt ämne."
    ]);

    exit;
}


$subjectText = $subjectNames[$subject];


// Adressen som ska ta emot meddelandet
$to = "info@bymarcel.se";


// Ämnesraden i mejlet
$mailSubject = "Kontaktformulär By Marcel - " . $subjectText;


// Själva mejlet
$mailBody =
    "Nytt meddelande från kontaktformuläret på By Marcel\n\n" .

    "Namn:\n" .
    $firstName . " " . $lastName . "\n\n" .

    "E-post:\n" .
    $email . "\n\n" .

    "Ämne:\n" .
    $subjectText . "\n\n" .

    "Meddelande:\n" .
    $message . "\n";


// Headers
$headers = [
    "From: By Marcel <info@bymarcel.se>",
    "Reply-To: " . $email,
    "Content-Type: text/plain; charset=UTF-8"
];


// Skicka mejlet
$sent = mail(
    $to,
    $mailSubject,
    $mailBody,
    implode("\r\n", $headers)
);


// Kontrollera resultatet
if (!$sent) {
    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Meddelandet kunde inte skickas."
    ]);

    exit;
}


// Allt gick bra
echo json_encode([
    "success" => true,
    "message" => "Meddelandet har skickats."
]);