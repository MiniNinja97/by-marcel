<?php

header("Content-Type: text/html; charset=UTF-8");

require_once __DIR__ . "/../../config/db.php";

$message = "";
$success = false;

// Kontrollera om en admin redan finns
$result = $conn->query("SELECT COUNT(*) AS total FROM admin_users");

if (!$result) {
    die("Kunde inte kontrollera admin_users.");
}

$row = $result->fetch_assoc();

if ((int) $row["total"] > 0) {
    die("
        <h2>Admin finns redan</h2>
        <p>Setup är därför avstängd.</p>
        <p>Ta bort setup-admin.php från servern.</p>
    ");
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $email = strtolower(trim($_POST["email"] ?? ""));
    $password = $_POST["password"] ?? "";
    $confirmPassword = $_POST["confirm_password"] ?? "";

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $message = "Ange en giltig e-postadress.";
    } elseif (strlen($password) < 10) {
        $message = "Lösenordet måste vara minst 10 tecken.";
    } elseif ($password !== $confirmPassword) {
        $message = "Lösenorden matchar inte.";
    } else {
        $passwordHash = password_hash(
            $password,
            PASSWORD_DEFAULT
        );

        $stmt = $conn->prepare("
            INSERT INTO admin_users (
                email,
                password_hash
            )
            VALUES (?, ?)
        ");

        if (!$stmt) {
            $message = "Kunde inte skapa admin.";
        } else {
            $stmt->bind_param(
                "ss",
                $email,
                $passwordHash
            );

            if ($stmt->execute()) {
                $success = true;
                $message = "Admin-kontot har skapats.";
            } else {
                $message = "Kunde inte skapa admin-kontot.";
            }

            $stmt->close();
        }
    }
}
?>

<!DOCTYPE html>
<html lang="sv">
<head>
    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <title>Skapa admin</title>

    <style>
        body {
            margin: 0;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            background: #0a0a0a;
            color: white;
            font-family: Arial, sans-serif;
        }

        .box {
            width: 100%;
            max-width: 400px;
            padding: 32px;
            border: 1px solid #c9a84c;
            border-radius: 8px;
        }

        h1 {
            margin-top: 0;
            color: #c9a84c;
        }

        label {
            display: block;
            margin-top: 18px;
            margin-bottom: 6px;
        }

        input {
            width: 100%;
            box-sizing: border-box;
            padding: 12px;
            background: #161616;
            border: 1px solid #555;
            color: white;
        }

        button {
            width: 100%;
            margin-top: 24px;
            padding: 12px;
            background: #c9a84c;
            border: none;
            cursor: pointer;
            font-weight: bold;
        }

        .message {
            margin-top: 20px;
        }
    </style>
</head>

<body>

<div class="box">

    <h1>Skapa admin</h1>

    <?php if ($success): ?>

        <p>
            Admin-kontot har skapats.
        </p>

        <p>
            <strong>
                Ta nu bort setup-admin.php från servern.
            </strong>
        </p>

    <?php else: ?>

        <form method="POST">

            <label for="email">
                E-post
            </label>

            <input
                id="email"
                name="email"
                type="email"
                autocomplete="email"
                required
            >

            <label for="password">
                Lösenord
            </label>

            <input
                id="password"
                name="password"
                type="password"
                autocomplete="new-password"
                required
            >

            <label for="confirm_password">
                Bekräfta lösenord
            </label>

            <input
                id="confirm_password"
                name="confirm_password"
                type="password"
                autocomplete="new-password"
                required
            >

            <button type="submit">
                Skapa admin
            </button>

        </form>

        <?php if ($message !== ""): ?>

            <p class="message">
                <?= htmlspecialchars($message) ?>
            </p>

        <?php endif; ?>

    <?php endif; ?>

</div>

</body>
</html>