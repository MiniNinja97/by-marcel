<?php

// -----------------------------------------
// Skapa ett unikt, synligt ordernummer
// -----------------------------------------

function generateOrderNumber(mysqli $conn): string
{
    $stmt = $conn->prepare("
        INSERT INTO order_number_sequence ()
        VALUES ()
    ");

    $stmt->execute();

    $sequenceNumber = $conn->insert_id;

    $stmt->close();

    $year = date("Y");

    return $year . "-" . $sequenceNumber;
}