<?php
/**
 * Mahalakshmi Spice Heritage - Mail Configuration
 * 
 * Automatically loads settings from environment variables or .env.local
 */

// If .env.local exists, load it automatically (for local / server deployment)
$envLocalPath = __DIR__ . '/../.env.local';
if (file_exists($envLocalPath)) {
    $lines = file($envLocalPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        $line = trim($line);
        if (empty($line) || strpos($line, '#') === 0 || strpos($line, '=') === false) continue;
        list($k, $v) = explode('=', $line, 2);
        $k = trim($k);
        $v = trim(trim($v), '"\'');
        if (!getenv($k)) {
            putenv("{$k}={$v}");
        }
    }
}

return [
    // The email address where reservation & inquiry alerts will be sent
    'recipient_email' => getenv('RECIPIENT_EMAIL') ?: 'mshfamilyrestaurant@gmail.com',
    'recipient_name'  => getenv('RECIPIENT_NAME')  ?: 'Mahalakshmi Spice Heritage Reservations',

    // Sender details
    'sender_email'    => getenv('SENDER_EMAIL')    ?: 'mshfamilyrestaurant@gmail.com',
    'sender_name'     => getenv('SENDER_NAME')     ?: 'Mahalakshmi Spice Heritage',

    // Send a confirmation copy to the customer if they provided an email address
    'send_customer_confirmation' => true,

    // Gmail SMTP Settings
    'smtp' => [
        'enabled'  => filter_var(getenv('SMTP_ENABLED') ?: true, FILTER_VALIDATE_BOOLEAN),
        'host'     => getenv('SMTP_HOST')     ?: 'smtp.gmail.com',
        'port'     => (int)(getenv('SMTP_PORT') ?: 465),
        'secure'   => getenv('SMTP_SECURE')   ?: 'ssl', // 'ssl' (port 465) or 'tls' (port 587)
        'username' => getenv('SMTP_USER')     ?: 'mshfamilyrestaurant@gmail.com',
        'password' => getenv('SMTP_PASS')     ?: '', // Loaded safely from .env.local or environment variable
        'timeout'  => 15,
    ],
];
